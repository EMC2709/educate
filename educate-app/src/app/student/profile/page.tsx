'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Profile {
  userId: string;
  displayName: string;
  xp: number;
  level: number;
  title: string;
  progress: number;
  currentLevelXP: number;
  nextLevelXP: number;
  role: string;
  org_id: string | null;
  year_group: number | null;
}

interface QuizResult {
  id: string;
  subject: string | null;
  topic: string | null;
  score: number | null;
  total: number | null;
  created_at: string;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function scoreColor(score: number, total: number): string {
  const pct = total > 0 ? score / total : 0;
  if (pct >= 0.8) return 'text-emerald-400';
  if (pct >= 0.5) return 'text-amber-400';
  return 'text-rose-400';
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/quiz-history'),
        ]);
        const [profileData, historyData] = await Promise.all([
          profileRes.json(),
          historyRes.json(),
        ]);
        setProfile(profileData);
        setResults((historyData.results ?? []).slice(0, 20));
      } catch {
        setError('Failed to load profile. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-rose-400">{error ?? 'Profile not found.'}</p>
      </div>
    );
  }

  const initials = profile.displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const totalQuestions = results.reduce((sum, r) => sum + (r.score ?? 0), 0);
  const sessionsCompleted = results.length;
  const progressPct = profile.nextLevelXP > 0
    ? Math.min(100, Math.round((profile.currentLevelXP / profile.nextLevelXP) * 100))
    : 0;

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back link */}
        <Link href="/student" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors no-underline">
          ← Back
        </Link>

        {/* Header card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xl font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-white truncate">{profile.displayName}</h1>
            <p className="text-indigo-400 font-medium text-sm mt-0.5">{profile.title}</p>
            {profile.year_group && (
              <p className="text-neutral-500 text-sm mt-0.5">Year {profile.year_group}</p>
            )}
          </div>
        </div>

        {/* XP progress bar */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">Level {profile.level}</span>
            <span className="text-neutral-400 text-sm">
              {profile.currentLevelXP.toLocaleString()} / {profile.nextLevelXP.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-neutral-500 text-xs mt-2">{progressPct}% to next level</p>
        </div>

        {/* My Classes shortcut */}
        <Link
          href="/student/classes"
          className="flex items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 rounded-2xl p-5 no-underline transition-colors group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <div>
              <p className="text-white font-semibold text-sm">My Classes</p>
              <p className="text-neutral-500 text-xs">View classes &amp; assignments from your teacher</p>
            </div>
          </div>
          <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors">→</span>
        </Link>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
            <p className="text-amber-400 text-2xl font-extrabold">{profile.xp.toLocaleString()}</p>
            <p className="text-neutral-400 text-xs mt-1">Total XP</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
            <p className="text-white text-2xl font-extrabold">{totalQuestions.toLocaleString()}</p>
            <p className="text-neutral-400 text-xs mt-1">Questions Answered</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
            <p className="text-white text-2xl font-extrabold">{sessionsCompleted}</p>
            <p className="text-neutral-400 text-xs mt-1">Sessions Completed</p>
          </div>
        </div>

        {/* Quiz history */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-4">Recent Sessions</h2>
          {results.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-6">No quiz sessions yet.</p>
          ) : (
            <ul className="space-y-2">
              {results.map(r => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2 border-b border-neutral-800 last:border-0">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{r.subject ?? 'General'}</p>
                    {r.topic && <p className="text-neutral-500 text-xs truncate">{r.topic}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-sm font-semibold ${scoreColor(r.score ?? 0, r.total ?? 1)}`}>
                      {r.score ?? 0}/{r.total ?? 0}
                    </span>
                    <span className="text-neutral-600 text-xs">{relativeTime(r.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </main>
  );
}
