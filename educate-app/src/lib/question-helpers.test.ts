import { describe, it, expect } from 'vitest';
import { getBankQuestionsForSelection, getBankCardsForSelection } from './question-helpers';

const mockTopicMap = { 'Algebra': ['Linear equations', 'Quadratics'] };

describe('getBankQuestionsForSelection', () => {
  it('returns null when nothing is selected', () => {
    const result = getBankQuestionsForSelection('Mathematics', mockTopicMap, {}, 'short');
    expect(result).toBeNull();
  });

  it('returns null or array — never throws', () => {
    const selected = { 'Algebra||Linear equations': true };
    const result = getBankQuestionsForSelection('Mathematics', mockTopicMap, selected, 'short');
    expect(result === null || Array.isArray(result)).toBe(true);
  });

  it('falls back to subject bank when subtopics have no entries', () => {
    const fakeBank = {
      'Physics': { 'short': [{ question: 'Q1', answer: 'A1', marks: 1, hint: '' }] },
    };
    const result = getBankQuestionsForSelection(
      'Physics',
      { 'Forces': ['Newton'] },
      { 'Forces||Newton': true },
      'short',
      fakeBank as never
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result!.length).toBeGreaterThan(0);
  });
});

describe('getBankCardsForSelection', () => {
  it('returns null when nothing is selected', () => {
    expect(getBankCardsForSelection('Mathematics', mockTopicMap, {})).toBeNull();
  });

  it('returns null or array — never throws', () => {
    const selected = { 'Algebra||Quadratics': true };
    const result = getBankCardsForSelection('Mathematics', mockTopicMap, selected);
    expect(result === null || Array.isArray(result)).toBe(true);
  });
});
