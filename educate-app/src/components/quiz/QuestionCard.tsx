import type { Question } from '@/types';
import { MessageContent } from '@/components/ui/MessageContent';

type QuestionType = 'short' | 'mid' | 'long' | 'flashcard' | 'past-paper';

interface TierInfo { label: string; color: string; bg: string }
function getTier(qt: QuestionType | undefined): TierInfo | null {
  if (qt === 'short') return { label: 'Foundation', color: '#4ade80', bg: '#4ade8018' };
  if (qt === 'mid')   return { label: 'Foundation / Higher', color: '#fbbf24', bg: '#fbbf2418' };
  if (qt === 'long')  return { label: 'Higher', color: '#c084fc', bg: '#c084fc18' };
  return null;
}

interface QuestionCardProps {
  question: Question;
  typeLabel: string;
  typeColor: string;
  questionType?: QuestionType;
}

export function QuestionCard({ question, typeLabel, typeColor, questionType }: QuestionCardProps) {
  const tier = getTier(questionType);
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 mb-5">
      <div className="flex justify-between items-start mb-4">
        <span
          className="text-xs px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: `${typeColor}22`, color: typeColor }}
        >
          {typeLabel} &middot; {question.marks} marks
        </span>
        {tier && (
          <span
            className="text-xs px-2.5 py-1 rounded-lg font-semibold"
            style={{ backgroundColor: tier.bg, color: tier.color }}
          >
            {tier.label}
          </span>
        )}
      </div>
      <div className="text-base sm:text-lg leading-relaxed font-medium">
        <MessageContent content={question.question} />
      </div>
    </div>
  );
}
