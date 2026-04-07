'use client';

import { useState, useEffect } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { ALL_ACHIEVEMENTS, getUnlockedAchievements, type Achievement } from '@/lib/achievements';

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  quiz: { label: 'Quiz', icon: '\u{1F4DD}' },
  streak: { label: 'Streak', icon: '\u{1F525}' },
  xp: { label: 'XP', icon: '\u{2B50}' },
  exploration: { label: 'Exploration', icon: '\u{1F5FA}\uFE0F' },
  special: { label: 'Special', icon: '\u{1F31F}' },
};

export default function AchievementsPage() {
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setUnlocked(getUnlockedAchievements());
  }, []);

  const unlockedIds = new Set(unlocked.map(a => a.id));
  const categories = ['all', ...Object.keys(CATEGORY_LABELS)];

  const filtered = filter === 'all'
    ? ALL_ACHIEVEMENTS
    : ALL_ACHIEVEMENTS.filter(a => a.category === filter);

  const unlockedCount = unlocked.length;
  const totalCount = ALL_ACHIEVEMENTS.length;
  const progressPct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {'\u{1F3C6}'} Achievements
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">
              {unlockedCount} of {totalCount} unlocked
            </p>
          </div>

          {/* Overall progress */}
          <div className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/25 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400 font-bold text-sm">Collection Progress</span>
              <span className="text-amber-400 font-bold">{progressPct}%</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 cursor-pointer transition-all whitespace-nowrap ${
                  filter === cat
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400'
                    : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-700'
                }`}
              >
                {cat === 'all' ? 'All' : `${CATEGORY_LABELS[cat].icon} ${CATEGORY_LABELS[cat].label}`}
              </button>
            ))}
          </div>

          {/* Achievement grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(achievement => {
              const isUnlocked = unlockedIds.has(achievement.id);
              const unlockedData = unlocked.find(a => a.id === achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`border rounded-2xl p-4 flex items-center gap-4 transition-all ${
                    isUnlocked
                      ? 'bg-neutral-900 border-amber-500/30'
                      : 'bg-neutral-950 border-neutral-800 opacity-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      isUnlocked ? 'bg-amber-500/15' : 'bg-neutral-900'
                    }`}
                  >
                    {isUnlocked ? achievement.icon : '\u{1F512}'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold m-0 ${isUnlocked ? 'text-white' : 'text-neutral-600'}`}>
                      {achievement.title}
                    </p>
                    <p className={`text-xs m-0 mt-0.5 ${isUnlocked ? 'text-neutral-400' : 'text-neutral-700'}`}>
                      {achievement.description}
                    </p>
                    {isUnlocked && unlockedData?.unlockedAt && (
                      <p className="text-[10px] text-amber-500/60 m-0 mt-1">
                        Unlocked {new Date(unlockedData.unlockedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                  {isUnlocked && (
                    <span className="text-amber-400 text-lg shrink-0">{'\u2713'}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
