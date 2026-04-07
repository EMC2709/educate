import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { anthropic } from '@/lib/anthropic';
import { generateQuestionsPrompt, generateFlashcardsPrompt, generatePastPaperPrompt } from '@/lib/prompts';
import { rateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';

// Bound input sizes so a malicious caller can't smuggle a huge prompt into
// the upstream model.
const schema = z.object({
  subject: z.string().min(1).max(80),
  board: z.string().min(1).max(40),
  type: z.enum(['short', 'mid', 'long', 'flashcard', 'past-paper']),
  focusStr: z.string().max(500).nullable(),
});

// 20 generations per user per hour. AI calls are the most expensive endpoint.
const LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return NextResponse.json(
      { error: 'API key not configured. Add your ANTHROPIC_API_KEY to .env.local and restart the server.' },
      { status: 503 }
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Sign in required to generate content.' }, { status: 401 });
  }

  // Rate limit BEFORE we touch the upstream API.
  const key = getRateLimitKey('generate', userId, request);
  const rl = rateLimit(key, LIMIT, WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `You've hit the hourly limit (${LIMIT} generations / hour). Try again in ${Math.ceil(rl.retryAfterSec / 60)} min.` },
      { status: 429, headers: rateLimitHeaders(LIMIT, rl) }
    );
  }

  let parsedBody;
  try {
    parsedBody = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400, headers: rateLimitHeaders(LIMIT, rl) });
  }

  const { subject, board, type, focusStr } = parsedBody;

  try {
    const prompt = type === 'flashcard'
      ? generateFlashcardsPrompt(subject, board, focusStr)
      : type === 'past-paper'
        ? generatePastPaperPrompt(subject, board)
        : generateQuestionsPrompt(subject, board, type, focusStr);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: type === 'flashcard' ? 1800 : type === 'past-paper' ? 2000 : 1400,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content
      .map(b => (b.type === 'text' ? b.text : ''))
      .join('')
      .trim();

    const cleaned = text.replace(/```json|```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'AI returned malformed content. Please try again.' },
        { status: 502, headers: rateLimitHeaders(LIMIT, rl) }
      );
    }

    if (type === 'flashcard') {
      return NextResponse.json({ flashcards: parsed }, { headers: rateLimitHeaders(LIMIT, rl) });
    }
    return NextResponse.json({ questions: parsed }, { headers: rateLimitHeaders(LIMIT, rl) });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500, headers: rateLimitHeaders(LIMIT, rl) }
    );
  }
}
