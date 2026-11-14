import { describe, it, expect } from 'vitest';
import { cleanQuestionText, recoverQuestionNumber, cleanPaperQuestions } from './question-text';

// Every input below is a real stored question_text row (AQA past papers).
describe('cleanQuestionText', () => {
  it('removes page numbers with their barcode markers and [Turn over]', () => {
    expect(cleanQuestionText(
      '0 2 Water pollution is a problem for humans and wildlife. Explain how human activities are polluting rivers, lakes and seas. 15 *15* [Turn over] 6 16 *16*',
    )).toBe('0 2 Water pollution is a problem for humans and wildlife. Explain how human activities are polluting rivers, lakes and seas. 6');
  });

  it('keeps a number before a marker when it is not that page number', () => {
    expect(cleanQuestionText('1 (b) Work out 5 6 ÷ 3 Answer 5 *05*')).toBe('1 (b) Work out 5 6 ÷ 3 Answer');
    expect(cleanQuestionText('Work out 12 *47* please')).toBe('Work out 12 please');
  });

  it('removes BLANK PAGE, exam footer codes and margin text', () => {
    expect(cleanQuestionText(
      '0 1 . 1 Which reaction produces water? Tick () ONE box. Aerobic respiration Anaerobic respiration Photosynthesis 5 *05* BLANK PAGE [Turn over] 6 *06* The water cycle provides water',
    )).toBe('0 1 . 1 Which reaction produces water? Tick () ONE box. Aerobic respiration Anaerobic respiration Photosynthesis The water cycle provides water');

    expect(cleanQuestionText(
      'Explain your answer. IB/M/ Jun23/8464/C/1H outside the box There are no questions printed on this page DO NOT WRITE ON THIS PAGE ANSWER IN THE SPACES PROVIDED 23 *23* IB/M/Jun23/8464/C/1H outside the box',
    )).toBe('Explain your answer.');

    expect(cleanQuestionText('0 1 . 2 Give one of the key moral principles of Judaism. 3 outside the box'))
      .toBe('0 1 . 2 Give one of the key moral principles of Judaism.');
    expect(cleanQuestionText('Answer G/Jun23/8035/3/PM and WP/M/LW/Jun24/8145/2B/B/G4006/V2 done')).toBe('Answer and done');
  });

  it('cuts everything after END OF QUESTIONS or the additional answer page', () => {
    expect(cleanQuestionText(
      'I want to visit my uncle who lives in Germany. [Turn over] 60 *60* 61 *61* END OF QUESTIONS 12 62 *62* Additional page, if required. Write the question numbers in the left-hand margin.',
    )).toBe('I want to visit my uncle who lives in Germany.');
  });

  it('removes copyright lines and extra-space labels', () => {
    expect(cleanQuestionText('Describe it. 7 outside the box Extra space Copyright © 2025 AQA and its licensors. All rights reserved.'))
      .toBe('Describe it.');
  });

  it('cuts off mark-scheme text that the scraper glued onto a question (OCR sample papers)', () => {
    expect(cleanQuestionText(
      '5 Explain what actions taken by Caesar would be in keeping with the ideals of a popularis. Indicative content Land reform and the distribution of land',
    )).toBe('5 Explain what actions taken by Caesar would be in keeping with the ideals of a popularis.');
    expect(cleanQuestionText(
      '(ii) Give two reasons why quartz is common. 2 1.1c × 2 ALLOW intensity of metamorphism DO NOT ALLOW general comments',
    )).toBe('(ii) Give two reasons why quartz is common. 2 1.1c × 2');
    expect(cleanQuestionText('Describe the cell. J260/05 Mark Scheme June 20XX 25 Question Answer Marks'))
      .toBe('Describe the cell.');
    expect(cleanQuestionText('State the law. MARK SCHEME Duration: 2 hours MAXIMUM MARK 100'))
      .toBe('State the law.');
    expect(cleanQuestionText('2 AO2/1 4.1.3 Total 4 MARK SCHEME – PHYSICS PAPER 1H – SPECIMEN MATERIAL 9of 19'))
      .toBe('2 AO2/1 4.1.3 Total 4');
    expect(cleanQuestionText('Exemplar Learner Responses QuestionAnswerMarksGuidance 6(c) Please refer'))
      .toBe('Exemplar Learner Responses');
  });

  it('keeps ordinary uses of the words "mark" and "scheme"', () => {
    const s = '3 The council set up a recycling scheme. Explain how it might change behaviour. [4 marks]';
    expect(cleanQuestionText(s)).toBe(s);
  });

  it('leaves clean text alone', () => {
    const s = '14 4 chocolate bars and 3 packets of mints cost £4.70';
    expect(cleanQuestionText(s)).toBe(s);
    expect(cleanQuestionText('3 + 7 x')).toBe('3 + 7 x');
    expect(cleanQuestionText('')).toBe('');
    expect(cleanQuestionText(null)).toBe('');
  });
});

