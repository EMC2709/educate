/**
 * Past Papers Processor
 * ─────────────────────
 * Recursively crawls the Google Drive folder, downloads PDFs,
 * extracts text (pdf-parse) + uses Claude Vision for image-heavy pages,
 * and stores structured data in Neon Postgres.
 *
 * Prerequisites:
 *   1. Run: npx tsx scripts/auth-drive.ts  (creates token.json)
 *   2. DATABASE_URL in .env.local
 *   3. ANTHROPIC_API_KEY in .env.local
 *
 * Usage:
 *   npx tsx scripts/process-past-papers.ts
 *   npx tsx scripts/process-past-papers.ts --dry-run   (no DB writes)
 *   npx tsx scripts/process-past-papers.ts --limit 5   (process first 5 files)
 */

import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import Anthropic from '@anthropic-ai/sdk';
import { neon } from '@neondatabase/serverless';

// ── Load env ──────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

// ── Config ────────────────────────────────────────────────────────────────────
const ROOT_FOLDER_ID = '1wTYT4FwqFLTuTcY_nc-UJM7pla5PbvW9';
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH        = path.join(__dirname, 'token.json');
const DOWNLOAD_DIR      = path.join(__dirname, 'downloaded-papers');
const DRY_RUN           = process.argv.includes('--dry-run');
const LIMIT_ARG         = process.argv.indexOf('--limit');
const MAX_FILES         = LIMIT_ARG >= 0 ? parseInt(process.argv[LIMIT_ARG + 1] ?? '99999') : 99999;
const CONCURRENCY_ARG   = process.argv.indexOf('--concurrency');
const CONCURRENCY       = CONCURRENCY_ARG >= 0 ? parseInt(process.argv[CONCURRENCY_ARG + 1] ?? '5') : 5;

// Pages with fewer than this many characters of text are treated as image-heavy
const IMAGE_PAGE_TEXT_THRESHOLD = 100;

interface PageAnalysis {
  page: number;
  text: string;
  has_image: boolean;
  vision_desc?: string;
}

interface ProcessedPaper {
  drive_file_id: string;
  country: string;
  exam_type: string;
  subject: string;
  title: string;
  year: number | null;
  paper_number: string | null;
  raw_text: string;
  page_analyses: PageAnalysis[];
  questions: Record<string, unknown>[];
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function getAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('credentials.json not found. Run: npx tsx scripts/auth-drive.ts first.');
  }
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error('token.json not found. Run: npx tsx scripts/auth-drive.ts first.');
  }

  const creds  = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  const { client_secret, client_id } = creds.installed;

  const auth = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3333/callback');
  auth.setCredentials(tokens);
  return auth;
}

// ── Drive helpers ──────────────────────────────────────────────────────────────
interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
}

async function listFolderContents(drive: drive_v3.Drive, folderId: string): Promise<DriveFile[]> {
  const items: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType)',
      pageToken,
      pageSize: 200,
    });
    for (const f of res.data.files ?? []) {
      items.push({ id: f.id!, name: f.name!, mimeType: f.mimeType!, parents: [folderId] });
    }
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return items;
}

interface PaperEntry {
  file: DriveFile;
  country: string;
  exam_type: string;
  subject: string;
}

async function crawlDrive(drive: drive_v3.Drive): Promise<PaperEntry[]> {
  console.log('🔍 Crawling Google Drive structure...');
  const papers: PaperEntry[] = [];

  // Level 1: countries (England, Northern_Ireland, Scotland, Wales)
  const countryFolders = await listFolderContents(drive, ROOT_FOLDER_ID);
  for (const countryFolder of countryFolders) {
    if (countryFolder.mimeType !== 'application/vnd.google-apps.folder') continue;
    const country = countryFolder.name.replace(/_/g, ' ');

    // Level 2: exam types (GCSE, A-Level, ...)
    const examTypeFolders = await listFolderContents(drive, countryFolder.id);
    for (const examTypeFolder of examTypeFolders) {
      if (examTypeFolder.mimeType !== 'application/vnd.google-apps.folder') continue;
      const examType = examTypeFolder.name;

      // Level 3: subjects (Maths, Physics, ...)
      const subjectFolders = await listFolderContents(drive, examTypeFolder.id);
      for (const subjectFolder of subjectFolders) {
        if (subjectFolder.mimeType !== 'application/vnd.google-apps.folder') continue;
        const subject = subjectFolder.name;

        // Level 4: actual PDF files
        const files = await listFolderContents(drive, subjectFolder.id);
        for (const file of files) {
          if (file.mimeType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            papers.push({ file, country, exam_type: examType, subject });
          }
        }
      }

      // Also handle PDFs directly in exam_type folder (if subject = examType folder)
      for (const item of subjectFolders) {
        if (item.mimeType === 'application/pdf' || item.name.toLowerCase().endsWith('.pdf')) {
          papers.push({ file: item, country, exam_type: examType, subject: examType });
        }
      }
    }
  }

  console.log(`   Found ${papers.length} PDF files\n`);
  return papers;
}

