import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { saveQuizResult } from '@/lib/progress';
import { rateLimit } from '@/lib/rate-limit';
// XP is now awarded per-question via /api/award-xp — save-result only logs the quiz result

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
    CREATE TABLE IF NOT EXISTS quiz_results (
      id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id       text NOT NULL,
      subject       text NOT NULL,
      board         text NOT NULL,
      question_type text NOT NULL,
      score         integer NOT NULL DEFAULT 0,
      total         integer NOT NULL DEFAULT 0,
      topic         text,
      created_at    timestamptz NOT NULL DEFAULT now()
    )
  `;
}

// Accept both quiz-page format (scoreCorrect/scoreTotal/board/questionType)
// and practice-page format (score/total/examType/topic)
// Scores come from the client, so keep them within what one quiz or paper can produce.
const count = z.number().min(0).max(500);
const schema = z.object({
  subject: z.string().min(1).max(80),
  // Quiz page fields
  board: z.string().max(40).optional(),
  questionType: z.string().max(40).optional(),
  scoreCorrect: count.optional(),
  scoreTotal: count.optional(),
  marksAwarded: count.optional(),
  totalMarks: count.optional(),
  // Practice page fields
  examType: z.string().max(40).optional(),
  topic: z.string().max(200).optional().nullable(),
  score: count.optional(),
  total: count.optional(),
  questions_done: count.optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not configured', xpGained: 0 }, { status: 503 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid result' }, { status: 400 });
  const body = parsed.data;

  // A finished quiz or paper every few seconds is not a real student
  const withinLimit = rateLimit(`save-result:user:${userId}`, 12, 60_000).ok;
  if (!withinLimit) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    await ensureTables();
  } catch (tableErr) {
    console.error('[save-result] ensureTables failed:', tableErr);
    return NextResponse.json({ error: 'DB setup failed', xpGained: 0 }, { status: 503 });
  }

  // Normalise to a single shape
  const scoreTotal   = body.scoreTotal   ?? body.total  ?? 0;
  const scoreCorrect = Math.min(body.scoreCorrect ?? body.score ?? 0, scoreTotal);
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

  // Award coins: 15 base + 10 bonus for ≥80% accuracy
  try {
    const accuracy = scoreTotal > 0 ? scoreCorrect / scoreTotal : 0;
    const coinsEarned = 15 + (accuracy >= 0.8 ? 10 : 0);
    await sql`
      UPDATE profiles
      SET coins = COALESCE(coins, 200) + ${coinsEarned}, updated_at = now()
      WHERE user_id = ${userId}
    `;
  } catch { /* coins column may not exist yet — marketplace will add it */ }

  return NextResponse.json({ ok: true });
}
