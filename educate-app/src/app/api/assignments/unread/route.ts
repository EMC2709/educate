import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface CountRow { count: string }

/**
 * GET /api/assignments/unread
 * Returns count of assignments the student hasn't started yet.
 * Fast — single aggregation query, no joins on progress rows.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ count: 0 });

  try {
    const rows = await sql`
      SELECT COUNT(*)::text AS count
      FROM assignments a
      INNER JOIN class_members cm ON cm.class_id = a.class_id
      WHERE cm.student_id = ${userId}
        AND NOT EXISTS (
          SELECT 1 FROM assignment_progress ap
          WHERE ap.assignment_id = a.id
            AND ap.student_id = ${userId}
        )
    ` as CountRow[];

    return NextResponse.json(
      { count: parseInt(rows[0]?.count ?? '0', 10) },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
