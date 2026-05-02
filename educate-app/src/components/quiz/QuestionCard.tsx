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
  const isVerified = question.verified === true;
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 mb-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: `${typeColor}22`, color: typeColor }}
          >
            {typeLabel} &middot; {question.marks} marks
          </span>
          {question.required_practical && (
            <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{ backgroundColor: '#06b6d422', color: '#06b6d4' }}>
              Required Practical
            </span>
          )}
          {question.tier === 'higher' && (
            <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{ backgroundColor: '#c084fc22', color: '#c084fc' }}>
              Higher
            </span>
          )}
          {question.tier === 'foundation' && (
            <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{ backgroundColor: '#4ade8022', color: '#4ade80' }}>
              Foundation
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {tier && !question.tier && (
            <span
              className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{ backgroundColor: tier.bg, color: tier.color }}
            >
              {tier.label}
            </span>
          )}
          <span
            className="text-xs px-2 py-1 rounded-lg font-medium"
            title={isVerified ? 'This question has been reviewed by a human expert' : 'AI-generated content — may contain errors'}
            style={isVerified
              ? { backgroundColor: '#16a34a22', color: '#4ade80' }
              : { backgroundColor: '#78716c22', color: '#a8a29e' }
            }
          >
            {isVerified ? '✓ Verified' : '⚠ AI'}
          </span>
        </div>
      </div>
      <div className="text-base sm:text-lg leading-relaxed font-medium">
        <MessageContent content={question.question} />
      </div>
    </div>
  );
}
