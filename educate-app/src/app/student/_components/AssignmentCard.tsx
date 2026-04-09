'use client';

import Link from 'next/link';

export interface AssignmentProgress {
  questions_done: number;
  questions_total: number;
  score: number;
  completed: boolean;
  started_at: string | null;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string | null;
  topic: string | null;
  exam_type: string | null;
  due_date: string | null;
  class_id: string;
  class_name?: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-500/20 text-blue-300',
  'English Language': 'bg-purple-500/20 text-purple-300',
  'English Literature': 'bg-violet-500/20 text-violet-300',
  Biology: 'bg-emerald-500/20 text-emerald-300',
  Chemistry: 'bg-cyan-500/20 text-cyan-300',
  Physics: 'bg-sky-500/20 text-sky-300',
  'Combined Science': 'bg-teal-500/20 text-teal-300',
  History: 'bg-amber-500/20 text-amber-300',
  Geography: 'bg-lime-500/20 text-lime-300',
  'Computer Science': 'bg-indigo-500/20 text-indigo-300',
};

function getSubjectColor(subject: string | null): string {
  if (!subject) return 'bg-neutral-700/50 text-neutral-400';
  return SUBJECT_COLORS[subject] ?? 'bg-indigo-500/20 text-indigo-300';
}

function getDueDateColor(dueDate: string | null): { color: string; label: string } {
  if (!dueDate) return { color: 'text-neutral-500', label: 'No due date' };
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const formatted = due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (diffDays < 0) return { color: 'text-rose-400', label: `Overdue — ${formatted}` };
  if (diffDays < 2) return { color: 'text-rose-400', label: `Due ${formatted}` };
  if (diffDays < 7) return { color: 'text-amber-400', label: `Due ${formatted}` };
  return { color: 'text-emerald-400', label: `Due ${formatted}` };
}

interface Props {
  assignment: Assignment;
  progress: AssignmentProgress | null;
}

export function AssignmentCard({ assignment, progress }: Props) {
  const done = progress?.questions_done ?? 0;
  const total = progress?.questions_total ?? 10;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const started = done > 0 || !!progress?.started_at;
  const completed = progress?.completed ?? false;
  const { color: dueDateColor, label: dueDateLabel } = getDueDateColor(assignment.due_date);

  return (
    <div className="bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-snug truncate">{assignment.title}</h3>
          {assignment.class_name && (
            <p className="text-neutral-500 text-xs mt-0.5 truncate">{assignment.class_name}</p>
          )}
        </div>
        {assignment.subject && (
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg shrink-0 ${getSubjectColor(assignment.subject)}`}>
            {assignment.subject}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs">
        <span className={dueDateColor}>{dueDateLabel}</span>
        {assignment.topic && (
          <span className="text-neutral-600 truncate max-w-[120px]">{assignment.topic}</span>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-neutral-500">
            {completed ? 'Completed' : `${done} / ${total} questions`}
          </span>
          <span className="text-xs font-semibold text-neutral-400">{pct}%</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completed ? 'bg-emerald-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Action button */}
      <Link
        href={`/student/practice/${assignment.id}`}
        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold no-underline transition-colors ${
          completed
            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
            : started
            ? 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 border border-indigo-500/30'
            : 'bg-indigo-500 text-white hover:bg-indigo-400'
        }`}
      >
        {completed ? 'Review' : started ? 'Continue' : 'Start'}
      </Link>
    </div>
  );
}
