'use client';

import { useEffect, useState, use } from 'react';
import { levelFromXP, getLevelTitle } from '@/lib/xp-client';

interface ParentData {
  displayName: string;
  xp: number;
  totalSessions: number;
  accuracy: number;
  subjects: string[];
  last7: { day: string; count: number }[];
  recentResults: {
    subject: string;
    question_type: string;
    score_correct: number;
    score_total: number;
    created_at: string;
  }[];
}

export default function ParentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [data, setData] = useState<ParentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/parent/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Failed to load'));
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h1 className="text-xl font-bold text-white mb-2">Link not found</h1>
          <p className="text-neutral-500 text-sm">This progress link may have expired or been revoked.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-500 text-sm animate-pulse">Loading progress…</div>
      </div>
    );
  }

  const level = levelFromXP(data.xp);
  const title = getLevelTitle(level);
  const maxDay = Math.max(...data.last7.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4">
            E
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {data.displayName}&apos;s Progress
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Shared via Educate GCSE Revision</p>
        </div>

        {/* Level card */}
        <div className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/25 rounded-2xl p-5 mb-5 flex items-center justify-between">
          <div>
            <p className="text-amber-400 font-bold text-lg">Level {level}</p>
            <p className="text-neutral-400 text-sm">{title}</p>
          </div>
          <div className="text-right">
            <p className="text-amber-400 font-bold text-xl">{data.xp.toLocaleString()} XP</p>
            <p className="text-neutral-500 text-xs">total earned</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Sessions', value: data.totalSessions, icon: '📝' },
            { label: 'Accuracy', value: `${data.accuracy}%`, icon: '🎯' },
            { label: 'Subjects', value: data.subjects.length, icon: '📚' },
          ].map(s => (
            <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-xs text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 7-day activity */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-5">
          <h3 className="text-sm font-bold text-white mb-4">Activity This Week</h3>
          <div className="flex items-end gap-2 h-20">
            {data.last7.map((d, i) => {
              const h = d.count > 0 ? Math.max((d.count / maxDay) * 100, 12) : 4;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-neutral-500">{d.count || ''}</span>
                  <div
                    className="w-full rounded-t-md"
                    style={{ height: `${h}%`, backgroundColor: d.count > 0 ? '#6366f1' : '#2a2a2a' }}
                  />
                  <span className="text-[10px] text-neutral-600">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subjects */}
        {data.subjects.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-5">
            <h3 className="text-sm font-bold text-white mb-3">Subjects Studied</h3>
            <div className="flex flex-wrap gap-2">
              {data.subjects.map(s => (
                <span key={s} className="bg-indigo-500/15 text-indigo-400 text-xs px-3 py-1 rounded-lg border border-indigo-500/25">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent results */}
        {data.recentResults.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">Recent Quizzes</h3>
            <div className="flex flex-col gap-2">
              {data.recentResults.map((r, i) => {
                const acc = r.score_total > 0 ? Math.round((r.score_correct / r.score_total) * 100) : 0;
                const color = acc >= 70 ? '#4ade80' : acc >= 40 ? '#fbbf24' : '#f87171';
                return (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-neutral-800 last:border-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: `${color}20`, color }}>
                      {acc}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white m-0 truncate">{r.subject}</p>
                      <p className="text-xs text-neutral-500 m-0">{r.question_type} · {r.score_correct}/{r.score_total} correct</p>
                    </div>
                    <span className="text-[11px] text-neutral-600 shrink-0">
                      {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-center text-neutral-700 text-xs mt-8">
          Powered by{' '}
          <a href="/" className="text-neutral-500 no-underline hover:text-neutral-400">Educate</a>
          {' '}— GCSE Revision
        </p>
      </div>
    </div>
  );
}
