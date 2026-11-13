import { describe, it, expect } from 'vitest';
import {
  dbSubjectsFor, parseYearLabel, examCodePattern, pickPaper, parseExamCode, formatExamCode,
  isPaperStored, paperLetterFromTitle, type PaperCandidate, type PaperSelection,
} from './past-paper-match';
import { aqaMarkSchemeCandidates } from './aqa-mark-scheme';

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

describe('exam codes', () => {
  it('parses footer codes and drops version suffixes', () => {
    expect(formatExamCode(parseExamCode('Jun23/8300/1H/E3')!)).toBe('jun23/8300/1h');
    expect(formatExamCode(parseExamCode('jun23/8464/B/1H')!)).toBe('jun23/8464/b/1h');
    expect(formatExamCode(parseExamCode('jun23/8658/lh/e3')!)).toBe('jun23/8658/lh');
    expect(formatExamCode(parseExamCode('jun22/8145/1b/b')!)).toBe('jun22/8145/1b');
    expect(formatExamCode(parseExamCode('jun23/8552/w/g40')!)).toBe('jun23/8552/w');
    expect(parseExamCode('jun24/8463/ins/v2')).toBeNull();
    expect(parseExamCode('jun24/8464/846')).toBeNull();
    expect(parseExamCode('8300/1H')).toBeNull();
  });

  it('reads the skill letter from language paper titles', () => {
    expect(paperLetterFromTitle('Paper 1: Listening')).toBe('l');
    expect(paperLetterFromTitle('Paper 3: Reading')).toBe('r');
    expect(paperLetterFromTitle('Paper 4: Writing')).toBe('w');
    expect(paperLetterFromTitle('Paper 1: Non-Calculator')).toBeNull();
  });

  it('knows which selections are stored', () => {
    const codes = ['jun23/8300/1h', 'jun22/8300/2f', 'jun23/8464/b/1h', 'jun23/8658/lh', 'jun23/8062/11'];
    const sel = (o: Partial<PaperSelection>): PaperSelection =>
      ({ year: 2023, session: 'June', paperNumber: 1, tier: 'H', component: null, ...o });
    expect(isPaperStored(codes, sel({}))).toBe(true);
    expect(isPaperStored(codes, sel({ tier: 'F' }))).toBe(false);
    expect(isPaperStored(codes, sel({ year: 2022, paperNumber: 2, tier: 'F' }))).toBe(true);
    expect(isPaperStored(codes, sel({ year: 2024 }))).toBe(false);
    expect(isPaperStored(codes, sel({ session: 'November' }))).toBe(false);
    expect(isPaperStored(codes, sel({ component: 'Biology' }))).toBe(true);
    expect(isPaperStored(codes, sel({ component: 'Physics' }))).toBe(false);
    expect(isPaperStored(codes, sel({ paperLetter: 'l' }))).toBe(true);
    expect(isPaperStored(codes, sel({ paperLetter: 'r' }))).toBe(false);
    expect(isPaperStored(codes, sel({ tier: null }))).toBe(true); // untiered "1[a-z0-9]?" also matches 8062/11
    // A single written paper ("8271/W") counts as paper 1 of an untiered subject
    expect(isPaperStored(['jun23/8271/w'], sel({ tier: null }))).toBe(true);
    expect(isPaperStored(['jun23/8271/w'], sel({ tier: null, paperNumber: 2 }))).toBe(false);
    expect(isPaperStored(['jun23/8271/w'], sel({}))).toBe(false);
  });

  it('builds AQA mark-scheme URLs, with a fallback for option letters', () => {
    const urls = (raw: string) => aqaMarkSchemeCandidates(parseExamCode(raw)!).map(u => u.split('/').slice(-3).join('/'));
    expect(urls('jun23/8300/1h')).toEqual(['2023/june/AQA-83001H-MS-JUN23.PDF']);
    expect(urls('jun23/8464/b/1h')).toEqual(['2023/june/AQA-8464B1H-MS-JUN23.PDF']);
    expect(urls('nov22/8300/1h')).toEqual(['2022/november/AQA-83001H-MS-NOV22.PDF']);
    expect(urls('jun23/8702/1n')).toEqual(['2023/june/AQA-87021N-MS-JUN23.PDF', '2023/june/AQA-87021-MS-JUN23.PDF']);
    expect(urls('jun22/8463/2hr')).toEqual([
      '2022/june/AQA-84632HR-MS-JUN22.PDF', '2022/june/AQA-84632H-MS-JUN22.PDF', '2022/june/AQA-84632-MS-JUN22.PDF',
    ]);
    expect(urls('jun23/8658/lh')).toEqual(['2023/june/AQA-8658LH-MS-JUN23.PDF']);
  });
});
