import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { anthropic } from '@/lib/anthropic';
import { scoreAnswer, buildFeedbackPrompt } from '@/lib/mark-scheme';

const schema = z.object({
  subject: z.string().max(80),
  board: z.string().max(40),
  questionType: z.string().max(40),
  question: z.string().max(4000),
  modelAnswer: z.string().max(10000),
  acceptedAnswers: z.array(z.string()).optional(),
  userAnswer: z.string().max(4000),
  marks: z.number().int().min(1).max(25),
});

export async function POST(request: Request) {
  // Note: deterministic scoring runs for everyone.
  // AI feedback only runs if an API key is present and the user is signed in.
  const { userId } = await auth();
  const aiEnabled = !!userId &&
    !!process.env.ANTHROPIC_API_KEY &&
    process.env.ANTHROPIC_API_KEY !== 'your-api-key-here';

  try {
    const body = await request.json();
    // Clamp marks to valid range — avoid Zod errors if bank has marks:0 edge case
    const rawBody = { ...body, marks: Math.max(1, Math.min(25, Math.round(Number(body.marks) || 1))) };
    const { subject, questionType, question, modelAnswer, acceptedAnswers, userAnswer, marks } = schema.parse(rawBody);

    // --- Step 1: Deterministic rule-based scoring (always runs, no auth needed) ---
    const score = scoreAnswer(userAnswer, modelAnswer, marks, acceptedAnswers);

    // --- Step 2: AI feedback (only when signed in AND API key available) ---
    let feedback = '';

    if (aiEnabled) {
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
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }],
        });

        feedback = message.content
          .map(b => (b.type === 'text' ? b.text : ''))
          .join('')
          .trim();
      } catch (aiError) {
        console.error('AI feedback error (using deterministic fallback):', aiError);
      }
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
