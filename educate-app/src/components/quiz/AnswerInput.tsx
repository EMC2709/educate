'use client';

import type { QuestionType } from '@/types';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  questionType: QuestionType;
  accentColor: string;
  onSubmit: () => void;
  onHint: () => void;
  disabled: boolean;
}

const placeholders: Record<string, string> = {
  short: 'Type your answer (1-2 sentences)...',
  mid: 'Write 2-3 developed points with clear explanation...',
  long: 'Full paragraph — argument, evidence and evaluation...',
};

const minHeights: Record<string, string> = {
  short: 'min-h-[80px] sm:min-h-[100px]',
  mid: 'min-h-[120px] sm:min-h-[150px]',
  long: 'min-h-[180px] sm:min-h-[220px]',
};

export function AnswerInput({ value, onChange, questionType, accentColor, onSubmit, onHint, disabled }: AnswerInputProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholders[questionType] || 'Type your answer...'}
        className={`w-full bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white text-sm leading-relaxed resize-y outline-none font-inherit ${minHeights[questionType] || 'min-h-[100px]'} focus:border-indigo-500 placeholder:text-neutral-600 transition-colors`}
        onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) onSubmit(); }}
      />
      <div className="flex gap-2.5 mt-3">
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="flex-1 border-none rounded-xl py-3 text-white font-bold text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          style={{ backgroundColor: accentColor }}
        >
          Check Answer
        </button>
        <button
          onClick={onHint}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-400 cursor-pointer text-xs sm:text-sm hover:bg-neutral-700 transition-colors"
        >
          &#128172; Hint
        </button>
      </div>
    </div>
  );
}
