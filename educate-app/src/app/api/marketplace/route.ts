import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { BANNER_CATALOG } from '@/lib/banners';

async function ensureTables() {
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coins integer NOT NULL DEFAULT 200`;
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active_banner_id text`;
  await sql`
    CREATE TABLE IF NOT EXISTS user_banners (
      id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id      text NOT NULL,
      banner_id    text NOT NULL,
      purchased_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (user_id, banner_id)
    )
  `;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    await ensureTables();
    const [profileRows, ownedRows] = await Promise.all([
      sql`SELECT coins, active_banner_id FROM profiles WHERE user_id = ${userId}`,
      sql`SELECT banner_id FROM user_banners WHERE user_id = ${userId}`,
    ]);
    const coins = (profileRows[0] as { coins: number } | undefined)?.coins ?? 200;
    const activeBannerId = (profileRows[0] as { active_banner_id: string | null } | undefined)?.active_banner_id ?? null;
    const owned = (ownedRows as { banner_id: string }[]).map(r => r.banner_id);
    return NextResponse.json({ coins, activeBannerId, owned, catalog: BANNER_CATALOG });
  } catch {
    return NextResponse.json({ coins: 0, activeBannerId: null, owned: [], catalog: BANNER_CATALOG });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { bannerId } = await req.json();
  const banner = BANNER_CATALOG.find(b => b.id === bannerId);
  if (!banner) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });

  try {
    await ensureTables();
    const owned = await sql`SELECT id FROM user_banners WHERE user_id = ${userId} AND banner_id = ${bannerId}`;
    if ((owned as unknown[]).length > 0) return NextResponse.json({ error: 'Already owned' }, { status: 400 });

    const profileRows = await sql`SELECT coins FROM profiles WHERE user_id = ${userId}`;
    const coins = (profileRows[0] as { coins: number } | undefined)?.coins ?? 0;
    if (coins < banner.price) return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });

    await sql`UPDATE profiles SET coins = coins - ${banner.price}, updated_at = now() WHERE user_id = ${userId}`;
    await sql`INSERT INTO user_banners (user_id, banner_id) VALUES (${userId}, ${bannerId}) ON CONFLICT DO NOTHING`;

    return NextResponse.json({ ok: true, newCoins: coins - banner.price });
  } catch {
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 });
  }
}
