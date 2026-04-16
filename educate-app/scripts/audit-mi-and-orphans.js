const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const envPath = path.join(__dirname, '..', '.env.local');
for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) { let v = m[2].trim().replace(/^"(.*)"$/, '$1').replace(/\\n/g, '').replace(/\r/g, '').trim(); process.env[m[1].trim()] = v; }
}

(async () => {
  const sql = neon(process.env.DATABASE_URL);

  // Scottish marking-instruction / mark-scheme PDFs misclassified as papers
  console.log('═══ MARK-SCHEME FILES IN past_papers ═══');
  const mi = await sql`
    SELECT COUNT(*)::int AS n FROM past_papers
    WHERE total_questions > 0 AND (
      title ILIKE 'mi_%' OR title ILIKE '%_ms_%' OR title ILIKE '%MarkScheme%' OR
      title ILIKE '%mark_scheme%' OR title ILIKE '%marking-instructions%' OR
      title ILIKE '%mark-scheme%' OR title ILIKE '%_MS%'
    )`;
  console.log(`  papers likely = mark schemes: ${mi[0].n}`);

  const byPrefix = await sql`
    SELECT CASE
      WHEN title ILIKE 'mi_%'                      THEN 'mi_ (Scottish MI)'
      WHEN title ILIKE '%MarkScheme%'              THEN 'MarkScheme'
      WHEN title ILIKE '%mark-scheme%'             THEN 'mark-scheme'
      WHEN title ILIKE '%marking-instructions%'    THEN 'marking-instructions'
      WHEN title ILIKE '%_ms_%' OR title ILIKE '%_MS%' THEN '_ms_'
      ELSE '?' END AS pattern,
      COUNT(*)::int AS n
    FROM past_papers WHERE total_questions > 0 AND (
      title ILIKE 'mi_%' OR title ILIKE '%_ms_%' OR title ILIKE '%MarkScheme%' OR
      title ILIKE '%mark_scheme%' OR title ILIKE '%marking-instructions%' OR title ILIKE '%_MS%')
    GROUP BY 1 ORDER BY n DESC`;
  byPrefix.forEach(r => console.log(`    ${r.pattern?.padEnd(25)} ${r.n}`));

  console.log('\n═══ QUESTION-PAPER FILES (non-mark-scheme) ═══');
  const qp = await sql`
    SELECT COUNT(*)::int AS n FROM past_papers
    WHERE total_questions > 0 AND NOT (
      title ILIKE 'mi_%' OR title ILIKE '%_ms_%' OR title ILIKE '%MarkScheme%' OR
      title ILIKE '%mark_scheme%' OR title ILIKE '%marking-instructions%' OR title ILIKE '%_MS%'
    )`;
  console.log(`  genuine question papers: ${qp[0].n}`);

  console.log('\n═══ Sample non-MI Spanish papers (should be real question papers) ═══');
  const realSpanish = await sql`
    SELECT id, title, total_questions FROM past_papers
    WHERE subject ILIKE '%spanish%' AND total_questions > 0
      AND NOT (title ILIKE 'mi_%' OR title ILIKE '%_ms%' OR title ILIKE '%MarkScheme%')
    LIMIT 10`;
  realSpanish.forEach(r => console.log(`  ${r.title?.substring(0, 70)}  (${r.total_questions} Qs)`));

  // Check if first-question text of non-MI papers looks like actual questions vs mark scheme
  console.log('\n═══ Q1 preview from non-MI Spanish papers ═══');
  for (const p of realSpanish.slice(0, 5)) {
    const q = await sql`
      SELECT LEFT(question_text, 140) AS preview FROM questions
      WHERE paper_id = ${p.id} ORDER BY question_number NULLS LAST LIMIT 1`;
    console.log(`  ${p.title?.substring(0, 50)}: ${q[0]?.preview?.replace(/\s+/g, ' ')}`);
  }
})();
