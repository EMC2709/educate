/**
 * Past Papers Processor  — normalised schema edition
 * ────────────────────────────────────────────────────
 * Crawls Google Drive, downloads PDFs, extracts structured questions,
 * stores in Neon (past_papers + questions tables).  PDFs are never
 * stored in the DB — only the Drive file ID is kept for on-demand access.
 *
 * Text extraction strategy (in order):
 *   1. pdf-parse  — fast, free, works on text-based PDFs
 *   2. Drive OCR  — copies PDF as Google Doc (triggers OCR), exports as text
 *   3. Claude PDF — sends PDF bytes to Claude as last resort (vision-capable)
 *
 * Prerequisites:
 *   npx tsx scripts/auth-drive.ts     (creates token.json)
 *   npx tsx scripts/migrate-past-papers.ts  (creates tables)
 *
 * Usage:
 *   npx tsx scripts/process-past-papers.ts                       # full run
 *   npx tsx scripts/process-past-papers.ts --limit 20            # test 20 files
 *   npx tsx scripts/process-past-papers.ts --concurrency 4       # 4 parallel
 *   npx tsx scripts/process-past-papers.ts --dry-run             # no DB writes
 *   npx tsx scripts/process-past-papers.ts --force               # reprocess all
 */

import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import Anthropic from '@anthropic-ai/sdk';
import { neon } from '@neondatabase/serverless';

// ── Env ───────────────────────────────────────────────────────────────────────
// Only load from file if vars aren't already set (dotenvx pre-injects them decrypted).
// Unconditionally overwriting would replace decrypted values with encrypted blobs.
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) {
      const key = m[1].trim();
      if (!process.env[key]) {  // ← only set if not already injected by dotenvx
        // Strip surrounding quotes, then strip literal \n Vercel artifacts
        process.env[key] = m[2].trim()
          .replace(/^["']|["']$/g, '')
          .replace(/\\n$/, '')
          .trim();
      }
    }
  }
}

// ── Config ────────────────────────────────────────────────────────────────────
const ROOT_FOLDER_ID   = '1wTYT4FwqFLTuTcY_nc-UJM7pla5PbvW9';
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH       = path.join(__dirname, 'token.json');
const DOWNLOAD_DIR     = path.join(__dirname, 'downloaded-papers');

const DRY_RUN     = process.argv.includes('--dry-run');
const FORCE       = process.argv.includes('--force');
const LIMIT_ARG   = process.argv.indexOf('--limit');
const MAX_FILES   = LIMIT_ARG >= 0 ? parseInt(process.argv[LIMIT_ARG + 1] ?? '99999') : 99999;
const CONC_ARG    = process.argv.indexOf('--concurrency');
const CONCURRENCY = CONC_ARG >= 0 ? parseInt(process.argv[CONC_ARG + 1] ?? '4') : 4;

// Minimum characters to consider a PDF text-based
const TEXT_THRESHOLD = 300;

interface DriveFile { id: string; name: string; mimeType: string }
interface PaperEntry { file: DriveFile; country: string; exam_type: string; subject: string }

interface ExtractedQuestion {
  question_number: string;
  question_text: string;
  marks: number;
  topic: string;
  mark_scheme?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function getAuth() {
  if (!fs.existsSync(CREDENTIALS_PATH)) throw new Error('credentials.json not found. Run: npx tsx scripts/auth-drive.ts');
  if (!fs.existsSync(TOKEN_PATH))       throw new Error('token.json not found. Run: npx tsx scripts/auth-drive.ts');
  const creds  = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  const auth   = new google.auth.OAuth2(creds.installed.client_id, creds.installed.client_secret, 'http://localhost:3333/callback');
  auth.setCredentials(tokens);
  return auth;
}

// ── Retry wrapper ─────────────────────────────────────────────────────────────
async function withRetry<T>(fn: () => Promise<T>, attempts = 4, delayMs = 2000): Promise<T> {
  let lastErr: Error = new Error('unknown');
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e as Error;
      const msg = lastErr.message ?? '';
      // Rate limit: wait longer (60s base, exponential)
      const isRateLimit = msg.includes('429') || msg.includes('rate_limit');
      const wait = isRateLimit ? 60000 * (i + 1) : delayMs * (i + 1);
      if (i < attempts - 1) {
        if (isRateLimit) process.stderr.write(`  [rate limit] waiting ${wait / 1000}s before retry ${i + 2}/${attempts}...\n`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }
  throw lastErr;
}

// ── Drive helpers ─────────────────────────────────────────────────────────────
async function listFolder(drive: drive_v3.Drive, folderId: string): Promise<DriveFile[]> {
  const items: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType)',
      pageToken, pageSize: 200,
    });
    for (const f of res.data.files ?? []) items.push({ id: f.id!, name: f.name!, mimeType: f.mimeType! });
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);
  return items;
}

