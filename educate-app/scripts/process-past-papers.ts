/**
 * Past Papers Processor  — normalised schema edition
 * ────────────────────────────────────────────────────
 * Crawls Google Drive, downloads PDFs, extracts structured questions,
 * stores in Neon (past_papers + questions tables).  PDFs are never
 * stored in the DB — only the Drive file ID is kept for on-demand access.
 *
 * Prerequisites:
 *   npx tsx scripts/auth-drive.ts     (creates token.json)
 *   npx tsx scripts/migrate-past-papers.ts  (creates tables)
 *
 * Usage:
 *   npx tsx scripts/process-past-papers.ts                    # full run
 *   npx tsx scripts/process-past-papers.ts --limit 5          # test 5 files
 *   npx tsx scripts/process-past-papers.ts --concurrency 8    # 8 parallel
 *   npx tsx scripts/process-past-papers.ts --dry-run          # no DB writes
 */

import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import Anthropic from '@anthropic-ai/sdk';
import { neon } from '@neondatabase/serverless';

// ── Env ───────────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

// ── Config ────────────────────────────────────────────────────────────────────
const ROOT_FOLDER_ID   = '1wTYT4FwqFLTuTcY_nc-UJM7pla5PbvW9';
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH       = path.join(__dirname, 'token.json');
const DOWNLOAD_DIR     = path.join(__dirname, 'downloaded-papers');

const DRY_RUN         = process.argv.includes('--dry-run');
const FORCE           = process.argv.includes('--force');
const LIMIT_ARG       = process.argv.indexOf('--limit');
const MAX_FILES       = LIMIT_ARG >= 0 ? parseInt(process.argv[LIMIT_ARG + 1] ?? '99999') : 99999;
const CONC_ARG        = process.argv.indexOf('--concurrency');
const CONCURRENCY     = CONC_ARG >= 0 ? parseInt(process.argv[CONC_ARG + 1] ?? '5') : 5;

// Pages with < this many chars are treated as image-heavy
const IMAGE_THRESHOLD = 100;

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
          // subject folder → files inside
          const files = await listFolder(drive, subjectItem.id);
          for (const f of files) {
            if (isPDF(f)) papers.push({ file: f, country, exam_type: examType, subject: subjectItem.name });
          }
        } else if (isPDF(subjectItem)) {
          // PDF directly in exam folder
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

// ── PDF text extraction ───────────────────────────────────────────────────────
async function extractText(filePath: string): Promise<{ fullText: string; pages: string[] }> {
  const buffer = fs.readFileSync(filePath);
  const pages: string[] = [];

  const data = await pdfParse(buffer, {
    pagerender: (pageData: { getTextContent: () => Promise<{ items: { str: string; transform: number[] }[] }> }) =>
      pageData.getTextContent().then(tc => {
        let text = '';
        let lastY: number | null = null;
        for (const item of tc.items) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) text += '\n';
          text += item.str;
          lastY = item.transform[5];
        }
        pages.push(text);
        return text;
      }),
  });

  return { fullText: data.text, pages };
}

// ── Claude Vision for image-heavy pages ───────────────────────────────────────
async function visionAnalysePage(anthropic: Anthropic, pdfPath: string, pageNum: number): Promise<string> {
  try {
    const base64 = fs.readFileSync(pdfPath).toString('base64');
    const res = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } } as unknown as Anthropic.MessageParam['content'][0],
          { type: 'text', text: `Describe page ${pageNum} of this exam paper in detail: what question is asked, what diagram/graph/table is shown, any measurements or values. Be concise but complete.` },
        ],
      }],
    });
    return (res.content[0] as { text: string }).text;
  } catch { return ''; }
}

