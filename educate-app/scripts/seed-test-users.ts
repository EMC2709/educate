/**
 * scripts/seed-test-users.ts
 *
 * Creates two test accounts in Clerk + sets their roles in the profiles table.
 *
 * Teacher:  teacher@test.educate  / Test1234!
 * Student:  student11@test.educate / Test1234!
 *
 * Run:
 *   npx tsx scripts/seed-test-users.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local from the project root
config({ path: resolve(process.cwd(), '.env.local') });

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!CLERK_SECRET_KEY) {
  console.error('❌  CLERK_SECRET_KEY not found in .env.local');
  process.exit(1);
}
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL not found in .env.local');
  process.exit(1);
}

// ── Clerk REST helpers ──────────────────────────────────────────────────────

interface ClerkUser {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
}

async function clerkRequest(path: string, method = 'GET', body?: unknown): Promise<Response> {
  return fetch(`https://api.clerk.com/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function findOrCreateUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<ClerkUser> {
  // Check if already exists
  const searchRes = await clerkRequest(`/users?email_address=${encodeURIComponent(email)}`);
  const searchData = await searchRes.json() as ClerkUser[] | { data?: ClerkUser[] };
  const existing = Array.isArray(searchData)
    ? searchData[0]
    : (searchData as { data?: ClerkUser[] }).data?.[0];

  if (existing) {
    console.log(`  ↩  Found existing user: ${email} (${existing.id})`);
    return existing;
  }

  const createRes = await clerkRequest('/users', 'POST', {
    first_name: firstName,
    last_name: lastName,
    email_address: [email],
    password,
    skip_password_checks: true,
    skip_password_requirement: true,
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(`Failed to create ${email}: ${JSON.stringify(err)}`);
  }

  const user = await createRes.json() as ClerkUser;
  console.log(`  ✓  Created Clerk user: ${email} (${user.id})`);
  return user;
}

// ── Neon DB ──────────────────────────────────────────────────────────────────

import { neon } from '@neondatabase/serverless';

async function upsertProfile(
  userId: string,
  displayName: string,
  role: string,
  yearGroup: number | null = null,
): Promise<void> {
  const sql = neon(DATABASE_URL!);
  await sql`
    INSERT INTO profiles (user_id, display_name, role, year_group)
    VALUES (${userId}, ${displayName}, ${role}, ${yearGroup})
    ON CONFLICT (user_id) DO UPDATE
      SET role       = EXCLUDED.role,
          year_group = EXCLUDED.year_group,
          display_name = EXCLUDED.display_name,
          updated_at = now()
  `;
  console.log(`  ✓  Profile upserted: ${displayName} (${role}${yearGroup ? `, year ${yearGroup}` : ''})`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱  Seeding test users…\n');

  console.log('1. Teacher account');
  const teacher = await findOrCreateUser(
    'Test',
    'Teacher',
    'testteacher@yopmail.com',
    'Educ8-Seed$xQ7!',
  );
  await upsertProfile(teacher.id, 'Test Teacher', 'teacher');

  console.log('\n2. 11+ Student account');
  const student = await findOrCreateUser(
    'Test',
    'Student',
    'teststudent11@yopmail.com',
    'Educ8-Seed$xQ7!',
  );
  // year_group constraint is BETWEEN 7 AND 13; pass null for 11+ (pre-secondary) students
  await upsertProfile(student.id, 'Test Student', 'student', null);

  console.log('\n✅  Done!\n');
  console.log('  Teacher  → testteacher@yopmail.com   / Test1234!  (role: teacher)');
  console.log('  Student  → teststudent11@yopmail.com / Test1234!  (role: student, no org — 11+ independent)');
  console.log('\nBoth can sign in at /sign-in. The teacher will be prompted to set up a school.');
  console.log('The student lands on /practice as an independent 11+ student.\n');
}

main().catch(err => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
