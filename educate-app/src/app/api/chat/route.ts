import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { chatSystemPrompt } from '@/lib/prompts';
import { TUTOR_MODEL } from '@/lib/anthropic';
import { isAiDisabledFor, AI_DISABLED_MESSAGE } from '@/lib/ai-access';
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

  if (await isAiDisabledFor(userId)) {
    return Response.json({ error: AI_DISABLED_MESSAGE }, { status: 403, headers: rateLimitHeaders(LIMIT, rl) });
  }

  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400, headers: rateLimitHeaders(LIMIT, rl) });
  }
  // The message shape is open-ended, so cap the conversation by total size instead
  if (JSON.stringify(body.messages).length > 80_000) {
    return Response.json({ error: 'This conversation is too long. Start a new chat.' }, { status: 413, headers: rateLimitHeaders(LIMIT, rl) });
  }

  const systemPrompt = chatSystemPrompt(body.subject ?? null, body.board ?? null);

  // Convert UIMessage[] → ModelMessage[] (handles parts, content-string, content-array)
  const coreMessages = await convertToModelMessages(body.messages as Parameters<typeof convertToModelMessages>[0]);

  const result = streamText({
    model: anthropic(TUTOR_MODEL),
    system: systemPrompt,
    messages: coreMessages,
    // The model's thinking counts towards this limit as well as the reply, so leave headroom
    maxOutputTokens: 4000,
    // Low effort is the recommended level for chat: little or no thinking, fastest first word
    providerOptions: { anthropic: { effort: 'low' } },
    onFinish: ({ finishReason, usage }) => {
      // Token counts only (no content), so the cost of tutor chat can be tracked in the logs
      console.log('[chat] usage', JSON.stringify({
        model: TUTOR_MODEL, input: usage.inputTokens, output: usage.outputTokens, finish: finishReason,
      }));
    },
  });

  return result.toUIMessageStreamResponse({
    headers: rateLimitHeaders(LIMIT, rl),
    // Thinking is never shown, and keeping it out of the client means it is never sent back
    sendReasoning: false,
  });
}
