import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { anthropic } from '@/lib/anthropic';
import { scoreAnswer, buildFeedbackPrompt } from '@/lib/mark-scheme';

const schema = z.object({
  subject: z.string().max(80),
  board: z.string().max(40),
  questionType: z.string().max(40),
  question: z.string().max(2000),
  modelAnswer: z.string().max(2000),
  acceptedAnswers: z.array(z.string()).optional(),
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

  try {
    const body = await request.json();
    const { subject, questionType, question, modelAnswer, acceptedAnswers, userAnswer, marks } = schema.parse(body);

    // --- Step 1: Deterministic rule-based scoring against the bank's model answer ---
    const score = scoreAnswer(userAnswer, modelAnswer, marks, acceptedAnswers);

    // --- Step 2: Ask AI ONLY for plain-text feedback (short, no JSON, no schema) ---
    let feedback = '';

    try {
      const prompt = buildFeedbackPrompt({
        subject,
        question,
        userAnswer,
        modelAnswer,
        marksAwarded: score.marksAwarded,
        maxMarks: score.maxMarks,
        matchedTerms: score.matchedTerms,
        missedTerms: score.missedTerms,
      });

      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      });

      feedback = message.content
        .map(b => (b.type === 'text' ? b.text : ''))
        .join('')
        .trim();
    } catch (aiError) {
      console.error('AI feedback error (continuing without AI feedback):', aiError);
    }

    // --- Step 3: Fallback feedback if AI is unavailable or failed ---
    if (!feedback) {
      if (score.marksAwarded === score.maxMarks) {
        feedback = `Full marks — you covered the key points well.`;
      } else if (score.marksAwarded === 0) {
        feedback = score.missedTerms.length > 0
          ? `Your answer did not cover the key points. Make sure to include: **${score.missedTerms.slice(0, 4).join('**, **')}**.`
          : `Your answer did not match the mark scheme. Review the model answer below.`;
      } else {
        const gaps = score.missedTerms.slice(0, 4).join(', ');
        feedback = gaps
          ? `You covered some key points (${score.matchedTerms.slice(0, 3).join(', ')}) but missed: **${gaps}**. Review the model answer for full marks.`
          : `Good effort — see the model answer for a more complete response.`;
      }
    }

    return NextResponse.json({
      correct: score.correct,
      marksAwarded: score.marksAwarded,
      feedback,
      modelAnswer,
      ...(questionType === 'past-paper' && { coverage: score.coverage }),
    });
  } catch (error) {
    console.error('Check API error:', error);
    return NextResponse.json(
      { correct: false, feedback: 'Could not assess. Try again.', modelAnswer: '', marksAwarded: 0 },
      { status: 500 }
    );
  }
}
