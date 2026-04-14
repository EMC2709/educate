'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { PAST_PAPER_BANK } from '@/data/past-paper-bank';
import type { Question } from '@/types';
import { MessageContent } from '@/components/ui/MessageContent';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';

interface PaperInfo {
  paperTitle: string;
  year: string;
  tier: string;
  duration: string;
  totalMarks: number;
}

type Mode = 'intro' | 'exam' | 'results';

export default function ExamPaperPage({
  params,
}: {
  params: Promise<{ board: string; subject: string }>;
}) {
  const { board: boardName, subject: rawSubject } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const board = EXAM_BOARDS[boardName];

  if (!board || !board.subjects.includes(subject)) notFound();

  const questions: Question[] = PAST_PAPER_BANK[subject] ?? [];

  const [mode, setMode] = useState<Mode>('intro');
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ''));
  const [paperInfo, setPaperInfo] = useState<PaperInfo>({
    paperTitle: 'Paper 1',
    year: '',
    tier: '',
    duration: '1 hour 45 minutes',
    totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
  });
  const [revealed, setRevealed] = useState<boolean[]>(() => questions.map(() => false));
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('educate-paper-info');
      if (stored) {
        const info = JSON.parse(stored) as Partial<PaperInfo>;
        setPaperInfo(prev => ({
          ...prev,
          paperTitle: info.paperTitle ?? prev.paperTitle,
          year: info.year ?? prev.year,
          tier: info.tier ?? prev.tier,
          duration: info.duration ?? prev.duration,
          totalMarks: info.totalMarks ?? prev.totalMarks,
        }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (mode === 'exam') {
      setStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - Date.now()) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mode, startTime]);

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const attemptedCount = answers.filter(a => a.trim().length > 0).length;
  const revealedCount = revealed.filter(Boolean).length;

  function handleRevealAll() {
    setRevealed(questions.map(() => true));
  }

  function handleToggleReveal(i: number) {
    setRevealed(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  function getTimeSince() {
    const secs = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8 pb-20 md:pb-8">
          <div className="text-center">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-neutral-300 font-semibold mb-2">No past paper questions available yet</p>
            <p className="text-neutral-500 text-sm mb-6">Questions for {subject} are being added soon.</p>
            <Link href={`/${boardName}/${encodeURIComponent(subject)}/papers`} className="text-indigo-400 hover:text-indigo-300 text-sm underline">
              ← Back to papers
            </Link>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // ── INTRO ───────────────────────────────────────────────────────────────────
  if (mode === 'intro') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-2xl mx-auto">
            <Link href={`/${boardName}/${encodeURIComponent(subject)}/papers`} className="text-neutral-500 hover:text-neutral-300 text-sm flex items-center gap-1 mb-8 no-underline transition-colors">
              ← Back to papers
            </Link>

            {/* Paper header card */}
            <div className="bg-neutral-900 border-2 border-indigo-500/30 rounded-2xl p-6 sm:p-8 mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">{boardName} · GCSE</p>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-1">{subject}</h1>
                  <p className="text-neutral-400 text-sm">
                    {paperInfo.paperTitle}
                    {paperInfo.year ? ` · ${paperInfo.year}` : ''}
                    {paperInfo.tier ? ` · ${paperInfo.tier} Tier` : ''}
                  </p>
                </div>
                <span className="text-4xl shrink-0">📄</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                <div className="bg-neutral-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-neutral-500 mb-1">Questions</p>
                  <p className="text-xl font-bold text-white">{questions.length}</p>
                </div>
                <div className="bg-neutral-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-neutral-500 mb-1">Total marks</p>
                  <p className="text-xl font-bold text-white">{totalMarks}</p>
                </div>
                <div className="bg-neutral-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <p className="text-xs text-neutral-500 mb-1">Suggested time</p>
                  <p className="text-sm font-bold text-white">{paperInfo.duration}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Instructions</h2>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0 mt-0.5">•</span>Answer all questions in the spaces provided</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0 mt-0.5">•</span>The marks for each question are shown in brackets</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0 mt-0.5">•</span>Use the hints if you get stuck — but try without first</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0 mt-0.5">•</span>After finishing, reveal model answers to mark your work</li>
              </ul>
            </div>

            <button
              onClick={() => { setMode('exam'); setStartTime(Date.now()); }}
              className="w-full py-4 rounded-2xl font-bold text-base text-white border-none cursor-pointer transition-opacity"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Start Paper ✏️
            </button>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // ── EXAM ────────────────────────────────────────────────────────────────────
  if (mode === 'exam') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto pb-20 md:pb-8">
          {/* Sticky exam header */}
          <div className="sticky top-0 z-10 bg-neutral-950/95 backdrop-blur border-b border-neutral-800 px-4 sm:px-6 py-3">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-neutral-500 truncate">{boardName} · {subject}</p>
                <p className="text-sm font-bold text-white truncate">{paperInfo.paperTitle}{paperInfo.year ? ` · ${paperInfo.year}` : ''}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-1 rounded-lg">
                  {attemptedCount}/{questions.length} answered
                </span>
                <button
                  onClick={() => setMode('results')}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold px-4 py-2 rounded-lg border-none cursor-pointer transition-colors"
                >
                  Finish →
                </button>
              </div>
            </div>
          </div>

          {/* Paper content */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            {/* Official paper header */}
            <div className="border-2 border-neutral-700 rounded-2xl p-5 sm:p-6 mb-8 text-center bg-neutral-900">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">GCSE</p>
              <h1 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wide mb-1">{subject}</h1>
              <p className="text-sm text-neutral-400 mb-3">
                {paperInfo.paperTitle}
                {paperInfo.year ? ` · ${paperInfo.year}` : ''}
                {paperInfo.tier ? ` · ${paperInfo.tier} Tier` : ''}
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
                <span>⏱ {paperInfo.duration}</span>
                <span>·</span>
                <span>📊 {totalMarks} marks</span>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {questions.map((q, i) => (
                <div key={i} className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900">
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-neutral-800">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 text-sm font-extrabold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">{q.topic}</p>
                        <div className="text-sm text-neutral-200 leading-relaxed">
                          <MessageContent content={q.question} />
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-neutral-400 bg-neutral-800 px-2 py-1 rounded-lg whitespace-nowrap">
                      [{q.marks} mark{q.marks !== 1 ? 's' : ''}]
                    </span>
                  </div>

                  {/* Answer area */}
                  <div className="p-4 sm:p-5">
                    <textarea
                      value={answers[i]}
                      onChange={e => setAnswers(prev => prev.map((a, idx) => idx === i ? e.target.value : a))}
                      placeholder="Write your answer here…"
                      rows={Math.max(3, Math.ceil(q.marks * 1.5))}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 outline-none resize-y focus:border-indigo-500/60 transition-colors"
                      style={{ minHeight: `${Math.max(80, q.marks * 28)}px` }}
                    />
                    {/* Hint toggle */}
                    <details className="mt-2">
                      <summary className="text-[11px] text-neutral-600 hover:text-neutral-400 cursor-pointer transition-colors list-none flex items-center gap-1">
                        <span>💡</span> Show hint
                      </summary>
                      <p className="text-[11px] text-amber-400/80 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2 mt-2 leading-relaxed">{q.hint}</p>
                    </details>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="mt-10 text-center">
              <p className="text-sm text-neutral-500 mb-4">{attemptedCount} of {questions.length} questions answered</p>
              <button
                onClick={() => setMode('results')}
                className="px-8 py-4 rounded-2xl font-bold text-base text-white border-none cursor-pointer transition-opacity"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Finish &amp; See Model Answers →
              </button>
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // ── RESULTS ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-8">
        {/* Results header */}
        <div className="bg-neutral-950 border-b border-neutral-800 px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-3xl mb-2">📋</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-1">Paper Complete</h1>
            <p className="text-neutral-400 text-sm">{subject} · {boardName} · {paperInfo.paperTitle}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-neutral-500">Answered</p>
                <p className="text-lg font-bold text-white">{attemptedCount}/{questions.length}</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-neutral-500">Total marks</p>
                <p className="text-lg font-bold text-indigo-400">{totalMarks}</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-neutral-500">Time</p>
                <p className="text-lg font-bold text-white">{getTimeSince()}</p>
              </div>
            </div>
            <button
              onClick={handleRevealAll}
              className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 text-white border-none cursor-pointer transition-colors"
            >
              Reveal all model answers
            </button>
          </div>
        </div>

        {/* Questions + answers */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {questions.map((q, i) => {
            const userAnswer = answers[i].trim();
            const isAttempted = userAnswer.length > 0;
            const isRevealed = revealed[i];

            return (
              <div key={i} className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900">
                {/* Question */}
                <div className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-neutral-800">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={`shrink-0 w-8 h-8 rounded-lg text-sm font-extrabold flex items-center justify-center ${isAttempted ? 'bg-emerald-500/15 text-emerald-400' : 'bg-neutral-800 text-neutral-500'}`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">{q.topic}</p>
                      <div className="text-sm text-neutral-200 leading-relaxed">
                        <MessageContent content={q.question} />
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-neutral-400 bg-neutral-800 px-2 py-1 rounded-lg whitespace-nowrap">
                    [{q.marks} mark{q.marks !== 1 ? 's' : ''}]
                  </span>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  {/* User answer */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Your answer</p>
                    {isAttempted ? (
                      <div className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                        {userAnswer}
                      </div>
                    ) : (
                      <div className="bg-neutral-800/50 border border-dashed border-neutral-700 rounded-xl px-4 py-3 text-sm text-neutral-600 italic">
                        Not attempted
                      </div>
                    )}
                  </div>

                  {/* Model answer */}
                  {isRevealed ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1.5">Model answer</p>
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-neutral-200 leading-relaxed">
                        <MessageContent content={q.answer} />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggleReveal(i)}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition-colors"
                    >
                      ✓ Reveal model answer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom nav */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { setAnswers(questions.map(() => '')); setRevealed(questions.map(() => false)); setMode('intro'); }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-neutral-300 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 cursor-pointer transition-colors"
          >
            ↺ Redo paper
          </button>
          <Link
            href={`/${boardName}/${encodeURIComponent(subject)}/papers`}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 text-center no-underline transition-colors flex items-center justify-center"
          >
            ← Back to papers
          </Link>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
