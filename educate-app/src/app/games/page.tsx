'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { levelProgress, getLevelTitle } from '@/lib/xp-client';
import { getRank, rankProgress, ALL_RANKS } from '@/lib/ranks';

interface Profile {
  displayName: string;
  xp: number;
  level: number;
  title: string;
  progress: number;
  nextLevelXP: number;
  currentLevelXP: number;
}

interface Stats {
  quizCount: number;
  perfectCount: number;
  xp: number;
}

// ── Rank Modal ────────────────────────────────────────────────────────────────
function RankModal({ profile, stats, onClose }: { profile: Profile; stats: Stats | null; onClose: () => void }) {
  const rp = rankProgress(profile.xp);
  const currentRankIdx = ALL_RANKS.findIndex(r => r.label === rp.rank.label);
  const perfectPct = stats && stats.quizCount > 0
    ? Math.round((stats.perfectCount / stats.quizCount) * 100)
    : 0;

  // Group ranks by tier for the ladder
  const tiers = [
    'Copper', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Champion',
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg bg-neutral-950 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div
          className="p-5 sm:p-6 flex items-center gap-4 border-b border-neutral-800 shrink-0"
          style={{ background: `linear-gradient(135deg, ${rp.rank.glowColor}, rgba(0,0,0,0))` }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: rp.rank.glowColor, border: `2px solid ${rp.rank.color}66` }}
          >
            {rp.rank.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest m-0" style={{ color: rp.rank.color }}>
              Current Rank
            </p>
            <p className="text-2xl font-black text-white m-0 leading-tight">{rp.rank.label}</p>
            {rp.nextRank && (
              <p className="text-xs text-neutral-500 m-0">
                {rp.xpIntoRank.toLocaleString()} / {rp.xpNeeded.toLocaleString()} XP to{' '}
                <span style={{ color: rp.nextRank.color }}>{rp.nextRank.label}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 border-none text-neutral-400 cursor-pointer flex items-center justify-center text-lg hover:bg-neutral-700 transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Stats row */}
        <div className="px-5 sm:px-6 py-4 grid grid-cols-3 gap-3 border-b border-neutral-800 shrink-0">
          {[
            { label: 'Total XP', value: profile.xp.toLocaleString(), color: '#f59e0b' },
            { label: 'Quizzes', value: (stats?.quizCount ?? 0).toString(), color: '#6366f1' },
            { label: 'Perfect %', value: `${perfectPct}%`, color: '#10b981' },
          ].map(s => (
            <div key={s.label} className="bg-neutral-900 rounded-xl p-3 text-center border border-neutral-800">
              <p className="text-xl font-black m-0" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-neutral-500 m-0 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Rank progress bar */}
        {rp.nextRank && (
          <div className="px-5 sm:px-6 pt-4 pb-2 shrink-0">
            <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
              <span style={{ color: rp.rank.color }}>{rp.rank.label}</span>
              <span style={{ color: rp.nextRank.color }}>{rp.nextRank.label}</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${rp.progressPct}%`,
                  background: `linear-gradient(90deg, ${rp.rank.color}, ${rp.nextRank.color})`,
                }}
              />
            </div>
            <p className="text-[10px] text-neutral-600 text-right mt-1 m-0">{rp.progressPct}% complete</p>
          </div>
        )}

        {/* Full rank ladder — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-1.5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">All Ranks</p>
          {tiers.map(tier => {
            // Get all ranks in this tier
            const tierRanks = ALL_RANKS.filter(r => r.tier === tier);
            // Collapse Champion (single entry)
            if (tierRanks.length === 1) {
              const r = tierRanks[0];
              const rankIdx = ALL_RANKS.findIndex(x => x.label === r.label);
              const isCurrentRank = rankIdx === currentRankIdx;
              const isUnlocked = profile.xp >= r.minXP;
              return (
                <div
                  key={r.label}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                  style={{
                    borderColor: isCurrentRank ? r.color : isUnlocked ? r.color + '33' : '#1f1f1f',
                    backgroundColor: isCurrentRank ? r.glowColor : 'transparent',
                    boxShadow: isCurrentRank ? `0 0 16px ${r.glowColor}` : 'none',
                  }}
                >
                  <span className="text-2xl">{isUnlocked ? r.icon : '🔒'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold m-0" style={{ color: isUnlocked ? r.color : '#3f3f3f' }}>
                      {r.label}
                      {isCurrentRank && <span className="ml-2 text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded-full text-white">YOU</span>}
                    </p>
                    <p className="text-[10px] text-neutral-600 m-0">{r.minXP.toLocaleString()} XP</p>
                  </div>
                  {isUnlocked && <span className="text-green-400 text-sm">✓</span>}
                </div>
              );
            }

            // For multi-division tiers, show tier header + collapsed divisions
            const tierUnlocked = tierRanks.some(r => profile.xp >= r.minXP);
            const sampleRank = tierRanks[0];
            const hasCurrent = tierRanks.some((_, i) => ALL_RANKS.findIndex(x => x.label === tierRanks[i].label) === currentRankIdx);

            return (
              <div key={tier} className="rounded-xl overflow-hidden border" style={{ borderColor: hasCurrent ? sampleRank.color + '55' : '#1f1f1f' }}>
                {/* Tier header */}
                <div
                  className="px-3 py-2 flex items-center gap-2"
                  style={{ background: tierUnlocked ? sampleRank.glowColor : 'rgba(20,20,20,0.8)' }}
                >
                  <span className="text-lg">{tierUnlocked ? sampleRank.icon : '🔒'}</span>
                  <span
                    className="text-sm font-black"
                    style={{ color: tierUnlocked ? sampleRank.color : '#3f3f3f' }}
                  >
                    {tier}
                  </span>
                  <span className="text-[10px] text-neutral-600 ml-auto">
                    {tierRanks[0].minXP.toLocaleString()} – {tierRanks[4].minXP.toLocaleString()} XP
                  </span>
                </div>

                {/* Divisions (V → I) */}
                <div className="divide-y divide-neutral-800/50">
                  {tierRanks.map(r => {
                    const rankIdx = ALL_RANKS.findIndex(x => x.label === r.label);
                    const isCurrentRank = rankIdx === currentRankIdx;
                    const isUnlocked = profile.xp >= r.minXP;

                    // Progress within this division
                    const nextR = ALL_RANKS[rankIdx + 1];
                    const divProgress = isUnlocked
                      ? nextR
                        ? Math.min(100, Math.round(((profile.xp - r.minXP) / (nextR.minXP - r.minXP)) * 100))
                        : 100
                      : 0;

                    return (
                      <div
                        key={r.label}
                        className="flex items-center gap-3 px-3 py-2"
                        style={{ backgroundColor: isCurrentRank ? r.glowColor : 'transparent' }}
                      >
                        <span className="text-xs font-bold w-6 text-center" style={{ color: isUnlocked ? r.color : '#2a2a2a' }}>
                          {r.division}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold" style={{ color: isUnlocked ? r.color : '#2a2a2a' }}>
                              {r.label}
                            </span>
                            {isCurrentRank && (
                              <span className="text-[9px] font-bold bg-white/15 text-white px-1.5 py-0.5 rounded-full">YOU</span>
                            )}
                            <span className="text-[10px] text-neutral-700 ml-auto">{r.minXP.toLocaleString()} XP</span>
                          </div>
                          <div className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${divProgress}%`,
                                backgroundColor: r.color,
                              }}
                            />
                          </div>
                        </div>
                        {isUnlocked && !isCurrentRank && <span className="text-green-400 text-xs">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GamesHubPage() {
  const { isSignedIn } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showRankModal, setShowRankModal] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/profile').then(r => r.json()).then(setProfile).catch(() => {});
      fetch('/api/achievements').then(r => r.json()).then(setStats).catch(() => {});
    }
  }, [isSignedIn]);

  const cards = [
    {
      href: '/games/leaderboard',
      icon: '\u{1F3C6}',
      title: 'Leaderboard',
      desc: 'See who\'s top of the class. Global and friends rankings.',
      color: '#f59e0b',
    },
    {
      href: '/games/friends',
      icon: '\u{1F465}',
      title: 'Friends',
      desc: 'Add friends and compete on the leaderboard.',
      color: '#6366f1',
    },
    {
      href: '/games/tic-tac-toe',
      icon: '\u{274E}',
      title: 'Noughts & Crosses',
      desc: 'Answer multiple-choice questions to claim squares. Local or online.',
      color: '#10b981',
    },
    {
      href: '/games/battleships',
      icon: '\u{1F6A2}',
      title: 'Battleships',
      desc: 'Sink the enemy fleet! Answer questions to fire your shots.',
      color: '#3b82f6',
    },
    {
      href: '/games/relay',
      icon: '\u{1F3C3}',
      title: 'Running Relay',
      desc: 'Race to the finish line — every correct answer moves you closer.',
      color: '#f43f5e',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Game Zone</h1>
            <p className="text-neutral-500 text-sm">Earn XP, level up, and compete with friends</p>
          </div>

          {/* Rank Card — clickable */}
          {profile && (() => {
            const rp = rankProgress(profile.xp);
            return (
              <button
                onClick={() => setShowRankModal(true)}
                className="w-full text-left rounded-2xl p-5 sm:p-6 mb-4 border cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] bg-transparent"
                style={{
                  background: `linear-gradient(135deg, ${rp.rank.glowColor}, rgba(0,0,0,0.6))`,
                  borderColor: rp.rank.color + '55',
                  boxShadow: `0 0 32px ${rp.rank.glowColor}`,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                    style={{ background: rp.rank.glowColor, border: `2px solid ${rp.rank.color}55` }}
                  >
                    {rp.rank.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest m-0" style={{ color: rp.rank.color }}>
                      Current Rank · tap to view all
                    </p>
                    <p className="text-2xl font-black text-white m-0">{rp.rank.label}</p>
                    <p className="text-xs text-neutral-400 m-0">Level {profile.level} · {profile.xp.toLocaleString()} XP</p>
                  </div>
                  {rp.nextRank && (
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-neutral-500 m-0">Next rank</p>
                      <p className="text-sm font-bold m-0" style={{ color: rp.nextRank.color }}>
                        {rp.nextRank.icon} {rp.nextRank.label}
                      </p>
                    </div>
                  )}
                </div>

                {rp.nextRank ? (
                  <>
                    <div className="w-full bg-neutral-900/70 rounded-full h-2.5 overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${rp.progressPct}%`,
                          background: `linear-gradient(90deg, ${rp.rank.color}, ${rp.nextRank.color})`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-neutral-500 text-right m-0">
                      {rp.xpIntoRank.toLocaleString()} / {rp.xpNeeded.toLocaleString()} XP to {rp.nextRank.label}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-center m-0" style={{ color: rp.rank.color }}>
                    👑 Maximum rank achieved
                  </p>
                )}
              </button>
            );
          })()}

          {/* Level bar (compact) */}
          {profile && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 mb-8 flex items-center gap-3">
              <span className="text-amber-400 text-xs font-bold whitespace-nowrap">Lv.{profile.level} {profile.title}</span>
              <div className="flex-1 bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(profile.progress * 100)}%` }}
                />
              </div>
              <span className="text-neutral-500 text-xs whitespace-nowrap">{profile.xp.toLocaleString()} XP</span>
            </div>
          )}

          {!isSignedIn && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 text-center">
              <p className="text-neutral-400 mb-3">Sign in to track your XP, level, and compete on leaderboards.</p>
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm underline">Sign in</Link>
            </div>
          )}

          {/* Game cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map(card => (
              <Link key={card.href} href={card.href} className="no-underline">
                <div
                  className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 cursor-pointer transition-all duration-200 text-center hover:scale-[1.02] min-h-[160px] flex flex-col items-center justify-center"
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.backgroundColor = `${card.color}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#2a2a2a';
                    e.currentTarget.style.backgroundColor = '';
                  }}
                >
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <div className="font-bold text-lg mb-1.5 text-white">{card.title}</div>
                  <p className="text-neutral-500 text-xs leading-relaxed m-0">{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* How XP works */}
          <div className="mt-10 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white">How XP Works</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { type: 'Past Paper', rate: '10 XP/mark', color: '#14b8a6' },
                { type: 'Extended', rate: '8 XP/mark', color: '#f97316' },
                { type: 'Mid Answer', rate: '6 XP/mark', color: '#818cf8' },
                { type: 'Short Answer', rate: '5 XP/mark', color: '#22d3ee' },
              ].map(r => (
                <div key={r.type} className="bg-neutral-800 rounded-xl p-3">
                  <p className="text-xs text-neutral-400 mb-1">{r.type}</p>
                  <p className="font-bold text-sm m-0" style={{ color: r.color }}>{r.rate}</p>
                </div>
              ))}
            </div>
            <p className="text-neutral-500 text-xs mt-4 text-center">
              Every mark you earn in a quiz awards XP. Harder questions give more marks = more XP!
            </p>
          </div>
        </div>
      </div>
      <MobileNav />

      {/* Rank modal */}
      {showRankModal && profile && (
        <RankModal
          profile={profile}
          stats={stats}
          onClose={() => setShowRankModal(false)}
        />
      )}
    </div>
  );
}
