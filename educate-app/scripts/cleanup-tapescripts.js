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
  const r = await sql`
    UPDATE past_papers SET processed = false
    WHERE processed = true AND total_questions > 0 AND (
         title ILIKE '%tapescript%'
      OR title ILIKE '%-transcript%'
      OR title ILIKE '%\\_transcript%' ESCAPE '\\'
      OR title ILIKE '%data-sheet%'
      OR title ILIKE '%data\\_sheet%' ESCAPE '\\'
      OR title ILIKE '%formula-sheet%'
      OR title ILIKE '%formulae-sheet%'
      OR title ILIKE '%source-booklet%'
      OR title ILIKE '%insert%'
    )
    RETURNING id`;
  console.log(`Hidden ${r.length} tapescripts/transcripts/inserts/data-sheets`);
  const after = await sql`SELECT COUNT(*)::int AS n FROM past_papers WHERE processed = true AND total_questions > 0`;
  console.log(`Now: ${after[0].n.toLocaleString()} papers visible`);
})();
