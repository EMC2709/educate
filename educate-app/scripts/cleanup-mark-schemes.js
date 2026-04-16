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

  const before = await sql`SELECT COUNT(*)::int AS n FROM past_papers WHERE processed = true AND total_questions > 0`;
  console.log(`Before: ${before[0].n.toLocaleString()} papers visible`);

  const result = await sql`
    UPDATE past_papers SET processed = false
    WHERE processed = true AND (
         title ILIKE 'mi\\_%' ESCAPE '\\'
      OR title ILIKE '%\\_ms\\_%' ESCAPE '\\'
      OR title ILIKE '%\\_MS' ESCAPE '\\'
      OR title ILIKE '%MarkScheme%'
      OR title ILIKE '%mark-scheme%'
      OR title ILIKE '%mark\\_scheme%' ESCAPE '\\'
      OR title ILIKE '%marking-instructions%'
      OR title ILIKE '%Listening-Transcript%'
      OR title ILIKE '%Listening-transcript%'
    )
    RETURNING id`;
  console.log(`Marked ${result.length.toLocaleString()} mark-scheme/transcript papers as processed=false`);

  const after = await sql`SELECT COUNT(*)::int AS n FROM past_papers WHERE processed = true AND total_questions > 0`;
  console.log(`After: ${after[0].n.toLocaleString()} papers visible`);
  console.log(`Hidden: ${(before[0].n - after[0].n).toLocaleString()}`);

  // Quick sanity: Spanish now?
  const sp = await sql`
    SELECT title, total_questions FROM past_papers
    WHERE processed = true AND subject ILIKE '%spanish%' AND total_questions > 0
    ORDER BY year DESC NULLS LAST LIMIT 10`;
  console.log(`\nRemaining Spanish papers (top 10):`);
  sp.forEach(r => console.log(`  ${r.title?.substring(0, 70)}  (${r.total_questions} Qs)`));
})();
