import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { calculateXP, awardXP } from '@/lib/xp';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ xpGained: 0 });
  }

  const { marksAwarded, questionType, attempted } = await request.json();

  // Award at least 1 XP for attempting a question, even if marks = 0
  const effectiveMarks = (marksAwarded ?? 0) > 0 ? marksAwarded : (attempted ? 0.2 : 0);
  const xpGained = effectiveMarks > 0
    ? Math.max(1, Math.round(calculateXP(questionType ?? 'short', effectiveMarks)))
    : 0;

  if (xpGained <= 0) return NextResponse.json({ xpGained: 0 });

  try {
    const xpResult = await awardXP(userId, xpGained);
    return NextResponse.json({ xpGained, xpResult });
  } catch (err) {
    console.error('[award-xp]', err);
    return NextResponse.json({ xpGained: 0 });
  }
}
