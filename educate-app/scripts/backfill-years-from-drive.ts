/**
 * Backfill year + paper_number + tier metadata for past_papers using Google Drive filenames.
 *
 * Drive filenames follow AQA/OCR/Edexcel conventions e.g.:
 *   AQA-84611H-QP-JUN23.PDF   → Biology P1 Higher June 2023
 *   AQA-84631F-QP-NOV21.PDF   → Chemistry P1 Foundation Nov 2021
 *   EDUQAS-C410-QP-2022.pdf   → year 2022
 *
 * Run: npx tsx scripts/backfill-years-from-drive.ts
 *      npx tsx scripts/backfill-years-from-drive.ts --dry-run
 */
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) {
      const key = m[1].trim();
      if (!process.env[key]) process.env[key] = m[2].trim().replace(/^["']|["']$/g, '').replace(/\\n$/, '').trim();
    }
  }
}

import { google } from 'googleapis';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const DRY_RUN = process.argv.includes('--dry-run');

// ── Load saved OAuth token ─────────────────────────────────────────────────
const TOKEN_PATH   = path.join(__dirname, 'token.json');
const CREDS_PATH   = path.join(__dirname, 'credentials.json');

if (!fs.existsSync(TOKEN_PATH))   throw new Error('token.json not found — run auth-drive.ts first');
if (!fs.existsSync(CREDS_PATH))   throw new Error('credentials.json not found');

const creds  = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf-8'));
const { client_id, client_secret } = creds.installed;
const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

const auth = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3333/callback');
auth.setCredentials(tokens);
const drive = google.drive({ version: 'v3', auth });

// ── Year extraction from filename ─────────────────────────────────────────
const MONTH_TO_NUM: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

function parseFilename(name: string): { year: number | null; paperNumber: string | null; tier: string | null } {
  const upper = name.toUpperCase();
  let year: number | null = null;

  // AQA: JUN23 / NOV21 / JAN22 suffix
  const aqaM = upper.match(/(?:JUN|NOV|JAN|MAY|MAR|OCT|FEB|AUG|SEP|APR|DEC)(\d{2})\b/);
  if (aqaM) year = 2000 + parseInt(aqaM[1]);

  // Eduqas/WJEC: s18-... or s23-... prefix (sXX = 20XX)
  if (!year) {
    const eduqasM = name.match(/^s(\d{2})[-_]/i);
    if (eduqasM) year = 2000 + parseInt(eduqasM[1]);
  }

  // 4-digit year anywhere: -2022- or _2023_ or (2019)
  if (!year) {
    const longM = name.match(/[\-_(](20[12]\d)[\-_)\.]/);
    if (longM) year = parseInt(longM[1]);
  }

  // Standalone 4-digit year at end e.g. name-2022.pdf
  if (!year) {
    const endM = name.match(/(20[12]\d)(?:\.pdf|\.PDF)?$/i);
    if (endM) year = parseInt(endM[1]);
  }

  // Paper number
  let paperNumber: string | null = null;
  const pnM = upper.match(/(?:PAPER[-\s]?|[-_]P)([123])\b/) || upper.match(/UNIT[-\s]?([123])\b/) || upper.match(/COMP([123])\b/);
  if (pnM) paperNumber = `Paper ${pnM[1]}`;

  // Tier
  let tier: string | null = null;
  if (/[-_]H[-_\.]/.test(upper) || upper.includes('-HT-') || upper.includes('HIGHER')) tier = 'Higher';
  else if (/[-_]F[-_\.]/.test(upper) || upper.includes('-FT-') || upper.includes('FOUNDATION')) tier = 'Foundation';

  return { year, paperNumber, tier };
}

// ── AQA paper-code → component + paper number ─────────────────────────────
// Combined Science Trilogy codes: 84611/84612=Bio P1/P2, 84631/32=Chem, 84651/52=Phys
// Combined Science Synergy codes:  84711/12=Bio, 84731/32=Chem, 84751/52=Phys
// Individual science codes: 84011=Bio P1, 84021=Bio P2, 84031=Chem P1, etc.
const AQA_CODE_MAP: Record<string, { component: string; paperNumber: string }> = {
  '84611': { component: 'Biology',   paperNumber: 'Paper 1' },
  '84612': { component: 'Biology',   paperNumber: 'Paper 2' },
  '84621': { component: 'Biology',   paperNumber: 'Paper 1' }, // alt code
  '84622': { component: 'Biology',   paperNumber: 'Paper 2' },
  '84631': { component: 'Chemistry', paperNumber: 'Paper 1' },
  '84632': { component: 'Chemistry', paperNumber: 'Paper 2' },
  '84641': { component: 'Chemistry', paperNumber: 'Paper 1' },
  '84642': { component: 'Chemistry', paperNumber: 'Paper 2' },
  '84651': { component: 'Physics',   paperNumber: 'Paper 1' },
  '84652': { component: 'Physics',   paperNumber: 'Paper 2' },
  '84661': { component: 'Physics',   paperNumber: 'Paper 1' },
  '84662': { component: 'Physics',   paperNumber: 'Paper 2' },
};

