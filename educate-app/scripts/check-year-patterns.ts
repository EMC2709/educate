/**
 * Probe whether question texts contain year metadata we can extract.
 * Run: npx tsx scripts/check-year-patterns.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) {
      const key = m[1].trim();
      if (!process.env[key]) process.env[key] = m[2].trim().replace(/^["']|["']$/g, '').replace(/\\n$/, '').trim();
    }
  }
}

import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const rows = await sql`
    SELECT q.question_text, pp.id, pp.component, pp.exam_type
    FROM questions q
    JOIN past_papers pp ON pp.id = q.paper_id
    WHERE pp.subject ILIKE '%combined%'
      AND pp.exam_type = 'GCSE_AQA'
      AND pp.year IS NULL
    LIMIT 60
  ` as { question_text: string; id: string; component: string; exam_type: string }[];

  let found = 0;
  const yearPat = /\b(20[12]\d)\b/;
  const seasonPat = /(june|jan|january|november|nov|may|march)\s*(20[12]\d)/i;
  const aqaPat = /IB\/(20[12]\d)/i;

  for (const row of rows) {
    const text = row.question_text || '';
    const m = text.match(yearPat) || text.match(seasonPat) || text.match(aqaPat);
    if (m) {
      console.log('FOUND:', m[0], '| component:', row.component, '| text:', text.substring(0, 100));
      found++;
    }
  }
  console.log('\nFound year patterns in:', found, '/ 60 sampled questions');
}

main().catch(console.error);
