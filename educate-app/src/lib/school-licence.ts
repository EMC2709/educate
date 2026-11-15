/**
 * School licences: what a school pays for.
 *
 * A school (organisation) has a licence while `organisations.licence_ends_on` is today or
 * later, UK time. Only a super_admin sets it, from /admin (PATCH /api/admin/organisations),
 * once the school has paid or agreed a pilot. Any teacher can create a school, so being in
 * a school is never enough on its own.
 *
 * Students and teachers in a licensed school get the school tier: the full AI allowance and
 * every past paper. Everyone else gets the free tier. Super admins always get the school tier.
 */
import { sql } from './db';
import type { AccessTier } from './plan-limits';

export type { AccessTier } from './plan-limits';

export async function getAccessTier(userId: string): Promise<AccessTier> {
  try {
    const rows = await sql`
      SELECT (
        p.role = 'super_admin'
        OR o.licence_ends_on >= (now() AT TIME ZONE 'Europe/London')::date
      ) AS licensed
      FROM profiles p
      LEFT JOIN organisations o ON o.id = p.org_id
      WHERE p.user_id = ${userId}
      LIMIT 1
    ` as Array<{ licensed: boolean | null }>;
    return rows[0]?.licensed === true ? 'school' : 'free';
  } catch (err) {
    // If the licence can't be read, fall back to the free tier: it still works, it just costs less.
    console.error('[licence] could not read the school licence, using the free tier:', err instanceof Error ? err.message : err);
    return 'free';
  }
}
