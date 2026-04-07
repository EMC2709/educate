'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { SUBJECT_TOPICS } from '@/data/topic-map';

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': '#a78bfa', 'English Language': '#f472b6', 'English Literature': '#ec4899',
  'Biology': '#4ade80', 'Chemistry': '#fb923c', 'Physics': '#60a5fa',
  'Combined Science': '#38bdf8', 'History': '#fbbf24', 'Geography': '#a3e635',
  'French': '#f87171', 'Spanish': '#fb7185', 'Computer Science': '#22d3ee',
  'Business Studies': '#2dd4bf', 'Psychology': '#c084fc', 'Sociology': '#f472b6',
  'Religious Studies': '#fcd34d', 'Economics': '#34d399', 'Music': '#e879f9',
  'Drama': '#fb7185', 'Art & Design': '#f59e0b', 'Design & Technology': '#facc15',
  'Food Preparation & Nutrition': '#fb923c', 'Physical Education': '#38bdf8',
};

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematics': '\u{1F4D0}', 'English Language': '\u{1F4DD}', 'English Literature': '\u{1F4D6}',
  'Biology': '\u{1F9EC}', 'Chemistry': '\u{1F9EA}', 'Physics': '\u{269B}\uFE0F',
  'Combined Science': '\u{1F52C}', 'History': '\u{1F4DC}', 'Geography': '\u{1F30D}',
  'French': '\u{1F1EB}\u{1F1F7}', 'Spanish': '\u{1F1EA}\u{1F1F8}', 'Computer Science': '\u{1F4BB}',
  'Business Studies': '\u{1F4BC}', 'Psychology': '\u{1F9E0}', 'Sociology': '\u{1F465}',
  'Religious Studies': '\u{1F54A}\uFE0F', 'Economics': '\u{1F4B9}', 'Music': '\u{1F3B5}',
  'Drama': '\u{1F3AD}', 'Art & Design': '\u{1F3A8}', 'Design & Technology': '\u{1F6E0}\uFE0F',
  'Food Preparation & Nutrition': '\u{1F373}', 'Physical Education': '\u{26BD}',
};

type MasteryLevel = 'not-started' | 'learning' | 'reviewing' | 'mastered';

function getTopicMastery(subject: string, topicId: string): MasteryLevel {
  try {
    const raw = localStorage.getItem('educate-quiz-scores');
    if (raw) {
      const scores: Record<string, { correct: number; total: number }> = JSON.parse(raw);
      const data = scores[`${subject}:${topicId}`];
      if (data && data.total > 0) {
        const acc = data.correct / data.total;
        if (acc >= 0.9) return 'mastered';
        if (acc >= 0.7) return 'reviewing';
        return 'learning';
      }
    }
  } catch {}
  return 'not-started';
}

export default function MasteryPage() {
  const [subjects, setSubjects] = useState<{ subject: string; board: string }[]>([]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (cached) setSubjects(JSON.parse(cached));
    } catch {}
  }, []);

  const subjectStats = useMemo(() => {
    const result: Record<string, { total: number; mastered: number; pct: number }> = {};
    subjects.forEach(({ subject }) => {
      const groups = SUBJECT_TOPICS[subject] || [];
      let total = 0, mastered = 0;
      groups.forEach(g => g.topics.forEach(t => {
        total++;
        if (getTopicMastery(subject, t.id) === 'mastered') mastered++;
      }));
      result[subject] = { total, mastered, pct: total ? Math.round((mastered / total) * 100) : 0 };
    });
    return result;
  }, [subjects]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {'\u{1F5FA}\uFE0F'} Topic Mastery
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">Pick a subject to walk the pathway</p>
          </div>

          {subjects.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
              <p className="text-neutral-400 m-0">No subjects selected yet.</p>
              <Link href="/onboarding" className="text-indigo-400 text-sm mt-2 inline-block">Choose your subjects</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(({ subject }) => {
                const color = SUBJECT_COLORS[subject] || '#6366f1';
                const icon = SUBJECT_ICONS[subject] || '\u{1F4DA}';
                const stats = subjectStats[subject] || { total: 0, mastered: 0, pct: 0 };
                const hasTopics = (SUBJECT_TOPICS[subject] || []).length > 0;
                return (
                  <Link
                    key={subject}
                    href={`/mastery/${encodeURIComponent(subject)}`}
                    className="no-underline group"
                  >
                    <div
                      className="relative bg-neutral-900 border-2 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-all overflow-hidden"
                      style={{ borderColor: `${color}40` }}
                    >
                      <div
                        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                        style={{ background: `radial-gradient(circle at top right, ${color}, transparent 70%)` }}
                      />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl">{icon}</span>
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-full"
                            style={{ backgroundColor: `${color}20`, color }}
                          >
                            {stats.pct}%
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white m-0 mb-1">{subject}</h3>
                        <p className="text-xs text-neutral-500 m-0 mb-3">
                          {hasTopics ? `${stats.mastered} / ${stats.total} topics mastered` : 'Pathway coming soon'}
                        </p>
                        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${stats.pct}%`, backgroundColor: color }}
                          />
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
                          <span>Start pathway</span>
                          <span>{'\u2192'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
