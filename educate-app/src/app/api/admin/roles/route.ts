import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserRole } from '@/lib/roles';

const VALID_ROLES = ['student', 'teacher', 'school_admin', 'super_admin'];

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const role = await getUserRole(userId);
  if (role !== 'super_admin') {
    return NextResponse.json({ error: 'Super admin only' }, { status: 403 });
  }

  const body = await req.json() as { targetUserId?: unknown; newRole?: unknown; orgId?: unknown };
  const { targetUserId, newRole, orgId } = body;

  if (!targetUserId || typeof targetUserId !== 'string') {
    return NextResponse.json({ error: 'targetUserId required' }, { status: 400 });
  }
  if (!newRole || typeof newRole !== 'string' || !VALID_ROLES.includes(newRole)) {
    return NextResponse.json({ error: `newRole must be one of: ${VALID_ROLES.join(', ')}` }, { status: 400 });
  }

  try {
    if (orgId && typeof orgId === 'string') {
      await sql`
        UPDATE profiles SET role = ${newRole}, org_id = ${orgId}, updated_at = now()
        WHERE user_id = ${targetUserId}
      `;
    } else {
      await sql`
        UPDATE profiles SET role = ${newRole}, updated_at = now()
        WHERE user_id = ${targetUserId}
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
