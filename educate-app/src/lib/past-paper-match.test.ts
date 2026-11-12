import { describe, it, expect } from 'vitest';
import { dbSubjectsFor, parseYearLabel, examCodePattern, pickPaper, type PaperCandidate } from './past-paper-match';

const re = (s: string) => new RegExp(s, 'i');
const cand = (o: Partial<PaperCandidate>): PaperCandidate => ({
  id: 'x', year: null, subject: 'Mathematics', paper_number: null, component: null,
  total_questions: 20, n_rows: 20, hits: 0, other_hits: 0, marks: 40, ...o,
});

describe('past paper matching', () => {
  it('maps UI subject names to DB values', () => {
    expect(dbSubjectsFor('Combined Science')).toContain('Combined Science Trilogy');
    expect(dbSubjectsFor('Business Studies')).toContain('Business');
    expect(dbSubjectsFor('Religious Studies')).toContain('Religious Studies A');
    expect(dbSubjectsFor('Mathematics')).toEqual(['Mathematics']);
  });

  it('parses June and November year labels', () => {
    expect(parseYearLabel('2023')).toEqual({ year: 2023, session: 'June' });
    expect(parseYearLabel('Nov 2023')).toEqual({ year: 2023, session: 'November' });
    expect(parseYearLabel('')).toBeNull();
  });

  it('builds a code pattern for paper number, tier and sitting', () => {
    const p = re(examCodePattern({ year: 2023, session: 'June', paperNumber: 1, tier: 'H', component: null })!);
    expect(p.test('IB/M/Jun23/8300/1H outside the box')).toBe(true);
    expect(p.test('IB/M/Jun23/8300/1F')).toBe(false);
    expect(p.test('IB/M/Jun23/8300/2H')).toBe(false);
    expect(p.test('IB/M/Nov23/8300/1H')).toBe(false);
    expect(p.test('IB/M/Jun22/8300/1H')).toBe(false);
    const bio = re(examCodePattern({ year: 2023, session: 'June', paperNumber: 1, tier: 'H', component: 'Biology' })!);
    expect(bio.test('Jun23/8464/B/1H')).toBe(true);
    expect(bio.test('Jun23/8464/C/1H')).toBe(false);
  });

  it('prefers the exact code match and never picks by year alone when a code matches', () => {
    const sel = { year: 2023, session: 'June' as const, paperNumber: 1, tier: 'H' as const, component: null };
    const r = pickPaper([
      cand({ id: 'year-only', year: 2023 }),
      cand({ id: 'exact', hits: 3 }),
    ], sel);
    expect(r).toEqual({ paper: expect.objectContaining({ id: 'exact' }), match: 'exact' });
  });

  it('skips year matches whose footer code says they are a different paper', () => {
    const sel = { year: 2023, session: 'June' as const, paperNumber: 1, tier: 'H' as const, component: null };
    const r = pickPaper([cand({ id: 'wrong', year: 2023, other_hits: 5 }), cand({ id: 'meta', year: 2023 })], sel);
    expect(r?.paper.id).toBe('meta');
    expect(r?.match).toBe('metadata');
  });
});
