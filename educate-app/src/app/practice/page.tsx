'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { ChatPanel } from '@/components/layout/ChatPanel';

interface Question {
  id: string | number;
  question_text: string;
  marks: number;
  topic: string;
  question_number: string | number;
}

interface Filters {
  subject: string;
  examType: string;
  topic: string;
}

type PracticeState = 'idle' | 'loading' | 'active' | 'done';

export default function PracticePage() {
  const [filters, setFilters] = useState<Filters>({ subject: '', examType: '', topic: '' });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [state, setState] = useState<PracticeState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedScore, setSavedScore] = useState<{ score: number; total: number } | null>(null);

  const handleStart = async () => {
    if (!filters.subject.trim()) {
      setError('Please enter a subject to practice.');
      return;
    }
    setError(null);
    setState('loading');
    setDone(new Set());
    setQuestions([]);
    setSavedScore(null);

    const params = new URLSearchParams({ random: 'true', limit: '10' });
    if (filters.subject.trim()) params.set('subject', filters.subject.trim());
    if (filters.examType) params.set('examType', filters.examType);
    if (filters.topic.trim()) params.set('topic', filters.topic.trim());

    try {
      const res = await fetch(`/api/questions?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch questions (${res.status})`);
      const data: Question[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError('No questions found for those filters. Try broadening your search.');
        setState('idle');
        return;
      }
      setQuestions(data);
      setState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setState('idle');
    }
  };

  const toggleDone = (index: number) => {
    setDone(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleFinish = async () => {
    setSaving(true);
    const score = done.size;
    const total = questions.length;
    try {
      await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: filters.subject.trim(),
          examType: filters.examType || 'Free Practice',
          topic: filters.topic.trim() || undefined,
          score,
          total,
        }),
      });
    } catch {
      // Non-blocking — result save failure shouldn't block the UI
    }
    setSavedScore({ score, total });
    setState('done');
    setSaving(false);
  };

  const handleReset = () => {
    setState('idle');
    setQuestions([]);
    setDone(new Set());
    setSavedScore(null);
    setError(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex min-h-screen">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/"
                  className="text-neutral-500 text-sm no-underline hover:text-neutral-300 transition-colors"
                >
                  Home
                </Link>
                <span className="text-neutral-700 text-sm">/</span>
                <span className="text-neutral-300 text-sm">Practice Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
                Free Practice Hub
              </h1>
              <p className="text-neutral-500 mt-1 text-sm">
                Pick a subject and start practising — no assignments, no pressure.
              </p>
            </div>

            {/* Filters card */}
            {(state === 'idle' || state === 'loading') && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 mb-6">
                <h2 className="text-sm font-bold text-white mb-4 m-0">Choose your practice</h2>
                <div className="flex flex-col gap-4">

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1.5" htmlFor="subject-input">
                      Subject <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="subject-input"
                      type="text"
                      value={filters.subject}
                      onChange={e => setFilters(f => ({ ...f, subject: e.target.value }))}
                      placeholder="e.g. Mathematics, English, Verbal Reasoning"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Exam Type */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1.5" htmlFor="exam-type-select">
                        Exam Type
                      </label>
                      <select
                        id="exam-type-select"
                        value={filters.examType}
                        onChange={e => setFilters(f => ({ ...f, examType: e.target.value }))}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Any</option>
                        <option value="11+">11+</option>
                        <option value="GCSE">GCSE</option>
                        <option value="A-Level">A-Level</option>
                        <option value="Free Practice">Free Practice</option>
                      </select>
                    </div>

                    {/* Topic */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1.5" htmlFor="topic-input">
                        Topic (optional)
                      </label>
                      <input
                        id="topic-input"
                        type="text"
                        value={filters.topic}
                        onChange={e => setFilters(f => ({ ...f, topic: e.target.value }))}
                        placeholder="e.g. Fractions, Synonyms"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 m-0">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleStart}
                    disabled={state === 'loading'}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-semibold text-sm rounded-xl py-3 px-6 transition-colors cursor-pointer border-0 flex items-center justify-center gap-2"
                  >
                    {state === 'loading' ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Fetching questions...
                      </>
                    ) : (
                      'Start Practice'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Questions */}
            {state === 'active' && questions.length > 0 && (
              <div>
                {/* Score bar */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white m-0">
                    {filters.subject}{filters.examType ? ` \u2014 ${filters.examType}` : ''}
                    {filters.topic ? ` \u2014 ${filters.topic}` : ''}
                  </h2>
                  <span className="text-sm font-bold text-indigo-400">
                    {done.size} / {questions.length} done
                  </span>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  {questions.map((q, i) => {
                    const isDone = done.has(i);
                    return (
                      <div
                        key={q.id ?? i}
                        className={`bg-neutral-900 border rounded-2xl p-4 sm:p-5 transition-all ${
                          isDone
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : 'border-neutral-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-neutral-800 text-neutral-500 text-xs font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            {q.topic && (
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 m-0 mb-1">
                                {q.topic}
                              </p>
                            )}
                            <p className="text-sm text-white m-0 leading-relaxed">
                              {q.question_text}
                            </p>
                            {q.marks > 0 && (
                              <p className="text-[10px] text-neutral-600 m-0 mt-1">
                                [{q.marks} mark{q.marks !== 1 ? 's' : ''}]
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => toggleDone(i)}
                            className={`text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white'
                            }`}
                          >
                            {isDone ? '\u2713 Done' : 'Mark as done'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-sm rounded-xl py-3 px-6 transition-colors cursor-pointer border-0"
                  >
                    Start over
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={saving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-semibold text-sm rounded-xl py-3 px-6 transition-colors cursor-pointer border-0 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Finish & Save'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Done / results */}
            {state === 'done' && savedScore && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 text-center">
                <div className="text-5xl mb-4">
                  {savedScore.score === savedScore.total ? '\u{1F3C6}' : savedScore.score >= savedScore.total / 2 ? '\u{1F44D}' : '\u{1F4AA}'}
                </div>
                <h2 className="text-2xl font-extrabold text-white m-0 mb-1">
                  {savedScore.score} / {savedScore.total}
                </h2>
                <p className="text-neutral-500 text-sm m-0 mb-6">
                  {savedScore.score === savedScore.total
                    ? 'Perfect score! Great work.'
                    : savedScore.score === 0
                    ? 'Keep at it — practice makes perfect.'
                    : `${Math.round((savedScore.score / savedScore.total) * 100)}% complete. Nice effort!`}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleReset}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl py-3 px-6 transition-colors cursor-pointer border-0"
                  >
                    Practice again
                  </button>
                  <Link
                    href="/progress"
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-sm rounded-xl py-3 px-6 transition-colors no-underline inline-flex items-center justify-center"
                  >
                    View my progress
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
        <ChatPanel />
      </div>
      <MobileNav />
    </div>
  );
}
