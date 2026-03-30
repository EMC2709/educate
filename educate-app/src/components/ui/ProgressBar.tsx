'use client';

export function ProgressBar({ value, color = 'bg-emerald-500' }: { value: number; color?: string }) {
  return (
    <div className="h-1 rounded-full bg-neutral-800 overflow-hidden">
      <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${value}%` }} />
    </div>
  );
}