async function crawlDrive(drive: drive_v3.Drive): Promise<PaperEntry[]> {
  console.log('🔍 Crawling Google Drive...');
  const papers: PaperEntry[] = [];
  const isPDF = (f: DriveFile) => f.mimeType === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
  const isDir = (f: DriveFile) => f.mimeType === 'application/vnd.google-apps.folder';

  const countries = (await listFolder(drive, ROOT_FOLDER_ID)).filter(isDir);
  for (const countryFolder of countries) {
    const country = countryFolder.name.replace(/_/g, ' ');
    const examTypes = await listFolder(drive, countryFolder.id);
    for (const examFolder of examTypes) {
      if (!isDir(examFolder)) continue;
      const examType = examFolder.name;
      const subjects = await listFolder(drive, examFolder.id);
      for (const subjectItem of subjects) {
        if (isDir(subjectItem)) {
          const files = await listFolder(drive, subjectItem.id);
          for (const f of files) {
            if (isPDF(f)) papers.push({ file: f, country, exam_type: examType, subject: subjectItem.name });
          }
        } else if (isPDF(subjectItem)) {
          papers.push({ file: subjectItem, country, exam_type: examType, subject: examType });
        }
      }
    }
  }
  console.log(`   Found ${papers.length} PDF files\n`);
  return papers;
}

// ── Download ──────────────────────────────────────────────────────────────────
async function downloadPDF(drive: drive_v3.Drive, fileId: string, dest: string): Promise<void> {
  const out = fs.createWriteStream(dest);
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
  await new Promise<void>((resolve, reject) => {
    (res.data as NodeJS.ReadableStream).pipe(out);
    out.on('finish', resolve);
    out.on('error', reject);
  });
}

// ── PDF text extraction via pdf-parse ─────────────────────────────────────────
async function extractTextLocal(filePath: string): Promise<string> {
  try {
    const buffer = fs.readFileSync(filePath);
    // Some PDFs have corrupt charCodes that cause unhandled rejections in pdf-parse
    const data = await Promise.resolve(pdfParse(buffer, {
      pagerender: (pageData: { getTextContent: () => Promise<{ items: { str: string; transform: number[] }[] }> }) =>
        pageData.getTextContent().then(tc => {
          let text = '';
          let lastY: number | null = null;
          for (const item of tc.items) {
            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) text += '\n';
            text += item.str;
            lastY = item.transform[5];
          }
          return text;
        }),
    })).catch(() => ({ text: '' }));
    return data.text;
  } catch { return ''; }
}

// ── Drive OCR fallback ────────────────────────────────────────────────────────
// Copies the PDF as a Google Doc (triggers Drive's built-in OCR), exports plain text.
// Deletes the temp Doc afterwards.
async function extractTextViaOCR(drive: drive_v3.Drive, fileId: string): Promise<string> {
  let docId: string | null = null;
  try {
    const copy = await drive.files.copy({
      fileId,
      requestBody: { mimeType: 'application/vnd.google-apps.document', name: `__ocr_tmp_${fileId}` },
      fields: 'id',
    });
    docId = copy.data.id ?? null;
    if (!docId) return '';
    const exported = await drive.files.export({ fileId: docId, mimeType: 'text/plain' });
    return typeof exported.data === 'string' ? exported.data : '';
  } catch { return ''; }
  finally {
    if (docId) {
      try { await drive.files.delete({ fileId: docId }); } catch { /* best effort */ }
    }
  }
}

// ── Claude Vision fallback (last resort for complex image PDFs) ───────────────
async function extractQuestionsFromPDFVision(
  anthropic: Anthropic,
  pdfPath: string,
  subject: string,
  examType: string,
): Promise<ExtractedQuestion[]> {
  try {
    // Only send if file < 10 MB to avoid hitting API limits
    const stats = fs.statSync(pdfPath);
    if (stats.size > 10 * 1024 * 1024) return [];

    const base64 = fs.readFileSync(pdfPath).toString('base64');
    const res = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 },
          } as unknown as Anthropic.ContentBlock,
          {
            type: 'text',
            text: `This is a ${examType} ${subject} past paper or mark scheme. Extract ALL exam questions.
Return ONLY a JSON array — no other text:
[{ "question_number": "1a", "question_text": "full question text here", "marks": 3, "topic": "algebra", "mark_scheme": "model answer if this is a mark scheme" }]
If this is a mark scheme, put the mark scheme answers in the mark_scheme field.`,
          },
        ],
      }],
    });
    const text = (res.content[0] as { text: string }).text.trim();
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]) as ExtractedQuestion[];
  } catch { /* ignore */ }
  return [];
}

