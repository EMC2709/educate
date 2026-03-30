import { NextResponse } from 'next/server';
import { z } from 'zod';
import { anthropic } from '@/lib/anthropic';
import { chatSystemPrompt } from '@/lib/prompts';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const schema = z.object({
  messages: z.array(messageSchema),
  subject: z.string().nullable().optional(),
  board: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return NextResponse.json(
      { content: 'API key not configured. Add your ANTHROPIC_API_KEY to .env.local and restart the server.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { messages, subject, board } = schema.parse(body);

    const systemPrompt = chatSystemPrompt(subject ?? null, board ?? null);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const text = message.content
      .map(b => (b.type === 'text' ? b.text : ''))
      .join('');

    return NextResponse.json({ content: text || 'Sorry, try again.' });
  } catch (error) {
    console.error('Chat API error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { content: `Something went wrong: ${msg}` },
      { status: 500 }
    );
  }
}
