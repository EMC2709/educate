'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { getLevelTitle, levelProgress } from '@/lib/xp-client';
import { getRank } from '@/lib/ranks';
import { getBanner, RARITY_COLORS } from '@/lib/banners';
import { getStreakData } from '@/lib/streak';
import { RankEmblem } from '@/components/ui/RankEmblem';

interface Profile {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  title: string;
  currentLevelXP: number;
  nextLevelXP: number;
  role: string;
}

interface QuizResult {
  id: string;
  subject: string | null;
  topic: string | null;
  score: number | null;
  total: number | null;
  created_at: string;
}

interface MarketplaceData {
  coins: number;
  activeBannerId: string | null;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function pct(score: number | null, total: number | null) {
  if (!total || total === 0) return null;
  return Math.round(((score ?? 0) / total) * 100);
}

function AccBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [market, setMarket] = useState<MarketplaceData>({ coins: 0, activeBannerId: null });
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try { setStreak(getStreakData().currentStreak); } catch {}
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/quiz-history').then(r => r.json()),
      fetch('/api/marketplace').then(r => r.json()).catch(() => ({ coins: 0, activeBannerId: null })),
    ]).then(([p, h, m]) => {
      setProfile(p);
      setResults((h.results ?? []).slice(0, 50));
      setMarket({ coins: m.coins ?? 0, activeBannerId: m.activeBannerId ?? null });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ background: '#0a0a0a' }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen" style={{ background: '#0a0a0a' }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-neutral-400 mb-4">Sign in to view your profile.</p>
            <button onClick={() => router.push('/login')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold cursor-pointer border-0">Sign In</button>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  const initials = profile.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const rank = getRank(profile.xp);
  const activeBanner = getBanner(market.activeBannerId);
  const lp = levelProgress(profile.xp);
  const progressPct = lp.nextLevelXP > lp.currentLevelXP
    ? Math.round(((profile.xp - lp.currentLevelXP) / (lp.nextLevelXP - lp.currentLevelXP)) * 100)
    : 100;

  // Overall accuracy
  const totalCorrect = results.reduce((s, r) => s + (r.score ?? 0), 0);
  const totalQs = results.reduce((s, r) => s + (r.total ?? 0), 0);
  const overallAcc = totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : null;

  // Per-subject accuracy
  const subjectMap: Record<string, { correct: number; total: number }> = {};
  for (const r of results) {
    if (!r.subject || !r.total) continue;
    if (!subjectMap[r.subject]) subjectMap[r.subject] = { correct: 0, total: 0 };
    subjectMap[r.subject].correct += r.score ?? 0;
    subjectMap[r.subject].total += r.total;
  }
  const subjectStats = Object.entries(subjectMap)
    .map(([subject, v]) => ({ subject, acc: Math.round((v.correct / v.total) * 100) }))
    .sort((a, b) => b.acc - a.acc);

  // Last active
  const lastActive = results.length > 0 ? relativeTime(results[0].created_at) : 'Never';

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a0a' }}>
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">

          {/* Back */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white no-underline">
            ← Back
          </Link>

          {/* Hero card */}
          <div
            className="rounded-2xl p-6 border"
            style={{
              background: activeBanner
                ? `linear-gradient(rgba(8,8,12,0.72), rgba(8,8,12,0.72)), ${activeBanner.gradient}`
                : '#111',
              borderColor: activeBanner ? `${rank.color}60` : `${rank.color}40`,
              boxShadow: rank.glowColor ? `0 4px 32px ${rank.glowColor}` : undefined,
            }}
          >
            <div className="flex items-start gap-5">
              {/* Large rank emblem */}
              <div className="shrink-0 flex flex-col items-center gap-1">
                <RankEmblem rank={rank} size={72} uid="profile" />
                <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: rank.color }}>
                  {rank.label}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                {/* Avatar + name row */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-black text-white shrink-0 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${rank.color}60, ${rank.color}30)`, border: `2px solid ${rank.color}80` }}
                  >
                    {profile.avatarUrl
                      ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                      : initials}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg font-extrabold text-white m-0 truncate">{profile.displayName}</h1>
                    <p className="text-xs m-0" style={{ color: rank.color }}>{getLevelTitle(profile.level)} · Lv.{profile.level}</p>
                  </div>
                </div>
                {/* Active banner */}
                {activeBanner && (
                  <span
                    className="inline-flex text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: activeBanner.gradient, color: activeBanner.textColor }}
                  >
                    {activeBanner.emoji} {activeBanner.name}
                  </span>
                )}
              </div>
            </div>

            {/* XP progress */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                <span>Level {profile.level} → {profile.level + 1}</span>
                <span>{profile.xp.toLocaleString()} XP</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                <div className="h-2.5 rounded-full transition-all" style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${rank.color}, ${rank.color}88)` }} />
              </div>
              <p className="text-[10px] text-neutral-600 mt-1">{progressPct}% to next level</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total XP',  value: profile.xp.toLocaleString(),              icon: '⚡', color: '#fbbf24' },
              { label: 'Coins',     value: market.coins.toLocaleString(),             icon: '🪙', color: '#f59e0b' },
              { label: 'Streak',    value: `${streak} day${streak !== 1 ? 's' : ''}`, icon: '🔥', color: '#f97316' },
              { label: 'Accuracy',  value: overallAcc != null ? `${overallAcc}%` : '—', icon: '🎯', color: '#4ade80' },
            ].map(stat => (
              <div key={stat.label} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="text-lg font-extrabold m-0" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-neutral-500 m-0 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Last active */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-3 flex items-center justify-between">
            <span className="text-sm text-neutral-400">Last active</span>
            <span className="text-sm font-semibold text-white">{lastActive}</span>
          </div>

          {/* Per-subject accuracy */}
          {subjectStats.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4">Subject Accuracy</h2>
              <div className="space-y-3">
                {subjectStats.slice(0, 8).map(({ subject, acc }) => (
                  <div key={subject}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-300 font-medium truncate">{subject}</span>
                      <span className="font-bold ml-2 shrink-0" style={{ color: acc >= 80 ? '#4ade80' : acc >= 50 ? '#fbbf24' : '#f87171' }}>{acc}%</span>
                    </div>
                    <AccBar value={acc} color={acc >= 80 ? '#4ade80' : acc >= 50 ? '#fbbf24' : '#f87171'} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent sessions */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white m-0">Recent Sessions</h2>
              <span className="text-[10px] text-neutral-500">{results.length} total</span>
            </div>
            {results.length === 0 ? (
              <p className="text-neutral-500 text-sm text-center py-4 m-0">No quiz sessions yet — start learning!</p>
            ) : (
              <ul className="space-y-0 m-0 p-0 list-none">
                {results.slice(0, 10).map(r => {
                  const p = pct(r.score, r.total);
                  return (
                    <li key={r.id} className="flex items-center gap-3 py-2.5 border-b border-neutral-800 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white m-0 truncate">{r.subject ?? 'General'}</p>
                        {r.topic && <p className="text-[11px] text-neutral-500 m-0 truncate">{r.topic}</p>}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {p != null && (
                          <span className="text-sm font-bold" style={{ color: p >= 80 ? '#4ade80' : p >= 50 ? '#fbbf24' : '#f87171' }}>
                            {p}%
                          </span>
                        )}
                        <span className="text-xs text-neutral-500">{relativeTime(r.created_at)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Marketplace CTA */}
          <Link
            href="/marketplace"
            className="block bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 text-center no-underline hover:opacity-90 transition-opacity"
          >
            <p className="text-white font-bold text-sm m-0">🛒 Visit the Banner Marketplace</p>
            <p className="text-indigo-200 text-xs m-0 mt-0.5">You have {market.coins.toLocaleString()} 🪙 coins to spend</p>
          </Link>

        </div>
      </div>
      <MobileNav />
    </div>
  );
}
