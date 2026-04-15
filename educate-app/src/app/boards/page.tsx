'use client';

import { EXAM_BOARDS } from '@/data/exam-boards';
import { BoardCard } from '@/components/home/BoardCard';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { ChatPanel } from '@/components/layout/ChatPanel';

export default function BoardsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex min-h-screen">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent m-0">
                Exam Boards
              </h1>
              <p className="text-neutral-500 mt-2 text-sm sm:text-base">
                Browse all GCSE examination boards and their subjects
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {Object.entries(EXAM_BOARDS).map(([name, cfg]) => (
                <BoardCard key={name} name={name} board={cfg} />
              ))}
            </div>
          </div>
        </div>
        
      </div>
      <MobileNav />
    </div>
  );
}
