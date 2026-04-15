import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { ensureProfile, levelProgress, getLevelTitle } from '@/lib/xp';
import { sql } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const displayName = user.fullName || user.firstName || 'Student';

    const profile = await ensureProfile(userId, displayName);
    const progress = levelProgress(profile.xp);
    const title = getLevelTitle(progress.level);

    // Fetch coins + active banner — columns should already exist after migration
    let coins = 200;
    let activeBannerId: string | null = null;
    try {
      const extra = await sql`SELECT coins, active_banner_id FROM profiles WHERE user_id = ${userId}`;
      if (extra[0]) {
        coins = (extra[0] as { coins: number }).coins ?? 200;
        activeBannerId = (extra[0] as { active_banner_id: string | null }).active_banner_id ?? null;
      }
    } catch { /* columns may not exist yet — return defaults */ }

    return NextResponse.json({
      userId,
      displayName: profile.display_name,
      avatarUrl: user.imageUrl,
      xp: profile.xp,
      level: progress.level,
      title,
      progress: progress.progress,
      currentLevelXP: progress.currentLevelXP,
      nextLevelXP: progress.nextLevelXP,
      coins,
      activeBannerId,
      role: (profile as Record<string, unknown>).role ?? 'student',
      org_id: (profile as Record<string, unknown>).org_id ?? null,
      year_group: (profile as Record<string, unknown>).year_group ?? null,
    });
  } catch {
    return NextResponse.json({
      userId,
      displayName: 'Student',
      xp: 0,
      level: 1,
      title: 'Beginner',
      progress: 0,
      currentLevelXP: 0,
      nextLevelXP: 100,
      coins: 0,
      activeBannerId: null,
    });
  }
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { displayName } = await req.json();
  if (!displayName || typeof displayName !== 'string') {
    return NextResponse.json({ error: 'displayName required' }, { status: 400 });
  }

  await ensureProfile(userId);
  await sql`
    UPDATE profiles SET display_name = ${displayName.slice(0, 30)}, updated_at = now()
    WHERE user_id = ${userId}
  `;

  return NextResponse.json({ ok: true });
}
