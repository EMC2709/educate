'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  xp: number;
  level: number;
}

interface Props {
  currentUserId: string | null;
}

const MEDALS = ['🥇', '🥈', '🥉'];
const RANK_COLOURS = [
  'from-amber-500/20 to-yellow-500/5 border-amber-500/30',
  'from-neutral-400/15 to-neutral-500/5 border-neutral-500/25',
  'from-orange-500/15 to-amber-600/5 border-orange-500/25',
];

export function ClassLeaderboard({ currentUserId }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'class' | 'global'>('class');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?type=${tab}`)
      .then(r => r.json())
      .then(d => setEntries(d.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Leaderboard</h2>
        <div className="flex bg-neutral-900 border border-neutral-800 rounded-xl p-1 gap-1">
          {(['class', 'global'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer border-none ${
                tab === t
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-neutral-500 hover:text-neutral-300 bg-transparent'
              }`}
            >
              {t === 'class' ? 'My Class' : 'Global'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">{tab === 'class' ? '🏫' : '🌍'}</p>
            <p className="text-neutral-400 text-sm">
              {tab === 'class'
                ? 'No classmates yet — your teacher needs to add students to your class.'
                : 'No entries yet.'}
            </p>
          </div>
        ) : (
          <div>
            {/* Top 3 podium */}
            {entries.slice(0, 3).map((e, i) => {
              const isMe = e.user_id === currentUserId;
              return (
                <div
                  key={e.user_id}
                  className={`flex items-center gap-4 px-5 py-4 bg-gradient-to-r ${RANK_COLOURS[i]} border-b border-neutral-800 last:border-b-0 ${isMe ? 'ring-1 ring-inset ring-indigo-500/40' : ''}`}
                >
                  <span className="text-2xl w-8 text-center">{MEDALS[i]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isMe ? 'text-indigo-300' : 'text-white'}`}>
                      {e.display_name}{isMe ? ' (you)' : ''}
                    </p>
                    <p className="text-xs text-neutral-500">Level {e.level}</p>
                  </div>
                  <span className="text-amber-400 font-bold text-sm">{e.xp.toLocaleString()} XP</span>
                </div>
              );
            })}

            {/* Rest of the list */}
            {entries.slice(3).map((e, i) => {
              const isMe = e.user_id === currentUserId;
              const rank = i + 4;
              return (
                <div
                  key={e.user_id}
                  className={`flex items-center gap-4 px-5 py-3 border-b border-neutral-800/60 last:border-b-0 hover:bg-neutral-800/40 transition-colors ${isMe ? 'bg-indigo-500/5' : ''}`}
                >
                  <span className="text-neutral-600 font-mono text-sm w-8 text-center">{rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${isMe ? 'text-indigo-300 font-semibold' : 'text-neutral-300'}`}>
                      {e.display_name}{isMe ? ' (you)' : ''}
                    </p>
                    <p className="text-xs text-neutral-600">Level {e.level}</p>
                  </div>
                  <span className="text-neutral-400 text-sm">{e.xp.toLocaleString()} XP</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
