import { NextResponse } from 'next/server';
import { z } from 'zod';
import { anthropic } from '@/lib/anthropic';
import { generateQuestionsPrompt, generateFlashcardsPrompt } from '@/lib/prompts';

const schema = z.object({
  subject: z.string(),
  board: z.string(),
  type: z.enum(['short', 'mid', 'long', 'flashcard']),
  focusStr: z.string().nullable(),
});

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return NextResponse.json(
      { error: 'API key not configured. Add your ANTHROPIC_API_KEY to .env.local and restart the server.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { subject, board, type, focusStr } = schema.parse(body);

    const prompt = type === 'flashcard'
      ? generateFlashcardsPrompt(subject, board, focusStr)
      : generateQuestionsPrompt(subject, board, type, focusStr);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: type === 'flashcard' ? 1800 : 1400,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content
      .map(b => (b.type === 'text' ? b.text : ''))
      .join('')
      .trim();

    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());

    if (type === 'flashcard') {
      return NextResponse.json({ flashcards: parsed });
    }
    return NextResponse.json({ questions: parsed });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