// ── Question extraction via Claude Haiku (text-based) ────────────────────────
async function extractQuestions(
  anthropic: Anthropic,
  fullText: string,
  subject: string,
  examType: string,
): Promise<ExtractedQuestion[]> {
  if (!fullText || fullText.trim().length < TEXT_THRESHOLD) return [];
  try {
    const res = await withRetry(() => anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Extract questions from this ${examType} ${subject} paper. JSON array only, no prose:
[{"q":"1a","t":"question text","m":3,"topic":"algebra"}]
Use "q" for number, "t" for text, "m" for marks, "topic" for topic.

TEXT:
${fullText.slice(0, 5000)}`,
      }],
    }));
    const text = (res.content[0] as { text: string }).text.trim();
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      // Support both short {q,t,m,topic} and long {question_number,question_text,marks,topic} keys
      const raw = JSON.parse(match[0]) as Array<Record<string, unknown>>;
      return raw.map(r => ({
        question_number: (r.question_number ?? r.q ?? '') as string,
        question_text:   (r.question_text   ?? r.t ?? '') as string,
        marks:           (r.marks           ?? r.m ?? 0)  as number,
        topic:           (r.topic           ?? '')        as string,
        mark_scheme:     (r.mark_scheme     ?? r.ms ?? undefined) as string | undefined,
      })) as ExtractedQuestion[];
    }
  } catch (e) {
    process.stderr.write(`  [extractQuestions warn] ${(e as Error).message}\n`);
  }
  return [];
}

// ── Metadata from filename ────────────────────────────────────────────────────
function parseMeta(filename: string) {
  const year  = filename.match(/\b(20\d{2}|19\d{2})\b/)?.[1];
  const paper = filename.match(/\bpaper\s*(\d+)\b/i)?.[1] ?? filename.match(/\b[pP](\d)\b/)?.[1];
  return {
    year:         year  ? parseInt(year)   : null,
    paper_number: paper ? `Paper ${paper}` : null,
  };
}

// ── DB write ──────────────────────────────────────────────────────────────────
async function saveToDB(
  sql: ReturnType<typeof neon>,
  entry: PaperEntry,
  questions: ExtractedQuestion[],
  hasImages: boolean,
): Promise<void> {
  const { year, paper_number } = parseMeta(entry.file.name);
  const title = entry.file.name.replace(/\.pdf$/i, '');

  const rows = await withRetry(() => sql`
    INSERT INTO past_papers (drive_file_id, country, exam_type, subject, title, year, paper_number,
                             total_questions, has_images, processed, processed_at)
    VALUES (${entry.file.id}, ${entry.country}, ${entry.exam_type}, ${entry.subject},
            ${title}, ${year}, ${paper_number},
            ${questions.length}, ${hasImages}, true, now())
    ON CONFLICT (drive_file_id) DO UPDATE SET
      total_questions = EXCLUDED.total_questions,
      has_images      = EXCLUDED.has_images,
      processed       = true,
      processed_at    = now()
    RETURNING id
  `);
  const paperId = (rows[0] as { id: string }).id;

  if (questions.length > 0) {
    await withRetry(() => sql`DELETE FROM questions WHERE paper_id = ${paperId}`);
    // Insert in batches of 20 to reduce round-trips
    for (let i = 0; i < questions.length; i += 20) {
      const batch = questions.slice(i, i + 20);
      for (const q of batch) {
        await withRetry(() => sql`
          INSERT INTO questions (paper_id, question_number, question_text, marks, topic,
                                 has_image, image_desc, mark_scheme)
          VALUES (${paperId}, ${q.question_number ?? null}, ${q.question_text},
                  ${q.marks ?? null}, ${q.topic ?? null}, false, null,
                  ${q.mark_scheme ?? null})
        `);
      }
    }
  }
}

// ── Process one paper ─────────────────────────────────────────────────────────
async function processPaper(
  entry: PaperEntry,
  drive: drive_v3.Drive,
  anthropic: Anthropic,
  sqlClient: ReturnType<typeof neon>,
  idx: number,
  total: number,
  counters: { processed: number; skipped: number; errored: number },
): Promise<void> {
  const tag   = `[${idx}/${total}]`;
  const label = `${entry.country} › ${entry.exam_type} › ${entry.subject} › ${entry.file.name.slice(0, 35)}`;

  try {
    // Skip only if already processed AND has questions extracted (unless --force)
    if (!DRY_RUN && !FORCE) {
      const existing = await withRetry(() => sqlClient`
        SELECT id FROM past_papers
        WHERE drive_file_id = ${entry.file.id}
          AND processed = true
          AND total_questions > 0
        LIMIT 1
      `);
      if (existing.length > 0) { counters.skipped++; return; }
    }

    console.log(`${tag} ⬇  ${label}`);
    const tmpFile = path.join(DOWNLOAD_DIR, `${entry.file.id}.pdf`);
    await downloadPDF(drive, entry.file.id, tmpFile);

    // ── Text extraction: 3-tier ─────────────────────────────────────────────
    let fullText = await extractTextLocal(tmpFile);
    let usedOCR  = false;
    let usedVision = false;

    if (fullText.trim().length < TEXT_THRESHOLD) {
      // Tier 2: Drive OCR
      console.log(`${tag} 🔍 OCR (text too short: ${fullText.trim().length} chars)`);
      fullText = await extractTextViaOCR(drive, entry.file.id);
      usedOCR  = true;
    }

    // ── Question extraction ─────────────────────────────────────────────────
    let questions: ExtractedQuestion[];

    if (fullText.trim().length >= TEXT_THRESHOLD) {
      questions = await extractQuestions(anthropic, fullText, entry.subject, entry.exam_type);
    } else {
      // Tier 3: Claude Vision on the raw PDF bytes
      console.log(`${tag} 👁  Vision fallback`);
      questions = await extractQuestionsFromPDFVision(anthropic, tmpFile, entry.subject, entry.exam_type);
      usedVision = true;
    }

    const hasImages = usedOCR || usedVision;

    if (!DRY_RUN) {
      await saveToDB(sqlClient, entry, questions, hasImages);
    }

    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }

    const method = usedVision ? '👁 vision' : usedOCR ? '🔍 ocr' : '📄 text';
    console.log(`${tag} ✅  ${questions.length} questions | ${method}`);
    counters.processed++;
  } catch (err) {
    console.error(`${tag} ❌  ${label}: ${(err as Error).message}`);
    counters.errored++;
  }
}

// ── Concurrency pool ──────────────────────────────────────────────────────────
async function runPool<T>(items: T[], concurrency: number, fn: (item: T, i: number) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (i < items.length) { const idx = i++; await fn(items[idx], idx + 1); }
  }));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n📚 Educate Past Papers Processor  (3-tier extraction)');
  console.log('═'.repeat(55));
  console.log(`   Concurrency: ${CONCURRENCY} | Limit: ${MAX_FILES} | Dry run: ${DRY_RUN} | Force: ${FORCE}`);
  console.log('   Extraction: pdf-parse → Drive OCR → Claude Vision');
  console.log('   Skip logic: only skip papers with total_questions > 0');
  console.log('═'.repeat(55) + '\n');

  if (!process.env.DATABASE_URL)      throw new Error('DATABASE_URL not set');
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');

  const auth      = getAuth();
  const drive     = google.drive({ version: 'v3', auth });
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const sqlClient = neon(process.env.DATABASE_URL);

  if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

  const all       = await crawlDrive(drive);
  const toProcess = all.slice(0, MAX_FILES);
  const counters  = { processed: 0, skipped: 0, errored: 0 };
  const t0        = Date.now();

  await runPool(toProcess, CONCURRENCY, (entry, idx) =>
    processPaper(entry, drive, anthropic, sqlClient, idx, toProcess.length, counters)
  );

  const secs    = Math.round((Date.now() - t0) / 1000);
  const perFile = counters.processed > 0 ? secs / counters.processed : 0;
  const remaining = all.length - counters.processed - counters.skipped;
  const etaMins = perFile > 0 && remaining > 0
    ? Math.round(remaining * perFile / CONCURRENCY / 60)
    : 0;

  console.log('\n' + '═'.repeat(55));
  console.log(`✅  ${counters.processed} processed | ${counters.skipped} skipped | ${counters.errored} errors`);
  console.log(`⏱   ${secs}s elapsed | ${perFile.toFixed(1)}s per file`);
  if (etaMins > 0) console.log(`📊  Remaining ETA at ${CONCURRENCY}x: ~${etaMins}min (~${(etaMins / 60).toFixed(1)}h)`);
}

// Prevent corrupt PDFs from crashing the whole process
process.on('unhandledRejection', (reason) => {
  process.stderr.write(`  [unhandled rejection ignored] ${String(reason)}\n`);
});

main().catch(err => { console.error('\n💥', err.message); process.exit(1); });
