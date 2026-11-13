import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getFriendsLeaderboard } from '@/lib/xp';
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
    const rows = await sql`
      SELECT DISTINCT p.user_id, p.display_name, p.xp, p.level, p.active_banner_id
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

  // Global: signed-in users only (it lists children's display names), and other
  // players' Clerk ids are replaced with opaque placeholders.
  if (!userId) return NextResponse.json({ error: 'Sign in to see the leaderboard', entries: [] }, { status: 401 });
  try {
    const rows = await sql`
      SELECT user_id, display_name, avatar_url, xp, level, active_banner_id
      FROM profiles ORDER BY xp DESC LIMIT 50
    ` as unknown as Array<Record<string, unknown> & { user_id: string }>;
    const entries = rows.map((r, i) => (r.user_id === userId ? r : { ...r, user_id: `player-${i + 1}` }));
    return NextResponse.json({ entries, currentUserId: userId });
  } catch {
    return NextResponse.json({ entries: [], currentUserId: userId });
  }
}
