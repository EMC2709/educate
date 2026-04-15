import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '').replace(/\\n$/, '').trim();
    }
  }
}

const sql = neon(process.env.DATABASE_URL!);
const [r] = await sql`
  SELECT
    COUNT(*)::int                                         AS total_papers,
    COUNT(CASE WHEN total_questions > 0 THEN 1 END)::int AS papers_done,
    COUNT(CASE WHEN total_questions = 0 THEN 1 END)::int AS papers_pending,
    COALESCE(SUM(total_questions), 0)::int               AS total_questions
  FROM past_papers
` as Array<{ total_papers: number; papers_done: number; papers_pending: number; total_questions: number }>;

const pct = r.total_papers > 0 ? ((r.papers_done / r.total_papers) * 100).toFixed(1) : '0';
console.log(`\n📊 Past Papers Progress`);
console.log(`   Papers with questions : ${r.papers_done.toLocaleString()} / ${r.total_papers.toLocaleString()} (${pct}%)`);
console.log(`   Still pending         : ${r.papers_pending.toLocaleString()}`);
console.log(`   Total questions in DB : ${r.total_questions.toLocaleString()}\n`);
