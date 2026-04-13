import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureProfile } from '@/lib/xp';

/** Create tables if they don't exist yet (idempotent, safe to call every request). */
async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id      text PRIMARY KEY,
      display_name text NOT NULL DEFAULT 'Student',
      avatar_url   text,
      xp           integer NOT NULL DEFAULT 0,
      level        integer NOT NULL DEFAULT 1,
      created_at   timestamptz NOT NULL DEFAULT now(),
      updated_at   timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS friendships (
      id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      requester_id text NOT NULL,
      addressee_id text NOT NULL,
      status       text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','accepted','declined')),
      created_at   timestamptz NOT NULL DEFAULT now(),
      UNIQUE (requester_id, addressee_id)
    )
  `;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    await ensureTables();
    await ensureProfile(userId);

    const friendships = await sql`
      SELECT * FROM friendships
      WHERE (requester_id = ${userId} OR addressee_id = ${userId}) AND status != 'declined'
    ` as Array<{ id: string; requester_id: string; addressee_id: string; status: string }>;

    if (friendships.length === 0) {
      return NextResponse.json({ friends: [], incoming: [], outgoing: [] });
    }

    const allUserIds = [...new Set(
      friendships.flatMap(f => [f.requester_id, f.addressee_id]).filter(id => id !== userId)
    )];

    const profiles = allUserIds.length > 0
      ? await sql`SELECT user_id, display_name, avatar_url, xp, level FROM profiles WHERE user_id = ANY(${allUserIds})`
      : [];

    const profileMap = new Map((profiles as Array<{ user_id: string; display_name: string; xp: number; level: number }>).map(p => [p.user_id, p]));

    const friends: Array<{ userId: string; displayName: string; xp: number; level: number }> = [];
    const incoming: Array<{ friendshipId: string; userId: string; displayName: string }> = [];
    const outgoing: Array<{ friendshipId: string; userId: string; displayName: string }> = [];

    for (const f of friendships) {
      const otherId = f.requester_id === userId ? f.addressee_id : f.requester_id;
      const profile = profileMap.get(otherId);
      const name = profile?.display_name ?? 'Student';

      if (f.status === 'accepted') {
        friends.push({ userId: otherId, displayName: name, xp: profile?.xp ?? 0, level: profile?.level ?? 1 });
      } else if (f.status === 'pending') {
        if (f.addressee_id === userId) {
          incoming.push({ friendshipId: f.id, userId: otherId, displayName: name });
        } else {
          outgoing.push({ friendshipId: f.id, userId: otherId, displayName: name });
        }
      }
    }

    return NextResponse.json({ friends, incoming, outgoing });
  } catch {
    return NextResponse.json({ friends: [], incoming: [], outgoing: [] });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { friendCode } = await req.json();
  if (!friendCode || typeof friendCode !== 'string') {
    return NextResponse.json({ error: 'friendCode required' }, { status: 400 });
  }

  try {
    await ensureTables();
    await ensureProfile(userId);

    const matches = await sql`
      SELECT user_id, display_name FROM profiles
      WHERE user_id = ${friendCode} OR display_name ILIKE ${friendCode} LIMIT 1
    ` as Array<{ user_id: string }>;

    let targetUserId: string | null = matches[0]?.user_id ?? null;

    if (!targetUserId) {
      try {
        const client = await clerkClient();
        const users = await client.users.getUserList({ emailAddress: [friendCode] });
        if (users.data.length > 0) {
          targetUserId = users.data[0].id;
          await ensureProfile(targetUserId, users.data[0].fullName ?? users.data[0].emailAddresses?.[0]?.emailAddress ?? 'Student');
        }
      } catch (clerkErr) {
        console.error('[friends] Clerk lookup failed:', clerkErr);
      }
    }

    if (!targetUserId) return NextResponse.json({ error: 'No account found with that email. Ask them to sign in to Educate first, then try again.' }, { status: 404 });
    if (targetUserId === userId) return NextResponse.json({ error: "You can't add yourself!" }, { status: 400 });

    const existing = await sql`
      SELECT id, status FROM friendships
      WHERE (requester_id = ${userId} AND addressee_id = ${targetUserId})
         OR (requester_id = ${targetUserId} AND addressee_id = ${userId})
      LIMIT 1
    ` as Array<{ id: string; status: string }>;

    if (existing.length > 0) {
      if (existing[0].status === 'accepted') return NextResponse.json({ error: 'Already friends!' }, { status: 400 });
      if (existing[0].status === 'pending') return NextResponse.json({ error: 'Friend request already pending.' }, { status: 400 });
    }

    await sql`INSERT INTO friendships (requester_id, addressee_id, status) VALUES (${userId}, ${targetUserId}, 'pending')`;
    return NextResponse.json({ ok: true, message: 'Friend request sent!' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { friendshipId, action } = await req.json();
  if (!friendshipId || !['accept', 'decline'].includes(action)) {
    return NextResponse.json({ error: 'friendshipId and action (accept/decline) required' }, { status: 400 });
  }

  await ensureTables();
  const newStatus = action === 'accept' ? 'accepted' : 'declined';
  await sql`UPDATE friendships SET status = ${newStatus} WHERE id = ${friendshipId} AND addressee_id = ${userId}`;
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { friendUserId } = await req.json();
  if (!friendUserId) return NextResponse.json({ error: 'friendUserId required' }, { status: 400 });

  await sql`
    DELETE FROM friendships
    WHERE (requester_id = ${userId} AND addressee_id = ${friendUserId})
       OR (requester_id = ${friendUserId} AND addressee_id = ${userId})
  `;
  return NextResponse.json({ ok: true });
}
