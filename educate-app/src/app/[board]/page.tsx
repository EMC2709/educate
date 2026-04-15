'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { Navbar } from '@/components/layout/Navbar';
import { SubjectCard } from '@/components/subjects/SubjectCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SubjectsPage({ params }: { params: Promise<{ board: string }> }) {
  const { board: boardName } = use(params);
  const board = EXAM_BOARDS[boardName];
  const [filter, setFilter] = useState('');

  if (!board) notFound();

  const filtered = board.subjects.filter(s => s.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen">
      <Navbar board={boardName} />
      <div className="flex min-h-[calc(100vh-56px)]">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-6">&#8592; Back</Button>
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="rounded-lg px-3.5 py-1.5 text-base font-extrabold border text-white"
                style={{ backgroundColor: board.color, borderColor: board.accent }}
              >
                {board.logo}
              </div>
              <h2 className="m-0 text-2xl sm:text-3xl font-bold text-white">Select a Subject</h2>
            </div>
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter subjects..."
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm w-full sm:w-72 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(subj => (
              <SubjectCard
                key={subj}
                subject={subj}
                board={boardName}
                boardColor={board.color}
                boardAccent={board.accent}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
