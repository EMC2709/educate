const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const envPath = path.join(__dirname, '..', '.env.local');
for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) {
    let v = m[2].trim().replace(/^"(.*)"$/, '$1').replace(/\\n/g, '').replace(/\r/g, '').trim();
    process.env[m[1].trim()] = v;
  }
}

(async () => {
  const sql = neon(process.env.DATABASE_URL);

  console.log('Top exam_types (only with total_questions > 0):');
  const types = await sql`
    SELECT exam_type, COUNT(*)::int AS papers, SUM(total_questions)::int AS qs
    FROM past_papers WHERE total_questions > 0
    GROUP BY exam_type ORDER BY papers DESC LIMIT 20
  `;
  types.forEach(r => console.log(`  ${r.exam_type.padEnd(25)} ${r.papers.toString().padStart(6)} papers, ${r.qs.toLocaleString().padStart(8)} questions`));

  console.log('\nSample papers for GCSE_AQA (first 5):');
  const aqa = await sql`
    SELECT subject, year, component, paper_number, total_questions, title
    FROM past_papers WHERE exam_type LIKE '%AQA%' AND total_questions > 0
    ORDER BY year DESC NULLS LAST LIMIT 5
  `;
  aqa.forEach(r => console.log(`  ${r.subject} (${r.year}) ${r.component ?? ''} ${r.paper_number ?? ''} — ${r.total_questions} Qs: ${r.title?.substring(0, 50)}`));

  console.log('\nCombined Science papers available:');
  const combo = await sql`
    SELECT component, COUNT(*)::int AS n, AVG(total_questions)::numeric(10,1) AS avg_qs
    FROM past_papers WHERE subject ILIKE '%Combined%Science%' AND total_questions > 0
    GROUP BY component ORDER BY n DESC
  `;
  combo.forEach(r => console.log(`  ${(r.component ?? 'NULL').padEnd(15)} ${r.n} papers, avg ${r.avg_qs} questions`));
})();
