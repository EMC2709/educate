import { describe, it, expect } from 'vitest';
import { generateQuestionsPrompt, generateFlashcardsPrompt, checkAnswerPrompt, chatSystemPrompt } from './prompts';

describe('generateQuestionsPrompt', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateQuestionsPrompt('Mathematics', 'AQA', 'short', null)).toBe('string');
    expect(generateQuestionsPrompt('Mathematics', 'AQA', 'short', null).length).toBeGreaterThan(0);
  });

  it('includes subject and board', () => {
    const p = generateQuestionsPrompt('Biology', 'OCR', 'mid', null);
    expect(p).toContain('Biology');
    expect(p).toContain('OCR');
  });

  it('throws on invalid type', () => {
    expect(() => generateQuestionsPrompt('Maths', 'AQA', 'invalid', null)).toThrow();
  });

  it('includes focus string when provided', () => {
    const p = generateQuestionsPrompt('Chemistry', 'AQA', 'long', 'Atomic structure');
    expect(p).toContain('Atomic structure');
  });

  it('works for all valid types', () => {
    ['short', 'mid', 'long'].forEach(type => {
      expect(() => generateQuestionsPrompt('Physics', 'Edexcel', type, null)).not.toThrow();
    });
  });
});

describe('generateFlashcardsPrompt', () => {
  it('returns a string containing subject', () => {
    const p = generateFlashcardsPrompt('History', 'AQA', null);
    expect(p).toContain('History');
    expect(p).toContain('AQA');
  });

  it('includes focus when provided', () => {
    const p = generateFlashcardsPrompt('Biology', 'Edexcel', 'Cell Biology');
    expect(p).toContain('Cell Biology');
  });
});

describe('checkAnswerPrompt', () => {
  it('includes all key fields in output', () => {
    const p = checkAnswerPrompt('Physics', 'AQA', 'short', 'What is velocity?', 'Speed with direction', 'Distance over time', 2);
    expect(p).toContain('Physics');
    expect(p).toContain('What is velocity?');
    expect(p).toContain('Speed with direction');
    expect(p).toContain('Distance over time');
    expect(p).toContain('2');
  });
});

describe('chatSystemPrompt', () => {
  it('mentions subject when provided', () => {
    const p = chatSystemPrompt('Physics', 'Edexcel');
    expect(p).toContain('Physics');
    expect(p).toContain('Edexcel');
  });

  it('returns generic prompt when no subject', () => {
    const p = chatSystemPrompt(null, null);
    expect(p).toContain('GCSEs');
  });

  it('includes LaTeX formatting rules', () => {
    const p = chatSystemPrompt(null, null);
    expect(p).toContain('LaTeX');
  });
});
