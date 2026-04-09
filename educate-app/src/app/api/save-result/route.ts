import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveQuizResult } from '@/lib/progress';
import { calculateXP, awardXP } from '@/lib/xp';

// Accept both quiz-page format (scoreCorrect/scoreTotal/board/questionType)
// and practice-page format (score/total/examType/topic)
const schema = z.object({
  subject: z.string(),
  // Quiz page fields
  board: z.string().optional(),
  questionType: z.string().optional(),
  scoreCorrect: z.number().optional(),
  scoreTotal: z.number().optional(),
  marksAwarded: z.number().optional(),
  totalMarks: z.number().optional(),
  // Practice page fields
  examType: z.string().optional(),
  topic: z.string().optional().nullable(),
  score: z.number().optional(),
  total: z.number().optional(),
  questions_done: z.number().optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const body = schema.parse(await request.json());

  // Normalise to a single shape
  const scoreCorrect = body.scoreCorrect ?? body.score ?? 0;
  const scoreTotal   = body.scoreTotal   ?? body.total  ?? 0;
  const board        = body.board        ?? body.examType ?? '';
  const questionType = body.questionType ?? 'practice';
  const topic        = body.topic ?? null;

  await saveQuizResult({
    userId,
    subject: body.subject,
    board,
    questionType,
    scoreCorrect,
    scoreTotal,
    topic,
  });

  // Award XP
  const marks = body.marksAwarded ?? scoreCorrect;
  const xpGained = calculateXP(questionType, marks);

  let xpResult = null;
  if (xpGained > 0) {
    xpResult = await awardXP(userId, xpGained);
  }

  return NextResponse.json({ ok: true, xpGained, xpResult });
}
