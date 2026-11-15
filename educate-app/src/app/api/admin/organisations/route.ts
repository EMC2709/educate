import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { getUserRole } from '@/lib/roles';

const schema = z.object({
  orgId: z.string().uuid(),
  // The last day of the licence (UK time), or null to remove it
  licenceEndsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
});

/**
 * PATCH /api/admin/organisations  { orgId, licenceEndsOn: "YYYY-MM-DD" | null }
 *
 * Switch a school's licence on (until a date) or off. Super admin only: a school's own
 * teachers must never be able to licence themselves.
 */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if ((await getUserRole(userId)) !== 'super_admin') {
    return NextResponse.json({ error: 'Super admin only' }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'orgId and licenceEndsOn (YYYY-MM-DD or null) are required' }, { status: 400 });
  }
  const { orgId, licenceEndsOn } = parsed.data;
  if (licenceEndsOn && Number.isNaN(Date.parse(`${licenceEndsOn}T00:00:00Z`))) {
    return NextResponse.json({ error: 'licenceEndsOn is not a real date' }, { status: 400 });
  }

  try {
    const rows = await sql`
      UPDATE organisations SET licence_ends_on = ${licenceEndsOn}::date
      WHERE id = ${orgId}
      RETURNING id, licence_ends_on::text AS licence_ends_on
    ` as Array<{ id: string; licence_ends_on: string | null }>;
    if (rows.length === 0) return NextResponse.json({ error: 'School not found' }, { status: 404 });
    return NextResponse.json({ organisation: rows[0] });
  } catch (err) {
    console.error('[admin/organisations] could not change the licence:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Could not save the licence. Please try again.' }, { status: 500 });
  }
}
