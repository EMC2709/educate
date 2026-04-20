import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserRole } from '@/lib/roles';

interface MemberRow { student_id: string; display_name: string | null; email: string | null }
interface ResultRow {
  user_id: string;
  subject: string;
  topic: string | null;
  question_type: string;
  score_correct: number;
  score_total: number;
  created_at: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const role = await getUserRole(userId);
  if (!['teacher', 'school_admin', 'super_admin'].includes(role)) {
    return NextResponse.json({ error: 'Requires teacher role' }, { status: 403 });
  }

  const { id: classId } = await params;

  try {
    // Verify teacher owns this class
    const classRows = await sql`
      SELECT id, subject FROM classes WHERE id = ${classId} AND teacher_id = ${userId}
    ` as { id: string; subject: string }[];
    if (classRows.length === 0) return NextResponse.json({ error: 'Class not found' }, { status: 404 });

    // Get class members
    const members = await sql`
      SELECT cm.student_id, p.display_name, p.email
      FROM class_members cm
      LEFT JOIN profiles p ON p.user_id = cm.student_id
      WHERE cm.class_id = ${classId}
      ORDER BY p.display_name ASC NULLS LAST
    ` as MemberRow[];

    if (members.length === 0) {
      return NextResponse.json({ members: [], topicStats: {}, subjectStats: {} });
    }

    const studentIds = members.map(m => m.student_id);

    // Get quiz results for all members (last 90 days)
    const results = await sql`
      SELECT user_id, subject, topic, question_type, score_correct, score_total, created_at
      FROM quiz_results
      WHERE user_id = ANY(${studentIds}::text[])
        AND created_at > now() - interval '90 days'
      ORDER BY created_at DESC
    ` as ResultRow[];

    // Build per-student, per-topic accuracy map
    // topicStats[topic][studentId] = { correct, total }
    const topicStats: Record<string, Record<string, { correct: number; total: number }>> = {};
    const subjectStats: Record<string, { correct: number; total: number; sessions: number }> = {};

    for (const r of results) {
      // Subject-level aggregate
      if (!subjectStats[r.subject]) subjectStats[r.subject] = { correct: 0, total: 0, sessions: 0 };
      subjectStats[r.subject].correct += r.score_correct;
      subjectStats[r.subject].total += r.score_total;
      subjectStats[r.subject].sessions += 1;

      // Topic-level (only if topic recorded)
      if (!r.topic) continue;
      if (!topicStats[r.topic]) topicStats[r.topic] = {};
      if (!topicStats[r.topic][r.user_id]) topicStats[r.topic][r.user_id] = { correct: 0, total: 0 };
      topicStats[r.topic][r.user_id].correct += r.score_correct;
      topicStats[r.topic][r.user_id].total += r.score_total;
    }

    return NextResponse.json({ members, topicStats, subjectStats });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
