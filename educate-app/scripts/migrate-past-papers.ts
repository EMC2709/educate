/**
 * Apply past_papers schema to Neon Postgres.
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

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not set in .env.local');
}

// Use neon's SQL function with unsafe raw query support
const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('🗄️  Applying past_papers schema to Neon...');

  // Run each statement individually using tagged template (safe for DDL)
  await sql`
    CREATE TABLE IF NOT EXISTS past_papers (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      drive_file_id TEXT NOT NULL UNIQUE,
      country       TEXT NOT NULL,
      exam_type     TEXT NOT NULL,
      subject       TEXT NOT NULL,
      title         TEXT NOT NULL,
      year          INTEGER,
      paper_number  TEXT,
      raw_text      TEXT,
      page_analyses JSONB DEFAULT '[]',
      questions     JSONB DEFAULT '[]',
      processed_at  TIMESTAMPTZ DEFAULT now(),
      created_at    TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log('  ✓ past_papers table');

  await sql`CREATE INDEX IF NOT EXISTS past_papers_country_idx   ON past_papers (country)`;
  await sql`CREATE INDEX IF NOT EXISTS past_papers_subject_idx   ON past_papers (subject)`;
  await sql`CREATE INDEX IF NOT EXISTS past_papers_exam_type_idx ON past_papers (exam_type)`;
  await sql`CREATE INDEX IF NOT EXISTS past_papers_year_idx      ON past_papers (year)`;
  await sql`CREATE INDEX IF NOT EXISTS past_papers_fts_idx       ON past_papers USING gin(to_tsvector('english', coalesce(raw_text, '')))`;
  console.log('  ✓ Indexes');

  console.log('\n✅ Schema applied successfully!\n');
  console.log('Next steps:');
  console.log('  1. In Google Cloud Console → APIs & Services → Credentials');
  console.log('     → Click your Desktop app OAuth client → Download JSON');
  console.log('     → Rename it credentials.json');
  console.log('     → Save to: educate-app/scripts/credentials.json');
  console.log('');
  console.log('  2. Run: npx tsx scripts/auth-drive.ts');
  console.log('     (opens browser, log in as Paul, saves token.json)');
  console.log('');
  console.log('  3. Run: npx tsx scripts/process-past-papers.ts --limit 5');
  console.log('     (test with 5 files first, then remove --limit for full crawl)');
}

main().catch(err => {
  console.error('\n❌ Migration failed:', err.message);
  process.exit(1);
});