function parseAQACode(name: string): { component: string | null; paperNumber: string | null } {
  const m = name.toUpperCase().match(/AQA-(\d{5})[HF]/);
  if (m) {
    const info = AQA_CODE_MAP[m[1]];
    if (info) return info;
  }
  return { component: null, paperNumber: null };
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n📅 Year Backfill from Drive Filenames${DRY_RUN ? ' (DRY RUN)' : ''}`);
  console.log('═'.repeat(60));

  // Get all papers with missing year metadata
  const papers = await sql`
    SELECT id, drive_file_id, year, paper_number, component, subject, exam_type
    FROM past_papers
    WHERE total_questions > 0
      AND (year IS NULL OR paper_number IS NULL)
    ORDER BY exam_type, subject
  ` as { id: string; drive_file_id: string; year: number | null; paper_number: string | null; component: string | null; subject: string; exam_type: string }[];

  console.log(`Papers needing year/paper metadata: ${papers.length}\n`);

  let updatedYear = 0, updatedPaper = 0, updatedComponent = 0, errors = 0, skipped = 0;
  let batchUpdates: { id: string; year: number | null; paperNumber: string | null; component: string | null; tier: string | null }[] = [];

  const BATCH = 50;
  let processed = 0;

  for (const paper of papers) {
    processed++;
    if (processed % 100 === 0) {
      console.log(`  Progress: ${processed}/${papers.length} (${Math.round(processed/papers.length*100)}%)`);
    }

    try {
      // Fetch Drive filename
      const res = await drive.files.get({
        fileId: paper.drive_file_id,
        fields: 'name',
      });
      const filename = res.data.name || '';

      const { year, paperNumber, tier } = parseFilename(filename);
      const { component: aqaComponent, paperNumber: aqaPaperNumber } = parseAQACode(filename);

      const newYear        = paper.year        ?? year;
      const newPaperNumber = paper.paper_number ?? paperNumber ?? aqaPaperNumber;
      const newComponent   = paper.component   ?? aqaComponent;

      const hasChange = (newYear && !paper.year) || (newPaperNumber && !paper.paper_number) || (newComponent && !paper.component);

      if (!hasChange) { skipped++; continue; }

      if (DRY_RUN) {
        console.log(`  ${filename.padEnd(45)} → year:${newYear} paper:${newPaperNumber} comp:${newComponent}`);
      } else {
        batchUpdates.push({ id: paper.id, year: newYear, paperNumber: newPaperNumber, component: newComponent, tier });

        if (batchUpdates.length >= BATCH) {
          await flushBatch(batchUpdates);
          batchUpdates = [];
        }
      }

      if (newYear        && !paper.year)         updatedYear++;
      if (newPaperNumber && !paper.paper_number) updatedPaper++;
      if (newComponent   && !paper.component)    updatedComponent++;

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('not found') && !msg.includes('404')) {
        errors++;
        if (errors <= 5) console.error(`  Error for ${paper.drive_file_id}: ${msg}`);
      } else {
        skipped++;
      }
    }
  }

  // Flush remaining
  if (!DRY_RUN && batchUpdates.length > 0) await flushBatch(batchUpdates);

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Year updated:        ${updatedYear}`);
  console.log(`✅ Paper # updated:     ${updatedPaper}`);
  console.log(`✅ Component updated:   ${updatedComponent}`);
  console.log(`⏭  Skipped:            ${skipped}`);
  console.log(`❌ Errors:             ${errors}`);
  console.log(`📊 Total processed:    ${papers.length}`);
  if (DRY_RUN) console.log('\n⚠️  DRY RUN — no changes written.');
}

async function flushBatch(batch: { id: string; year: number | null; paperNumber: string | null; component: string | null; tier: string | null }[]) {
  for (const u of batch) {
    await sql`
      UPDATE past_papers SET
        year         = COALESCE(${u.year},         year),
        paper_number = COALESCE(${u.paperNumber},  paper_number),
        component    = COALESCE(${u.component},    component)
      WHERE id = ${u.id}
    `;
  }
}

main().catch(console.error);
