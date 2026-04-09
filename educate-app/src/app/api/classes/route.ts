import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserRole, getUserOrg } from '@/lib/roles';

interface ClassRow {
  id: string;
  org_id: string;
  teacher_id: string;
  name: string;
  subject: string;
  year_group: number | null;
  exam_type: string | null;
  google_classroom_id: string | null;
  created_at: string;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const role = await getUserRole(userId);
    let classes: ClassRow[] = [];

    if (role === 'teacher') {
      classes = await sql`
        SELECT id, org_id, teacher_id, name, subject, year_group, exam_type, google_classroom_id, created_at
        FROM classes
        WHERE teacher_id = ${userId}
        ORDER BY created_at DESC
      ` as ClassRow[];
    } else if (role === 'student') {
      classes = await sql`
        SELECT c.id, c.org_id, c.teacher_id, c.name, c.subject, c.year_group, c.exam_type, c.google_classroom_id, c.created_at
        FROM classes c
        INNER JOIN class_members cm ON cm.class_id = c.id
        WHERE cm.student_id = ${userId}
        ORDER BY c.created_at DESC
      ` as ClassRow[];
    } else if (role === 'school_admin' || role === 'super_admin') {
      const orgId = await getUserOrg(userId);
      if (!orgId) return NextResponse.json({ classes: [] });
      classes = await sql`
        SELECT id, org_id, teacher_id, name, subject, year_group, exam_type, google_classroom_id, created_at
        FROM classes
        WHERE org_id = ${orgId}
        ORDER BY created_at DESC
      ` as ClassRow[];
    }

    return NextResponse.json({ classes });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const role = await getUserRole(userId);
    if (!['teacher', 'school_admin', 'super_admin'].includes(role)) {
      return NextResponse.json({ error: 'Requires teacher role' }, { status: 403 });
    }

    const orgId = await getUserOrg(userId);
    if (!orgId) {
      return NextResponse.json({ error: 'You must belong to an organisation to create a class' }, { status: 400 });
    }

    const body = await req.json() as {
      name?: unknown;
      subject?: unknown;
      year_group?: unknown;
      exam_type?: unknown;
    };

    const { name, subject, year_group, exam_type } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return NextResponse.json({ error: 'subject is required' }, { status: 400 });
    }

    const yearGroupNum = typeof year_group === 'number' ? year_group : null;
    if (yearGroupNum !== null && (yearGroupNum < 7 || yearGroupNum > 13)) {
      return NextResponse.json({ error: 'year_group must be between 7 and 13' }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO classes (org_id, teacher_id, name, subject, year_group, exam_type)
      VALUES (
        ${orgId},
        ${userId},
        ${name.trim()},
        ${subject.trim()},
        ${yearGroupNum},
        ${typeof exam_type === 'string' && exam_type.trim() ? exam_type.trim() : null}
      )
      RETURNING id, org_id, teacher_id, name, subject, year_group, exam_type, google_classroom_id, created_at
    ` as ClassRow[];

    return NextResponse.json({ class: rows[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
