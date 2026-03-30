import type { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  typeLabel: string;
  typeColor: string;
}

export function QuestionCard({ question, typeLabel, typeColor }: QuestionCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 mb-5">
      <div className="flex justify-between items-start mb-4">
        <span
          className="text-xs px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: `${typeColor}22`, color: typeColor }}
        >
          {typeLabel} &middot; {question.marks} marks
        </span>
      </div>
      <p className="text-base sm:text-lg leading-relaxed m-0 font-medium">{question.question}</p>
    </div>
  );
}
