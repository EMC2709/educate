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

// Get questions from the SUBTOPIC_BANK for selected subtopics
export function getBankQuestionsForSelection(
  selectedSubject: string,
  topicMap: Record<string, string[]>,
  selectedSubtopics: Record<string, boolean>,
  type: QuestionType,
  questionBank?: Record<string, Record<string, Question[]>>
): Question[] | null {
  const results: Question[] = [];
  Object.entries(topicMap).forEach(([topic, subs]) => {
    subs.forEach(sub => {
      if (selectedSubtopics[`${topic}||${sub}`]) {
        const qs = SUBTOPIC_BANK?.[selectedSubject]?.[topic]?.[sub]?.[type] as Question[] | undefined;
        if (qs) results.push(...qs);
      }
    });
  });
  // Also check subject-level bank if whole topics selected
  if (results.length < 3) {
    const subjectBank = questionBank?.[selectedSubject]?.[type];
    if (subjectBank) results.push(...subjectBank);
  }
  return results.length > 0 ? results : null;
}

// Get flashcards from the SUBTOPIC_BANK for selected subtopics
export function getBankCardsForSelection(
  selectedSubject: string,
  topicMap: Record<string, string[]>,
  selectedSubtopics: Record<string, boolean>,
  questionBank?: Record<string, Record<string, Flashcard[]>>
): Flashcard[] | null {
  const results: Flashcard[] = [];
  Object.entries(topicMap).forEach(([topic, subs]) => {
    subs.forEach(sub => {
      if (selectedSubtopics[`${topic}||${sub}`]) {
        const cards = SUBTOPIC_BANK?.[selectedSubject]?.[topic]?.[sub]?.flashcard;
        if (cards) results.push(...cards);
      }
    });
  });
  if (results.length < 3) {
    const subjectCards = questionBank?.[selectedSubject]?.flashcard;
    if (subjectCards) results.push(...subjectCards);
  }
  return results.length > 0 ? results : null;
}
