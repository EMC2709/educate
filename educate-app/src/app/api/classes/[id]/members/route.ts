import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserRole, getUserOrg } from '@/lib/roles';

interface ClassRow {
  id: string;
  org_id: string;
  teacher_id: string;
}

interface MemberRow {
  id: string;
  class_id: string;
  student_id: string;
  joined_at: string;
  display_name: string | null;
  username: string | null;
  xp: number | null;
  level: number | null;
}

interface ProfileRow {
  user_id: string;
}

async function getClass(classId: string): Promise<ClassRow | null> {
  const rows = await sql`
    SELECT id, org_id, teacher_id FROM classes WHERE id = ${classId} LIMIT 1
  ` as ClassRow[];
  return rows[0] ?? null;
}

async function canManageClass(userId: string, classRow: ClassRow): Promise<boolean> {
  if (classRow.teacher_id === userId) return true;
  const role = await getUserRole(userId);
  if (role === 'super_admin') return true;
  if (role === 'school_admin') {
    const orgId = await getUserOrg(userId);
    return orgId === classRow.org_id;
  }
  return false;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const { id } = await params;
    const classRow = await getClass(id);
    if (!classRow) return NextResponse.json({ error: 'Class not found' }, { status: 404 });

    const allowed = await canManageClass(userId, classRow);
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const members = await sql`
      SELECT cm.id, cm.class_id, cm.student_id, cm.joined_at,
             p.display_name, p.username, p.xp, p.level
      FROM class_members cm
      LEFT JOIN profiles p ON p.user_id = cm.student_id
      WHERE cm.class_id = ${id}
      ORDER BY cm.joined_at ASC
    ` as MemberRow[];

    return NextResponse.json({ members });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const { id } = await params;
    const classRow = await getClass(id);
    if (!classRow) return NextResponse.json({ error: 'Class not found' }, { status: 404 });

    const allowed = await canManageClass(userId, classRow);
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json() as { studentId?: unknown; username?: unknown };
    const { studentId, username } = body;

    let resolvedId: string | null = null;

    if (typeof studentId === 'string' && studentId.trim()) {
      resolvedId = studentId.trim();
    } else if (typeof username === 'string' && username.trim()) {
      // Strip leading @ if provided
      const cleanUsername = username.trim().replace(/^@/, '');

      // 1) Try profiles table first (fast path — synced on each profile load)
      const rows = await sql`
        SELECT user_id FROM profiles
        WHERE LOWER(username) = LOWER(${cleanUsername})
        LIMIT 1
      ` as ProfileRow[];

      if (rows.length > 0) {
        resolvedId = rows[0].user_id;
      } else {
        // 2) Fall back to Clerk API (covers users who haven't loaded their profile since the migration)
        try {
          const client = await clerkClient();
          const result = await client.users.getUserList({ username: [cleanUsername], limit: 1 });
          const clerkUser = result.data?.[0];
          if (clerkUser) {
            resolvedId = clerkUser.id;
            // Opportunistically sync the username into profiles
            await sql`
              UPDATE profiles SET username = ${cleanUsername}
              WHERE user_id = ${clerkUser.id} AND (username IS NULL OR username != ${cleanUsername})
            `.catch(() => {});
          }
        } catch { /* Clerk lookup failed — fall through to 404 */ }
      }

      if (!resolvedId) {
        return NextResponse.json({ error: `No student found with username "${cleanUsername}".` }, { status: 404 });
      }
    }

    if (!resolvedId) {
      return NextResponse.json({ error: 'A username or studentId is required.' }, { status: 400 });
    }

    await sql`
      INSERT INTO class_members (class_id, student_id)
      VALUES (${id}, ${resolvedId})
      ON CONFLICT (class_id, student_id) DO NOTHING
    `;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const { id } = await params;
    const classRow = await getClass(id);
    if (!classRow) return NextResponse.json({ error: 'Class not found' }, { status: 404 });

    const allowed = await canManageClass(userId, classRow);
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json() as { studentId?: unknown };
    const { studentId } = body;

    if (!studentId || typeof studentId !== 'string') {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM class_members
      WHERE class_id = ${id} AND student_id = ${studentId}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
