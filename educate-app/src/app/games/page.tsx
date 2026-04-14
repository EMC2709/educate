'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { levelProgress, getLevelTitle } from '@/lib/xp-client';
import { getRank, getNextRank, rankProgress } from '@/lib/ranks';

interface Profile {
  displayName: string;
  xp: number;
  level: number;
  title: string;
  progress: number;
  nextLevelXP: number;
  currentLevelXP: number;
}

export default function GamesHubPage() {
  const { isSignedIn } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/profile').then(r => r.json()).then(setProfile).catch(() => {});
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
      desc: 'Answer questions to claim squares. Play vs a friend or AI.',
      color: '#10b981',
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

        {/* Rank Card */}
        {profile && (() => {
          const rp = rankProgress(profile.xp);
          return (
            <div
              className="rounded-2xl p-5 sm:p-6 mb-6 border"
              style={{
                background: `linear-gradient(135deg, ${rp.rank.glowColor}, rgba(0,0,0,0.6))`,
                borderColor: rp.rank.color + '55',
                boxShadow: `0 0 32px ${rp.rank.glowColor}`,
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                {/* Big rank icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                  style={{ background: rp.rank.glowColor, border: `2px solid ${rp.rank.color}55` }}
                >
                  {rp.rank.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest m-0" style={{ color: rp.rank.color }}>
                    Current Rank
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

              {/* Rank progress bar */}
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
            </div>
          );
        })()}

        {/* Level progress bar (compact) */}
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

        {/* Game Cards */}
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

        {/* How XP Works */}
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
    </div>
  );
}
