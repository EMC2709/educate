const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

// Load .env.local
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

  const total = await sql`SELECT COUNT(*)::int AS n FROM past_papers`;
  const withQs = await sql`SELECT COUNT(*)::int AS n FROM past_papers WHERE total_questions > 0`;
  const zeros  = await sql`SELECT COUNT(*)::int AS n FROM past_papers WHERE total_questions = 0`;
  const avgRow = await sql`SELECT AVG(total_questions)::numeric(10,1) AS avg, MAX(total_questions) AS max, MIN(total_questions) AS min FROM past_papers WHERE total_questions > 0`;

  const dist = await sql`
    SELECT
      CASE
        WHEN total_questions = 0 THEN '0'
        WHEN total_questions BETWEEN 1 AND 10 THEN '1-10'
        WHEN total_questions BETWEEN 11 AND 30 THEN '11-30'
        WHEN total_questions BETWEEN 31 AND 60 THEN '31-60'
        WHEN total_questions BETWEEN 61 AND 100 THEN '61-100'
        ELSE '100+'
      END AS bucket,
      COUNT(*)::int AS n
    FROM past_papers
    GROUP BY 1
    ORDER BY MIN(total_questions)
  `;

  const qTotal = await sql`SELECT COUNT(*)::int AS n FROM questions`;

  console.log('═'.repeat(55));
  console.log(' DATABASE STATS');
  console.log('═'.repeat(55));
  console.log(`Total papers:         ${total[0].n.toLocaleString()}`);
  console.log(`  with questions:     ${withQs[0].n.toLocaleString()} (${((withQs[0].n/total[0].n)*100).toFixed(1)}%)`);
  console.log(`  with 0 questions:   ${zeros[0].n.toLocaleString()} (${((zeros[0].n/total[0].n)*100).toFixed(1)}%)`);
  console.log();
  console.log(`Avg questions/paper:  ${avgRow[0].avg} (for papers with >0)`);
  console.log(`Max questions:        ${avgRow[0].max}`);
  console.log(`Min questions:        ${avgRow[0].min}`);
  console.log();
  console.log(`Total questions in DB: ${qTotal[0].n.toLocaleString()}`);
  console.log();
  console.log('Distribution:');
  for (const r of dist) {
    const bar = '█'.repeat(Math.round((r.n/total[0].n)*50));
    console.log(`  ${r.bucket.padEnd(7)} ${r.n.toString().padStart(6)}  ${bar}`);
  }
})();
