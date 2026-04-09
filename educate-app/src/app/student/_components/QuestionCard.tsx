'use client';

export interface Question {
  id: string;
  question_number: string | number;
  question_text: string;
  marks: number;
  topic: string | null;
  has_image: boolean;
  image_desc: string | null;
  subject: string | null;
  exam_type: string | null;
  year: number | null;
  title: string | null;
  drive_file_id: string | null;
}

interface Props {
  question: Question;
  index: number;
  total: number;
  onMarkDone: () => void;
  isDone: boolean;
}

export function QuestionCard({ question, index, total, onMarkDone, isDone }: Props) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
      {/* Question header */}
      <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-neutral-500 text-sm">
            Question {index + 1} of {total}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/15 text-indigo-400 rounded-lg">
            {question.marks} mark{question.marks !== 1 ? 's' : ''}
          </span>
          {question.topic && (
            <span className="text-xs px-2.5 py-1 bg-neutral-800 text-neutral-400 rounded-lg">
              {question.topic}
            </span>
          )}
        </div>
        {question.exam_type && (
          <span className="text-xs text-neutral-600 shrink-0">
            {question.exam_type}
            {question.year ? ` · ${question.year}` : ''}
          </span>
        )}
      </div>

      {/* Question body */}
      <div className="px-6 py-6 space-y-5">
        {/* Image / diagram callout */}
        {question.has_image && question.image_desc && (
          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-4 text-sm text-neutral-300">
            <p className="font-semibold text-neutral-200 mb-1">📊 This question includes a diagram</p>
            <p className="text-neutral-400 leading-relaxed">{question.image_desc}</p>
          </div>
        )}
        {question.has_image && !question.image_desc && (
          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-4 text-sm text-neutral-400">
            📊 This question includes a diagram (refer to your paper copy).
          </div>
        )}

        {/* Question text */}
        <p className="text-white text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
          {question.question_text}
        </p>
      </div>

      {/* Footer actions */}
      <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between gap-3">
        {question.drive_file_id ? (
          <a
            href={`/api/download-paper?fileId=${question.drive_file_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-500 hover:text-neutral-300 no-underline transition-colors"
          >
            View original paper →
          </a>
        ) : (
          <span className="text-xs text-neutral-700">
            {question.title ?? 'Practice question'}
          </span>
        )}

        <button
          onClick={onMarkDone}
          disabled={isDone}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border-0 ${
            isDone
              ? 'bg-emerald-500/10 text-emerald-400 cursor-default'
              : 'bg-emerald-500 hover:bg-emerald-400 text-white'
          }`}
        >
          {isDone ? '✓ Done' : 'Mark as Done'}
        </button>
      </div>
    </div>
  );
}
