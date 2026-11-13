-- Consolidated schema for educate (reconstructed from scripts/*.sql, scripts/migrate-*.ts,
-- supabase-schema-game.sql and inline CREATE/ALTER statements in src/app/api/**)
-- Apply to a fresh DB (idempotent): any Postgres client, or a Node script using @neondatabase/serverless
-- (sql.query per statement) with DATABASE_URL_UNPOOLED. Keep this file in sync when adding tables/columns.

CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  country TEXT DEFAULT 'England',
  ai_disabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- The school "AI off" switch (added 13 Nov 2026); read by src/lib/ai-access.ts
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS ai_disabled BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT 'Student',
  avatar_url TEXT,
  email TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  coins INTEGER NOT NULL DEFAULT 200,
  active_banner_id TEXT,
  parent_token TEXT,
  org_id UUID REFERENCES organisations(id),
  role TEXT DEFAULT 'student' CHECK (role IN ('student','teacher','school_admin','super_admin')),
  year_group INTEGER CHECK (year_group BETWEEN 6 AND 13),
  google_classroom_id TEXT,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles (xp DESC);
CREATE INDEX IF NOT EXISTS profiles_org_idx ON profiles (org_id);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (LOWER(username));

CREATE TABLE IF NOT EXISTS past_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_file_id TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  year INTEGER,
  paper_number TEXT,
  component TEXT,
  page_count INTEGER,
  total_questions INTEGER DEFAULT 0,
  has_images BOOLEAN DEFAULT false,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pp_country_idx ON past_papers (country);
CREATE INDEX IF NOT EXISTS pp_subject_idx ON past_papers (subject);
CREATE INDEX IF NOT EXISTS pp_exam_idx ON past_papers (exam_type);
CREATE INDEX IF NOT EXISTS pp_year_idx ON past_papers (year);
CREATE INDEX IF NOT EXISTS pp_processed_idx ON past_papers (processed);
CREATE INDEX IF NOT EXISTS pp_subject_exam_idx ON past_papers (subject, exam_type);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID NOT NULL REFERENCES past_papers(id) ON DELETE CASCADE,
  question_number TEXT,
  question_text TEXT NOT NULL,
  marks INTEGER,
  topic TEXT,
  has_image BOOLEAN DEFAULT false,
  image_desc TEXT,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  mark_scheme TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS q_paper_idx ON questions (paper_id);
CREATE INDEX IF NOT EXISTS q_topic_idx ON questions (topic);
CREATE INDEX IF NOT EXISTS q_marks_idx ON questions (marks);
CREATE INDEX IF NOT EXISTS q_has_img_idx ON questions (has_image);
CREATE INDEX IF NOT EXISTS q_diff_idx ON questions (difficulty);
CREATE INDEX IF NOT EXISTS q_fts_idx ON questions USING gin(to_tsvector('english', coalesce(question_text, '') || ' ' || coalesce(topic, '')));

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  year_group INTEGER,
  exam_type TEXT,
  google_classroom_id TEXT,
  last_synced_at TIMESTAMPTZ,
  join_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS classes_org_idx ON classes (org_id);
CREATE INDEX IF NOT EXISTS classes_teacher_idx ON classes (teacher_id);
CREATE INDEX IF NOT EXISTS classes_join_code_idx ON classes (join_code);

CREATE TABLE IF NOT EXISTS class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(class_id, student_id)
);
CREATE INDEX IF NOT EXISTS class_members_class_idx ON class_members (class_id);
CREATE INDEX IF NOT EXISTS class_members_student_idx ON class_members (student_id);

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  paper_id UUID REFERENCES past_papers(id),
  subject TEXT,
  topic TEXT,
  exam_type TEXT,
  question_ids JSONB DEFAULT '[]',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS assignments_class_idx ON assignments (class_id);

CREATE TABLE IF NOT EXISTS assignment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  questions_done INTEGER DEFAULT 0,
  questions_total INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);
CREATE INDEX IF NOT EXISTS assignment_progress_assign_idx ON assignment_progress (assignment_id);
CREATE INDEX IF NOT EXISTS assignment_progress_student_idx ON assignment_progress (student_id);

CREATE TABLE IF NOT EXISTS teacher_google_tokens (
  user_id TEXT PRIMARY KEY,
  tokens JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id TEXT NOT NULL,
  addressee_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (requester_id, addressee_id)
);
CREATE INDEX IF NOT EXISTS idx_friendships_users ON friendships (requester_id, addressee_id, status);

CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT UNIQUE NOT NULL,
  game_type TEXT NOT NULL DEFAULT 'tic-tac-toe',
  player_x TEXT NOT NULL,
  player_x_name TEXT NOT NULL DEFAULT 'Player X',
  player_o TEXT,
  player_o_name TEXT,
  board_state JSONB NOT NULL DEFAULT '["","","","","","","","",""]',
  current_turn TEXT NOT NULL DEFAULT 'X',
  winner TEXT,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','active','finished')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_subjects (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  board TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, subject, board)
);
CREATE INDEX IF NOT EXISTS idx_user_subjects_user ON user_subjects (user_id);

CREATE TABLE IF NOT EXISTS user_flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  subject TEXT,
  card_count INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT false,
  shared_by_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  example TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS revision_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (subject, topic)
);

CREATE TABLE IF NOT EXISTS user_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  banner_id TEXT NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, banner_id)
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  board TEXT NOT NULL,
  question_type TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  topic TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quiz_results_user_idx ON quiz_results (user_id, created_at DESC);
