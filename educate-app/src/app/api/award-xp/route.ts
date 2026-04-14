import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { calculateXP, awardXP } from '@/lib/xp';

async function ensureProfiles() {
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
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ xpGained: 0 });
  }

  const { marksAwarded, questionType } = await request.json();
  if (!marksAwarded || marksAwarded <= 0) {
    return NextResponse.json({ xpGained: 0 });
  }

  const xpGained = calculateXP(questionType ?? 'short', marksAwarded);
  if (xpGained <= 0) return NextResponse.json({ xpGained: 0 });

  try {
    await ensureProfiles();
    const xpResult = await awardXP(userId, xpGained);
    return NextResponse.json({ xpGained, xpResult });
  } catch (err) {
    console.error('[award-xp]', err);
    return NextResponse.json({ xpGained: 0 });
  }
}
