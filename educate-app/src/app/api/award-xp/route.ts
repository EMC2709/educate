import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateXP, awardXP } from '@/lib/xp';
import { rateLimit } from '@/lib/rate-limit';

// The client reports marks for one question at a time. No GCSE question is worth
// more than 25 marks, so anything larger is rejected rather than trusted.
const schema = z.object({
  marksAwarded: z.number().min(0).max(25).nullable().optional(),
  questionType: z.string().max(40).nullable().optional(),
  attempted: z.boolean().nullable().optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ xpGained: 0 });
  }

  // A student answers a question every few seconds at most
  if (!rateLimit(`award-xp:user:${userId}`, 60, 60_000).ok) {
    return NextResponse.json({ xpGained: 0 }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ xpGained: 0 }, { status: 400 });
  const { marksAwarded, questionType, attempted } = parsed.data;

  // Award at least 1 XP for attempting a question, even if marks = 0
  const marks = marksAwarded ?? 0;
  const effectiveMarks = marks > 0 ? marks : (attempted ? 0.2 : 0);
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
