'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { SUBJECT_ICONS } from '@/data/subject-icons';
import { Q_TYPES } from '@/data/question-types';
import { PAST_PAPERS_INDEX } from '@/data/past-papers-index';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { CombinedScienceHub } from '@/components/combined-science/CombinedScienceHub';

export default function QuestionTypePage({ params }: { params: Promise<{ board: string; subject: string }> }) {
  const { board: boardName, subject: rawSubject } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const board = EXAM_BOARDS[boardName];

  if (!board || !board.subjects.includes(subject)) notFound();

  // ── Combined Science: render the three-panel hub instead of standard UI ──
  if (subject === 'Combined Science') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar board={boardName} subject={subject} />
        <CombinedScienceHub board={boardName} />
      </div>
    );
  }

  const hasPastPapers = !!PAST_PAPERS_INDEX[subject]?.[boardName];
  const isEnglishLit = subject === 'English Literature';

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

            {/* Question type cards + Quotes Bank (English Lit only) in 2-col grid */}
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

              {isEnglishLit && (
                <Link href="/quotes" className="no-underline">
                  <div
                    className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-200 text-center hover:scale-[1.02] min-h-[140px] flex flex-col items-center justify-center"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#34d399';
                      e.currentTarget.style.backgroundColor = '#34d39918';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#2a2a2a';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                  >
                    <div className="text-3xl sm:text-4xl mb-2.5">💬</div>
                    <div className="font-bold text-base sm:text-lg mb-1.5 text-white">Quotes Bank</div>
                    <div
                      className="text-[11px] px-2.5 py-0.5 rounded-lg inline-block mb-2.5"
                      style={{ color: '#34d399', backgroundColor: '#34d39922' }}
                    >
                      75 key quotes
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed m-0">Macbeth, A Christmas Carol, An Inspector Calls &amp; Poetry — with analysis</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Past Papers — full width below the grid */}
            {hasPastPapers && (
              <Link
                href={`/${boardName}/${encodeURIComponent(subject)}/papers`}
                className="no-underline block mt-3 sm:mt-4"
              >
                <div
                  className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-200 text-center hover:scale-[1.02] flex flex-col items-center justify-center"
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.backgroundColor = '#8b5cf618';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#2a2a2a';
                    e.currentTarget.style.backgroundColor = '';
                  }}
                >
                  <div className="text-3xl sm:text-4xl mb-2.5">&#128196;</div>
                  <div className="font-bold text-base sm:text-lg mb-1.5 text-white">Official Past Papers</div>
                  <div
                    className="text-[11px] px-2.5 py-0.5 rounded-lg inline-block mb-2.5"
                    style={{ color: '#8b5cf6', backgroundColor: '#8b5cf622' }}
                  >
                    Real exam papers
                  </div>
                  <p className="text-neutral-500 text-xs leading-relaxed m-0">Download Paper 1, 2 &amp; 3 from the official exam board</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
