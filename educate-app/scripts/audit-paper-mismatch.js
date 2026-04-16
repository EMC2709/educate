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

  console.log('═══ SUBJECT DISTRIBUTION ═══');
  const subjects = await sql`
    SELECT subject, COUNT(*)::int AS n
    FROM past_papers WHERE total_questions > 0
    GROUP BY subject ORDER BY n DESC LIMIT 30`;
  subjects.forEach(r => console.log(`  ${r.subject?.padEnd(40) ?? 'NULL'} ${r.n}`));

  console.log('\n═══ SPANISH PAPERS — sample titles ═══');
  const spanish = await sql`
    SELECT id, title, subject, drive_file_id
    FROM past_papers WHERE subject ILIKE '%spanish%' AND total_questions > 0
    LIMIT 15`;
  spanish.forEach(r => console.log(`  [${r.subject}] ${r.title?.substring(0, 80)}`));

  console.log('\n═══ SAMPLE QUESTIONS FROM SPANISH PAPERS (should be Spanish language) ═══');
  for (const p of spanish.slice(0, 3)) {
    const qs = await sql`
      SELECT question_number, LEFT(question_text, 120) AS preview, topic
      FROM questions WHERE paper_id = ${p.id}
      ORDER BY question_number LIMIT 3`;
    console.log(`\n  Paper: ${p.title?.substring(0, 60)}`);
    qs.forEach(q => console.log(`    Q${q.question_number}: ${q.preview?.replace(/\s+/g, ' ')}`));
  }

  console.log('\n═══ TITLE VS SUBJECT MISMATCH HEURISTIC ═══');
  // Flag papers where the title contains a subject keyword that contradicts the subject column
  const mismatches = await sql`
    SELECT subject, title, COUNT(*)::int AS n FROM past_papers
    WHERE total_questions > 0
      AND (
        (subject ILIKE '%spanish%' AND (title ILIKE '%biology%' OR title ILIKE '%chemistry%' OR title ILIKE '%physics%' OR title ILIKE '%maths%' OR title ILIKE '%math%'))
        OR
        (subject ILIKE '%french%'  AND (title ILIKE '%biology%' OR title ILIKE '%chemistry%' OR title ILIKE '%physics%' OR title ILIKE '%maths%'))
        OR
        (subject ILIKE '%german%'  AND (title ILIKE '%biology%' OR title ILIKE '%chemistry%' OR title ILIKE '%physics%' OR title ILIKE '%maths%'))
        OR
        (subject ILIKE '%english%' AND (title ILIKE '%biology%' OR title ILIKE '%chemistry%' OR title ILIKE '%physics%'))
      )
    GROUP BY subject, title
    ORDER BY n DESC
    LIMIT 20`;
  mismatches.forEach(r => console.log(`  [${r.subject}] ${r.title?.substring(0, 70)}  (×${r.n})`));
  const totalMis = await sql`
    SELECT COUNT(*)::int AS n FROM past_papers
    WHERE total_questions > 0 AND (
      (subject ILIKE '%spanish%' AND (title ILIKE '%biology%' OR title ILIKE '%chemistry%' OR title ILIKE '%physics%' OR title ILIKE '%math%'))
      OR (subject ILIKE '%french%' AND (title ILIKE '%biology%' OR title ILIKE '%chemistry%' OR title ILIKE '%physics%' OR title ILIKE '%math%'))
      OR (subject ILIKE '%german%' AND (title ILIKE '%biology%' OR title ILIKE '%chemistry%' OR title ILIKE '%physics%' OR title ILIKE '%math%'))
    )`;
  console.log(`\n  TOTAL suspected mis-classified papers: ${totalMis[0].n}`);

  console.log('\n═══ DUPLICATE DRIVE_FILE_IDs (same PDF linked to multiple papers) ═══');
  const dupes = await sql`
    SELECT drive_file_id, COUNT(*)::int AS n, array_agg(DISTINCT subject) AS subjects
    FROM past_papers WHERE drive_file_id IS NOT NULL AND total_questions > 0
    GROUP BY drive_file_id HAVING COUNT(*) > 1
    ORDER BY n DESC LIMIT 10`;
  if (dupes.length === 0) console.log('  (none)');
  else dupes.forEach(r => console.log(`  ${r.drive_file_id}  ×${r.n}  subjects=${r.subjects.join(',')}`));
})();
