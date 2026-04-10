/**
 * Applies the multi-tenant school schema to Neon.
 * Safe to re-run — uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS throughout.
 * Usage: npx tsx scripts/migrate-school-schema.ts
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
  console.log('Applying school/multi-tenant schema to Neon...\n');

  // ── organisations ──────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS organisations (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name       TEXT NOT NULL,
      slug       TEXT UNIQUE NOT NULL,
      domain     TEXT,
      country    TEXT DEFAULT 'England',
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log('  + organisations table');

  // ── extend profiles ────────────────────────────────────────────
  const profileAlters = [
    sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organisations(id)`,
    sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student','teacher','school_admin','super_admin'))`,
    sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year_group INTEGER CHECK (year_group BETWEEN 6 AND 13)`,
    sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_classroom_id TEXT`,
  ];
  await Promise.all(profileAlters);
  console.log('  + profiles columns (org_id, role, year_group, google_classroom_id)');

  // ── classes ────────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS classes (
      id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id              UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      teacher_id          TEXT NOT NULL,
      name                TEXT NOT NULL,
      subject             TEXT NOT NULL,
      year_group          INTEGER,
      exam_type           TEXT,
      google_classroom_id TEXT,
      created_at          TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log('  + classes table');

  // ── class_members ──────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS class_members (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      class_id   UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
      student_id TEXT NOT NULL,
      joined_at  TIMESTAMPTZ DEFAULT now(),
      UNIQUE(class_id, student_id)
    )
  `;
  console.log('  + class_members table');

  // ── assignments ────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS assignments (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      class_id     UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
      teacher_id   TEXT NOT NULL,
      title        TEXT NOT NULL,
      description  TEXT,
      paper_id     UUID REFERENCES past_papers(id),
      subject      TEXT,
      topic        TEXT,
      exam_type    TEXT,
      question_ids JSONB DEFAULT '[]',
      due_date     TIMESTAMPTZ,
      created_at   TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log('  + assignments table');

  // ── assignment_progress ────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS assignment_progress (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      assignment_id   UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id      TEXT NOT NULL,
      questions_done  INTEGER DEFAULT 0,
      questions_total INTEGER DEFAULT 0,
      score           INTEGER DEFAULT 0,
      completed       BOOLEAN DEFAULT false,
      completed_at    TIMESTAMPTZ,
      started_at      TIMESTAMPTZ DEFAULT now(),
      UNIQUE(assignment_id, student_id)
    )
  `;
  console.log('  + assignment_progress table');

  // ── indexes ────────────────────────────────────────────────────
  const indexes = [
    sql`CREATE INDEX IF NOT EXISTS classes_org_idx               ON classes (org_id)`,
    sql`CREATE INDEX IF NOT EXISTS classes_teacher_idx           ON classes (teacher_id)`,
    sql`CREATE INDEX IF NOT EXISTS class_members_class_idx       ON class_members (class_id)`,
    sql`CREATE INDEX IF NOT EXISTS class_members_student_idx     ON class_members (student_id)`,
    sql`CREATE INDEX IF NOT EXISTS assignments_class_idx         ON assignments (class_id)`,
    sql`CREATE INDEX IF NOT EXISTS assignment_progress_assign_idx ON assignment_progress (assignment_id)`,
    sql`CREATE INDEX IF NOT EXISTS assignment_progress_student_idx ON assignment_progress (student_id)`,
    sql`CREATE INDEX IF NOT EXISTS profiles_org_idx              ON profiles (org_id)`,
  ];
  await Promise.all(indexes);
  console.log('  + Indexes (8)\n');

  console.log('Schema ready!\n');
  console.log('Run the app and use POST /api/organisations to create your first school.');
}

main().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
