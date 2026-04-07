'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { levelProgress, getLevelTitle } from '@/lib/xp-client';

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

        {/* XP/Level Card */}
        {profile && (
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-5 sm:p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-amber-400 text-sm font-bold">Level {profile.level}</span>
                <span className="text-neutral-400 text-sm ml-2">{profile.title}</span>
              </div>
              <span className="text-amber-400 font-bold text-lg">{profile.xp.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.round(profile.progress * 100)}%` }}
              />
            </div>
            <p className="text-neutral-500 text-xs mt-2 text-right">
              {profile.xp - profile.currentLevelXP} / {profile.nextLevelXP - profile.currentLevelXP} XP to Level {profile.level + 1}
            </p>
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
