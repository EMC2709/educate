/**
 * Bootstrap a super_admin account.
 * Usage: node scripts/make-admin.mjs <clerk-user-id>
 *
 * Run from inside educate-app/ so .env.local is picked up automatically.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (Next.js doesn't run here)
const envPath = join(__dirname, '..', '.env.local');
try {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error('Could not read .env.local — make sure you run this from inside educate-app/');
  process.exit(1);
}

const userId = process.argv[2];
if (!userId || !userId.startsWith('user_')) {
  console.error('Usage: node scripts/make-admin.mjs user_YOURCLERKID');
  console.error('  Your Clerk user ID starts with "user_"');
  console.error('  Find it at: https://dashboard.clerk.com → Users → click your name');
  process.exit(1);
}

const { neon } = await import('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

try {
  await sql`
    INSERT INTO profiles (user_id, display_name, xp, role)
    VALUES (${userId}, 'Admin', 0, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin'
  `;
  console.log(`\n✅ Done! "${userId}" is now super_admin.`);
  console.log('   Sign in and go to /admin\n');
} catch (err) {
  console.error('❌ Failed:', err.message);
  process.exit(1);
}
