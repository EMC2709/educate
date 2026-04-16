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

  // Preview first
  const preview = await sql`
    SELECT COUNT(*)::int AS n FROM past_papers
    WHERE processed = true AND total_questions > 0 AND (
      -- mark scheme patterns (covers _ms_, -ms_, -ms at end, _MS, -MS, mark-scheme, etc.)
      title ~* '(^|[_-])(ms|mark.?scheme|markscheme|marking.?instructions|marking.?scheme)($|[_.-])'
      -- Scottish marking instructions prefix
      OR title ILIKE 'mi\\_%' ESCAPE '\\'
      -- Listening transcripts (teacher read-aloud scripts, not student questions)
      OR title ILIKE '%listening%transcript%'
      OR title ILIKE '%transcript%listening%'
      OR title ILIKE '%audio%transcript%'
      -- Examiner reports / principal examiner / teacher-facing documents
      OR title ILIKE '%examiner%report%'
      OR title ILIKE '%principal%examiner%'
      OR title ILIKE '%teachers.notes%'
    )`;
  console.log(`About to hide: ${preview[0].n.toLocaleString()} papers`);

  // Sample — check we're not catching real papers
  const sample = await sql`
    SELECT title, subject FROM past_papers
    WHERE processed = true AND total_questions > 0 AND (
      title ~* '(^|[_-])(ms|mark.?scheme|markscheme|marking.?instructions|marking.?scheme)($|[_.-])'
      OR title ILIKE 'mi\\_%' ESCAPE '\\'
      OR title ILIKE '%listening%transcript%'
      OR title ILIKE '%transcript%listening%'
      OR title ILIKE '%audio%transcript%'
      OR title ILIKE '%examiner%report%'
      OR title ILIKE '%principal%examiner%'
      OR title ILIKE '%teachers.notes%'
    )
    ORDER BY RANDOM() LIMIT 15`;
  console.log('\nSample of what will be hidden:');
  sample.forEach(r => console.log(`  [${r.subject?.substring(0, 25)?.padEnd(25)}] ${r.title?.substring(0, 60)}`));

  // Execute
  const result = await sql`
    UPDATE past_papers SET processed = false
    WHERE processed = true AND total_questions > 0 AND (
      title ~* '(^|[_-])(ms|mark.?scheme|markscheme|marking.?instructions|marking.?scheme)($|[_.-])'
      OR title ILIKE 'mi\\_%' ESCAPE '\\'
      OR title ILIKE '%listening%transcript%'
      OR title ILIKE '%transcript%listening%'
      OR title ILIKE '%audio%transcript%'
      OR title ILIKE '%examiner%report%'
      OR title ILIKE '%principal%examiner%'
      OR title ILIKE '%teachers.notes%'
    )
    RETURNING id`;
  console.log(`\n✅ Hidden ${result.length.toLocaleString()} mark-scheme/transcript papers`);

  const after = await sql`SELECT COUNT(*)::int AS n FROM past_papers WHERE processed = true AND total_questions > 0`;
  console.log(`After: ${after[0].n.toLocaleString()} papers visible`);

  const spanish = await sql`
    SELECT title, total_questions FROM past_papers
    WHERE processed = true AND subject ILIKE '%spanish%' AND total_questions > 0
    ORDER BY year DESC NULLS LAST LIMIT 10`;
  console.log(`\nRemaining Spanish papers:`);
  spanish.forEach(r => console.log(`  ${r.title?.substring(0, 70)}  (${r.total_questions} Qs)`));
})();
