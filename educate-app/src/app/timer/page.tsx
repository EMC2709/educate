'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { useTimer } from '@/context/TimerContext';

const PRESETS = [
  { label: '25 / 5',  work: 25, break: 5  },
  { label: '50 / 10', work: 50, break: 10 },
  { label: '15 / 3',  work: 15, break: 3  },
];

interface SubjectEntry { subject: string; board: string; }

function getTimerStats() {
  try {
    const raw = localStorage.getItem('educate-timer-stats');
    if (raw) return JSON.parse(raw) as { totalMinutes: number; sessionsCompleted: number; bySubject: Record<string, number> };
  } catch {}
  return { totalMinutes: 0, sessionsCompleted: 0, bySubject: {} as Record<string, number> };
}

export default function TimerPage() {
  const router = useRouter();
  const { start, stop, phase, subject: activeSubject, board: activeBoard } = useTimer();

  const [subjects, setSubjects]       = useState<SubjectEntry[]>([]);
  const [selected, setSelected]       = useState('');
  const [preset, setPreset]           = useState(PRESETS[0]);
  const [useCustom, setUseCustom]     = useState(false);
  const [customWork, setCustomWork]   = useState(25);
  const [customBreak, setCustomBreak] = useState(5);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (cached) {
        const subs: SubjectEntry[] = JSON.parse(cached);
        setSubjects(subs);
        if (subs.length > 0) setSelected(subs[0].subject);
      }
    } catch {}
  }, []);

  const workMins  = useCustom ? customWork  : preset.work;
  const breakMins = useCustom ? customBreak : preset.break;
  const stats     = getTimerStats();

  const handleStart = () => {
    const entry = subjects.find(s => s.subject === selected);
    if (!entry) return;
    start(entry.subject, entry.board, workMins, breakMins);
    // Take them to the subject page to pick question type + topics
    router.push(`/${encodeURIComponent(entry.board)}/${encodeURIComponent(entry.subject)}`);
  };

  const handleGoToQuiz = () => {
    router.push(`/${encodeURIComponent(activeBoard)}/${encodeURIComponent(activeSubject)}`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="max-w-lg mx-auto">

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">⏰ Study Timer</h1>
            <p className="text-neutral-500 mt-1 text-sm">Set your subject, start the timer, and get revising.</p>
          </div>

          {/* Active timer notice */}
          {phase !== 'idle' && (
            <div className="mb-6 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-indigo-400 text-sm font-bold m-0">Timer running — {activeSubject}</p>
                <p className="text-neutral-400 text-xs m-0 mt-0.5">Timer widget shows bottom-right of your screen</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleGoToQuiz}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold cursor-pointer hover:bg-indigo-500/30 transition-colors"
                >
                  Go to Subject →
                </button>
                <button
                  onClick={stop}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold cursor-pointer hover:bg-rose-500/20 transition-colors"
                >
                  Stop
                </button>
              </div>
            </div>
          )}

          {/* Subject */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-neutral-400 block mb-2">Subject</label>
            <select
              value={selected}
              onChange={e => setSelected(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
            >
              {subjects.map(s => (
                <option key={s.subject} value={s.subject}>{s.subject} — {s.board}</option>
              ))}
            </select>
          </div>

          {/* Duration presets */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-neutral-400 block mb-2">Duration (work / break)</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { setPreset(p); setUseCustom(false); }}
                  className={`py-3 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all ${
                    !useCustom && preset === p
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400'
                      : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-700'
                  }`}
                >
                  {p.label} min
                </button>
              ))}
            </div>
            <button
              onClick={() => setUseCustom(true)}
              className={`w-full py-2 rounded-xl text-xs font-semibold border-2 cursor-pointer transition-all ${
                useCustom
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400'
                  : 'border-neutral-800 bg-transparent text-neutral-600 hover:border-neutral-700'
              }`}
            >
              Custom
            </button>
            {useCustom && (
              <div className="flex gap-3 mt-3">
                <div className="flex-1">
                  <label className="text-[10px] text-neutral-600 block mb-1">Work (min)</label>
                  <input type="number" min={5} max={120} value={customWork}
                    onChange={e => setCustomWork(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-neutral-600 block mb-1">Break (min)</label>
                  <input type="number" min={1} max={30} value={customBreak}
                    onChange={e => setCustomBreak(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* XP info */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-neutral-400 m-0">
              You&apos;ll earn <span className="text-amber-400 font-bold">{workMins * 2} XP</span> for completing this session
            </p>
          </div>

          {/* Start */}
          <button
            onClick={handleStart}
            disabled={!selected || phase !== 'idle'}
            className="w-full py-4 rounded-2xl text-lg font-bold border-none cursor-pointer transition-all bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {phase !== 'idle' ? 'Timer already running' : 'Start Focusing →'}
          </button>
          <p className="text-neutral-600 text-xs text-center mt-2">
            Timer stays visible while you revise — choose your question type once you get there
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white m-0">{stats.sessionsCompleted}</p>
              <p className="text-[10px] text-neutral-500 m-0">Sessions</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white m-0">{Math.round(stats.totalMinutes / 60 * 10) / 10}h</p>
              <p className="text-[10px] text-neutral-500 m-0">Total Time</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-amber-400 m-0">{stats.totalMinutes * 2}</p>
              <p className="text-[10px] text-neutral-500 m-0">XP Earned</p>
            </div>
          </div>

        </div>
      </div>
      <MobileNav />
    </div>
  );
}
