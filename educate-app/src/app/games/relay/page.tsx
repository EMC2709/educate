'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { QUESTION_BANK } from '@/data/question-bank';
import { shuffle } from '@/lib/shuffle';
import type { Question } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'racing' | 'finished';
type Difficulty = 'easy' | 'hard';
interface MCQ { options: string[]; correctIndex: number }
interface RaceQuestion { question: Question; mcq: MCQ }

// ─── Config ───────────────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG = {
  easy: { total: 20, needed: 10 },
  hard: { total: 15, needed: 12 },
} as const;
const LABELS = ['A', 'B', 'C', 'D'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getShort(subject: string): Question[] {
  const bank = QUESTION_BANK[subject];
  return bank && Array.isArray(bank.short) ? bank.short : [];
}

const SUBJECTS = Object.keys(QUESTION_BANK).filter(s => getShort(s).length >= 5);

function generateMCQ(correct: string, pool: Question[]): MCQ {
  const clean = (s: string) => s.split('\n')[0].replace(/^\d+[\.\)]\s*/, '').trim().slice(0, 80);
  const correctClean = clean(correct);
  const wrongs: string[] = [];
  const seen = new Set([correctClean.toLowerCase()]);
  for (const q of pool) {
    for (const c of [...(q.acceptedAnswers ?? []), q.answer.split('\n')[0].trim()]) {
      const t = c.trim().slice(0, 80);
      if (t.length > 3 && t.length < 80 && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase()); wrongs.push(t);
        if (wrongs.length >= 15) break;
      }
    }
    if (wrongs.length >= 15) break;
  }
  const distractors = shuffle(wrongs).slice(0, 3);
  while (distractors.length < 3) {
    distractors.push(['Not applicable', 'Cannot be determined', 'None of the above'][distractors.length]);
  }
  const opts = shuffle([correctClean, ...distractors]);
  return { options: opts, correctIndex: opts.indexOf(correctClean) };
}

function buildQuestions(subject: string, total: number): RaceQuestion[] {
  const pool = shuffle(getShort(subject));
  return pool.slice(0, Math.min(total, pool.length)).map(q => ({ question: q, mcq: generateMCQ(q.answer, pool) }));
}

