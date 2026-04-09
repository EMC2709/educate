'use client';

import { useState, useEffect, useMemo, use, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { SUBJECT_TOPICS, TopicNode } from '@/data/topic-map';
import { SUBJECT_TOPICS_MAP } from '@/data/subject-topics';

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

type MasteryLevel = 'not-started' | 'learning' | 'reviewing' | 'mastered';

const MASTERY_META: Record<MasteryLevel, { label: string; color: string; emoji: string }> = {
  'not-started': { label: 'Locked', color: '#525252', emoji: '\u{1F512}' },
  'learning':    { label: 'Learning', color: '#f87171', emoji: '\u{1F331}' },
  'reviewing':   { label: 'Reviewing', color: '#fbbf24', emoji: '\u{1F504}' },
  'mastered':    { label: 'Mastered', color: '#4ade80', emoji: '\u{2B50}' },
};

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

interface FlatTopic extends TopicNode {
  group: string;
  mastery: MasteryLevel;
}

export default function MasteryPathwayPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectParam } = use(params);
  const subject = decodeURIComponent(subjectParam);
  const color = SUBJECT_COLORS[subject] || '#6366f1';

  const router = useRouter();
  const [board, setBoard] = useState('');
  const [selected, setSelected] = useState<FlatTopic | null>(null);
  const [tick, setTick] = useState(0);

  // Find the closest matching subtopic label in SUBJECT_TOPICS_MAP for a pathway topic,
  // so we can pre-populate the quiz page's sessionStorage selection.
  const resolveQuizSelection = (topicName: string): { topic: string; sub: string } | null => {
    const map = SUBJECT_TOPICS_MAP[subject];
    if (!map) return null;
    const lower = topicName.toLowerCase();
    // Exact match first
    for (const [topic, subs] of Object.entries(map)) {
      const hit = subs.find(s => s.toLowerCase() === lower);
      if (hit) return { topic, sub: hit };
    }
    // Fuzzy: contains
    for (const [topic, subs] of Object.entries(map)) {
      const hit = subs.find(s => s.toLowerCase().includes(lower) || lower.includes(s.toLowerCase()));
      if (hit) return { topic, sub: hit };
    }
    return null;
  };

  const launchQuiz = (type: 'flashcard' | 'short') => {
    if (!selected || !board) return;
    const match = resolveQuizSelection(selected.name);
    try {
      if (match) {
        const subSel: Record<string, boolean> = { [`${match.topic}||${match.sub}`]: true };
        const topicSel: Record<string, boolean> = {};
        sessionStorage.setItem('educate-selected-subtopics', JSON.stringify(subSel));
        sessionStorage.setItem('educate-selected-topics', JSON.stringify(topicSel));
      } else {
        sessionStorage.removeItem('educate-selected-subtopics');
        sessionStorage.removeItem('educate-selected-topics');
      }
    } catch {}
    router.push(`/${board}/${encodeURIComponent(subject)}/quiz?type=${type}`);
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (cached) {
        const subs = JSON.parse(cached);
        const found = subs.find((s: { subject: string }) => s.subject === subject);
        if (found) setBoard(found.board);
      }
    } catch {}
  }, [subject]);

  const flatTopics: FlatTopic[] = useMemo(() => {
    const groups = SUBJECT_TOPICS[subject] || [];
    const list: FlatTopic[] = [];
    groups.forEach(g => {
      g.topics.forEach(t => {
        list.push({ ...t, group: g.name, mastery: getTopicMastery(subject, t.id) });
      });
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, tick]);

  useEffect(() => {
    const onStorage = () => setTick(t => t + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const stats = useMemo(() => {
    const total = flatTopics.length;
    const mastered = flatTopics.filter(t => t.mastery === 'mastered').length;
    return { total, mastered, pct: total ? Math.round((mastered / total) * 100) : 0 };
  }, [flatTopics]);

  // Responsive layout — fewer columns on small screens
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const NODES_PER_ROW = windowWidth < 400 ? 2 : windowWidth < 640 ? 3 : 4;
  const NODE_SIZE = windowWidth < 400 ? 72 : windowWidth < 640 ? 80 : 88;
  const ROW_HEIGHT = windowWidth < 640 ? 140 : 160;

  const rows: FlatTopic[][] = [];
  for (let i = 0; i < flatTopics.length; i += NODES_PER_ROW) {
    rows.push(flatTopics.slice(i, i + NODES_PER_ROW));
  }

  const positioned = rows.flatMap((row, rowIdx) => {
    const reversed = rowIdx % 2 === 1;
    const ordered = reversed ? [...row].reverse() : row;
    return ordered.map((topic, colIdx) => {
      const xPct = ((colIdx + 0.5) / NODES_PER_ROW) * 100;
      const y = rowIdx * ROW_HEIGHT + 60;
      // Original (non-reversed) index within the row, for sequence numbering
      const origIdx = reversed ? row.length - 1 - colIdx : colIdx;
      const seq = rowIdx * NODES_PER_ROW + origIdx + 1;
      return { topic, xPct, y, seq };
    });
  });

  const totalHeight = rows.length * ROW_HEIGHT + 80;

  // Build SVG path connecting nodes in sequence
  const ordered = [...positioned].sort((a, b) => a.seq - b.seq);
  const pathD = ordered.reduce((acc, n, i) => {
    const x = n.xPct;
    const y = n.y;
    if (i === 0) return `M ${x} ${y}`;
    const prev = ordered[i - 1];
    const midY = (prev.y + y) / 2;
    return `${acc} C ${prev.xPct} ${midY}, ${x} ${midY}, ${x} ${y}`;
  }, '');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-8">
        {/* Header */}
        <div
          className="sticky top-0 z-10 backdrop-blur-lg border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-4"
          style={{ backgroundColor: '#0a0a0acc' }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <Link href="/mastery" className="text-neutral-400 hover:text-white text-sm no-underline flex items-center gap-1">
              <span>{'\u2190'}</span> Back
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-lg sm:text-xl font-extrabold text-white m-0">{subject}</h1>
              <p className="text-[10px] text-neutral-500 m-0">{stats.mastered} / {stats.total} mastered · {stats.pct}%</p>
            </div>
            <div className="w-16 sm:w-20 bg-neutral-800 rounded-full h-2 overflow-hidden">
              <div className="h-full" style={{ width: `${stats.pct}%`, backgroundColor: color }} />
            </div>
          </div>
        </div>

        {flatTopics.length === 0 ? (
          <div className="max-w-2xl mx-auto p-8 text-center">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              <span className="text-4xl block mb-3">{'\u{1F6A7}'}</span>
              <p className="text-neutral-400 m-0">Pathway for {subject} is coming soon.</p>
            </div>
          </div>
        ) : (
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
            <div className="relative" style={{ height: totalHeight }}>
              {/* Path SVG */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 100 ${totalHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <path
                  d={pathD}
                  fill="none"
                  stroke="#262626"
                  strokeWidth="3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="4 6"
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#pathGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Nodes */}
              {positioned.map(({ topic, xPct, y, seq }) => {
                const meta = MASTERY_META[topic.mastery];
                const isSelected = selected?.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelected(isSelected ? null : topic)}
                    className="absolute flex flex-col items-center cursor-pointer group"
                    style={{
                      left: `${xPct}%`,
                      top: y,
                      transform: 'translate(-50%, -50%)',
                      width: NODE_SIZE,
                    }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center text-2xl transition-all group-hover:scale-110 shadow-lg"
                      style={{
                        width: NODE_SIZE - 20,
                        height: NODE_SIZE - 20,
                        backgroundColor: topic.mastery === 'not-started' ? '#171717' : `${meta.color}20`,
                        border: `3px solid ${meta.color}`,
                        boxShadow: isSelected ? `0 0 0 4px ${meta.color}40, 0 8px 24px ${meta.color}50` : `0 4px 16px ${meta.color}30`,
                      }}
                    >
                      <span>{meta.emoji}</span>
                    </div>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1"
                      style={{ backgroundColor: '#171717', color: meta.color, border: `1px solid ${meta.color}40` }}
                    >
                      {seq}
                    </span>
                    <span className="text-[10px] text-neutral-300 font-semibold text-center mt-1 leading-tight line-clamp-2 px-1">
                      {topic.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detail drawer */}
            {selected && (
              <div
                className="sticky bottom-4 mx-auto max-w-md bg-neutral-900 border-2 rounded-2xl p-5 shadow-2xl mb-4"
                style={{ borderColor: `${color}60` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wide m-0 mb-0.5">{selected.group}</p>
                    <h3 className="text-base font-bold text-white m-0">{selected.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-neutral-500 hover:text-white text-xl leading-none cursor-pointer bg-transparent border-0"
                  >
                    {'\u00D7'}
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${MASTERY_META[selected.mastery].color}20`, color: MASTERY_META[selected.mastery].color }}
                  >
                    {MASTERY_META[selected.mastery].emoji} {MASTERY_META[selected.mastery].label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => launchQuiz('short')}
                    className="text-center text-xs font-bold py-2.5 rounded-xl text-white cursor-pointer border-0"
                    style={{ backgroundColor: color }}
                  >
                    {'\u{1F3AF}'} Quiz
                  </button>
                  <button
                    onClick={() => launchQuiz('flashcard')}
                    className="text-center text-xs font-bold py-2.5 rounded-xl text-white bg-neutral-800 border border-neutral-700 cursor-pointer"
                  >
                    {'\u{1F4DA}'} Flashcards
                  </button>
                </div>
                {!resolveQuizSelection(selected.name) && (
                  <p className="text-[9px] text-neutral-600 text-center mt-2 mb-0">
                    No topic-specific bank yet — will study the whole subject.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <MobileNav />
    </div>
  );
}
