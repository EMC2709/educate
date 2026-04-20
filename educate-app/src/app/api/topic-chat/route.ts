import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { anthropic } from '@/lib/anthropic';
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

  const { messages, subject, board, topic } = await request.json();

  const system = `You are a friendly, expert GCSE ${subject} tutor helping a student who just completed a test on "${topic}" (${board || 'AQA'} spec).
Answer their questions clearly and concisely. Use **bold** for key terms, $LaTeX$ for maths, and \`\`\`mermaid\n...\n\`\`\` diagrams where helpful.
Keep responses focused and under 200 words unless a longer explanation is genuinely needed.`;

  const coreMessages = (messages as Array<{ role: string; content: string }>).map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  try {
    const result = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system,
      messages: coreMessages,
    });
    const text = result.content.map(b => (b.type === 'text' ? b.text : '')).join('').trim();
    return NextResponse.json({ message: text }, { headers: rateLimitHeaders(LIMIT, rl) });
  } catch {
    return NextResponse.json({ error: 'Failed to respond.' }, { status: 500 });
  }
}
