import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { anthropic } from '@/lib/anthropic';
import { scoreAnswer, buildFallbackFeedback } from '@/lib/mark-scheme';
import { checkAnswerPrompt } from '@/lib/prompts';

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
    const { subject, board, questionType, question, modelAnswer, acceptedAnswers, userAnswer, marks } = schema.parse(rawBody);

    // --- Strategy 1: AI semantic scoring (signed-in users only) ---
    // Claude understands paraphrasing and equivalent expressions — far more lenient than
    // keyword matching. This is the primary scorer when available.
    if (aiEnabled) {
      try {
        const prompt = checkAnswerPrompt(subject, board, questionType, question, modelAnswer, userAnswer, marks);

        const message = await anthropic.messages.create({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }],
        });

        const raw = message.content
          .map(b => (b.type === 'text' ? b.text : ''))
          .join('')
          .trim();

        // Extract JSON — AI may occasionally include extra text before/after
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (typeof parsed.correct === 'boolean' && typeof parsed.marksAwarded === 'number') {
            return NextResponse.json({
              correct: parsed.correct,
              marksAwarded: Math.min(marks, Math.max(0, Math.round(parsed.marksAwarded))),
              feedback: parsed.feedback ?? '',
              modelAnswer: parsed.modelAnswer ?? modelAnswer,
              ...(questionType === 'past-paper' && { coverage: parsed.marksAwarded / marks }),
            });
          }
        }
      } catch (aiError) {
        console.error('AI scoring failed — falling back to deterministic:', aiError);
      }
    }

    // --- Strategy 2: Deterministic fallback (no auth / AI unavailable) ---
    // Keyword-matching engine — works offline, no API cost.
    const score = scoreAnswer(userAnswer, modelAnswer, marks, acceptedAnswers);
    const feedback = buildFallbackFeedback(score);

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
