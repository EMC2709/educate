'use client';

import { useState } from 'react';
import type { MCQQuestion } from '@/types';

const LABELS = ['A', 'B', 'C', 'D'] as const;

interface MCQOptionsProps {
  question: MCQQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext: (wasCorrect: boolean) => void;
  isLast: boolean;
  accentColor: string;
}

export function MCQOptions({
  question,
  questionNumber,
  totalQuestions,
  onNext,
  isLast,
  accentColor,
}: MCQOptionsProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === question.answer;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
  };

  const btnClass = (i: number) => {
    const base =
      'w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 flex items-start gap-3 font-medium text-sm';
    if (!answered) {
      return `${base} bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700 hover:border-neutral-600 cursor-pointer`;
    }
    if (i === question.answer) {
      return `${base} bg-emerald-500/20 border-emerald-500 text-emerald-200 cursor-default`;
    }
    if (i === selected) {
      return `${base} bg-rose-500/20 border-rose-500 text-rose-200 cursor-default`;
    }
    return `${base} bg-neutral-800/40 border-neutral-700/40 text-neutral-500 cursor-default`;
  };

  const labelClass = (i: number) => {
    const base =
      'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold leading-none';
    if (!answered) return `${base} border-current`;
    if (i === question.answer) return `${base} border-emerald-400 text-emerald-400`;
    if (i === selected) return `${base} border-rose-400 text-rose-400`;
    return `${base} border-neutral-600 text-neutral-600`;
  };

  return (
    <div>
      {/* Question card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[11px] px-2.5 py-0.5 rounded-lg font-semibold"
            style={{ color: accentColor, backgroundColor: `${accentColor}22` }}
          >
            Multiple Choice
          </span>
          <span className="text-neutral-500 text-xs">
            {questionNumber} / {totalQuestions}
          </span>
          {question.topic && (
            <span className="text-neutral-600 text-[11px] truncate hidden sm:block">
              · {question.topic}
            </span>
          )}
        </div>
        <p className="text-white text-base leading-relaxed m-0">{question.question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-4">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={answered}
            className={btnClass(i)}
          >
            <span className={labelClass(i)}>{LABELS[i]}</span>
            <span className="flex-1 leading-snug">{opt}</span>
            {answered && i === question.answer && (
              <span className="ml-auto text-emerald-400 text-base leading-none shrink-0">✓</span>
            )}
            {answered && i === selected && i !== question.answer && (
              <span className="ml-auto text-rose-400 text-base leading-none shrink-0">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback + explanation */}
      {answered && (
        <div
          className={`rounded-xl p-4 mb-4 ${
            isCorrect
              ? 'bg-emerald-500/10 border border-emerald-500/30'
              : 'bg-rose-500/10 border border-rose-500/30'
          }`}
        >
          <p
            className={`font-bold text-sm m-0 mb-1 ${
              isCorrect ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isCorrect ? '✓ Correct!' : `✗ Incorrect — the answer was ${LABELS[question.answer]}`}
          </p>
          {question.explanation && (
            <p className="text-neutral-300 text-sm m-0 leading-relaxed">
              {question.explanation}
            </p>
          )}
        </div>
      )}

      {/* Next / Results button */}
      {answered && (
        <button
          onClick={() => onNext(isCorrect)}
          className="w-full py-3 rounded-xl font-bold text-sm text-white border-none cursor-pointer transition-opacity hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          {isLast ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
