-- Past papers schema for Neon Postgres
-- Run once against your DATABASE_URL

CREATE TABLE IF NOT EXISTS past_papers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_file_id TEXT NOT NULL UNIQUE,        -- Google Drive file ID
  country       TEXT NOT NULL,               -- England / Northern_Ireland / Scotland / Wales
  exam_type     TEXT NOT NULL,               -- GCSE / A-Level / etc.
  subject       TEXT NOT NULL,               -- Maths / Physics / etc.
  title         TEXT NOT NULL,               -- original filename (without extension)
  year          INTEGER,                     -- extracted from filename if possible
  paper_number  TEXT,                        -- "Paper 1", "Paper 2", etc. if detectable
  raw_text      TEXT,                        -- full extracted text (pdf-parse)
  page_analyses JSONB DEFAULT '[]',          -- [{page: 1, text: "...", has_image: true, vision_desc: "..."}, ...]
  questions     JSONB DEFAULT '[]',          -- [{question: "...", mark_scheme: "...", marks: 5}, ...]
  processed_at  TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS past_papers_country_idx    ON past_papers (country);
CREATE INDEX IF NOT EXISTS past_papers_subject_idx    ON past_papers (subject);
CREATE INDEX IF NOT EXISTS past_papers_exam_type_idx  ON past_papers (exam_type);
CREATE INDEX IF NOT EXISTS past_papers_year_idx       ON past_papers (year);

-- Full-text search index
CREATE INDEX IF NOT EXISTS past_papers_fts_idx ON past_papers USING gin(to_tsvector('english', coalesce(raw_text, '')));
