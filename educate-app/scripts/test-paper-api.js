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

  // Get a Combined Science Biology paper from 2023
  const picks = await sql`
    SELECT id, subject, year, component, paper_number, total_questions, title
    FROM past_papers
    WHERE exam_type = 'GCSE_AQA' AND subject ILIKE '%Combined%' AND component = 'Biology'
      AND total_questions >= 30
    ORDER BY year DESC LIMIT 3
  `;

  for (const p of picks) {
    console.log(`\n━━━ ${p.subject} Biology ${p.year ?? '?'} ${p.paper_number ?? ''} (${p.total_questions} Qs) ━━━`);
    const qs = await sql`
      SELECT question_number, LEFT(question_text, 100) AS preview, marks, topic
      FROM questions WHERE paper_id = ${p.id}
      ORDER BY question_number NULLS LAST LIMIT 5
    `;
    qs.forEach(q => {
      console.log(`  Q${q.question_number ?? '?'} [${q.marks}m] ${q.topic ?? ''}: ${q.preview.replace(/\s+/g,' ')}...`);
    });
  }
})();
