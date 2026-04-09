/**
 * Apply/update past papers schema on Neon.
 * Safe to re-run — uses IF NOT EXISTS throughout.
 * Usage: npx tsx scripts/migrate-past-papers.ts
 */
import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set in .env.local');
const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('🗄️  Applying normalised past papers schema to Neon...\n');

  // ── past_papers ──────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS past_papers (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      drive_file_id   TEXT NOT NULL UNIQUE,
      country         TEXT NOT NULL,
      exam_type       TEXT NOT NULL,
      subject         TEXT NOT NULL,
      title           TEXT NOT NULL,
      year            INTEGER,
      paper_number    TEXT,
      total_questions INTEGER DEFAULT 0,
      has_images      BOOLEAN DEFAULT false,
      processed       BOOLEAN DEFAULT false,
      processed_at    TIMESTAMPTZ,
      created_at      TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log('  ✓ past_papers table');

  // ── questions ────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS questions (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      paper_id         UUID NOT NULL REFERENCES past_papers(id) ON DELETE CASCADE,
      question_number  TEXT,
      question_text    TEXT NOT NULL,
      marks            INTEGER,
      topic            TEXT,
      has_image        BOOLEAN DEFAULT false,
      image_desc       TEXT,
      difficulty       INTEGER CHECK (difficulty BETWEEN 1 AND 5),
      mark_scheme      TEXT,
      created_at       TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log('  ✓ questions table');

  // ── Migrate existing past_papers table (add new columns if missing) ──
  const alterStmts = [
    sql`ALTER TABLE past_papers ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0`,
    sql`ALTER TABLE past_papers ADD COLUMN IF NOT EXISTS has_images BOOLEAN DEFAULT false`,
    sql`ALTER TABLE past_papers ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT false`,
    sql`ALTER TABLE past_papers ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ`,
    // Drop old columns that are no longer needed (raw text blobs)
    sql`ALTER TABLE past_papers DROP COLUMN IF EXISTS raw_text`,
    sql`ALTER TABLE past_papers DROP COLUMN IF EXISTS page_analyses`,
    sql`ALTER TABLE past_papers DROP COLUMN IF EXISTS questions`,
  ];
  await Promise.all(alterStmts);
  console.log('  ✓ past_papers columns migrated');

  // ── indexes ──────────────────────────────────────────────────
  const indexes = [
    sql`CREATE INDEX IF NOT EXISTS pp_country_idx     ON past_papers (country)`,
    sql`CREATE INDEX IF NOT EXISTS pp_subject_idx     ON past_papers (subject)`,
    sql`CREATE INDEX IF NOT EXISTS pp_exam_idx        ON past_papers (exam_type)`,
    sql`CREATE INDEX IF NOT EXISTS pp_year_idx        ON past_papers (year)`,
    sql`CREATE INDEX IF NOT EXISTS pp_processed_idx   ON past_papers (processed)`,
    sql`CREATE INDEX IF NOT EXISTS pp_subject_exam_idx ON past_papers (subject, exam_type)`,
    sql`CREATE INDEX IF NOT EXISTS q_paper_idx        ON questions (paper_id)`,
    sql`CREATE INDEX IF NOT EXISTS q_topic_idx        ON questions (topic)`,
    sql`CREATE INDEX IF NOT EXISTS q_marks_idx        ON questions (marks)`,
    sql`CREATE INDEX IF NOT EXISTS q_has_img_idx      ON questions (has_image)`,
    sql`CREATE INDEX IF NOT EXISTS q_diff_idx         ON questions (difficulty)`,
    sql`CREATE INDEX IF NOT EXISTS q_fts_idx          ON questions USING gin(to_tsvector('english', coalesce(question_text, '') || ' ' || coalesce(topic, '')))`,
  ];
  await Promise.all(indexes);
  console.log('  ✓ Indexes (12)\n');

  console.log('✅ Schema ready!\n');
  console.log('Next: npx tsx scripts/process-past-papers.ts --limit 5');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
