import { NextResponse } from 'next/server';
import { z } from 'zod';
import { QUESTION_BANK } from '@/data/question-bank';
import { PAST_PAPER_BANK } from '@/data/past-paper-bank';
import { SUBTOPIC_BANK } from '@/data/subtopic-bank';
import { MCQ_BANK } from '@/data/mcq-bank';
import { shuffle } from '@/lib/shuffle';
import { anthropic } from '@/lib/anthropic';
import { generateMCQPrompt } from '@/lib/prompts';
import type { Question, Flashcard } from '@/types';

const schema = z.object({
  subject: z.string().min(1).max(80),
  board: z.string().min(1).max(40),
  type: z.enum(['short', 'mid', 'long', 'flashcard', 'past-paper', 'mcq']),
  focusStr: z.string().max(500).nullable().optional(),
});

/** Case-insensitive fuzzy match */
function fuzzyMatch(a: string, b: string): boolean {
  const na = a.toLowerCase().replace(/[^a-z0-9]/g, '');
  const nb = b.toLowerCase().replace(/[^a-z0-9]/g, '');
  return na === nb || na.includes(nb) || nb.includes(na);
}

/**
 * Collect subtopic-bank questions of a given type matching the focusStr.
 * Returns null if no matching subtopic content is found.
 */
function getSubtopicBankContent(
  subject: string,
  type: 'short' | 'mid' | 'long' | 'flashcard',
  focusStr: string,
): Question[] | Flashcard[] | null {
  const subjectBank = SUBTOPIC_BANK[subject];
  if (!subjectBank) return null;

  const collected: (Question | Flashcard)[] = [];

  for (const [groupName, subtopics] of Object.entries(subjectBank)) {
    const groupMatch = fuzzyMatch(groupName, focusStr);
    for (const [subtopicName, content] of Object.entries(subtopics)) {
      if (groupMatch || fuzzyMatch(subtopicName, focusStr)) {
        const items = content[type];
        if (items && items.length > 0) {
          collected.push(...items);
        }
      }
    }
  }

  return collected.length > 0 ? (collected as Question[] | Flashcard[]) : null;
}

export async function POST(request: Request) {
  let parsedBody;
  try {
    parsedBody = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { subject, type, focusStr } = parsedBody;

  try {
    // ── MCQ ───────────────────────────────────────────────────────────────────
    if (type === 'mcq') {
      const mcqQs = MCQ_BANK[subject];
      if (mcqQs && mcqQs.length > 0) {
        return NextResponse.json({ mcqQuestions: shuffle(mcqQs).slice(0, 10) });
      }
      // AI fallback for subjects not in the static bank
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (apiKey && apiKey !== 'your-api-key-here') {
        try {
          const prompt = generateMCQPrompt(subject, parsedBody.board, focusStr ?? null);
          const message = await anthropic.messages.create({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }],
          });
          const raw = message.content
            .map(b => (b.type === 'text' ? b.text : ''))
            .join('')
            .trim();
          const jsonMatch = raw.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return NextResponse.json({ mcqQuestions: parsed.slice(0, 10) });
            }
          }
        } catch (aiError) {
          console.error('AI MCQ generation failed:', aiError);
        }
      }
      return NextResponse.json({ mcqQuestions: [] });
    }

    // ── Flashcards ────────────────────────────────────────────────────────────
    if (type === 'flashcard') {
      // Prefer subtopic-bank content if user focused on a specific topic
      if (focusStr) {
        const topicCards = getSubtopicBankContent(subject, 'flashcard', focusStr) as Flashcard[] | null;
        if (topicCards && topicCards.length > 0) {
          return NextResponse.json({ flashcards: shuffle(topicCards).slice(0, 10) });
        }
      }
      const subjectCards = QUESTION_BANK[subject]?.flashcard;
      if (subjectCards && subjectCards.length > 0) {
        return NextResponse.json({ flashcards: shuffle(subjectCards).slice(0, 10) });
      }
      return NextResponse.json({ error: 'No flashcards available for this subject yet.' }, { status: 404 });
    }

    // ── Past-paper ────────────────────────────────────────────────────────────
    if (type === 'past-paper') {
      const papers = PAST_PAPER_BANK[subject];
      if (papers && papers.length > 0) {
        return NextResponse.json({ questions: shuffle(papers).slice(0, 3) });
      }
      // Fallback to long questions if no past-paper bank for this subject
      const longQs = QUESTION_BANK[subject]?.long;
      if (longQs && longQs.length > 0) {
        return NextResponse.json({ questions: shuffle(longQs).slice(0, 3) });
      }
      return NextResponse.json({ error: 'No past-paper questions available for this subject yet.' }, { status: 404 });
    }

    // ── Short / Mid / Long ────────────────────────────────────────────────────
    // Prefer topic-focused content when a focusStr is provided (mastery mode)
    if (focusStr) {
      const topicQs = getSubtopicBankContent(subject, type, focusStr) as Question[] | null;
      if (topicQs && topicQs.length > 0) {
        return NextResponse.json({ questions: shuffle(topicQs).slice(0, 5) });
      }
    }

    // Fall back to whole-subject bank
    const subjectQs = QUESTION_BANK[subject]?.[type];
    if (subjectQs && subjectQs.length > 0) {
      return NextResponse.json({ questions: shuffle(subjectQs).slice(0, 5) });
    }

    return NextResponse.json({ error: `No ${type} questions available for ${subject} yet.` }, { status: 404 });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Failed to load questions.' }, { status: 500 });
  }
}