// ── Download PDF ───────────────────────────────────────────────────────────────
async function downloadPDF(drive: drive_v3.Drive, fileId: string, destPath: string): Promise<void> {
  const dest = fs.createWriteStream(destPath);
  const res  = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
  await new Promise<void>((resolve, reject) => {
    (res.data as NodeJS.ReadableStream).pipe(dest);
    dest.on('finish', resolve);
    dest.on('error', reject);
  });
}

// ── PDF text extraction ────────────────────────────────────────────────────────
async function extractPDFText(filePath: string): Promise<{ fullText: string; pages: string[] }> {
  // pdf-parse is CJS; handle both .default and direct export
  const mod      = await import('pdf-parse');
  const pdfParse = (mod.default ?? mod) as (buf: Buffer, opts?: Record<string, unknown>) => Promise<{ text: string }>;
  const buffer   = fs.readFileSync(filePath);

  let pages: string[] = [];
  const data = await pdfParse(buffer, {
    pagerender: (pageData: { getTextContent: () => Promise<{ items: { str: string; transform: number[] }[] }> }) => {
      return pageData.getTextContent().then((textContent) => {
        let text = '';
        let lastY: number | null = null;
        for (const item of textContent.items) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) text += '\n';
          text += item.str;
          lastY = item.transform[5];
        }
        pages.push(text);
        return text;
      });
    },
  });

  return { fullText: data.text, pages };
}

// ── Claude Vision for image pages ─────────────────────────────────────────────
async function analysePageWithVision(
  anthropic: Anthropic,
  pdfPath: string,
  pageNum: number
): Promise<string> {
  try {
    // Convert PDF page to image using sharp + pdf.js would be complex.
    // Instead, send the whole PDF and ask Claude to describe page N.
    // For now we use a text prompt; full rasterisation requires poppler/ghostscript.
    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64PDF = pdfBuffer.toString('base64');

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64PDF,
            },
          } as Parameters<typeof anthropic.messages.create>[0]['messages'][0]['content'][0],
          {
            type: 'text',
            text: `This is a past exam paper. Page ${pageNum} appears to contain diagrams or images (the text extraction was poor). Please describe what is shown on page ${pageNum} in detail, including: any diagrams, graphs, tables, equations, or visual elements. Format your response as structured text that could be used to generate similar exam questions. Focus especially on: the question being asked, what the diagram shows, and any measurements or values shown.`,
          },
        ],
      }],
    });

    return (response.content[0] as { text: string }).text;
  } catch (err) {
    console.warn(`     ⚠️  Vision analysis failed for page ${pageNum}:`, (err as Error).message);
    return '';
  }
}

// ── Metadata extraction ────────────────────────────────────────────────────────
function extractMetadata(filename: string): { year: number | null; paper_number: string | null } {
  const yearMatch   = filename.match(/\b(20\d{2}|19\d{2})\b/);
  const paperMatch  = filename.match(/\bpaper\s*(\d+)\b/i) ?? filename.match(/\bp(\d)\b/i);
  return {
    year:         yearMatch  ? parseInt(yearMatch[1])  : null,
    paper_number: paperMatch ? `Paper ${paperMatch[1]}` : null,
  };
}

