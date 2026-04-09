/**
 * Migration: Add Google Classroom sync support
 * Run: npx tsx scripts/migrate-classroom-sync.ts
 */
import { sql } from '../src/lib/db';

async function migrate() {
  console.log('Running classroom sync migration...');

  await sql`
    CREATE TABLE IF NOT EXISTS teacher_google_tokens (
      user_id     TEXT PRIMARY KEY,
      tokens      JSONB NOT NULL,
      updated_at  TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log('Created teacher_google_tokens table');

  await sql`
    ALTER TABLE classes ADD COLUMN IF NOT EXISTS google_classroom_id TEXT
  `;
  console.log('Added google_classroom_id to classes');

  await sql`
    ALTER TABLE classes ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ
  `;
  console.log('Added last_synced_at to classes');

  console.log('Migration complete.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
