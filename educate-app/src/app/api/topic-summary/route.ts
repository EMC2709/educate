import { NextResponse } from 'next/server';
import { SUBTOPIC_BANK } from '@/data/subtopic-bank';
import type { SubtopicContent } from '@/types';

/** Case-insensitive fuzzy match — true if a includes b or vice-versa */
function fuzzyMatch(a: string, b: string): boolean {
  const na = a.toLowerCase().replace(/[^a-z0-9]/g, '');
  const nb = b.toLowerCase().replace(/[^a-z0-9]/g, '');
  return na === nb || na.includes(nb) || nb.includes(na);
}

/**
 * Find the best matching subtopic content from the bank.
 * Returns { groupName, subtopicName, content } or null.
 */
function findBankContent(subject: string, topicName: string): {
  groupName: string;
  subtopicName: string;
  content: SubtopicContent;
} | null {
  const subjectBank = SUBTOPIC_BANK[subject];
  if (!subjectBank) return null;

  // 1. Try exact subtopic match first
  for (const [groupName, subtopics] of Object.entries(subjectBank)) {
    for (const [subtopicName, content] of Object.entries(subtopics)) {
      if (fuzzyMatch(subtopicName, topicName)) {
        return { groupName, subtopicName, content };
      }
    }
  }

  // 2. Try group-level match — return first subtopic in the group
  for (const [groupName, subtopics] of Object.entries(subjectBank)) {
    if (fuzzyMatch(groupName, topicName)) {
      const [[subtopicName, content]] = Object.entries(subtopics);
      return { groupName, subtopicName, content };
    }
  }

  return null;
}

/** Build a rich markdown summary from bank content */
function buildSummaryFromContent(
  subject: string,
  topicName: string,
  groupName: string,
  content: SubtopicContent,
): string {
  const lines: string[] = [];

  // Header: What is this topic?
  lines.push(`**What is ${topicName}?**`);
  if (content.flashcard && content.flashcard.length > 0) {
    const first = content.flashcard[0];
    lines.push(first.definition);
  } else if (content.short && content.short.length > 0) {
    lines.push(`${topicName} is a key area of GCSE ${subject} in the **${groupName}** section. Understanding the core concepts below will help you score top marks in the exam.`);
  }
  lines.push('');

  // Key Concepts — from flashcards
  if (content.flashcard && content.flashcard.length > 0) {
    lines.push('**Key Concepts**');
    for (const card of content.flashcard) {
      lines.push(`– **${card.term}**: ${card.definition}`);
    }
    lines.push('');
  }

  // How It Works — from mid or long answer
  const deepQ = content.long?.[0] ?? content.mid?.[0];
  if (deepQ) {
    lines.push('**How It Works**');
    lines.push(deepQ.answer);
    lines.push('');
  }

  // Worked Example — from a short question
  if (content.short && content.short.length > 0) {
    const ex = content.short[0];
    lines.push('**Worked Example**');
    lines.push(`**Q:** ${ex.question}`);
    lines.push('');
    lines.push(`**A:** ${ex.answer}`);
    lines.push('');
  }

  // Examples from flashcards (if any have example field)
  const examplesFromCards = content.flashcard?.filter(c => c.example).slice(0, 2) ?? [];
  if (examplesFromCards.length > 0) {
    lines.push('**Concrete Examples**');
    for (const card of examplesFromCards) {
      lines.push(`– **${card.term}**: ${card.example}`);
    }
    lines.push('');
  }

  // Common Mistakes — hints from questions often indicate common pitfalls
  const hintsQs = [
    ...(content.short ?? []),
    ...(content.mid ?? []),
  ].filter(q => q.hint).slice(0, 3);

  if (hintsQs.length > 0) {
    lines.push('**Common Mistakes**');
    for (const q of hintsQs) {
      lines.push(`– Students often forget: ${q.hint?.toLowerCase()}. Make sure to include this in your answer.`);
    }
    lines.push('');
  }

  // Exam Tips — from a second short question if available
  lines.push('**Exam Tips**');
  const tips: string[] = [];

  if (content.mid && content.mid.length > 0) {
    tips.push(`For **${content.mid[0].marks}-mark questions** on ${topicName}, structure your answer point-by-point — examiners award one mark per distinct point.`);
  }
  if (content.long && content.long.length > 0) {
    const longQ = content.long[0];
    tips.push(`For extended-answer questions (${longQ.marks} marks), use the hint: "${longQ.hint ?? `cover all aspects of ${topicName}`}".`);
  }
  tips.push(`Learn the key terms in bold above — using precise scientific vocabulary gains you extra marks.`);

  for (const tip of tips.slice(0, 3)) {
    lines.push(`– ${tip}`);
  }

  return lines.join('\n');
}

/** Fallback: build a generic but useful template when no bank data found */
function buildFallbackSummary(subject: string, topicName: string, board: string): string {
  return `**What is ${topicName}?**
${topicName} is an important topic in GCSE ${subject} (${board} specification). Mastering it will help you answer both short-answer and extended-response questions in the exam.

**Key Concepts**
– Study your ${board} specification carefully for the exact content covered in **${topicName}**
– Focus on understanding definitions, processes and how to apply them in context
– Make sure you can recall key terms with precision — examiners look for accurate vocabulary
– Practise past-paper questions to see how ${topicName} is examined

**How It Works**
Read through your class notes and textbook section on **${topicName}**. Pay attention to:
– The underlying principles and why they matter
– Any diagrams, processes or sequences you need to recall
– The command words used in exam questions (describe, explain, evaluate, calculate)

**Worked Example**
Look at the practice questions below to see how ${topicName} is typically examined. For each question, plan your answer using the marks available as a guide — one mark = one distinct point.

**Common Mistakes**
– Not reading the question carefully — always check the command word
– Giving vague answers when specific key terms are needed
– Forgetting to show working in calculation questions

**Exam Tips**
– Use the mark allocation to decide how much to write
– Include **bold key terms** from the specification in your answers
– Review past paper mark schemes for ${topicName} to see exactly what examiners want`;
}

export async function POST(request: Request) {
  try {
    const { subject, topic, board } = await request.json();
    if (!subject || !topic) {
      return NextResponse.json({ error: 'Missing subject or topic.' }, { status: 400 });
    }

    // Try to build from bank data first
    const match = findBankContent(subject, topic);
    const summary = match
      ? buildSummaryFromContent(subject, topic, match.groupName, match.content)
      : buildFallbackSummary(subject, topic, board || 'AQA');

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Topic summary error:', error);
    return NextResponse.json({ error: 'Could not load summary.' }, { status: 500 });
  }
}
