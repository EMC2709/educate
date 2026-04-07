'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { levelFromXP, levelProgress, getLevelTitle, xpForLevel } from '@/lib/xp-client';

interface QuizResult {
  id: string;
  subject: string;
  board: string;
  question_type: string;
  score_correct: number;
  score_total: number;
  created_at: string;
}

interface Profile {
  xp: number;
  level: number;
  title: string;
  progress: number;
  currentLevelXP: number;
  nextLevelXP: number;
}

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': '#a78bfa', 'English Language': '#f472b6', 'English Literature': '#f472b6',
  'Biology': '#4ade80', 'Chemistry': '#fb923c', 'Physics': '#60a5fa',
  'Combined Science': '#38bdf8', 'History': '#fbbf24', 'Geography': '#a3e635',
  'French': '#f87171', 'Spanish': '#f87171', 'German': '#fbbf24',
  'Computer Science': '#38bdf8', 'Business Studies': '#2dd4bf', 'Psychology': '#a78bfa',
  'Religious Studies': '#c084fc', 'Sociology': '#60a5fa', 'Economics': '#fbbf24',
};

export default function ProgressPage() {
  const { isSignedIn } = useUser();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<'overview' | 'history'>('overview');

  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/quiz-history').then(r => r.json()).then(d => setResults(d.results || [])).catch(() => {});
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d.xp != null) setProfile(d);
    }).catch(() => {});
  }, [isSignedIn]);

  // Stats
  const stats = useMemo(() => {
    const bySubject: Record<string, { correct: number; total: number; sessions: number }> = {};
    const byDay: Record<string, number> = {};
    let streak = 0;

    results.forEach(r => {
      const key = r.subject;
      if (!bySubject[key]) bySubject[key] = { correct: 0, total: 0, sessions: 0 };
      bySubject[key].correct += r.score_correct;
      bySubject[key].total += r.score_total;
      bySubject[key].sessions += 1;

      const day = r.created_at.split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
    });

    // Calculate streak
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (byDay[key]) streak++;
      else break;
    }

    const totalSessions = results.length;
    const totalCorrect = results.reduce((a, r) => a + r.score_correct, 0);
    const totalQuestions = results.reduce((a, r) => a + r.score_total, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Last 7 days activity
    const last7: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      last7.push({ day: d.toLocaleDateString('en-GB', { weekday: 'short' }), count: byDay[key] || 0 });
    }

    return { bySubject, streak, totalSessions, accuracy, last7, totalCorrect, totalQuestions };
  }, [results]);

  const subjectEntries = Object.entries(stats.bySubject).sort((a, b) => b[1].sessions - a[1].sessions);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Your <span className="text-indigo-400">Progress</span>
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">Track your revision journey</p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-6 justify-center">
            {(['overview', 'history'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
                  tab === t
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400'
                    : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-700'
                }`}
              >
                {t === 'overview' ? 'Overview' : 'Quiz History'}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <>
              {/* XP Card */}
              {profile && (
                <div className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/25 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-amber-400 font-bold">Level {profile.level}</span>
                      <span className="text-neutral-400 text-sm ml-2">{profile.title}</span>
                    </div>
                    <span className="text-amber-400 font-bold text-lg">{profile.xp.toLocaleString()} XP</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                      style={{ width: `${Math.round(profile.progress * 100)}%` }}
                    />
                  </div>
                  <p className="text-neutral-500 text-xs mt-1.5 text-right">
                    {profile.xp - profile.currentLevelXP} / {profile.nextLevelXP - profile.currentLevelXP} XP to Level {profile.level + 1}
                  </p>
                </div>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Sessions', value: stats.totalSessions.toString(), icon: '\u{1F4DD}' },
                  { label: 'Accuracy', value: `${stats.accuracy}%`, icon: '\u{1F3AF}' },
                  { label: 'Streak', value: `${stats.streak} day${stats.streak !== 1 ? 's' : ''}`, icon: '\u{1F525}' },
                  { label: 'Questions', value: `${stats.totalCorrect}/${stats.totalQuestions}`, icon: '\u{2705}' },
                ].map(s => (
                  <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-lg font-bold text-white">{s.value}</div>
                    <div className="text-xs text-neutral-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Activity chart (last 7 days) */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
                <h3 className="text-white font-bold text-sm mb-4">This Week</h3>
                <div className="flex items-end gap-2 h-24">
                  {stats.last7.map((d, i) => {
                    const max = Math.max(...stats.last7.map(x => x.count), 1);
                    const h = d.count > 0 ? Math.max((d.count / max) * 100, 12) : 4;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-neutral-500">{d.count || ''}</span>
                        <div
                          className="w-full rounded-t-md transition-all"
                          style={{
                            height: `${h}%`,
                            backgroundColor: d.count > 0 ? '#6366f1' : '#2a2a2a',
                          }}
                        />
                        <span className="text-[10px] text-neutral-600">{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subject breakdown */}
              {subjectEntries.length > 0 && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <h3 className="text-white font-bold text-sm mb-4">By Subject</h3>
                  <div className="flex flex-col gap-3">
                    {subjectEntries.map(([subject, data]) => {
                      const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                      const color = SUBJECT_COLORS[subject] || '#6366f1';
                      return (
                        <div key={subject} className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-sm text-white flex-1 min-w-0 truncate">{subject}</span>
                          <span className="text-xs text-neutral-500">{data.sessions} quiz{data.sessions !== 1 ? 'zes' : ''}</span>
                          <div className="w-20 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${acc}%`, backgroundColor: color }} />
                          </div>
                          <span className="text-xs font-bold w-10 text-right" style={{ color }}>{acc}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {results.length === 0 && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
                  <p className="text-neutral-400 mb-2">No quiz results yet.</p>
                  <p className="text-neutral-600 text-sm">Complete some quizzes to see your progress here!</p>
                </div>
              )}
            </>
          )}

          {tab === 'history' && (
            <div className="flex flex-col gap-3">
              {results.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
                  <p className="text-neutral-400">No quiz history yet.</p>
                </div>
              ) : (
                results.map(r => {
                  const acc = r.score_total > 0 ? Math.round((r.score_correct / r.score_total) * 100) : 0;
                  const color = SUBJECT_COLORS[r.subject] || '#6366f1';
                  const date = new Date(r.created_at);
                  return (
                    <div key={r.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {acc}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white m-0 truncate">{r.subject}</p>
                        <p className="text-xs text-neutral-500 m-0">
                          {r.question_type} {'\u00B7'} {r.score_correct}/{r.score_total} correct
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-neutral-500 m-0">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                        <p className="text-[10px] text-neutral-600 m-0">{date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <Link
                        href={`/${r.board}/${encodeURIComponent(r.subject)}/quiz?type=${r.question_type}`}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-300 no-underline hover:bg-neutral-700 transition-colors shrink-0"
                      >
                        Retry
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
