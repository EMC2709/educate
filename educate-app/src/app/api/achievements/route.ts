import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ quizCount: 0, perfectCount: 0, xp: 0, streak: 0 });
  }

  try {
    const [quizRow, xpRow] = await Promise.all([
      sql`
        SELECT
          COUNT(*)::int AS quiz_count,
          SUM(CASE WHEN score = total AND total > 0 THEN 1 ELSE 0 END)::int AS perfect_count
        FROM quiz_results
        WHERE user_id = ${userId}
      `,
      sql`
        SELECT xp FROM profiles WHERE user_id = ${userId}
      `,
    ]);

    const quizCount = (quizRow[0] as { quiz_count: number })?.quiz_count ?? 0;
    const perfectCount = (quizRow[0] as { perfect_count: number })?.perfect_count ?? 0;
    const xp = (xpRow[0] as { xp: number })?.xp ?? 0;

    return NextResponse.json({ quizCount, perfectCount, xp, streak: 0 });
  } catch {
    return NextResponse.json({ quizCount: 0, perfectCount: 0, xp: 0, streak: 0 });
  }
}
