'use client';

interface Props {
  done: number;
  total: number;
  label?: string;
}

export function SessionProgress({ done, total, label }: Props) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-3 flex items-center gap-4">
      {label && <span className="text-neutral-400 text-sm font-medium shrink-0">{label}</span>}
      <div className="flex-1 bg-neutral-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-white shrink-0">
        {done}<span className="text-neutral-500">/{total}</span>
      </span>
      <span className="text-xs text-neutral-500 shrink-0">{pct}%</span>
    </div>
  );
}
