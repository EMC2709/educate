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
  await sql`ALTER TABLE past_papers ADD COLUMN IF NOT EXISTS page_count INTEGER`;
  console.log('✅ Added page_count column to past_papers');
  const r = await sql`SELECT COUNT(*)::int AS n FROM past_papers WHERE page_count IS NOT NULL`;
  console.log(`   ${r[0].n.toLocaleString()} papers already have a cached page_count`);
})();
