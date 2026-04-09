import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserRole } from '@/lib/roles';

interface ProgressRow {
  id: string;
  assignment_id: string;
  student_id: string;
  questions_done: number;
  questions_total: number;
  score: number;
  completed: boolean;
  completed_at: string | null;
  started_at: string;
}

interface AssignmentRow {
  id: string;
  teacher_id: string;
  class_id: string;
}

async function getAssignment(assignmentId: string): Promise<AssignmentRow | null> {
  const rows = await sql`
    SELECT id, teacher_id, class_id FROM assignments WHERE id = ${assignmentId} LIMIT 1
  ` as AssignmentRow[];
  return rows[0] ?? null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const { id } = await params;
    const assignment = await getAssignment(id);
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });

    const role = await getUserRole(userId);
    const isTeacherOrAdmin = ['teacher', 'school_admin', 'super_admin'].includes(role);

    if (isTeacherOrAdmin) {
      // Teachers see all students' progress
      const rows = await sql`
        SELECT ap.id, ap.assignment_id, ap.student_id, ap.questions_done,
               ap.questions_total, ap.score, ap.completed, ap.completed_at, ap.started_at,
               p.display_name
        FROM assignment_progress ap
        LEFT JOIN profiles p ON p.user_id = ap.student_id
        WHERE ap.assignment_id = ${id}
        ORDER BY ap.started_at ASC
      ` as Array<ProgressRow & { display_name: string | null }>;

      return NextResponse.json({ progress: rows });
    } else {
      // Students only see their own progress
      const rows = await sql`
        SELECT id, assignment_id, student_id, questions_done, questions_total,
               score, completed, completed_at, started_at
        FROM assignment_progress
        WHERE assignment_id = ${id} AND student_id = ${userId}
        LIMIT 1
      ` as ProgressRow[];

      return NextResponse.json({ progress: rows[0] ?? null });
    }
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
    const assignment = await getAssignment(id);
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });

    const body = await req.json() as {
      questionsDone?: unknown;
      questionsTotal?: unknown;
      score?: unknown;
      completed?: unknown;
    };

    const { questionsDone, questionsTotal, score, completed } = body;

    const done = typeof questionsDone === 'number' ? questionsDone : 0;
    const total = typeof questionsTotal === 'number' ? questionsTotal : 0;
    const scoreVal = typeof score === 'number' ? score : 0;
    const isCompleted = completed === true;
    const completedAt = isCompleted ? new Date().toISOString() : null;

    const rows = await sql`
      INSERT INTO assignment_progress (assignment_id, student_id, questions_done, questions_total, score, completed, completed_at)
      VALUES (${id}, ${userId}, ${done}, ${total}, ${scoreVal}, ${isCompleted}, ${completedAt})
      ON CONFLICT (assignment_id, student_id) DO UPDATE SET
        questions_done  = EXCLUDED.questions_done,
        questions_total = EXCLUDED.questions_total,
        score           = EXCLUDED.score,
        completed       = EXCLUDED.completed,
        completed_at    = CASE WHEN EXCLUDED.completed THEN EXCLUDED.completed_at ELSE assignment_progress.completed_at END
      RETURNING id, assignment_id, student_id, questions_done, questions_total, score, completed, completed_at, started_at
    ` as ProgressRow[];

    return NextResponse.json({ progress: rows[0] }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH is an alias for POST — same upsert logic
export { POST as PATCH };