describe('recoverQuestionNumber', () => {
  it('reads AQA two-digit numbers that were stored as "0"', () => {
    expect(recoverQuestionNumber('0', '0 1 . 3 THEME 3 – Current and future study')).toBe('1.3');
    expect(recoverQuestionNumber('0', '0 2 Water pollution is a problem')).toBe('2');
    expect(recoverQuestionNumber('0', '0 2 . 4 Explain two ways')).toBe('2.4');
  });

  it('keeps the stored number when it is not "0" or nothing can be read', () => {
    expect(recoverQuestionNumber('10(a)', '10 (a) Represent –2 < x < 4')).toBe('10(a)');
    expect(recoverQuestionNumber('0', '0 . 13 as a fraction in its simplest form.')).toBe('0');
    expect(recoverQuestionNumber('0', '0 2 20 25 53')).toBe('0');
    expect(recoverQuestionNumber(null, 'text')).toBe(null);
  });
});

describe('cleanPaperQuestions', () => {
  it('cleans text, recovers numbers, tidies the leading number and drops rows with no words left', () => {
    const rows = [
      { question_number: '0', question_text: '0 2 20 25 53 *53*', marks: 1 },
      { question_number: '0', question_text: '0 1 . 3 THEME 3 Du schreibst ein Blog. 7 *07*', marks: 16 },
      { question_number: '11', question_text: '11 Factorise x 2 + 2x – 24 Answer', marks: 2 },
      { question_number: '1', question_text: '1 ____________________ ____________________', marks: 1 },
      { question_number: '3', question_text: '3 Solve x² = 9', marks: 1 },
    ];
    expect(cleanPaperQuestions(rows)).toEqual([
      { question_number: '1.3', question_text: '01.3 THEME 3 Du schreibst ein Blog.', marks: 16 },
      { question_number: '11', question_text: '11 Factorise x 2 + 2x – 24 Answer', marks: 2 },
      { question_number: '3', question_text: '3 Solve x² = 9', marks: 1 },
    ]);
  });

  it('drops rows that are only mark-scheme text', () => {
    expect(cleanPaperQuestions([
      { question_number: '2', question_text: 'Indicative content The guidance provided is illustrative and not exhaustive.' },
      { question_number: '3', question_text: '3 Name the gas. [1 mark]' },
    ])).toEqual([{ question_number: '3', question_text: '3 Name the gas. [1 mark]' }]);

    // Real rows from OCR sample assessment materials: mark codes with AO references, level descriptors
    expect(cleanPaperQuestions([
      { question_number: '3(ii)', question_text: '3 (ii) (B) Hence yx= is an invariant line B1 2.2a' },
      { question_number: '5(i)', question_text: '5 (i) Mass of 5 small bags ~ N(2540,54.45) B2 3.3 1.1 B1 For Normal' },
      { question_number: '0', question_text: '0 marks No response or no response worthy of credit.' },
      { question_number: '0', question_text: '0 0 Nothing worthy of credit.' },
      { question_number: '4', question_text: '4 Vitamin B1 is found in whole grains. Name one food rich in it.' },
    ])).toEqual([
      { question_number: '4', question_text: '4 Vitamin B1 is found in whole grains. Name one food rich in it.' },
    ]);
  });

  it('copes with rows that have no text', () => {
    expect(cleanPaperQuestions([{ question_number: '1', question_text: null }])).toEqual([]);
  });
});
