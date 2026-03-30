'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { SUBJECT_ICONS } from '@/data/subject-icons';
import { Q_TYPES } from '@/data/question-types';
import { Navbar } from '@/components/layout/Navbar';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { Button } from '@/components/ui/Button';

export default function QuestionTypePage({ params }: { params: Promise<{ board: string; subject: string }> }) {
  const { board: boardName, subject: rawSubject } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const board = EXAM_BOARDS[boardName];

  if (!board || !board.subjects.includes(subject)) notFound();

  return (
    <div className="min-h-screen">
      <Navbar board={boardName} subject={subject} />
      <div className="flex min-h-[calc(100vh-56px)]">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <Link href={`/${boardName}`}>
              <Button variant="ghost" className="mb-8">&#8592; Back</Button>
            </Link>

            <div className="text-center mb-8 sm:mb-10">
              <span className="text-3xl sm:text-4xl">{SUBJECT_ICONS[subject] || '&#128218;'}</span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-1">{subject}</h2>
              <span className="text-neutral-500 text-sm">{boardName}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {Q_TYPES.map(opt => (
                <Link
                  key={opt.type}
                  href={`/${boardName}/${encodeURIComponent(subject)}/topics?type=${opt.type}`}
                  className="no-underline"
                >
                  <div
                    className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-200 text-center hover:scale-[1.02] min-h-[140px] flex flex-col items-center justify-center"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = opt.color;
                      e.currentTarget.style.backgroundColor = `${opt.color}18`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#2a2a2a';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                  >
                    <div className="text-3xl sm:text-4xl mb-2.5">{opt.icon}</div>
                    <div className="font-bold text-base sm:text-lg mb-1.5 text-white">{opt.label}</div>
                    <div
                      className="text-[11px] px-2.5 py-0.5 rounded-lg inline-block mb-2.5"
                      style={{ color: opt.color, backgroundColor: `${opt.color}22` }}
                    >
                      {opt.marks}
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed m-0">{opt.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <ChatPanel subject={subject} board={boardName} />
      </div>
    </div>
  );
}
