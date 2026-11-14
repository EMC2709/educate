// Hides mark-scheme documents that were scraped as if they were question papers.
//
// v1/v2 matched on file titles only. AQA files are stored under hash titles, so
// none of the AQA mark schemes were caught, and OCR titles such as
// "Mark scheme - Unit J567_04 - Paper 4" slipped through the v2 pattern.
// v3 also reads the text: every page of an AQA mark scheme carries a running
// header such as "MARK SCHEME – GCSE GERMAN – 8668/WH – JUNE 2024", and a question
// paper never does. Documents that also carry question-paper furniture ("Turn
// over", "outside the box", "*12*" page markers) are bundles of a paper plus its
// mark scheme and stay visible.
//
// OCR sample assessment materials only have a "MARK SCHEME Duration: ..." cover
// page and hold the question paper in the same PDF, so they are not hidden here;
// cleanQuestionText() in src/lib/question-text.ts cuts the mark-scheme text out
// of their rows instead.
//
// Same convention as v1/v2: processed = false hides a paper from every route.
// scripts/process-past-papers.ts skips papers with processed = false and keeps
// them hidden on --force (since 14 Nov 2026; before that a rerun un-hid them).
//
//   node scripts/cleanup-mark-schemes-v3.mjs           # dry run: counts and samples
//   node scripts/cleanup-mark-schemes-v3.mjs --apply   # hide them
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

process.loadEnvFile(new URL('../.env.local', import.meta.url));
const sql = neon(process.env.DATABASE_URL);
const APPLY = process.argv.includes('--apply');

const TITLE = '(mark[ _-]?schemes?|marking[ _-]?(instructions|guidance|scheme))|(^|[-_ ])(ms|mi)([-_ .]|$)';
const HEADER = 'MARK SCHEME [–-] [A-Z]';
const PAPER_FURNITURE = '(Turn over|outside the box|[*][0-9]{2,3}[*])';
// AQA teacher resources ("Example answers and commentaries", examiner reports) have
// no running header. Every real AQA question paper has page furniture and an exam
// footer code ("Jun23/8300/1H"); these have neither, plus marking language.
const AQA_FOOTER_CODE = '(Jun|Nov|JUN|NOV)[0-9]{2}/[0-9]{4}';
const MARKING_PHRASES = '(key messages are conveyed|does not meet the standard required|marks? for (Content|Quality|Range)|Indicative content|worthy of credit|Example answers and commentar|Extract from mark scheme)';
// AQA examiner reports quote each question and then comment on how students did.
// A real paper can use one of these phrases in passing, so a document is only
// treated as a report when at least 30% of its rows read like commentary.
const EXAMINER_REPORT = '(Students who|[Ss]tudents (were|often|tended|generally)|Report on the Examination|[Ee]xaminers? report|General [Cc]omments|Most students|[Mm]any students|[Ss]ome students|[Ff]ew students|answered (well|poorly)|well answered|poorly answered)';
const REPORT_SHARE = 0.3;

const found = await sql`
  SELECT p.id, p.exam_type, p.subject, p.title, p.total_questions,
         (p.title ~* ${TITLE}) AS by_title
  FROM past_papers p
  WHERE p.processed = true AND p.total_questions > 0 AND (
    p.title ~* ${TITLE}
    OR (EXISTS (SELECT 1 FROM questions q WHERE q.paper_id = p.id AND q.question_text ~ ${HEADER})
        AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.paper_id = p.id AND q.question_text ~ ${PAPER_FURNITURE}))
    OR (p.exam_type IN ('GCSE_AQA', 'A-Level_AQA')
        AND (EXISTS (SELECT 1 FROM questions q WHERE q.paper_id = p.id AND q.question_text ~ ${MARKING_PHRASES})
             OR (SELECT count(*) FROM questions q WHERE q.paper_id = p.id AND q.question_text ~ ${EXAMINER_REPORT})
                >= ${REPORT_SHARE}::float * p.total_questions)
        AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.paper_id = p.id AND q.question_text ~ ${PAPER_FURNITURE})
        AND NOT EXISTS (SELECT 1 FROM questions q WHERE q.paper_id = p.id AND q.question_text ~ ${AQA_FOOTER_CODE}))
  )`;

const byType = {};
for (const r of found) {
  const t = (byType[r.exam_type] ??= { papers: 0, questions: 0, byTitle: 0, byText: 0 });
  t.papers++; t.questions += r.total_questions; r.by_title ? t.byTitle++ : t.byText++;
}
console.log(`${found.length} papers, ${found.reduce((n, r) => n + r.total_questions, 0)} question rows`);
console.table(byType);
const sample = [...found].sort(() => Math.random() - 0.5).slice(0, 20);
for (const r of sample) console.log(`  ${r.by_title ? 'title' : 'text '} ${r.exam_type.padEnd(15)} ${r.subject.slice(0, 22).padEnd(22)} ${r.title.slice(0, 70)}`);

if (!APPLY) {
  console.log('\nDry run. Pass --apply to hide these papers.');
} else {
  const ids = found.map(r => r.id);
  // Undo: UPDATE past_papers SET processed = true WHERE id = ANY(<ids from this file>)
  const idsFile = new URL('./cleanup-mark-schemes-v3.ids.json', import.meta.url);
  const earlier = existsSync(idsFile) ? JSON.parse(readFileSync(idsFile, 'utf8')) : [];
  writeFileSync(idsFile, JSON.stringify([...new Set([...earlier, ...ids])], null, 0) + '\n');
  const done = await sql`UPDATE past_papers SET processed = false WHERE id = ANY(${ids}::uuid[]) RETURNING id`;
  console.log(`\nHidden ${done.length} mark-scheme papers (processed = false).`);
}
