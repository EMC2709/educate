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

    const role = profile.role ?? 'student';

    // Fetch coins + active banner — columns should already exist after migration
    let coins = 200;
    let activeBannerId: string | null = null;
    let org_id: string | null = null;
    let year_group: string | null = null;
    try {
      const extra = await sql`SELECT coins, active_banner_id, org_id, year_group FROM profiles WHERE user_id = ${userId}`;
      if (extra[0]) {
        const row = extra[0] as {
          coins: number;
          active_banner_id: string | null;
          org_id: string | null;
          year_group: string | null;
        };
        coins = row.coins ?? 200;
        activeBannerId = row.active_banner_id ?? null;
        org_id = row.org_id ?? null;
        year_group = row.year_group ?? null;
      }
    } catch { /* columns may not exist yet — return defaults */ }

    return NextResponse.json({
      userId,
      displayName: profile.display_name,
      username: user.username ?? '',
      avatarUrl: user.imageUrl,
      xp: profile.xp,
      level: progress.level,
      title,
      progress: progress.progress,
      currentLevelXP: progress.currentLevelXP,
      nextLevelXP: progress.nextLevelXP,
      coins,
      activeBannerId,
      role,
      org_id,
      year_group,
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

  const body = await req.json();
  const { displayName, username } = body as { displayName?: string; username?: string };

  if (!displayName && !username) {
    return NextResponse.json({ error: 'displayName or username required' }, { status: 400 });
  }

  if (displayName) {
    if (typeof displayName !== 'string') {
      return NextResponse.json({ error: 'displayName must be a string' }, { status: 400 });
    }
    await ensureProfile(userId);
    await sql`
      UPDATE profiles SET display_name = ${displayName.slice(0, 30)}, updated_at = now()
      WHERE user_id = ${userId}
    `;
  }

  if (username) {
    if (typeof username !== 'string') {
      return NextResponse.json({ error: 'username must be a string' }, { status: 400 });
    }
    try {
      const client = await clerkClient();
      await client.users.updateUser(userId, { username: username.slice(0, 30) });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Username update failed';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: true });
}
