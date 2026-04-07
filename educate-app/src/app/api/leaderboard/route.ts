import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard, getFriendsLeaderboard } from '@/lib/xp';

/** GET /api/leaderboard?type=global|friends */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const type = req.nextUrl.searchParams.get('type') ?? 'global';

  if (type === 'friends') {
    if (!userId) return NextResponse.json({ error: 'Sign in to see friends leaderboard' }, { status: 401 });
    const data = await getFriendsLeaderboard(userId);
    return NextResponse.json({ entries: data, currentUserId: userId });
  }

  const data = await getLeaderboard(50);
  return NextResponse.json({ entries: data, currentUserId: userId });
}
