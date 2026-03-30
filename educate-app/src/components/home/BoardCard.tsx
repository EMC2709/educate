'use client';

import Link from 'next/link';
import type { ExamBoard } from '@/types';

export function BoardCard({ name, board }: { name: string; board: ExamBoard }) {
  return (
    <Link
      href={`/${name}`}
      className="block no-underline rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-200 relative overflow-hidden group border-2 hover:-translate-y-1"
      style={{
        backgroundColor: board.color,
        borderColor: `${board.accent}22`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = board.accent;
        e.currentTarget.style.boxShadow = `0 20px 40px ${board.accent}33`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${board.accent}22`;
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full" style={{ backgroundColor: `${board.accent}11` }} />
      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">{board.logo}</div>
      <div className="text-xs sm:text-sm mb-5" style={{ color: board.lightAccent }}>{board.tagline}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs px-2.5 py-1 rounded-lg" style={{ backgroundColor: `${board.accent}33`, color: board.lightAccent }}>
          {board.subjects.length} subjects
        </span>
        <span className="text-xl" style={{ color: board.accent }}>&#8594;</span>
      </div>
    </Link>
  );
}
