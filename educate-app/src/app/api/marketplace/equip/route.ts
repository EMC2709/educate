import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { bannerId } = await req.json();

  try {
    if (!bannerId) {
      await sql`UPDATE profiles SET active_banner_id = NULL, updated_at = now() WHERE user_id = ${userId}`;
      return NextResponse.json({ ok: true });
    }
    const owned = await sql`SELECT id FROM user_banners WHERE user_id = ${userId} AND banner_id = ${bannerId}`;
    if ((owned as unknown[]).length === 0) return NextResponse.json({ error: 'Not owned' }, { status: 403 });
    await sql`UPDATE profiles SET active_banner_id = ${bannerId}, updated_at = now() WHERE user_id = ${userId}`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
