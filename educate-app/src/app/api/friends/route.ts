import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ensureProfile } from '@/lib/xp';

/** GET /api/friends — list friends and pending requests */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  await ensureProfile(userId);

  // Get all friendships involving the user
  const { data: friendships } = await supabaseAdmin
    .from('friendships')
    .select('*')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .neq('status', 'declined');

  if (!friendships || friendships.length === 0) {
    return NextResponse.json({ friends: [], incoming: [], outgoing: [] });
  }

  // Collect all user IDs we need profiles for
  const allUserIds = new Set<string>();
  friendships.forEach(f => {
    allUserIds.add(f.requester_id);
    allUserIds.add(f.addressee_id);
  });
  allUserIds.delete(userId);

  // Fetch profiles
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('user_id, display_name, avatar_url, xp, level')
    .in('user_id', Array.from(allUserIds));

  const profileMap = new Map((profiles ?? []).map(p => [p.user_id, p]));

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
}

/** POST /api/friends — send a friend request (by friend code = their userId prefix) */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { friendCode } = await req.json();
  if (!friendCode || typeof friendCode !== 'string') {
    return NextResponse.json({ error: 'friendCode required' }, { status: 400 });
  }

  // Look up user by friend code (search profiles by partial user_id or display_name)
  const { data: matches } = await supabaseAdmin
    .from('profiles')
    .select('user_id, display_name')
    .or(`user_id.eq.${friendCode},display_name.ilike.${friendCode}`)
    .limit(1);

  // Also try Clerk email lookup
  let targetUserId: string | null = matches?.[0]?.user_id ?? null;

  if (!targetUserId) {
    try {
      const client = await clerkClient();
      const users = await client.users.getUserList({ emailAddress: [friendCode] });
      if (users.data.length > 0) {
        targetUserId = users.data[0].id;
        await ensureProfile(targetUserId, users.data[0].fullName || 'Student');
      }
    } catch { /* ignore */ }
  }

  if (!targetUserId) {
    return NextResponse.json({ error: 'User not found. Try their email address.' }, { status: 404 });
  }

  if (targetUserId === userId) {
    return NextResponse.json({ error: "You can't add yourself!" }, { status: 400 });
  }

  // Check if friendship already exists
  const { data: existing } = await supabaseAdmin
    .from('friendships')
    .select('id, status')
    .or(`and(requester_id.eq.${userId},addressee_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},addressee_id.eq.${userId})`)
    .limit(1);

  if (existing && existing.length > 0) {
    if (existing[0].status === 'accepted') {
      return NextResponse.json({ error: 'Already friends!' }, { status: 400 });
    }
    if (existing[0].status === 'pending') {
      return NextResponse.json({ error: 'Friend request already pending.' }, { status: 400 });
    }
  }

  await supabaseAdmin.from('friendships').insert({
    requester_id: userId,
    addressee_id: targetUserId,
    status: 'pending',
  });

  return NextResponse.json({ ok: true, message: 'Friend request sent!' });
}

/** PATCH /api/friends — accept or decline a friend request */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { friendshipId, action } = await req.json();
  if (!friendshipId || !['accept', 'decline'].includes(action)) {
    return NextResponse.json({ error: 'friendshipId and action (accept/decline) required' }, { status: 400 });
  }

  const newStatus = action === 'accept' ? 'accepted' : 'declined';
  await supabaseAdmin
    .from('friendships')
    .update({ status: newStatus })
    .eq('id', friendshipId)
    .eq('addressee_id', userId);

  return NextResponse.json({ ok: true });
}

/** DELETE /api/friends — remove a friend */
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { friendUserId } = await req.json();
  if (!friendUserId) return NextResponse.json({ error: 'friendUserId required' }, { status: 400 });

  await supabaseAdmin
    .from('friendships')
    .delete()
    .or(`and(requester_id.eq.${userId},addressee_id.eq.${friendUserId}),and(requester_id.eq.${friendUserId},addressee_id.eq.${userId})`);

  return NextResponse.json({ ok: true });
}
