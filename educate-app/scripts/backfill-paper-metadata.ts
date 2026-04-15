/**
 * Backfill past paper metadata — extracts year, paper_number, and component
 * from question text and titles. Run after the main scrape to enrich records.
 *
 * Usage:
 *   npx tsx scripts/backfill-paper-metadata.ts
 *   npx tsx scripts/backfill-paper-metadata.ts --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Env loader (same as process-past-papers.ts) ─────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) {
      const key = m[1].trim();
      if (!process.env[key]) {
        process.env[key] = m[2].trim()
          .replace(/^["']|["']$/g, '')
          .replace(/\\n$/, '')
          .trim();
      }
    }
  }
}

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
const sql = neon(process.env.DATABASE_URL);
const DRY_RUN = process.argv.includes('--dry-run');

// ── Year extraction patterns ────────────────────────────────────────────────
function extractYear(title: string, questionTexts: string[]): number | null {
  // Try title first
  const titleYear = title.match(/\b(20[12]\d)\b/)?.[1];
  if (titleYear) return parseInt(titleYear);

  // Common patterns in exam paper titles: "june-2019", "nov2020", "2023-paper"
  const patterns = [
    /(?:june|jan|nov|mar|may|oct|summer|winter|autumn|spring)[\s_-]*(20[12]\d)/i,
    /(20[12]\d)[\s_-]*(?:june|jan|nov|mar|may|oct|summer|winter|autumn|spring)/i,
    /\b(20[12]\d)\b/,
  ];
  for (const p of patterns) {
    const m = title.match(p);
    if (m) return parseInt(m[1]);
  }

  // Try question text (some papers mention the year in headers)
  for (const qt of questionTexts.slice(0, 3)) {
    const m = qt.match(/\b(20[12]\d)\b/);
    if (m) return parseInt(m[1]);
  }

  return null;
}

// ── Paper number extraction ─────────────────────────────────────────────────
function extractPaperNumber(title: string, questionTexts: string[]): string | null {
  // Try title
  const patterns = [
    /paper[\s_-]*(\d)/i,
    /\bp(\d)\b/i,
    /unit[\s_-]*(\d)/i,
    /component[\s_-]*(\d)/i,
  ];
  for (const p of patterns) {
    const m = title.match(p);
    if (m) return `Paper ${m[1]}`;
  }

  // Check question text for paper headers
  for (const qt of questionTexts.slice(0, 2)) {
    for (const p of patterns) {
      const m = qt.match(p);
      if (m) return `Paper ${m[1]}`;
    }
  }

  return null;
}

// ── Combined Science component detection ────────────────────────────────────
const BIOLOGY_KEYWORDS = [
  'cell', 'enzyme', 'dna', 'gene', 'chromosome', 'mitosis', 'meiosis',
  'photosynthesis', 'respiration', 'osmosis', 'diffusion', 'organism',
  'ecosystem', 'food chain', 'heart', 'lung', 'blood', 'nervous system',
  'hormone', 'evolution', 'natural selection', 'species', 'classification',
  'infection', 'disease', 'immune', 'antibiotic', 'vaccination', 'plant',
  'transpiration', 'xylem', 'phloem', 'monoclonal', 'stem cell', 'ecology',
  'biodiversity', 'biomass', 'decomposition', 'carbon cycle',
];

const CHEMISTRY_KEYWORDS = [
  'atom', 'element', 'compound', 'mixture', 'bond', 'ionic', 'covalent',
  'metallic', 'electron', 'proton', 'neutron', 'periodic table', 'group',
  'period', 'reaction', 'acid', 'alkali', 'ph', 'neutralisation', 'salt',
  'electrolysis', 'oxidation', 'reduction', 'endothermic', 'exothermic',
  'rate of reaction', 'catalyst', 'organic', 'polymer', 'hydrocarbon',
  'crude oil', 'distillation', 'chromatography', 'mole', 'concentration',
  'titration', 'relative atomic mass', 'formula', 'equation',
];

const PHYSICS_KEYWORDS = [
  'force', 'newton', 'acceleration', 'velocity', 'speed', 'momentum',
  'energy', 'kinetic', 'potential', 'power', 'work done', 'circuit',
  'current', 'voltage', 'resistance', 'ohm', 'wave', 'frequency',
  'wavelength', 'electromagnetic', 'radiation', 'radioactive', 'half-life',
  'alpha', 'beta', 'gamma', 'nuclear', 'fission', 'fusion', 'magnet',
  'magnetic field', 'transformer', 'generator', 'motor', 'pressure',
  'density', 'specific heat', 'thermal', 'conduction', 'convection',
];

function detectScienceComponent(title: string, questionTexts: string[]): string | null {
  const allText = (title + ' ' + questionTexts.join(' ')).toLowerCase();

  // Check title first for explicit component names
  if (/biology/i.test(title)) return 'Biology';
  if (/chemistry/i.test(title)) return 'Chemistry';
  if (/physics/i.test(title)) return 'Physics';

  // Score keywords
  let bioScore = 0, chemScore = 0, physScore = 0;
  for (const kw of BIOLOGY_KEYWORDS) {
    if (allText.includes(kw)) bioScore++;
  }
  for (const kw of CHEMISTRY_KEYWORDS) {
    if (allText.includes(kw)) chemScore++;
  }
  for (const kw of PHYSICS_KEYWORDS) {
    if (allText.includes(kw)) physScore++;
  }

  const max = Math.max(bioScore, chemScore, physScore);
  if (max < 2) return null; // Too ambiguous
  if (bioScore === max) return 'Biology';
  if (chemScore === max) return 'Chemistry';
  return 'Physics';
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n📋 Past Paper Metadata Backfill${DRY_RUN ? ' (DRY RUN)' : ''}`);
  console.log('═'.repeat(55));

  // Add component column if it doesn't exist
  if (!DRY_RUN) {
    await sql`ALTER TABLE past_papers ADD COLUMN IF NOT EXISTS component text`;
  }

  // Fetch all papers that need enrichment
  const papers = await sql`
    SELECT id, title, year, paper_number, subject, exam_type
    FROM past_papers
    WHERE total_questions > 0
    ORDER BY exam_type, subject, title
  `;

  console.log(`Found ${papers.length} papers with questions to process\n`);

  let updatedYear = 0;
  let updatedPaper = 0;
  let updatedComponent = 0;
  let skipped = 0;

  for (const paper of papers) {
    const p = paper as { id: string; title: string; year: number | null; paper_number: string | null; subject: string; exam_type: string };

    // Fetch first few question texts for this paper
    const qs = await sql`
      SELECT question_text FROM questions
      WHERE paper_id = ${p.id}
      ORDER BY question_number
      LIMIT 5
    `;
    const qTexts = (qs as { question_text: string }[]).map(q => q.question_text);

    const newYear = p.year || extractYear(p.title, qTexts);
    const newPaper = p.paper_number || extractPaperNumber(p.title, qTexts);

    // Detect component for Combined Science
    let component: string | null = null;
    if (p.subject === 'Combined Science' || p.subject.toLowerCase().includes('combined')) {
      component = detectScienceComponent(p.title, qTexts);
    }

    const hasUpdates = (newYear && !p.year) || (newPaper && !p.paper_number) || component;

    if (!hasUpdates) {
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      if (newYear && !p.year) console.log(`  [year] ${p.title.substring(0, 50)} → ${newYear}`);
      if (newPaper && !p.paper_number) console.log(`  [paper] ${p.title.substring(0, 50)} → ${newPaper}`);
      if (component) console.log(`  [component] ${p.title.substring(0, 50)} → ${component}`);
    } else {
      await sql`
        UPDATE past_papers SET
          year = COALESCE(${newYear}, year),
          paper_number = COALESCE(${newPaper}, paper_number),
          component = COALESCE(${component}, component)
        WHERE id = ${p.id}
      `;
    }

    if (newYear && !p.year) updatedYear++;
    if (newPaper && !p.paper_number) updatedPaper++;
    if (component) updatedComponent++;
  }

  console.log('\n═'.repeat(55));
  console.log(`✅ Year extracted:      ${updatedYear}`);
  console.log(`✅ Paper # extracted:   ${updatedPaper}`);
  console.log(`✅ Component detected:  ${updatedComponent}`);
  console.log(`⏭  Skipped (no change): ${skipped}`);
  console.log(`📊 Total processed:     ${papers.length}`);
  if (DRY_RUN) console.log('\n⚠️  DRY RUN — no changes written. Remove --dry-run to apply.');
}

main().catch(console.error);
