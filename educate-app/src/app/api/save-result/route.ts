import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveQuizResult } from '@/lib/progress';
import { calculateXP, awardXP } from '@/lib/xp';

const schema = z.object({
  subject: z.string(),
  board: z.string(),
  questionType: z.string(),
  scoreCorrect: z.number(),
  scoreTotal: z.number(),
  marksAwarded: z.number().optional(),
  totalMarks: z.number().optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = schema.parse(await request.json());
  await saveQuizResult({ userId, ...body });

  // Award XP based on marks earned
  const marks = body.marksAwarded ?? body.scoreCorrect;
  const xpGained = calculateXP(body.questionType, marks);

  let xpResult = null;
  if (xpGained > 0) {
    xpResult = await awardXP(userId, xpGained);
  }

  return NextResponse.json({ ok: true, xpGained, xpResult });
}