// ── Question extraction via Claude Haiku ──────────────────────────────────────
async function extractQuestions(
  anthropic: Anthropic,
  fullText: string,
  subject: string,
  examType: string
): Promise<ExtractedQuestion[]> {
  if (!fullText || fullText.trim().length < 100) return [];
  try {
    const res = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Extract all questions from this ${examType} ${subject} past paper. Return ONLY a JSON array, no other text. Each object: { "question_number": "1a", "question_text": "full question text", "marks": 3, "topic": "one word topic like algebra/forces/genetics", "mark_scheme": "answer if this is a mark scheme" }

PAPER TEXT:
${fullText.slice(0, 10000)}`,
      }],
    });
    const text = (res.content[0] as { text: string }).text.trim();
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]) as ExtractedQuestion[];
  } catch { /* ignore */ }
  return [];
}

// ── Metadata from filename ────────────────────────────────────────────────────
function parseMeta(filename: string) {
  const year  = filename.match(/\b(20\d{2}|19\d{2})\b/)?.[1];
  const paper = filename.match(/\bpaper\s*(\d+)\b/i)?.[1] ?? filename.match(/\b[pP](\d)\b/)?.[1];
  return {
    year:         year  ? parseInt(year)        : null,
    paper_number: paper ? `Paper ${paper}`      : null,
  };
}

// ── DB write ──────────────────────────────────────────────────────────────────
async function saveToDB(
  sql: ReturnType<typeof neon>,
  entry: PaperEntry,
  questions: ExtractedQuestion[],
  hasImages: boolean,
  imageDescs: { page: number; desc: string }[]
): Promise<void> {
  const { year, paper_number } = parseMeta(entry.file.name);
  const title = entry.file.name.replace(/\.pdf$/i, '');

  // Upsert paper record
  const rows = await sql`
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
  `;
  const paperId = (rows[0] as { id: string }).id;

  // Delete old questions for this paper (re-process case)
  await sql`DELETE FROM questions WHERE paper_id = ${paperId}`;

  // Insert questions
  for (const q of questions) {
    // Find image description if this question is on an image page
    const imageDesc = imageDescs.length > 0 ? imageDescs[0]?.desc : null;
    await sql`
      INSERT INTO questions (paper_id, question_number, question_text, marks, topic,
                             has_image, image_desc, mark_scheme)
      VALUES (${paperId}, ${q.question_number ?? null}, ${q.question_text}, ${q.marks ?? null},
              ${q.topic ?? null}, ${!!imageDesc}, ${imageDesc ?? null}, ${q.mark_scheme ?? null})
    `;
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
  counters: { processed: number; skipped: number; errored: number }
): Promise<void> {
  const tag   = `[${idx}/${total}]`;
  const label = `${entry.country} › ${entry.exam_type} › ${entry.subject} › ${entry.file.name.slice(0, 40)}`;

  try {
    if (!DRY_RUN && !FORCE) {
      const existing = await sqlClient`SELECT id FROM past_papers WHERE drive_file_id = ${entry.file.id} AND processed = true LIMIT 1`;
      if (existing.length > 0) { counters.skipped++; return; }
    }

    console.log(`${tag} ⬇  ${label}`);
    const tmpFile = path.join(DOWNLOAD_DIR, `${entry.file.id}.pdf`);
    await downloadPDF(drive, entry.file.id, tmpFile);

    const { fullText, pages } = await extractText(tmpFile);

    // Vision pass for image-heavy pages
    const imageDescs: { page: number; desc: string }[] = [];
    for (let i = 0; i < pages.length; i++) {
      if ((pages[i] ?? '').trim().length < IMAGE_THRESHOLD) {
        const desc = await visionAnalysePage(anthropic, tmpFile, i + 1);
        if (desc) imageDescs.push({ page: i + 1, desc });
      }
    }

    const questions = await extractQuestions(anthropic, fullText, entry.subject, entry.exam_type);

    if (!DRY_RUN) {
      await saveToDB(sqlClient, entry, questions, imageDescs.length > 0, imageDescs);
    }

    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }

    console.log(`${tag} ✅  ${questions.length} questions | ${imageDescs.length} image pages`);
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
  console.log('\n📚 Educate Past Papers Processor');
  console.log('═'.repeat(55));
  console.log(`   Concurrency: ${CONCURRENCY} | Limit: ${MAX_FILES} | Dry run: ${DRY_RUN}`);
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
  const etaMins = perFile > 0 ? Math.round((all.length - counters.processed - counters.skipped) * perFile / CONCURRENCY / 60) : 0;

  console.log('\n' + '═'.repeat(55));
  console.log(`✅  ${counters.processed} processed | ${counters.skipped} skipped | ${counters.errored} errors`);
  console.log(`⏱   ${secs}s elapsed | ${perFile.toFixed(1)}s per file`);
  if (etaMins > 0) console.log(`📊  Full crawl ETA at ${CONCURRENCY}x: ~${etaMins}min (~${(etaMins/60).toFixed(1)}h)`);
}

main().catch(err => { console.error('\n💥', err.message); process.exit(1); });
