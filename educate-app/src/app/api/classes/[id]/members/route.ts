import { auth } from '@clerk/nextjs/server';
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
  xp: number | null;
  level: number | null;
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
             p.display_name, p.xp, p.level
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

    const body = await req.json() as { studentId?: unknown };
    const { studentId } = body;

    if (!studentId || typeof studentId !== 'string') {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }

    await sql`
      INSERT INTO class_members (class_id, student_id)
      VALUES (${id}, ${studentId})
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
