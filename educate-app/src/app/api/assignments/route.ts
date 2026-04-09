import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserRole } from '@/lib/roles';

interface AssignmentRow {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  paper_id: string | null;
  subject: string | null;
  topic: string | null;
  exam_type: string | null;
  question_ids: unknown[];
  due_date: string | null;
  created_at: string;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const role = await getUserRole(userId);
    let assignments: AssignmentRow[] = [];

    if (role === 'teacher' || role === 'school_admin' || role === 'super_admin') {
      assignments = await sql`
        SELECT id, class_id, teacher_id, title, description, paper_id,
               subject, topic, exam_type, question_ids, due_date, created_at
        FROM assignments
        WHERE teacher_id = ${userId}
        ORDER BY created_at DESC
      ` as AssignmentRow[];
    } else {
      // Student: assignments from classes they belong to
      assignments = await sql`
        SELECT a.id, a.class_id, a.teacher_id, a.title, a.description, a.paper_id,
               a.subject, a.topic, a.exam_type, a.question_ids, a.due_date, a.created_at
        FROM assignments a
        INNER JOIN class_members cm ON cm.class_id = a.class_id
        WHERE cm.student_id = ${userId}
        ORDER BY a.due_date ASC NULLS LAST, a.created_at DESC
      ` as AssignmentRow[];
    }

    return NextResponse.json({ assignments });
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

    const body = await req.json() as {
      classId?: unknown;
      title?: unknown;
      description?: unknown;
      subject?: unknown;
      topic?: unknown;
      examType?: unknown;
      paperId?: unknown;
      dueDate?: unknown;
      questionIds?: unknown;
    };

    const { classId, title, description, subject, topic, examType, paperId, dueDate, questionIds } = body;

    if (!classId || typeof classId !== 'string') {
      return NextResponse.json({ error: 'classId is required' }, { status: 400 });
    }
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    // Verify teacher owns (or can access) the class
    const classRows = await sql`
      SELECT id, teacher_id FROM classes WHERE id = ${classId} LIMIT 1
    ` as Array<{ id: string; teacher_id: string }>;

    if (classRows.length === 0) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    if (classRows[0].teacher_id !== userId && role === 'teacher') {
      return NextResponse.json({ error: 'You do not own this class' }, { status: 403 });
    }

    const qIds = Array.isArray(questionIds) ? questionIds : [];

    const rows = await sql`
      INSERT INTO assignments (class_id, teacher_id, title, description, paper_id, subject, topic, exam_type, question_ids, due_date)
      VALUES (
        ${classId},
        ${userId},
        ${title.trim()},
        ${typeof description === 'string' ? description.trim() : null},
        ${typeof paperId === 'string' && paperId ? paperId : null},
        ${typeof subject === 'string' && subject.trim() ? subject.trim() : null},
        ${typeof topic === 'string' && topic.trim() ? topic.trim() : null},
        ${typeof examType === 'string' && examType.trim() ? examType.trim() : null},
        ${JSON.stringify(qIds)},
        ${typeof dueDate === 'string' && dueDate ? dueDate : null}
      )
      RETURNING id, class_id, teacher_id, title, description, paper_id,
                subject, topic, exam_type, question_ids, due_date, created_at
    ` as AssignmentRow[];

    return NextResponse.json({ assignment: rows[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
