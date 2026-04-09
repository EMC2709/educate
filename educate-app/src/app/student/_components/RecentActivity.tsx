'use client';

interface QuizResult {
  id: string;
  subject: string | null;
  topic: string | null;
  score: number | null;
  total: number | null;
  created_at: string;
}

interface Props {
  results: QuizResult[];
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function scoreColor(score: number | null, total: number | null): string {
  if (score == null || total == null || total === 0) return 'text-neutral-500';
  const pct = score / total;
  if (pct >= 0.8) return 'text-emerald-400';
  if (pct >= 0.5) return 'text-amber-400';
  return 'text-rose-400';
}

export function RecentActivity({ results }: Props) {
  if (results.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">
        No recent activity yet. Complete a practice session to see results here.
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
      {results.map((r, idx) => {
        const isLast = idx === results.length - 1;
        return (
          <div
            key={r.id}
            className={`flex items-center justify-between px-5 py-4 ${!isLast ? 'border-b border-neutral-800' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">
                {r.subject ?? 'Practice session'}
              </div>
              {r.topic && (
                <div className="text-neutral-500 text-xs mt-0.5 truncate">{r.topic}</div>
              )}
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-4">
              {r.score != null && r.total != null && (
                <span className={`text-sm font-semibold ${scoreColor(r.score, r.total)}`}>
                  {r.score}/{r.total}
                </span>
              )}
              <span className="text-neutral-600 text-xs">{formatRelativeTime(r.created_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
