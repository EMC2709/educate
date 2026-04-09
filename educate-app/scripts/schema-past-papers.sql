-- ═══════════════════════════════════════════════════════════════
-- Past Papers Schema  — normalised, indexed, built for scale
-- ═══════════════════════════════════════════════════════════════

-- ── Papers (lightweight metadata only — NO raw text blobs) ──────
CREATE TABLE IF NOT EXISTS past_papers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_file_id   TEXT NOT NULL UNIQUE,
  country         TEXT NOT NULL,       -- England / Scotland / Wales / Northern_Ireland
  exam_type       TEXT NOT NULL,       -- GCSE / A-Level / AdvHigher_SQA / etc.
  subject         TEXT NOT NULL,       -- Maths / Biology / Physics / etc.
  title           TEXT NOT NULL,       -- filename without extension
  year            INTEGER,
  paper_number    TEXT,                -- Paper 1 / Paper 2 / etc.
  total_questions INTEGER DEFAULT 0,
  has_images      BOOLEAN DEFAULT false,
  processed       BOOLEAN DEFAULT false,
  processed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pp_country_idx   ON past_papers (country);
CREATE INDEX IF NOT EXISTS pp_subject_idx   ON past_papers (subject);
CREATE INDEX IF NOT EXISTS pp_exam_idx      ON past_papers (exam_type);
CREATE INDEX IF NOT EXISTS pp_year_idx      ON past_papers (year);
CREATE INDEX IF NOT EXISTS pp_processed_idx ON past_papers (processed);

-- ── Questions (the real data — properly indexed) ─────────────────
CREATE TABLE IF NOT EXISTS questions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id         UUID NOT NULL REFERENCES past_papers(id) ON DELETE CASCADE,

  -- Identity
  question_number  TEXT,              -- "1a", "2b(ii)", etc.
  question_text    TEXT NOT NULL,
  marks            INTEGER,
  topic            TEXT,              -- "trigonometry", "algebra", "forces", etc.

  -- Image support
  has_image        BOOLEAN DEFAULT false,
  image_desc       TEXT,              -- Claude Vision description of diagram/graph

  -- For AI quiz generation
  difficulty       INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  mark_scheme      TEXT,              -- if mark scheme paper, stores the answer

  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS q_paper_idx    ON questions (paper_id);
CREATE INDEX IF NOT EXISTS q_topic_idx    ON questions (topic);
CREATE INDEX IF NOT EXISTS q_marks_idx    ON questions (marks);
CREATE INDEX IF NOT EXISTS q_has_img_idx  ON questions (has_image);
CREATE INDEX IF NOT EXISTS q_diff_idx     ON questions (difficulty);

-- FTS on question text (fast keyword search)
CREATE INDEX IF NOT EXISTS q_fts_idx ON questions
  USING gin(to_tsvector('english', coalesce(question_text, '') || ' ' || coalesce(topic, '')));

-- ── Composite index for the most common app query ────────────────
-- "Give me 10 Maths GCSE trigonometry questions for this student"
CREATE INDEX IF NOT EXISTS pp_subject_exam_idx ON past_papers (subject, exam_type);
