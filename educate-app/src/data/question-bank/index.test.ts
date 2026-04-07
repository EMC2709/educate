import { describe, it, expect } from 'vitest';
import { QUESTION_BANK } from './index';

describe('QUESTION_BANK', () => {
  it('exports an object', () => {
    expect(typeof QUESTION_BANK).toBe('object');
    expect(QUESTION_BANK).not.toBeNull();
  });

  it('contains all expected core subjects', () => {
    const coreSubjects = ['Mathematics', 'Biology', 'Chemistry', 'Physics', 'English Language', 'History', 'Geography'];
    coreSubjects.forEach(subject => {
      expect(QUESTION_BANK).toHaveProperty(subject);
    });
  });

  it('each subject bank has the four question type arrays', () => {
    Object.entries(QUESTION_BANK).forEach(([subject, bank]) => {
      expect(Array.isArray(bank.short), `${subject}.short should be array`).toBe(true);
      expect(Array.isArray(bank.mid), `${subject}.mid should be array`).toBe(true);
      expect(Array.isArray(bank.long), `${subject}.long should be array`).toBe(true);
      expect(Array.isArray(bank.flashcard), `${subject}.flashcard should be array`).toBe(true);
    });
  });

  it('short questions have required fields', () => {
    Object.entries(QUESTION_BANK).forEach(([subject, bank]) => {
      bank.short.forEach((q, i) => {
        expect(q, `${subject}.short[${i}] missing field`).toMatchObject({
          question: expect.any(String),
          answer: expect.any(String),
          marks: expect.any(Number),
          hint: expect.any(String),
        });
      });
    });
  });

  it('flashcards have required fields', () => {
    Object.entries(QUESTION_BANK).forEach(([subject, bank]) => {
      bank.flashcard.forEach((card, i) => {
        expect(card, `${subject}.flashcard[${i}] missing field`).toMatchObject({
          term: expect.any(String),
          definition: expect.any(String),
        });
      });
    });
  });
});
