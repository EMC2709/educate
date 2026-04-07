import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { chatSystemPrompt } from '@/lib/prompts';
import { z } from 'zod';
import { rateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';

// Cap individual messages so a user can't drop a 10MB string into the model.
const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(8_000),
});

const schema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
  subject: z.string().max(80).nullable().optional(),
  board: z.string().max(40).nullable().optional(),
});

// 30 chat turns / minute / user. Tighter than /generate because chat is interactive.
const LIMIT = 30;
const WINDOW_MS = 60 * 1000;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Sign in required to use AI features.' }, { status: 401 });

  const key = getRateLimitKey('chat', userId, request);
  const rl = rateLimit(key, LIMIT, WINDOW_MS);
  if (!rl.ok) {
    return Response.json(
      { error: `Slow down — ${LIMIT} messages per minute max. Try again in ${rl.retryAfterSec}s.` },
      { status: 429, headers: rateLimitHeaders(LIMIT, rl) }
    );
  }

  let body;
  try {
    body = schema.parse(await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400, headers: rateLimitHeaders(LIMIT, rl) });
  }

  const systemPrompt = chatSystemPrompt(body.subject ?? null, body.board ?? null);

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages: body.messages,
    maxOutputTokens: 600,
  });

  return result.toUIMessageStreamResponse({
    headers: rateLimitHeaders(LIMIT, rl),
  });
}
