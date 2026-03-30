'use client';

import { EXAM_BOARDS } from '@/data/exam-boards';
import { BoardCard } from '@/components/home/BoardCard';
import { Navbar } from '@/components/layout/Navbar';
import { ChatPanel } from '@/components/layout/ChatPanel';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex min-h-[calc(100vh-56px)]">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent m-0">
              Choose Your Exam Board
            </h1>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base">
              Select your GCSE examination board to get started
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
            {Object.entries(EXAM_BOARDS).map(([name, cfg]) => (
              <BoardCard key={name} name={name} board={cfg} />
            ))}
          </div>
        </div>
        <ChatPanel />
      </div>
    </div>
  );
}
