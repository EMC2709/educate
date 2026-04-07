import { NextResponse } from 'next/server';
import { z } from 'zod';
import { anthropic } from '@/lib/anthropic';
import { checkAnswerPrompt } from '@/lib/prompts';

const schema = z.object({
  subject: z.string(),
  board: z.string(),
  questionType: z.string(),
  question: z.string(),
  modelAnswer: z.string(),
  userAnswer: z.string(),
  marks: z.number(),
});

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return NextResponse.json(
      { correct: false, feedback: 'API key not configured. Add your ANTHROPIC_API_KEY to .env.local and restart the server.', modelAnswer: '', marksAwarded: 0 },
      { status: 503 }
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
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Check API error:', error);
    return NextResponse.json(
      { correct: false, feedback: 'Could not assess. Try again.', modelAnswer: '', marksAwarded: 0 },
      { status: 500 }
    );
  }
}
