import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { askTutorModel } from '@/lib/anthropic';
import { isAiDisabledFor, AI_DISABLED_MESSAGE } from '@/lib/ai-access';
import { rateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';

const LIMIT = 30;
const WINDOW_MS = 60 * 1000;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const key = getRateLimitKey('topic-chat', userId, request);
  const rl = rateLimit(key, LIMIT, WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many messages — slow down.' }, { status: 429, headers: rateLimitHeaders(LIMIT, rl) });
  }

  if (await isAiDisabledFor(userId)) {
    return NextResponse.json({ error: AI_DISABLED_MESSAGE }, { status: 403, headers: rateLimitHeaders(LIMIT, rl) });
  }

  // Bound everything that goes into the prompt: 30 turns of at most 4,000 characters each
  const raw = await request.json().catch(() => null) as { messages?: unknown; subject?: unknown; board?: unknown; topic?: unknown } | null;
  const short = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
  const subject = short(raw?.subject, 80);
  const board = short(raw?.board, 40);
  const topic = short(raw?.topic, 200);
  const messages = Array.isArray(raw?.messages)
    ? (raw.messages as Array<{ role?: unknown; content?: unknown }>)
        .filter(m => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
        .slice(-30)
        .map(m => ({ role: m.role as string, content: (m.content as string).slice(0, 4000) }))
    : [];
  if (messages.length === 0) return NextResponse.json({ error: 'No message to answer.' }, { status: 400 });

  const system = `You are a friendly, expert GCSE ${subject} tutor helping a student who just completed a test on "${topic}" (${board || 'AQA'} spec).
Answer their questions clearly and concisely. Use **bold** for key terms, $LaTeX$ for maths, and \`\`\`mermaid\n...\n\`\`\` diagrams where helpful.
Keep responses focused and under 200 words unless a longer explanation is genuinely needed.`;

  const coreMessages = (messages as Array<{ role: string; content: string }>).map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  try {
    // max_tokens covers the model's thinking as well as the reply, so it sits well above 200 words
    const reply = await askTutorModel({ route: 'topic-chat', system, messages: coreMessages, maxTokens: 3000 });
    const message = reply.refused || !reply.text
      ? "Sorry, I can't answer that one. Try asking it a different way."
      : reply.text;
    return NextResponse.json({ message }, { headers: rateLimitHeaders(LIMIT, rl) });
  } catch {
    return NextResponse.json({ error: 'Failed to respond.' }, { status: 500 });
  }
}
