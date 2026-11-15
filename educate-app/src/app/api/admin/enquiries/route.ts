import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { getUserRole } from '@/lib/roles';

async function requireSuperAdmin(): Promise<NextResponse | null> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if ((await getUserRole(userId)) !== 'super_admin') {
    return NextResponse.json({ error: 'Super admin only' }, { status: 403 });
  }
  return null;
}

/** GET /api/admin/enquiries — the latest licence enquiries from /schools. Super admin only. */
export async function GET() {
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  try {
    const rows = await sql`
      SELECT id, name, role, organisation, email, student_count, message, created_at, handled_at
      FROM school_enquiries
      ORDER BY (handled_at IS NOT NULL), created_at DESC
      LIMIT 200
    `;
    return NextResponse.json({ enquiries: rows }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (err) {
    console.error('[admin/enquiries] could not read enquiries:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Could not load enquiries.' }, { status: 500 });
  }
}

const patchSchema = z.object({ id: z.string().uuid(), handled: z.boolean() });

/** PATCH /api/admin/enquiries { id, handled } — mark an enquiry as dealt with, or not. */
export async function PATCH(req: NextRequest) {
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'id and handled are required' }, { status: 400 });
  try {
    const rows = await sql`
      UPDATE school_enquiries
      SET handled_at = CASE WHEN ${parsed.data.handled}::boolean THEN now() ELSE NULL END
      WHERE id = ${parsed.data.id}
      RETURNING id
    ` as Array<{ id: string }>;
    if (rows.length === 0) return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/enquiries] could not update an enquiry:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 });
  }
}
