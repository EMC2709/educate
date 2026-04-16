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
const OFFSET_ARG  = process.argv.indexOf('--offset');
const OFFSET      = OFFSET_ARG >= 0 ? parseInt(process.argv[OFFSET_ARG + 1] ?? '0') : 0;

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
      model: 'claude-sonnet-4-5',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 },
          } as unknown as Anthropic.ContentBlock,
          {
            type: 'text',
            text: `This is a ${examType} ${subject} past paper. Extract EVERY SINGLE question and sub-question from the entire paper.
Return ONLY a JSON array — no other text, no markdown fences:
[{ "question_number": "1a", "question_text": "full question text", "marks": 3, "topic": "topic name", "mark_scheme": "answer if this is a mark scheme" }]
Include ALL questions including multiple choice, structured questions, extended writing questions.
Do NOT skip or summarise any questions. Include the complete question text for each.`,
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

// ── Heuristic question parser (no API needed) ────────────────────────────────
// Parses AQA/OCR/Edexcel/SQA exam papers using regex patterns.
// Works entirely offline — no Claude calls needed.
function extractQuestionsHeuristic(text: string, subject: string): ExtractedQuestion[] {
  const questions: ExtractedQuestion[] = [];
  const lines = text.split('\n');

  // Marks patterns: "[2 marks]", "(3 marks)", "[3]", "2 marks"
  const marksRe = /\[(\d+)\s*marks?\]|\((\d+)\s*marks?\)|\[(\d+)\]\s*$|(\d+)\s*marks?\s*$/i;

  // Question number patterns: "1", "1.", "1 ", "(1)", "Q1", "1(a)", "1 (a)", etc.
  const qStartRe = /^(?:Q\.?\s*)?(\d{1,2})\s*(?:\(([a-zA-Z])\))?\s*(?:\(([ivxIVX]+)\))?\s+\S/;
  const subQRe   = /^\s*(?:\(([a-zA-Z])\)|\(([ivxIVX]+)\))\s+\S/;

  let currentQNum    = '';
  let currentQText:  string[] = [];
  let currentMarks   = 0;

  const flush = () => {
    if (currentQText.length === 0) return;
    const text = currentQText.join(' ').replace(/\s+/g, ' ').trim();
    if (text.length < 10) return;
    questions.push({
      question_number: currentQNum,
      question_text:   text,
      marks:           currentMarks,
      topic:           subject,
    });
    currentQText  = [];
    currentMarks  = 0;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Skip header/footer noise
    if (/^(page|©|please turn over|turn over|end of questions|do not write)/i.test(line)) continue;

    // Extract marks from line
    const mMatch = line.match(marksRe);
    const lineMarks = mMatch ? parseInt(mMatch[1] ?? mMatch[2] ?? mMatch[3] ?? mMatch[4] ?? '0') : 0;
    if (lineMarks > 0 && lineMarks > currentMarks) currentMarks = lineMarks;

    // New main question
    const qm = line.match(qStartRe);
    if (qm) {
      flush();
      const part = qm[2] ? `(${qm[2]})` : qm[3] ? `(${qm[3]})` : '';
      currentQNum = `${qm[1]}${part}`;
      currentQText = [line.replace(marksRe, '').trim()];
      continue;
    }

    // Sub-question
    const sq = line.match(subQRe);
    if (sq && currentQNum) {
      flush();
      const sub = sq[1] ?? sq[2] ?? '';
      currentQNum = `${currentQNum.replace(/\(.*\)$/, '')}(${sub})`;
      currentQText = [line.replace(marksRe, '').trim()];
      continue;
    }

    // Continuation line
    if (currentQText.length > 0) {
      currentQText.push(line.replace(marksRe, '').trim());
    }
  }
  flush();

  // Filter out very short garbage entries
  return questions.filter(q =>
    q.question_text.length > 15 &&
    !/^(answer all questions|instructions|information|advice)/i.test(q.question_text)
  );
}

// ── Question extraction via Claude Haiku (text-based) ────────────────────────
// Processes the full text in chunks so nothing is missed.
const CHUNK_SIZE = 12000;   // chars per Claude call
const CHUNK_OVERLAP = 500;  // overlap to avoid cutting mid-question

async function extractQuestionsFromChunk(
  anthropic: Anthropic,
  chunk: string,
  subject: string,
  examType: string,
): Promise<ExtractedQuestion[]> {
  try {
    const res = await withRetry(() => anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Extract ALL exam questions from this ${examType} ${subject} past paper excerpt.
Return ONLY a JSON array — no other text, no markdown fences:
[{"question_number":"1a","question_text":"full question text","marks":3,"topic":"Biology","mark_scheme":"answer if present"}]
Include every question and sub-question. Do NOT skip any. If a mark scheme answer is visible for a question, include it in mark_scheme.

TEXT:
${chunk}`,
      }],
    }));
    const text = (res.content[0] as { text: string }).text.trim();
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const raw = JSON.parse(match[0]) as Array<Record<string, unknown>>;
    return raw.map(r => ({
      question_number: String(r.question_number ?? r.q ?? ''),
      question_text:   String(r.question_text   ?? r.t ?? ''),
      marks:           Number(r.marks           ?? r.m ?? 0),
      topic:           String(r.topic           ?? ''),
      mark_scheme:     r.mark_scheme ? String(r.mark_scheme) : undefined,
    }));
  } catch (e) {
    process.stderr.write(`  [extractQuestionsFromChunk warn] ${(e as Error).message}\n`);
    return [];
  }
}

async function extractQuestions(
  anthropic: Anthropic,
  fullText: string,
  subject: string,
  examType: string,
): Promise<ExtractedQuestion[]> {
  if (!fullText || fullText.trim().length < TEXT_THRESHOLD) return [];

  // Split into overlapping chunks so long papers are fully processed
  const chunks: string[] = [];
  for (let start = 0; start < fullText.length; start += CHUNK_SIZE - CHUNK_OVERLAP) {
    chunks.push(fullText.slice(start, start + CHUNK_SIZE));
    if (start + CHUNK_SIZE >= fullText.length) break;
  }

  const allQuestions: ExtractedQuestion[] = [];
  const seenTexts = new Set<string>();

  for (const chunk of chunks) {
    const qs = await extractQuestionsFromChunk(anthropic, chunk, subject, examType);
    for (const q of qs) {
      const key = q.question_text.trim().slice(0, 60);
      if (key && !seenTexts.has(key)) {
        seenTexts.add(key);
        allQuestions.push(q);
      }
    }
  }

  return allQuestions;
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
      // Tier A: heuristic parser (fast, no API, works for structured exam papers)
      questions = extractQuestionsHeuristic(fullText, entry.subject);
      console.log(`${tag} 📐 heuristic: ${questions.length} questions`);
      // NOTE: Claude fallback disabled — API rate-limited until 2026-05-01.
      // Papers where heuristic returns 0 are saved with 0 questions; they can be
      // reprocessed later without --force since skip logic spares non-empty papers.
    } else {
      // Text too short — skip Claude Vision (rate-limited), record 0 questions.
      console.log(`${tag} ⚠  text too short (${fullText.trim().length} chars), skipping (no Claude)`);
      questions = [];
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
  console.log(`   Concurrency: ${CONCURRENCY} | Limit: ${MAX_FILES} | Offset: ${OFFSET} | Dry run: ${DRY_RUN} | Force: ${FORCE}`);
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
  const sliced    = all.slice(OFFSET);
  const toProcess = sliced.slice(0, MAX_FILES);
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