// ── Question extraction ────────────────────────────────────────────────────────
async function extractQuestions(
  anthropic: Anthropic,
  rawText: string,
  subject: string,
  examType: string
): Promise<Record<string, unknown>[]> {
  if (!rawText || rawText.length < 50) return [];

  try {
    const truncated = rawText.slice(0, 8000); // stay within token budget
    const response  = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are processing a ${examType} ${subject} past exam paper. Extract all questions from the following text. Return a JSON array where each element has: { "question_number": "1a", "question_text": "...", "marks": 3, "topic": "algebra" }. Only return the JSON array, no other text.\n\n${truncated}`,
      }],
    });

    const text = (response.content[0] as { text: string }).text.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {
    // If extraction fails, return empty
  }
  return [];
}

// ── DB write ──────────────────────────────────────────────────────────────────
async function savePaper(sql: ReturnType<typeof neon>, paper: ProcessedPaper): Promise<void> {
  await sql`
    INSERT INTO past_papers
      (drive_file_id, country, exam_type, subject, title, year, paper_number,
       raw_text, page_analyses, questions)
    VALUES
      (${paper.drive_file_id}, ${paper.country}, ${paper.exam_type}, ${paper.subject},
       ${paper.title}, ${paper.year}, ${paper.paper_number},
       ${paper.raw_text},
       ${JSON.stringify(paper.page_analyses)},
       ${JSON.stringify(paper.questions)})
    ON CONFLICT (drive_file_id) DO UPDATE SET
      raw_text      = EXCLUDED.raw_text,
      page_analyses = EXCLUDED.page_analyses,
      questions     = EXCLUDED.questions,
      processed_at  = now()
  `;
}

// ── Process single paper ──────────────────────────────────────────────────────
async function processPaper(
  entry: PaperEntry,
  drive: drive_v3.Drive,
  anthropic: Anthropic,
  sqlClient: ReturnType<typeof neon>,
  index: number,
  total: number,
  counters: { processed: number; skipped: number; errored: number }
): Promise<void> {
  const { file, country, exam_type, subject } = entry;
  const title = file.name.replace(/\.pdf$/i, '');
  const tag = `[${index}/${total}]`;

  try {
    // Check if already processed
    if (!DRY_RUN) {
      const existing = await sqlClient`SELECT id FROM past_papers WHERE drive_file_id = ${file.id} LIMIT 1`;
      if (existing.length > 0) {
        console.log(`${tag} ⏭  ${subject} › ${title} (already done)`);
        counters.skipped++;
        return;
      }
    }

    console.log(`${tag} ⬇  ${country} › ${exam_type} › ${subject} › ${title}`);

    const tmpFile = path.join(DOWNLOAD_DIR, `${file.id}.pdf`);
    await downloadPDF(drive, file.id, tmpFile);

    const { fullText, pages } = await extractPDFText(tmpFile);

    // Analyse pages
    const pageAnalyses: PageAnalysis[] = [];
    for (let i = 0; i < pages.length; i++) {
      const pageText = pages[i] ?? '';
      const hasImage = pageText.trim().length < IMAGE_PAGE_TEXT_THRESHOLD;
      let visionDesc: string | undefined;
      if (hasImage) {
        visionDesc = await analysePageWithVision(anthropic, tmpFile, i + 1);
      }
      pageAnalyses.push({ page: i + 1, text: pageText, has_image: hasImage, vision_desc: visionDesc });
    }

    const questions = await extractQuestions(anthropic, fullText, subject, exam_type);
    const { year, paper_number } = extractMetadata(file.name);

    const paperData: ProcessedPaper = {
      drive_file_id: file.id,
      country, exam_type, subject, title, year, paper_number,
      raw_text: fullText,
      page_analyses: pageAnalyses,
      questions,
    };

    if (!DRY_RUN) {
      await savePaper(sqlClient, paperData);
    }

    console.log(`${tag} ✅ ${title} — ${questions.length} questions, ${pageAnalyses.filter(p => p.has_image).length} image pages`);
    counters.processed++;

    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }

  } catch (err) {
    console.error(`${tag} ❌ ${title}: ${(err as Error).message}`);
    counters.errored++;
  }
}

// ── Concurrency pool ──────────────────────────────────────────────────────────
async function runPool<T>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<void>
): Promise<void> {
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx + 1);
    }
  });
  await Promise.all(workers);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n📚 Educate Past Papers Processor');
  console.log('═'.repeat(50));
  if (DRY_RUN) console.log('⚠️  DRY RUN — no database writes\n');

  if (!process.env.DATABASE_URL)      throw new Error('DATABASE_URL not set in .env.local');
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set in .env.local');

  const auth      = getAuthClient();
  const drive     = google.drive({ version: 'v3', auth });
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const sqlClient = neon(process.env.DATABASE_URL);

  if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

  const papers    = await crawlDrive(drive);
  const toProcess = papers.slice(0, MAX_FILES);

  console.log(`Processing ${toProcess.length} of ${papers.length} files (concurrency: ${CONCURRENCY})...\n`);

  const counters = { processed: 0, skipped: 0, errored: 0 };
  const startTime = Date.now();

  await runPool(toProcess, CONCURRENCY, (entry, index) =>
    processPaper(entry, drive, anthropic, sqlClient, index, toProcess.length, counters)
  );

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const perFile = counters.processed > 0 ? Math.round(elapsed / counters.processed) : 0;

  console.log('\n' + '═'.repeat(50));
  console.log(`✅ Done in ${elapsed}s — ${counters.processed} processed (${perFile}s/file), ${counters.skipped} skipped, ${counters.errored} errors`);
  if (counters.processed > 0 && papers.length > toProcess.length) {
    const remaining = papers.length - toProcess.length;
    const eta = Math.round((remaining * perFile) / CONCURRENCY / 60);
    console.log(`📊 Full crawl ETA at ${CONCURRENCY}x concurrency: ~${eta} minutes (~${Math.round(eta/60)} hours)`);
  }
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message);
  process.exit(1);
});
