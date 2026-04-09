import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard, getFriendsLeaderboard } from '@/lib/xp';
import { sql } from '@/lib/db';

/** GET /api/leaderboard?type=global|friends|class */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const type = req.nextUrl.searchParams.get('type') ?? 'global';

  if (type === 'friends') {
    if (!userId) return NextResponse.json({ error: 'Sign in to see friends leaderboard' }, { status: 401 });
    const data = await getFriendsLeaderboard(userId);
    return NextResponse.json({ entries: data, currentUserId: userId });
  }

  if (type === 'class') {
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    // Get all classmates (students who share any class with the current user)
    const rows = await sql`
      SELECT DISTINCT p.user_id, p.display_name, p.xp, p.level
      FROM profiles p
      JOIN class_members cm ON cm.student_id = p.user_id
      WHERE cm.class_id IN (
        SELECT class_id FROM class_members WHERE student_id = ${userId}
      )
      ORDER BY p.xp DESC
      LIMIT 50
    `;
    return NextResponse.json({ entries: rows, currentUserId: userId });
  }

  const data = await getLeaderboard(50);
  return NextResponse.json({ entries: data, currentUserId: userId });
}
