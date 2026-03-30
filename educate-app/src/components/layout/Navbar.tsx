'use client';

import Link from 'next/link';
import { useChat } from '@/context/ChatContext';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  board?: string | null;
  subject?: string | null;
  score?: { correct: number; total: number } | null;
  loadingSource?: string | null;
  questionType?: string | null;
}

export function Navbar({ board, subject, score, loadingSource, questionType }: NavbarProps) {
  const { chatOpen, setChatOpen } = useChat();

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-lg flex items-center justify-center text-sm font-bold text-white">
          E
        </div>
        <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">Educate</span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        {board && (
          <span className="text-xs text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full max-w-[200px] sm:max-w-[300px] truncate hidden sm:inline-block">
            {board}{subject ? ` · ${subject}` : ''}
          </span>
        )}

        {loadingSource === 'bank' && (
          <span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
            &#9889; Instant
          </span>
        )}
        {loadingSource === 'api' && (
          <span className="text-[11px] text-violet-400 bg-violet-400/10 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
            &#10022; AI Generated
          </span>
        )}

        {score && score.total > 0 && questionType !== 'flashcard' && (
          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
            {score.correct}/{score.total}
          </span>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`${chatOpen ? 'bg-indigo-500' : 'bg-neutral-800'} border-none rounded-full px-3 sm:px-4 py-1.5 text-white cursor-pointer text-xs sm:text-sm flex items-center gap-1.5 transition-colors`}
        >
          <span className="text-base">&#128172;</span>
          <span className="hidden sm:inline">AI Tutor</span>
        </button>

        <UserMenu />
      </div>
    </nav>
  );
}
