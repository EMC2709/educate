'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SampleQuestionProps {
  subject: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

const INK = '#1a1d2e';
const PENCIL = '#4a5068';
const PEN = '#1e3a8a';      // the student's tick
const MARKER = '#be123c';   // the examiner's red pen

/**
 * One real question from the built-in MCQ bank, laid out like a printed GCSE
 * paper (boxed question number, "Tick one box", mark allocation, margin).
 * Answering it marks it on the spot — the same no-account experience the
 * guest quiz gives.
 */
export function SampleQuestion({ subject, question, options, answer, explanation }: SampleQuestionProps) {
  const [chosen, setChosen] = useState<number | null>(null);
  const answered = chosen !== null;
  const correct = chosen === answer;

  return (
    <section
      aria-labelledby="sample-q-heading"
      className="relative rounded-[6px] bg-[#eef0f6] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.75)] ring-1 ring-black/10 lg:-rotate-[1.25deg]"
      style={{ color: INK }}
    >
      {/* Paper header */}
      <div className="flex items-baseline justify-between gap-4 px-5 sm:px-7 pt-5 pb-3 border-b-2" style={{ borderColor: INK }}>
        <h2 id="sample-q-heading" className="m-0 text-sm sm:text-base font-extrabold landing-wide" style={{ color: INK }}>
          GCSE {subject}
        </h2>
        <p className="m-0 text-xs sm:text-sm" style={{ color: PENCIL }}>Try a question</p>
      </div>

      <div className="flex">
        <div className="flex-1 min-w-0 px-5 sm:px-7 pt-5 pb-6">
          <div className="flex gap-3 sm:gap-4">
            {/* AQA-style boxed question number */}
            <div className="flex shrink-0 self-start" aria-label="Question 1">
              {['0', '1'].map(d => (
                <span
                  key={d}
                  aria-hidden="true"
                  className="w-7 h-8 flex items-center justify-center border-[1.5px] -ml-[1.5px] first:ml-0 text-sm font-bold"
                  style={{ borderColor: INK }}
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="min-w-0">
              <p className="m-0 text-base sm:text-[1.0625rem] leading-snug font-medium">{question}</p>
              <div className="mt-3 flex items-baseline justify-between gap-3 text-sm" style={{ color: PENCIL }}>
                <span>Tick (✓) one box.</span>
                <span className="font-bold whitespace-nowrap" style={{ color: INK }}>[1 mark]</span>
              </div>
            </div>
          </div>

          <ul className="list-none m-0 mt-4 p-0 sm:pl-[4.5rem] space-y-1.5 max-w-[24rem]">
            {options.map((opt, i) => {
              const isChosen = chosen === i;
              const isAnswer = i === answer;
              return (
                <li key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChosen(i)}
                    disabled={answered}
                    aria-pressed={isChosen}
                    aria-label={opt}
                    className="group flex-1 flex items-center justify-between gap-4 rounded-[4px] px-3 py-1.5 text-left text-base bg-transparent border-none cursor-pointer enabled:hover:bg-[#dfe3ee] disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4f46e5]"
                    style={{ color: INK }}
                  >
                    <span>{opt}</span>
                    <span
                      aria-hidden="true"
                      className="w-8 h-8 shrink-0 flex items-center justify-center border-[1.5px] bg-white landing-hand text-2xl leading-none"
                      style={{ borderColor: INK, color: PEN }}
                    >
                      {isChosen ? '✓' : ''}
                    </span>
                  </button>
                  {/* Examiner's mark beside the line */}
                  <span aria-hidden="true" className="w-6 shrink-0 landing-hand text-2xl leading-none" style={{ color: MARKER }}>
                    {answered && isChosen ? (correct ? '✓' : '✗') : ''}
                    {answered && !correct && isAnswer ? '✓' : ''}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Examiner's comment + circled mark, written after answering */}
          <div aria-live="polite" className="min-h-[5.5rem] mt-4 sm:pl-[4.5rem]">
            {answered && (
              <div className="flex items-start justify-between gap-4">
                <p className="m-0 landing-hand text-lg leading-snug" style={{ color: MARKER }}>
                  <span className="sr-only">{correct ? 'Correct. ' : `Not quite. The answer is ${options[answer]}. `}</span>
                  <span aria-hidden="true">{correct ? 'Yes! ' : `It's ${options[answer]}. `}</span>
                  {explanation}
                </p>
                <span className="relative shrink-0 w-14 h-12 flex items-center justify-center landing-hand text-xl" style={{ color: MARKER }}>
                  <span className="sr-only">{correct ? '1 mark out of 1' : '0 marks out of 1'}</span>
                  <span aria-hidden="true">{correct ? '1' : '0'}/1</span>
                  <svg aria-hidden="true" viewBox="0 0 56 48" className="absolute inset-0 w-full h-full overflow-visible">
                    <path
                      className="mark-draw"
                      pathLength={1}
                      d="M44 8 C 30 0, 6 6, 5 24 C 4 42, 40 46, 50 30 C 56 18, 46 6, 30 7"
                      fill="none"
                      stroke={MARKER}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 pt-3 border-t flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm" style={{ borderColor: '#c9cfe0', color: PENCIL }}>
            <span>Marked straight away. No account needed.</span>
            {answered && (
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setChosen(null)}
                  className="bg-transparent border-none cursor-pointer px-2 font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#4f46e5]"
                  style={{ color: INK }}
                >
                  Try again
                </button>
                <Link
                  href="/boards"
                  className="px-2 inline-flex items-center font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#4f46e5]"
                  style={{ color: INK }}
                >
                  More questions
                </Link>
              </span>
            )}
          </div>
        </div>

        {/* "Do not write outside the box" margin, as on a printed paper */}
        <div aria-hidden="true" className="hidden sm:flex w-9 shrink-0 border-l items-center justify-center" style={{ borderColor: '#c9cfe0' }}>
          <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] tracking-wide whitespace-nowrap" style={{ color: PENCIL }}>
            Do not write outside the box
          </span>
        </div>
      </div>
    </section>
  );
}
