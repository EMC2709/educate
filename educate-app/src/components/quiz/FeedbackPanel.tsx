import type { FeedbackResult } from '@/types';
import { MessageContent } from '@/components/ui/MessageContent';

interface FeedbackPanelProps {
  feedback: FeedbackResult;
  maxMarks: number;
}

export function FeedbackPanel({ feedback, maxMarks }: FeedbackPanelProps) {
  if (feedback.loading) {
    return (
      <div className="text-center py-8 bg-neutral-900 rounded-xl">
        <div className="w-8 h-8 border-2 border-neutral-600 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-neutral-500 text-sm">Assessing your answer...</p>
      </div>
    );
  }

  const isCorrect = feedback.correct;

  return (
    <div
      className={`rounded-xl p-5 mb-4 border ${
        isCorrect ? 'bg-emerald-500/10 border-emerald-500' : 'bg-rose-500/10 border-rose-500'
      }`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-xl">{isCorrect ? '&#9989;' : '&#10060;'}</span>
        <span className={`font-bold text-base ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isCorrect ? 'Correct!' : 'Not quite right'}
        </span>
        <span
          className={`ml-auto text-sm px-2.5 py-0.5 rounded-lg ${
            isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}
        >
          {feedback.marksAwarded}/{maxMarks} marks
        </span>
      </div>
      <div className="text-neutral-300 text-sm leading-relaxed mb-3">
        <MessageContent content={feedback.feedback} />
      </div>
      <div className="bg-neutral-950 rounded-lg p-3.5">
        <p className="text-neutral-500 text-[11px] uppercase tracking-wide mb-1.5 m-0">Model Answer</p>
        <div className="text-neutral-300 text-sm leading-relaxed">
          <MessageContent content={feedback.modelAnswer} />
        </div>
      </div>
    </div>
  );
}
