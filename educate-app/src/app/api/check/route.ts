import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { anthropic } from '@/lib/anthropic';
import { checkAnswerPrompt } from '@/lib/prompts';
import { rateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';

// 60 answer checks per user per hour
const LIMIT = 60;
const WINDOW_MS = 60 * 60 * 1000;

const schema = z.object({
  subject: z.string().max(80),
  board: z.string().max(40),
  questionType: z.string().max(40),
  question: z.string().max(2000),
  modelAnswer: z.string().max(2000),
  userAnswer: z.string().max(2000),
  marks: z.number().int().min(1).max(25),
});

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return NextResponse.json(
      { correct: false, feedback: 'API key not configured.', modelAnswer: '', marksAwarded: 0 },
      { status: 503 }
    );
  }

  // Require authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  // Rate limit
  const key = getRateLimitKey('check', userId, request);
  const rl = rateLimit(key, LIMIT, WINDOW_MS);
  const rlHeaders = rateLimitHeaders(LIMIT, rl);
  if (!rl.ok) {
    return NextResponse.json(
      { correct: false, feedback: 'Too many requests. Please slow down.', modelAnswer: '', marksAwarded: 0 },
      { status: 429, headers: rlHeaders }
    );
  }

  try {
    const body = await request.json();
    const { subject, board, questionType, question, modelAnswer, userAnswer, marks } = schema.parse(body);

    const prompt = checkAnswerPrompt(subject, board, questionType, question, modelAnswer, userAnswer, marks);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: questionType === 'past-paper' ? 1200 : 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content
      .map(b => (b.type === 'text' ? b.text : ''))
      .join('')
      .trim();

    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return NextResponse.json(parsed, { headers: rlHeaders });
  } catch (error) {
    console.error('Check API error:', error);
    return NextResponse.json(
      { correct: false, feedback: 'Could not assess. Try again.', modelAnswer: '', marksAwarded: 0 },
      { status: 500 }
    );
  }
}
