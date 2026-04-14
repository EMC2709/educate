'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { getLevelTitle } from '@/lib/xp-client';
import { getRank } from '@/lib/ranks';
import { getBanner } from '@/lib/banners';
import { RankEmblem } from '@/components/ui/RankEmblem';

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  active_banner_id?: string | null;
}

export default function LeaderboardPage() {
  const { isSignedIn } = useUser();
  const [tab, setTab] = useState<'global' | 'friends'>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?type=${tab}`)
      .then(r => r.json())
      .then(data => {
        setEntries(data.entries ?? []);
        setCurrentUserId(data.currentUserId ?? null);
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const medalColors = ['#fbbf24', '#9ca3af', '#d97706'];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Game Zone</Link>

        <div className="text-center mt-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{'\u{1F3C6}'} Leaderboard</h1>
          <p className="text-neutral-500 text-sm m-0">
            Banners from the{' '}
            <Link href="/marketplace" className="text-amber-400 hover:text-amber-300 no-underline font-semibold">
              🛒 Marketplace
            </Link>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['global', 'friends'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border-2 bg-transparent cursor-pointer"
              style={
                tab === t
                  ? { borderColor: '#f59e0b', backgroundColor: '#f59e0b22', color: '#f59e0b' }
                  : { borderColor: '#2a2a2a', color: '#6b7280' }
              }
            >
              {t === 'global' ? 'Global' : 'Friends'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-2 border-neutral-600 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
            <p className="text-neutral-400">
              {tab === 'friends' ? 'Add some friends to see the friends leaderboard!' : 'No one on the leaderboard yet. Be the first!'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {entries.map((entry, i) => {
              const isMe = entry.user_id === currentUserId;
              const rank = getRank(entry.xp);
              const banner = getBanner(entry.active_banner_id);
              return (
                <div
                  key={entry.user_id}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all border"
                  style={
                    isMe
                      ? { backgroundColor: '#451a0322', borderColor: '#f59e0b50' }
                      : banner
                        ? { backgroundColor: '#111', borderColor: '#2a2a2a', boxShadow: `0 0 12px ${banner.gradient.includes('#ef4444') ? '#ef444420' : '#6366f120'}` }
                        : { backgroundColor: '#111', borderColor: '#1f1f1f' }
                  }
                >
                  {/* Position */}
                  <div className="w-8 text-center shrink-0">
                    {i < 3 ? (
                      <span className="text-xl" style={{ color: medalColors[i] }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span className="text-neutral-500 text-sm font-bold">#{i + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0"
                    style={{ background: banner ? banner.gradient : '#404040' }}
                  >
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      entry.display_name.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  {/* Name, banner, title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate">
                        {entry.display_name}
                        {isMe && <span className="text-amber-400 text-xs ml-1.5">(you)</span>}
                      </span>
                      {/* Banner pill */}
                      {banner && (
                        <span
                          className="inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: banner.gradient, color: banner.textColor }}
                        >
                          {banner.emoji} {banner.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 m-0">
                      Lv.{entry.level} · {getLevelTitle(entry.level)}
                    </p>
                  </div>

                  {/* Rank emblem */}
                  <div className="flex flex-col items-center shrink-0 min-w-[52px] gap-0.5">
                    <RankEmblem rank={rank} size={38} uid={i} />
                    <span className="text-[8px] font-bold leading-none" style={{ color: rank.color }}>
                      {rank.label}
                    </span>
                  </div>

                  {/* XP */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-amber-400 m-0">{entry.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-neutral-500 m-0">XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
