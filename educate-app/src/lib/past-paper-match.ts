/**
 * Helpers for matching a past paper chosen in the UI (board · subject · paper
 * number · tier · sitting) to a row in the `past_papers` table.
 *
 * The DB metadata is sparse: most rows have year, paper_number and component
 * set to NULL and titles are content hashes. The reliable signal is the exam
 * code printed in the paper footer and captured in `questions.question_text`,
 * e.g. AQA "IB/M/Jun23/8300/1H" (Maths Paper 1 Higher, June 2023) or
 * "Jun23/8464/B/1H" (Combined Science Trilogy Biology Paper 1 Higher).
 */

/** UI subject name → subject values used in the DB (exam_type keeps boards apart). */
const SUBJECT_ALIASES: Record<string, string[]> = {
  'Combined Science': [
    'Combined Science Trilogy',                                  // AQA
    'Gateway Science Suite - Combined Science A',                // OCR
    'Twenty First Century Science Suite - Combined Science B',   // OCR
  ],
  'Business Studies': ['Business'],
  'Religious Studies': ['Religious Studies A'],                  // AQA
  'Art & Design': ['Art and Design'],
  'Design & Technology': ['Design and Technology'],
  'Food Preparation & Nutrition': ['Food Preparation and Nutrition', 'Food and Nutrition'],
  'Biology': ['Biology A Gateway', 'Gateway Science Suite - Biology A', 'Twenty First Century Science Suite - Biology B'],
  'Chemistry': ['Gateway Science Suite - Chemistry A', 'Twenty First Century Science Suite - Chemistry B'],
  'Physics': ['Gateway Science Suite - Physics A', 'Twenty First Century Science Suite - Physics B'],
  'Geography': ['Geography A (Geographical Themes)', 'Geography B (Geography for Enquiring Minds)'],
  'History': ['History A (Explaining the Modern World)', 'History B (Schools History Project)'],
  'Welsh': ['Welsh Language'],
};

/** All DB subject values that should match a given subject name (always includes the name itself). */
export function dbSubjectsFor(subject: string): string[] {
  return [subject, ...(SUBJECT_ALIASES[subject] ?? [])];
}

const COMPONENT_LETTER: Record<string, string> = { Biology: 'b', Chemistry: 'c', Physics: 'p' };

export interface PaperSelection {
  year: number;                 // e.g. 2023
  session: 'June' | 'November';
  paperNumber: number | null;   // 1, 2, 3 …
  tier: 'H' | 'F' | null;
  component: string | null;     // Biology / Chemistry / Physics (Combined Science)
}

/** Parse the UI year label ("2023" or "Nov 2023") into year + sitting. */
export function parseYearLabel(label: string | null | undefined): { year: number; session: 'June' | 'November' } | null {
  if (!label) return null;
  const m = label.trim().match(/^(nov(?:ember)?\s+)?(20\d{2})$/i);
  if (!m) return null;
  return { year: parseInt(m[2]), session: m[1] ? 'November' : 'June' };
}

/**
 * Postgres (case-insensitive, ARE) regex matching the footer code of exactly
 * this paper, e.g. "jun23/[0-9]{4}[a-z]?/([a-z]/)?1h([^a-z0-9]|$)".
 * Returns null if there is not enough information for a precise code match.
 */
export function examCodePattern(sel: PaperSelection): string | null {
  if (!sel.paperNumber) return null;
  const sitting = sel.session === 'November' ? 'nov' : 'jun';
  const yy = String(sel.year).slice(2);
  const letter = sel.component ? COMPONENT_LETTER[sel.component] : undefined;
  const compPart = letter ? `${letter}/` : '([a-z]/)?';
  // Untiered papers may carry a one-character suffix, e.g. History "8145/1A", RS "8062/11"
  const tierPart = sel.tier ? sel.tier.toLowerCase() : '[a-z0-9]?';
  return `${sitting}${yy}/[0-9]{4}[a-z]?/${compPart}${sel.paperNumber}${tierPart}([^a-z0-9]|$)`;
}

/** Matches any AQA-style sitting/spec code, used to spot papers that belong to a different sitting. */
export const ANY_EXAM_CODE_PATTERN = '(jun|nov)[0-9]{2}/[0-9]{4}';

export interface PaperCandidate {
  id: string;
  year: number | null;
  subject: string;
  paper_number: string | null;
  component: string | null;
  total_questions: number;
  n_rows: number;      // question rows actually stored
  hits: number;        // rows containing this paper's exact code
  other_hits: number;  // rows containing a different sitting/paper code
  marks: number | null;
}

export type MatchKind = 'exact' | 'metadata' | 'subject';

/**
 * Pick the best paper for a selection.
 *  1. exact    — footer code matches sitting + paper number + tier (+ component)
 *  2. metadata — year (and paper_number when set) columns match, and no conflicting code
 *  3. subject  — same subject only, deterministic per selection (never another subject)
 */
export function pickPaper(cands: PaperCandidate[], sel: PaperSelection): { paper: PaperCandidate; match: MatchKind } | null {
  const usable = cands.filter(c => c.n_rows > 0);
  if (usable.length === 0) return null;

  const completeness = (a: PaperCandidate, b: PaperCandidate) =>
    Number(b.n_rows === b.total_questions) - Number(a.n_rows === a.total_questions) ||
    b.n_rows - a.n_rows ||
    a.id.localeCompare(b.id);

  const exact = usable
    .filter(c => c.hits > 0)
    .sort((a, b) => Number(a.other_hits > 0) - Number(b.other_hits > 0) || completeness(a, b));
  if (exact.length > 0) return { paper: exact[0], match: 'exact' };

  const wantPN = sel.paperNumber ? `Paper ${sel.paperNumber}` : null;
  const meta = usable
    .filter(c => c.year === sel.year && c.other_hits === 0)
    .filter(c => !wantPN || c.paper_number === null || c.paper_number === wantPN)
    .sort((a, b) => Number(b.paper_number === wantPN) - Number(a.paper_number === wantPN) || completeness(a, b));
  if (meta.length > 0) return { paper: meta[0], match: 'metadata' };

  // Prefer complete, reasonably sized papers so a stray fragment isn't served
  const solid = usable.filter(c => c.n_rows === c.total_questions && c.n_rows >= 10);
  const consistent = usable.filter(c => c.n_rows === c.total_questions);
  const list = (solid.length > 0 ? solid : consistent.length > 0 ? consistent : usable).sort((a, b) => a.id.localeCompare(b.id));
  const seed = `${sel.year}${sel.session}${sel.paperNumber ?? ''}${sel.tier ?? ''}${sel.component ?? ''}`;
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return { paper: list[h % list.length], match: 'subject' };
}
