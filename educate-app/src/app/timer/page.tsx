'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { useToast } from '@/components/ui/Toast';
import { recordActivity, addDailyXP } from '@/lib/streak';
import { checkAchievements } from '@/lib/achievements';
import { useFocusMode } from '@/components/layout/FocusMode';
import { updateChallengeProgress, recordSubjectStudied } from '@/lib/challenges';

const PRESETS = [
  { label: '25 / 5', work: 25, break: 5 },
  { label: '50 / 10', work: 50, break: 10 },
  { label: '15 / 3', work: 15, break: 3 },
];

const TIMER_KEY = 'educate-timer-stats';

interface TimerStats {
  totalMinutes: number;
  sessionsCompleted: number;
  bySubject: Record<string, number>; // subject -> minutes
}

function getTimerStats(): TimerStats {
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalMinutes: 0, sessionsCompleted: 0, bySubject: {} };
}

function saveTimerSession(subject: string, minutes: number): TimerStats {
  const stats = getTimerStats();
  stats.totalMinutes += minutes;
  stats.sessionsCompleted += 1;
  stats.bySubject[subject] = (stats.bySubject[subject] || 0) + minutes;
  localStorage.setItem(TIMER_KEY, JSON.stringify(stats));
  return stats;
}

export default function TimerPage() {
  const { showToast } = useToast();
  const { focusActive, setFocusActive, setFocusSubject } = useFocusMode();
  const [enableFocus, setEnableFocus] = useState(true);
  const [subjects, setSubjects] = useState<{ subject: string; board: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [preset, setPreset] = useState(PRESETS[0]);
  const [customWork, setCustomWork] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [useCustom, setUseCustom] = useState(false);

  const [phase, setPhase] = useState<'idle' | 'work' | 'break' | 'done'>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionsThisRun, setSessionsThisRun] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stats = getTimerStats();

  // Load subjects
  useEffect(() => {
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (cached) {
        const subs = JSON.parse(cached);
        setSubjects(subs);
        if (subs.length > 0) setSelectedSubject(subs[0].subject);
      }
    } catch {}
  }, []);

  const workMinutes = useCustom ? customWork : preset.work;
  const breakMinutes = useCustom ? customBreak : preset.break;

  const startTimer = useCallback((seconds: number, newPhase: 'work' | 'break') => {
    setPhase(newPhase);
    setTimeLeft(seconds);
    setTotalTime(seconds);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && phase === 'work') {
      // Work session complete
      const mins = workMinutes;
      saveTimerSession(selectedSubject, mins);
      recordActivity();
      const xpEarned = Math.round(mins * 2); // 2 XP per minute
      addDailyXP(xpEarned);
      setSessionsThisRun(p => p + 1);

      showToast({
        icon: '\u{23F0}',
        title: `${mins} min session complete!`,
        description: `+${xpEarned} XP earned. Time for a break!`,
        type: 'success',
      });

      // Track challenge progress
      updateChallengeProgress('timer', 1);
      recordSubjectStudied(selectedSubject);

      // Check for completed challenges
      const { completed: completedChallenges } = updateChallengeProgress('timer', 0); // just check
      completedChallenges.forEach(c => {
        showToast({
          icon: c.icon,
          title: 'Challenge Complete!',
          description: `${c.title} — +${c.xpReward} XP`,
          type: 'xp',
          duration: 5000,
        });
      });

      // Check achievements
      const streakData = JSON.parse(localStorage.getItem('educate-streak') || '{}');
      const newAchievements = checkAchievements({
        streak: streakData.currentStreak || 0,
      });
      newAchievements.forEach(a => {
        showToast({
          icon: a.icon,
          title: `Achievement Unlocked!`,
          description: a.title,
          type: 'achievement',
          duration: 5000,
        });
      });

      // Auto-start break
      startTimer(breakMinutes * 60, 'break');
    } else if (timeLeft === 0 && phase === 'break') {
      setPhase('done');
      showToast({
        icon: '\u{2615}',
        title: 'Break over!',
        description: 'Ready for another session?',
        type: 'info',
      });
    }
  }, [timeLeft, phase, workMinutes, breakMinutes, selectedSubject, showToast, startTimer]);

  const handleStart = () => {
    startTimer(workMinutes * 60, 'work');
    if (enableFocus) {
      setFocusSubject(selectedSubject);
      setFocusActive(true);
    }
  };

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('idle');
    setTimeLeft(0);
    setFocusActive(false);
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleResume = () => {
    if (timeLeft > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progressPct = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const phaseColor = phase === 'work' ? '#6366f1' : phase === 'break' ? '#22c55e' : '#6366f1';

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {'\u{23F0}'} Study Timer
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">Focus. Revise. Earn XP.</p>
          </div>

          {phase === 'idle' || phase === 'done' ? (
            <>
              {/* Subject selector */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-neutral-400 block mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
                >
                  {subjects.map(s => (
                    <option key={s.subject} value={s.subject}>{s.subject}</option>
                  ))}
                  <option value="General">General Revision</option>
                </select>
              </div>

              {/* Preset selector */}
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
                      <input
                        type="number"
                        min={5}
                        max={120}
                        value={customWork}
                        onChange={e => setCustomWork(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-neutral-600 block mb-1">Break (min)</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={customBreak}
                        onChange={e => setCustomBreak(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Focus mode toggle */}
              <div className="mb-6">
                <button
                  onClick={() => setEnableFocus(p => !p)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    enableFocus
                      ? 'border-indigo-500/40 bg-indigo-500/10'
                      : 'border-neutral-800 bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{'\u{1F3AF}'}</span>
                    <span className="text-sm font-semibold text-white">Focus Mode</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${enableFocus ? 'bg-indigo-500' : 'bg-neutral-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enableFocus ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </button>
                <p className="text-[10px] text-neutral-600 mt-1 px-1">
                  {enableFocus ? 'Distraction-blocking overlay will activate when timer starts' : 'Focus overlay disabled'}
                </p>
              </div>

              {/* XP info */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-neutral-400 m-0">
                  You{'\u2019'}ll earn <span className="text-amber-400 font-bold">{workMinutes * 2} XP</span> for completing this session
                </p>
              </div>

              {/* Start button */}
              <button
                onClick={handleStart}
                className="w-full py-4 rounded-2xl text-lg font-bold border-none cursor-pointer transition-all bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500"
              >
                {phase === 'done' ? 'Start Another Session' : 'Start Focusing'}
              </button>

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
            </>
          ) : (
            <>
              {/* Active timer */}
              <div className="text-center mb-8">
                <div className="inline-block relative mb-6">
                  {/* Circular progress */}
                  <svg width="240" height="240" viewBox="0 0 240 240" className="transform -rotate-90">
                    <circle cx="120" cy="120" r="108" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                    <circle
                      cx="120" cy="120" r="108" fill="none"
                      stroke={phaseColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 108}`}
                      strokeDashoffset={`${2 * Math.PI * 108 * (1 - progressPct / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-white tabular-nums">
                      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                    </span>
                    <span
                      className="text-sm font-semibold mt-1 uppercase tracking-wider"
                      style={{ color: phaseColor }}
                    >
                      {phase === 'work' ? 'Focus Time' : 'Break'}
                    </span>
                  </div>
                </div>

                <p className="text-neutral-400 text-sm mb-6">
                  Studying <span className="text-white font-semibold">{selectedSubject}</span>
                </p>

                {/* Controls */}
                <div className="flex gap-3 justify-center">
                  {intervalRef.current ? (
                    <button
                      onClick={handlePause}
                      className="bg-neutral-800 border border-neutral-700 rounded-xl px-8 py-3 text-white font-semibold cursor-pointer hover:bg-neutral-700 transition-colors"
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={handleResume}
                      className="bg-indigo-500/20 border border-indigo-500 rounded-xl px-8 py-3 text-indigo-400 font-semibold cursor-pointer hover:bg-indigo-500/30 transition-colors"
                    >
                      Resume
                    </button>
                  )}
                  <button
                    onClick={handleStop}
                    className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-8 py-3 text-rose-400 font-semibold cursor-pointer hover:bg-rose-500/20 transition-colors"
                  >
                    Stop
                  </button>
                </div>

                {sessionsThisRun > 0 && (
                  <p className="text-neutral-600 text-xs mt-4">
                    {sessionsThisRun} session{sessionsThisRun !== 1 ? 's' : ''} completed this run
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <MobileNav />
      <audio ref={audioRef} preload="none" />
    </div>
  );
}
