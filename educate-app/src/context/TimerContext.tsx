'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { recordActivity, addDailyXP } from '@/lib/streak';
import { updateChallengeProgress, recordSubjectStudied } from '@/lib/challenges';

type Phase = 'idle' | 'work' | 'break' | 'done';

interface TimerState {
  phase: Phase;
  timeLeft: number;
  totalTime: number;
  subject: string;
  board: string;
  workMinutes: number;
  breakMinutes: number;
  sessionsThisRun: number;
  isRunning: boolean;
}

interface TimerContextType extends TimerState {
  start: (subject: string, board: string, workMins: number, breakMins: number) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

const DEFAULT: TimerState = {
  phase: 'idle',
  timeLeft: 0,
  totalTime: 0,
  subject: '',
  board: '',
  workMinutes: 25,
  breakMinutes: 5,
  sessionsThisRun: 0,
  isRunning: false,
};

const TimerCtx = createContext<TimerContextType>({
  ...DEFAULT,
  start: () => {},
  stop: () => {},
  pause: () => {},
  resume: () => {},
});

export function useTimer() { return useContext(TimerCtx); }

// ── Floating mini-timer widget ────────────────────────────────────────────────

function FloatingTimer() {
  const { phase, timeLeft, totalTime, subject, isRunning, stop, pause, resume, sessionsThisRun } = useTimer();

  if (phase === 'idle') return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const pct  = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const color = phase === 'work' ? '#6366f1' : '#22c55e';
  const r = 20;
  const circ = 2 * Math.PI * r;

  return (
    <div
      className="fixed bottom-20 right-4 md:bottom-6 z-[60] select-none"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}
    >
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[220px]">

        {/* Circular progress ring */}
        <div className="relative shrink-0 w-11 h-11">
          <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
            <circle cx="22" cy="22" r={r} fill="none" stroke="#2a2a2a" strokeWidth="3" />
            <circle
              cx="22" cy="22" r={r}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct / 100)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-bold tabular-nums" style={{ color }}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide m-0" style={{ color }}>
            {phase === 'work' ? 'Focus' : phase === 'break' ? 'Break' : 'Done'}
          </p>
          <p className="text-white text-xs font-semibold m-0 truncate">{subject}</p>
          {sessionsThisRun > 0 && (
            <p className="text-neutral-600 text-[9px] m-0">{sessionsThisRun} session{sessionsThisRun !== 1 ? 's' : ''} done</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-1 shrink-0">
          {phase !== 'done' && (
            <button
              onClick={isRunning ? pause : resume}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs cursor-pointer transition-colors border-none"
              style={{ backgroundColor: isRunning ? '#3f3f3f' : `${color}22`, color: isRunning ? '#a3a3a3' : color }}
              title={isRunning ? 'Pause' : 'Resume'}
            >
              {isRunning ? '⏸' : '▶'}
            </button>
          )}
          <button
            onClick={stop}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs cursor-pointer bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors border-none"
            title="Stop timer"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TimerState>(DEFAULT);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTick = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.timeLeft <= 1) {
        clearTick();
        return { ...prev, timeLeft: 0, isRunning: false };
      }
      return { ...prev, timeLeft: prev.timeLeft - 1 };
    });
  }, []);

  const beginInterval = useCallback(() => {
    clearTick();
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  // Handle timeLeft hitting 0
  useEffect(() => {
    if (state.timeLeft !== 0 || state.phase === 'idle' || state.phase === 'done') return;

    if (state.phase === 'work') {
      // Work session complete — earn XP, auto-start break
      const mins = state.workMinutes;
      const xp   = Math.round(mins * 2);
      recordActivity();
      addDailyXP(xp);
      updateChallengeProgress('timer', 1);
      recordSubjectStudied(state.subject);

      // Save to localStorage stats
      try {
        const raw   = localStorage.getItem('educate-timer-stats');
        const stats = raw ? JSON.parse(raw) : { totalMinutes: 0, sessionsCompleted: 0, bySubject: {} };
        stats.totalMinutes += mins;
        stats.sessionsCompleted += 1;
        stats.bySubject[state.subject] = (stats.bySubject[state.subject] || 0) + mins;
        localStorage.setItem('educate-timer-stats', JSON.stringify(stats));
      } catch {}

      const breakSecs = state.breakMinutes * 60;
      setState(prev => ({
        ...prev,
        phase: 'break',
        timeLeft: breakSecs,
        totalTime: breakSecs,
        sessionsThisRun: prev.sessionsThisRun + 1,
        isRunning: true,
      }));
      beginInterval();
    } else if (state.phase === 'break') {
      setState(prev => ({ ...prev, phase: 'done', isRunning: false }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timeLeft, state.phase]);

  const start = useCallback((subject: string, board: string, workMins: number, breakMins: number) => {
    clearTick();
    const secs = workMins * 60;
    setState({
      phase: 'work',
      timeLeft: secs,
      totalTime: secs,
      subject,
      board,
      workMinutes: workMins,
      breakMinutes: breakMins,
      sessionsThisRun: 0,
      isRunning: true,
    });
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const stop = useCallback(() => {
    clearTick();
    setState(DEFAULT);
  }, []);

  const pause = useCallback(() => {
    clearTick();
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resume = useCallback(() => {
    if (state.timeLeft > 0) {
      beginInterval();
      setState(prev => ({ ...prev, isRunning: true }));
    }
  }, [state.timeLeft, beginInterval]);

  useEffect(() => () => clearTick(), []);

  return (
    <TimerCtx.Provider value={{ ...state, start, stop, pause, resume }}>
      {children}
      <FloatingTimer />
    </TimerCtx.Provider>
  );
}