function awardXP(isCorrect: boolean) {
  fetch('/api/award-xp', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marksAwarded: isCorrect ? 1 : 0, questionType: 'short', attempted: true }) })
    .then(r => r.json()).then((d: { xpGained?: number }) => {
      if ((d.xpGained ?? 0) > 0) window.dispatchEvent(new Event('educate-xp-updated'));
    }).catch(() => {});
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RunningRelayPage() {
  const [subject, setSubject] = useState(SUBJECTS[0] ?? 'Biology');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [phase, setPhase] = useState<Phase>('setup');
  const [questions, setQuestions] = useState<RaceQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [won, setWon] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);
  useEffect(() => () => stopTimer(), [stopTimer]);

  const cfg = DIFFICULTY_CONFIG[difficulty];
  const progress = Math.min((correct / cfg.needed) * 100, 100);
  const currentQ = questions[qIndex] ?? null;

  function startRace() {
    setQuestions(buildQuestions(subject, cfg.total));
    setQIndex(0); setCorrect(0); setWrong(0); setStreak(0);
    setSelected(null); setRevealed(false); setWon(false); setElapsedMs(0);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => setElapsedMs(Date.now() - startRef.current), 500);
    setPhase('racing');
  }

  function selectOption(idx: number) {
    if (revealed || !currentQ) return;
    setSelected(idx);
    setRevealed(true);
    const isCorrect = idx === currentQ.mcq.correctIndex;
    awardXP(isCorrect);
    const newCorrect = isCorrect ? correct + 1 : correct;
    const newStreak = isCorrect ? streak + 1 : 0;
    if (isCorrect) setCorrect(newCorrect);
    else setWrong(w => w + 1);
    setStreak(newStreak);

    if (isCorrect && newCorrect >= cfg.needed) {
      stopTimer(); setElapsedMs(Date.now() - startRef.current);
      setTimeout(() => { setWon(true); setPhase('finished'); }, 1500);
      return;
    }
    setTimeout(() => {
      const next = qIndex + 1;
      if (next >= questions.length) {
        stopTimer(); setElapsedMs(Date.now() - startRef.current);
        setWon(newCorrect >= cfg.needed); setPhase('finished');
      } else { setQIndex(next); setSelected(null); setRevealed(false); }
    }, 1500);
  }

  // ─── Setup ────────────────────────────────────────────────────────────────

  if (phase === 'setup') return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Game Zone</Link>
        <div className="text-center mt-6 mb-7">
          <div className="text-5xl mb-2">&#127939;</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Running Relay</h1>
          <p className="text-neutral-500 text-sm">Answer correctly to sprint to the finish line!</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-4">
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-3">Subject</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
            {SUBJECTS.map(s => (
              <button key={s} onClick={() => setSubject(s)}
                className="text-xs py-2 px-3 rounded-lg border-2 bg-transparent cursor-pointer transition-all text-left truncate"
                style={subject === s
                  ? { borderColor: '#22c55e', backgroundColor: '#22c55e1a', color: '#22c55e' }
                  : { borderColor: '#262626', color: '#9ca3af' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-3">Difficulty</p>
          <div className="grid grid-cols-2 gap-3">
            {(['easy', 'hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className="rounded-xl border-2 p-4 text-left cursor-pointer transition-all bg-transparent"
                style={difficulty === d ? { borderColor: '#22c55e', backgroundColor: '#22c55e0d' } : { borderColor: '#262626' }}>
                <div className="text-xl mb-1">{d === 'easy' ? '\uD83D\uDD25' : '\u26A1'}</div>
                <p className="font-bold text-white text-sm capitalize">{d}</p>
                <p className="text-neutral-500 text-xs mt-0.5">{DIFFICULTY_CONFIG[d].total}q &mdash; need {DIFFICULTY_CONFIG[d].needed} correct</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={startRace}
            className="flex-1 py-4 rounded-2xl font-bold text-white text-base border-none cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
            &#127939; Start Solo Race
          </button>
          <Link href="/games/relay/online"
            className="flex-1 py-4 rounded-2xl font-bold text-white text-base text-center no-underline cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
            &#127939;&#127939; Play Online
          </Link>
        </div>
      </div>
    </div>
  );

  // ─── Finished ─────────────────────────────────────────────────────────────

  if (phase === 'finished') {
    const total = correct + wrong;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
        <Navbar />
        <div className="max-w-lg mx-auto p-4 sm:p-6 text-center">
          <div className="mt-10 mb-6">
            {won ? (
              <><div className="text-6xl mb-2">&#127942;</div>
                <div className="text-2xl mb-1">&#127881;&#127939;&#127881;</div>
                <h2 className="text-2xl font-bold text-white">You crossed the finish line!</h2>
                <p className="text-emerald-400 text-sm mt-1">Outstanding effort!</p></>
            ) : (
              <><div className="text-6xl mb-2">&#128170;</div>
                <h2 className="text-2xl font-bold text-white">Keep training!</h2>
                <p className="text-neutral-500 text-sm mt-1">Needed {cfg.needed} correct &mdash; you got {correct}. So close!</p></>
            )}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6 text-left space-y-3">
            {[
              ['Subject', subject, '#d4d4d4'],
              ['Correct', `${correct} / ${cfg.needed} needed`, '#4ade80'],
              ['Accuracy', `${accuracy}%`, '#d4d4d4'],
              ['Time', fmt(elapsedMs), '#d4d4d4'],
            ].map(([label, value, color]) => (
              <div key={label as string} className="flex justify-between items-center">
                <span className="text-neutral-400 text-sm">{label}</span>
                <span className="font-bold text-sm" style={{ color: color as string }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={startRace}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm border-none cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
              &#128260; Try Again
            </button>
            <button onClick={() => setPhase('setup')}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm border-none cursor-pointer hover:bg-neutral-700 transition-colors"
              style={{ backgroundColor: '#262626' }}>
              &#127939; New Race
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Racing ───────────────────────────────────────────────────────────────

  const correctNeeded = Math.max(0, cfg.needed - correct);
  const runnerLeft = Math.max(4, Math.min(progress, 90));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Game Zone</Link>
          <div className="flex items-center gap-2">
            {streak >= 3 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#f97316', color: '#fff' }}>
                &#128293; On fire! {streak}x
              </span>
            )}
            <span className="text-neutral-500 text-sm font-mono">{fmt(elapsedMs)}</span>
          </div>
        </div>

        {/* Track */}
        <div className="relative rounded-2xl overflow-hidden mb-4"
          style={{ background: 'linear-gradient(180deg,#14532d,#15803d 50%,#166534)', height: '88px', border: '1px solid #166534' }}>
          {/* Dashed lane lines */}
          {[0.33, 0.66].map(pos => (
            <div key={pos} className="absolute w-full pointer-events-none"
              style={{ top: `${pos * 100}%`, height: '1px',
                background: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.12) 0,rgba(255,255,255,0.12) 10px,transparent 10px,transparent 20px)' }} />
          ))}
          {/* Flags */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-lg select-none">&#128681;</div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg select-none">&#127937;</div>
          {/* Runner */}
          <div className="absolute top-1/2 -translate-y-1/2 text-2xl select-none"
            style={{ left: `calc(${runnerLeft}% - 12px)`, transition: 'left 0.5s ease',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
              animation: revealed ? 'none' : 'runnerBounce 0.6s ease-in-out infinite alternate' }}>
            &#127939;
          </div>
          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 h-1 rounded-full"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#4ade80,#86efac)', transition: 'width 0.5s ease' }} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { icon: '&#9989;', val: correct, label: 'Correct', color: '#4ade80' },
            { icon: '&#10060;', val: wrong, label: 'Wrong', color: '#f87171' },
            { icon: '&#127919;', val: correctNeeded, label: 'Needed', color: '#fbbf24' },
            { icon: '&#128196;', val: questions.length - qIndex, label: 'Left', color: '#d4d4d4' },
          ].map(({ icon, val, label, color }) => (
            <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
              <div className="text-base" dangerouslySetInnerHTML={{ __html: icon }} />
              <div className="font-bold text-base leading-none mt-0.5" style={{ color }}>{val}</div>
              <div className="text-neutral-600 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Question card */}
        {currentQ && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <div className="flex justify-between mb-3">
              <span className="text-xs text-neutral-500">Question {qIndex + 1} of {questions.length}</span>
              <span className="text-xs text-neutral-600">{subject}</span>
            </div>
            <p className="text-white text-sm sm:text-base font-medium leading-relaxed mb-4">{currentQ.question.question}</p>

            <div className="space-y-2">
              {currentQ.mcq.options.map((opt, i) => {
                const isCorrectOpt = i === currentQ.mcq.correctIndex;
                const isChosen = selected === i;
                let bg = '#1a1a1a', border = '#2a2a2a', textColor = '#d4d4d4';
                if (revealed) {
                  if (isCorrectOpt) { bg = '#14532d'; border = '#22c55e'; textColor = '#4ade80'; }
                  else if (isChosen) { bg = '#450a0a'; border = '#ef4444'; textColor = '#fca5a5'; }
                }
                return (
                  <button key={i} onClick={() => selectOption(i)} disabled={revealed}
                    className="w-full text-left rounded-xl border-2 px-4 py-3 text-sm font-medium cursor-pointer transition-all disabled:cursor-default flex items-center gap-3"
                    style={{ backgroundColor: bg, borderColor: border, color: textColor }}>
                    <span className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: revealed && isCorrectOpt ? '#22c55e' : revealed && isChosen ? '#ef4444' : '#2a2a2a',
                        color: revealed && (isCorrectOpt || isChosen) ? '#fff' : '#9ca3af' }}>
                      {LABELS[i]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {revealed && isCorrectOpt && <span className="text-emerald-400">&#10003;</span>}
                    {revealed && isChosen && !isCorrectOpt && <span className="text-red-400">&#10007;</span>}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className="mt-4 rounded-xl px-4 py-3 text-center text-sm font-semibold"
                style={selected === currentQ.mcq.correctIndex
                  ? { backgroundColor: '#14532d', color: '#4ade80' }
                  : { backgroundColor: '#450a0a', color: '#fca5a5' }}>
                {selected === currentQ.mcq.correctIndex
                  ? '\u2705 Correct! Runner advancing\u2026'
                  : `\u274C Wrong! Correct: ${currentQ.mcq.options[currentQ.mcq.correctIndex]}`}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes runnerBounce {
          from { transform: translateY(-50%) translateY(0px); }
          to   { transform: translateY(-50%) translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
