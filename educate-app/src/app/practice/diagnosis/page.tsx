'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { QUESTION_BANK } from '@/data/question-bank';
import { SUBJECT_TOPICS_MAP } from '@/data/subject-topics';

// ── Types ────────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'testing' | 'results';

interface DiagQuestion {
  question: string;
  answer: string;
  topicName: string;
  topicIndex: number;
}

interface TopicResult {
  name: string;
  got: boolean | null; // null = not attempted
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const SUBJECTS = Object.keys(QUESTION_BANK).filter(s => {
  const bank = QUESTION_BANK[s] as { short?: { question: string; answer: string }[] };
  return Array.isArray(bank.short) && bank.short.length >= 5;
});

function subjectToSlug(subject: string): string {
  return subject.toLowerCase().replace(/[&]/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function buildQuestions(subject: string): DiagQuestion[] {
  const bank = QUESTION_BANK[subject] as { short: { question: string; answer: string }[] };
  const shorts = bank.short;
  const topicMap = SUBJECT_TOPICS_MAP[subject];
  const topicNames: string[] = topicMap ? Object.keys(topicMap) : ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Part 5'];
  const n = Math.min(topicNames.length, 15);
  const chunkSize = Math.floor(shorts.length / n);

  const questions: DiagQuestion[] = [];
  for (let i = 0; i < n; i++) {
    const idx = i * chunkSize;
    const q = shorts[idx];
    if (q) {
      questions.push({
        question: q.question,
        answer: q.answer,
        topicName: topicNames[i],
        topicIndex: i,
      });
    }
  }
  return questions;
}

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematics': '📐', 'English Language': '📝', 'English Literature': '📚',
  'Biology': '🧬', 'Chemistry': '⚗️', 'Physics': '⚛️',
  'Combined Science': '🔬', 'History': '📜', 'Geography': '🌍',
  'French': '🇫🇷', 'Spanish': '🇪🇸', 'German': '🇩🇪',
  'Chinese': '🇨🇳', 'Computer Science': '💻', 'Psychology': '🧠',
  'Sociology': '👥', 'Business Studies': '📈', 'Economics': '💰',
  'Religious Studies': '🕊️', 'Design & Technology': '🔧',
  'Food Preparation & Nutrition': '🍽️', 'Physical Education': '⚽',
  'Drama': '🎭', 'Music': '🎵', 'Art & Design': '🎨',
  'Graphic Communication': '🖨️',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function DiagnosisPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [questions, setQuestions] = useState<DiagQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  const [revealed, setRevealed] = useState(false);

  // ── Setup phase ──────────────────────────────────────────────────────────

  function startTest(subject: string) {
    const qs = buildQuestions(subject);
    setSelectedSubject(subject);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentIdx(0);
    setRevealed(false);
    setPhase('testing');
  }

  // ── Testing phase ────────────────────────────────────────────────────────

  function rate(got: boolean) {
    const updated = [...answers];
    updated[currentIdx] = got;
    setAnswers(updated);
    setRevealed(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
    } else {
      setPhase('results');
    }
  }

  const currentQ = questions[currentIdx];
  const progress = questions.length > 0 ? ((currentIdx) / questions.length) * 100 : 0;

  // ── Results phase ────────────────────────────────────────────────────────

  const topicResults = useMemo<TopicResult[]>(() => {
    return questions.map((q, i) => ({
      name: q.topicName,
      got: answers[i],
    }));
  }, [questions, answers]);

  const score = useMemo(() => {
    const attempted = answers.filter(a => a !== null).length;
    const correct = answers.filter(a => a === true).length;
    return { correct, attempted, pct: attempted ? Math.round((correct / attempted) * 100) : 0 };
  }, [answers]);

  const weakTopics = useMemo(
    () => topicResults.filter(t => t.got === false),
    [topicResults]
  );

  function reset() {
    setPhase('setup');
    setSelectedSubject('');
    setQuestions([]);
    setAnswers([]);
    setCurrentIdx(0);
    setRevealed(false);
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen" style={{ background: '#0f0f0f' }}>
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">

          {/* Header */}
          <div className="mb-6">
            <Link href="/practice" className="text-neutral-500 hover:text-white text-sm no-underline">
              &larr; Practice Hub
            </Link>
            <h1 className="text-2xl font-extrabold text-white mt-3 mb-1">
              🔍 Diagnosis Test
            </h1>
            <p className="text-neutral-500 text-sm m-0">
              Find your knowledge gaps — one question per topic, self-rated.
            </p>
          </div>

          {/* ── SETUP ── */}
          {phase === 'setup' && (
            <div>
              <p className="text-neutral-400 text-sm mb-4">Choose a subject to diagnose:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SUBJECTS.map(subject => (
                  <button
                    key={subject}
                    onClick={() => startTest(subject)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all text-center cursor-pointer group"
                  >
                    <span className="text-2xl">{SUBJECT_ICONS[subject] ?? '📖'}</span>
                    <span className="text-xs font-semibold text-neutral-300 group-hover:text-white leading-tight">
                      {subject}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── TESTING ── */}
          {phase === 'testing' && currentQ && (
            <div>
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span>{selectedSubject}</span>
                  <span>{currentIdx + 1} / {questions.length}</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Topic label */}
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">
                  {currentQ.topicName}
                </span>
              </div>

              {/* Question card */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-4">
                <p className="text-white text-base font-medium leading-relaxed m-0">
                  {currentQ.question}
                </p>

                {/* Reveal answer toggle */}
                {!revealed ? (
                  <button
                    onClick={() => setRevealed(true)}
                    className="mt-4 text-xs text-neutral-500 hover:text-neutral-300 underline bg-transparent border-none cursor-pointer p-0"
                  >
                    Show answer
                  </button>
                ) : (
                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 mb-1">
                      Model answer
                    </p>
                    <p className="text-emerald-400 text-sm leading-relaxed m-0">
                      {currentQ.answer}
                    </p>
                  </div>
                )}
              </div>

              {/* Rating buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => rate(true)}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-400 font-bold text-base transition-all cursor-pointer"
                >
                  <span>✓</span>
                  <span>Got it</span>
                </button>
                <button
                  onClick={() => rate(false)}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-rose-400 font-bold text-base transition-all cursor-pointer"
                >
                  <span>✗</span>
                  <span>Didn&apos;t know</span>
                </button>
              </div>
            </div>
          )}

          {/* ── RESULTS ── */}
          {phase === 'results' && (
            <div>
              {/* Score summary */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6 text-center">
                <div
                  className="text-5xl font-extrabold mb-1"
                  style={{ color: score.pct >= 70 ? '#4ade80' : score.pct >= 40 ? '#fbbf24' : '#f87171' }}
                >
                  {score.pct}%
                </div>
                <p className="text-neutral-400 text-sm m-0">
                  {score.correct} / {score.attempted} topics correct
                </p>
                <p className="text-neutral-500 text-xs mt-1 m-0">{selectedSubject}</p>
              </div>

              {/* Topic grid */}
              <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">
                Topic overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {topicResults.map((t, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-xl text-xs font-semibold border text-center"
                    style={
                      t.got === true
                        ? { background: '#4ade8018', borderColor: '#4ade8040', color: '#4ade80' }
                        : t.got === false
                        ? { background: '#f8717118', borderColor: '#f8717140', color: '#f87171' }
                        : { background: '#52525218', borderColor: '#52525240', color: '#737373' }
                    }
                  >
                    {t.got === true ? '✓ ' : t.got === false ? '✗ ' : '– '}
                    {t.name}
                  </div>
                ))}
              </div>

              {/* Weakest topics */}
              {weakTopics.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">
                    Your weakest topics — focus here
                  </h2>
                  <div className="flex flex-col gap-2">
                    {weakTopics.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-neutral-900 border border-rose-500/30 rounded-xl px-4 py-3"
                      >
                        <div>
                          <span className="text-rose-400 text-sm font-semibold">{t.name}</span>
                          <p className="text-neutral-500 text-xs m-0 mt-0.5">{selectedSubject}</p>
                        </div>
                        <Link
                          href={`/aqa/${subjectToSlug(selectedSubject)}?topic=${encodeURIComponent(t.name)}`}
                          className="no-underline text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25 transition-colors"
                        >
                          Start Revision →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm transition-colors cursor-pointer border-none"
                >
                  Try Another Subject
                </button>
                <button
                  onClick={() => startTest(selectedSubject)}
                  className="flex-1 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-colors cursor-pointer border-none"
                >
                  Retake Test
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <MobileNav />
    </div>
  );
}
