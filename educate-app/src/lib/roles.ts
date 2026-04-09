import { sql } from './db';

export type UserRole = 'student' | 'teacher' | 'school_admin' | 'super_admin';

const ROLE_ORDER: UserRole[] = ['student', 'teacher', 'school_admin', 'super_admin'];

export async function getUserRole(userId: string): Promise<UserRole> {
  const rows = await sql`SELECT role FROM profiles WHERE user_id = ${userId} LIMIT 1`;
  return (rows[0] as { role: UserRole } | undefined)?.role ?? 'student';
}

export async function requireRole(userId: string, minRole: UserRole): Promise<void> {
  const current = await getUserRole(userId);
  if (ROLE_ORDER.indexOf(current) < ROLE_ORDER.indexOf(minRole)) {
    throw new Error(`Requires ${minRole} role`);
  }
}

export async function getUserOrg(userId: string): Promise<string | null> {
  const rows = await sql`SELECT org_id FROM profiles WHERE user_id = ${userId} LIMIT 1`;
  return (rows[0] as { org_id: string | null } | undefined)?.org_id ?? null;
}
