import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { chatSystemPrompt } from '@/lib/prompts';
import { z } from 'zod';
import { rateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';

// 30 chat turns / minute / user
const LIMIT = 30;
const WINDOW_MS = 60 * 1000;

const schema = z.object({
  // Accept any message shape — AI SDK v6 sends UIMessage with parts[]
  messages: z.array(z.any()).min(1).max(50),
  subject: z.string().max(80).nullable().optional(),
  board: z.string().max(40).nullable().optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Sign in required to use AI features.' }, { status: 401 });
  }

  const key = getRateLimitKey('chat', userId, request);
  const rl = rateLimit(key, LIMIT, WINDOW_MS);
  if (!rl.ok) {
    return Response.json(
      { error: `Slow down — ${LIMIT} messages per minute max. Try again in ${rl.retryAfterSec}s.` },
      { status: 429, headers: rateLimitHeaders(LIMIT, rl) }
    );
  }

  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400, headers: rateLimitHeaders(LIMIT, rl) });
  }

  const systemPrompt = chatSystemPrompt(body.subject ?? null, body.board ?? null);

  // Convert UIMessage[] → ModelMessage[] (handles parts, content-string, content-array)
  const coreMessages = await convertToModelMessages(body.messages as Parameters<typeof convertToModelMessages>[0]);

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages: coreMessages,
    maxOutputTokens: 600,
  });

  return result.toUIMessageStreamResponse({
    headers: rateLimitHeaders(LIMIT, rl),
  });
}
