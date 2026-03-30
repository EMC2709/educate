'use client';

import Link from 'next/link';
import { SUBJECT_ICONS } from '@/data/subject-icons';
import { SUBTOPIC_BANK } from '@/data/subtopic-bank';
import { QUESTION_BANK } from '@/data/question-bank';

interface SubjectCardProps {
  subject: string;
  board: string;
  boardColor: string;
  boardAccent: string;
}

export function SubjectCard({ subject, board, boardColor, boardAccent }: SubjectCardProps) {
  const hasPregen = !!(SUBTOPIC_BANK?.[subject] || QUESTION_BANK?.[subject]);

  return (
    <Link
      href={`/${board}/${encodeURIComponent(subject)}`}
      className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-3 no-underline text-white transition-all duration-150 hover:border-opacity-100 group min-h-[48px]"
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = boardColor;
        e.currentTarget.style.borderColor = boardAccent;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.borderColor = '';
      }}
    >
      <span className="text-lg w-6 text-center flex-shrink-0">{SUBJECT_ICONS[subject] || '&#128218;'}</span>
      <span className="text-xs sm:text-sm font-medium flex-1">{subject}</span>
      {hasPregen && <span className="text-[9px] text-emerald-400">&#9889;</span>}
    </Link>
  );
}
