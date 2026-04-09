'use client';

import Link from 'next/link';

interface Props {
  done: number;
  total: number;
  mode: 'assignment' | 'free';
  assignmentId?: string;
  onSaveHistory?: () => void;
  saving?: boolean;
  saved?: boolean;
}

export function CompletionCard({ done, total, mode, assignmentId, onSaveHistory, saving, saved }: Props) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-6">
      <div className="text-5xl">🎉</div>
      <div>
        <h2 className="text-2xl font-extrabold text-white mb-2">
          {pct === 100 ? 'Session complete!' : 'Good effort!'}
        </h2>
        <p className="text-neutral-400">
          You answered{' '}
          <span className="text-white font-semibold">{done}</span> of{' '}
          <span className="text-white font-semibold">{total}</span> questions.
        </p>
      </div>

      {/* Score ring */}
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-neutral-800" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="16" fill="none"
              stroke={pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#6366f1'}
              strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-extrabold text-white">{pct}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/student"
          className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-xl no-underline transition-colors"
        >
          Back to hub
        </Link>

        {mode === 'free' && onSaveHistory && (
          <button
            onClick={onSaveHistory}
            disabled={saving || saved}
            className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer border-0 ${
              saved
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-indigo-500 hover:bg-indigo-400 text-white'
            }`}
          >
            {saved ? '✓ Saved to history' : saving ? 'Saving...' : 'Save to history'}
          </button>
        )}

        {mode === 'assignment' && assignmentId && (
          <Link
            href={`/student/practice/${assignmentId}`}
            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl no-underline transition-colors"
          >
            Practice again
          </Link>
        )}
      </div>
    </div>
  );
}
