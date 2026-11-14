/**
 * Tidies stored past-paper question text before it is shown to students.
 *
 * The questions were scraped from the PDFs, and the text still carries the
 * printed page furniture: page numbers with their barcode markers ("48 *48*"),
 * "[Turn over]", "BLANK PAGE", the "outside the box" margin, exam footer codes
 * ("IB/M/Jun24/8300/1H") and the additional-answer page.
 *
 * Only clean what is sent to the browser. Paper matching (past-paper-match.ts and
 * the SQL in api/past-papers and api/mark-scheme) reads the footer codes from the
 * raw text, so the stored rows must stay as they are.
 */

// Everything from here on is the end of the paper, not part of the question
const END_OF_PAPER = /\s*(?:END OF QUESTIONS|Additional page, if required)[\s\S]*$/;

// AQA footer codes, e.g. "IB/M/Jun24/8300/1H", "G/Jun23/8035/3/PM", "IB/M/ Jun23/8464/C/1H"
const FOOTER_CODE = /(?:\b[A-Z]{1,3}\/\s?)*\b(?:Jun|Nov|JUN|NOV)\d{2}\/\d{4}[A-Z]?(?:\/[A-Za-z0-9]{1,6})*/g;

// A barcode page marker, optionally preceded by a page number: "48 *48*", "5 *05*", "*47*"
const PAGE_MARKER = /(?:\b(\d{1,3})\s+)?\*(\d{2,3})\*/g;

const FURNITURE: RegExp[] = [
  /\[Turn over\]/gi,
  /\bBLANK PAGE\b/g,
  /\bThere are no questions printed on this page\b/gi,
  /\bDO NOT WRITE ON THIS PAGE\b/gi,
  /\bANSWER IN THE SPACES PROVIDED\b/gi,
  /\bQuestion \d+ continues on the next page\b/gi,
  /\bCopyright\s*©[\s\S]*?All rights reserved\./gi,
  // The page number printed beside "Do not write outside the box" in the margin
  /(?:\bDo not write\s+)?(?:\b\d{1,3}\s+)?\boutside the box\b/gi,
  /\bExtra space\b/gi,
];

export function cleanQuestionText(text: string | null | undefined): string {
  if (!text) return '';
  let s = text.replace(END_OF_PAPER, '');
  s = s.replace(FOOTER_CODE, ' ');
  // Drop the marker; drop the number before it only when it is that same page number
  s = s.replace(PAGE_MARKER, (_m, before: string | undefined, page: string) =>
    before !== undefined && Number(before) !== Number(page) ? before : ' ');
  for (const re of FURNITURE) s = s.replace(re, ' ');
  return s.replace(/\s+/g, ' ').trim();
}

// AQA prints question numbers as two digits ("0 1 . 3" is question 01.3), and the
// scraper stored all of those as question "0". Read the real number from the text.
const AQA_LEADING_NUMBER = /^0\s+([1-9])(?:\s*\.\s*(\d{1,2}))?(?=\s+\D)/;

export function recoverQuestionNumber(stored: string | null, text: string | null | undefined): string | null {
  if (stored !== '0' || !text) return stored;
  const m = text.match(AQA_LEADING_NUMBER);
  if (!m) return stored;
  return m[2] ? `${m[1]}.${m[2]}` : m[1];
}

// Fewer letters than this after cleaning means there is no question left to answer
// (number-only fragments, blank answer lines). Kept low so short stems such as
// "Solve x² = 9" survive.
const MIN_LETTERS = 5;

export interface StoredQuestion {
  question_number: string | null;
  question_text: string | null;
}

/** Clean a list of stored question rows for display. Rows with no words left are dropped. */
export function cleanPaperQuestions<T extends StoredQuestion>(rows: readonly T[]): T[] {
  const out: T[] = [];
  for (const row of rows) {
    const number = recoverQuestionNumber(row.question_number, row.question_text);
    let text = cleanQuestionText(row.question_text);
    if (number !== row.question_number) {
      // Show "01.3" rather than the spaced-out "0 1 . 3" the PDF produced
      text = text.replace(AQA_LEADING_NUMBER, (_m, q: string, part?: string) => (part ? `0${q}.${part}` : `0${q}`));
    }
    if ((text.match(/\p{L}/gu)?.length ?? 0) < MIN_LETTERS) continue;
    out.push({ ...row, question_number: number, question_text: text });
  }
  return out;
}
