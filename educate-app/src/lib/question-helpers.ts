import type { Question, Flashcard, QuestionType } from '@/types';
import { SUBTOPIC_BANK } from '@/data/subtopic-bank';
import { shuffle } from './shuffle';

// Get questions from the subject-level QUESTION_BANK, shuffled, capped at n
export function getBankQuestions(
  questionBank: Record<string, Record<string, Question[]>>,
  subject: string,
  type: string,
  n: number = 5
): Question[] | null {
  const bank = questionBank[subject]?.[type];
  if (!bank || bank.length === 0) return null;
  return shuffle(bank).slice(0, n);
}

// Get flashcards from the subject-level QUESTION_BANK, shuffled, capped at n
export function getBankFlashcards(
  questionBank: Record<string, Record<string, Question[] | Flashcard[]>>,
  subject: string,
  n: number = 10
): Flashcard[] | null {
  const bank = questionBank[subject]?.flashcard as Flashcard[] | undefined;
  if (!bank || bank.length === 0) return null;
  return shuffle(bank).slice(0, n);
}

// Check if subject has pre-generated content in the subject-level QUESTION_BANK
export function hasBank(
  questionBank: Record<string, Record<string, unknown[]>>,
  subject: string,
  type: string
): boolean {
  const bank = questionBank[subject];
  if (!bank) return false;
  if (type === "flashcard") return !!((bank.flashcard as unknown[] | undefined)?.length && (bank.flashcard as unknown[]).length > 0);
  return !!((bank[type] as unknown[] | undefined)?.length && (bank[type] as unknown[]).length > 0);
}

// Get questions from the SUBTOPIC_BANK for selected subtopics.
// IMPORTANT: Only falls back to the subject-level bank when NO specific subtopic
// was selected. Otherwise cross-topic content would leak into a focused study session
// (e.g. picking "Diffusion & Osmosis" and getting "Periodic Table" cards).
export function getBankQuestionsForSelection(
  selectedSubject: string,
  topicMap: Record<string, string[]>,
  selectedSubtopics: Record<string, boolean>,
  type: QuestionType,
  questionBank?: Record<string, Record<string, Question[]>>
): Question[] | null {
  const results: Question[] = [];
  let hasSpecificSelection = false;
  Object.entries(topicMap).forEach(([topic, subs]) => {
    subs.forEach(sub => {
      if (selectedSubtopics[`${topic}||${sub}`]) {
        hasSpecificSelection = true;
        const qs = (SUBTOPIC_BANK?.[selectedSubject]?.[topic]?.[sub] as Record<string, Question[] | undefined> | undefined)?.[type];
        if (qs) results.push(...qs);
      }
    });
  });
  // Fall back to whole-subject bank if:
  // 1. No subtopic was selected (browse all), OR
  // 2. A subtopic WAS selected but had no entries in the subtopic bank
  //    (avoids returning null when subject-level questions exist)
  if (!hasSpecificSelection || results.length === 0) {
    const subjectBank = questionBank?.[selectedSubject]?.[type];
    if (subjectBank) results.push(...subjectBank);
  }
  return results.length > 0 ? results : null;
}

// Get flashcards from the SUBTOPIC_BANK for selected subtopics.
// Same rule as getBankQuestionsForSelection — no cross-topic fallback.
export function getBankCardsForSelection(
  selectedSubject: string,
  topicMap: Record<string, string[]>,
  selectedSubtopics: Record<string, boolean>,
  questionBank?: Record<string, Record<string, Flashcard[]>>
): Flashcard[] | null {
  const results: Flashcard[] = [];
  let hasSpecificSelection = false;
  Object.entries(topicMap).forEach(([topic, subs]) => {
    subs.forEach(sub => {
      if (selectedSubtopics[`${topic}||${sub}`]) {
        hasSpecificSelection = true;
        const cards = SUBTOPIC_BANK?.[selectedSubject]?.[topic]?.[sub]?.flashcard;
        if (cards) results.push(...cards);
      }
    });
  });
  if (!hasSpecificSelection) {
    const subjectCards = questionBank?.[selectedSubject]?.flashcard;
    if (subjectCards) results.push(...subjectCards);
  }
  return results.length > 0 ? results : null;
}
