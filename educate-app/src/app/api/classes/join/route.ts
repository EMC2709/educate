import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface ClassRow {
  id: string;
  org_id: string;
  name: string;
  subject: string;
  year_group: number | null;
  teacher_id: string;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await req.json() as { code?: unknown };
  const raw = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';

  if (!raw || raw.length !== 6) {
    return NextResponse.json({ error: 'Enter the 6-character code from your teacher.' }, { status: 400 });
  }

  // Look up class by join code (case-insensitive, already uppercased above)
  const rows = await sql`
    SELECT id, org_id, name, subject, year_group, teacher_id
    FROM classes
    WHERE UPPER(join_code) = ${raw}
    LIMIT 1
  ` as ClassRow[];

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Code not found. Check with your teacher.' }, { status: 404 });
  }

  const cls = rows[0];

  // Add student to class (ignore if already a member)
  await sql`
    INSERT INTO class_members (class_id, student_id)
    VALUES (${cls.id}, ${userId})
    ON CONFLICT (class_id, student_id) DO NOTHING
  `;

  // Set student's org_id so they're recognised as a school student
  await sql`
    UPDATE profiles
    SET org_id = ${cls.org_id}
    WHERE user_id = ${userId}
      AND org_id IS NULL
  `;

  return NextResponse.json({
    ok: true,
    class: {
      id: cls.id,
      name: cls.name,
      subject: cls.subject,
      year_group: cls.year_group,
    },
  });
}
