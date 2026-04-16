'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { getStreakData, getDailyXP } from '@/lib/streak';
import { getNextExam, getDaysUntil, type ExamDate } from '@/lib/exam-dates';
import { getChallenges, type Challenge } from '@/lib/challenges';
import { BoardCard } from '@/components/home/BoardCard';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { ChatPanel } from '@/components/layout/ChatPanel';

interface UserSubject {
  subject: string;
  board: string;
}

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematics': '\u{1F4D0}',
  'English Language': '\u{1F4DD}',
  'English Literature': '\u{1F4DA}',
  'Biology': '\u{1F9EC}',
  'Chemistry': '\u{2697}\uFE0F',
  'Physics': '\u{269B}\uFE0F',
  'Combined Science': '\u{1F52C}',
  'History': '\u{1F3DB}\uFE0F',
  'Geography': '\u{1F30D}',
  'French': '\u{1F1EB}\u{1F1F7}',
  'Spanish': '\u{1F1EA}\u{1F1F8}',
  'German': '\u{1F1E9}\u{1F1EA}',
  'Chinese': '\u{1F1E8}\u{1F1F3}',
  'Welsh': '\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}',
  'Religious Studies': '\u{1F54C}',
  'Computer Science': '\u{1F4BB}',
  'Art & Design': '\u{1F3A8}',
  'Music': '\u{1F3B5}',
  'Drama': '\u{1F3AD}',
  'Physical Education': '\u{26BD}',
  'Sociology': '\u{1F465}',
  'Psychology': '\u{1F9E0}',
  'Business Studies': '\u{1F4C8}',
  'Economics': '\u{1F4B0}',
  'Design & Technology': '\u{1F527}',
  'Food Preparation & Nutrition': '\u{1F373}',
  'Graphic Communication': '\u{1F4D0}',
};

export default function HomePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [subjects, setSubjects] = useState<UserSubject[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  // Fallback: if Clerk doesn't signal isLoaded within 5s, show guest view
  const [clerkTimedOut, setClerkTimedOut] = useState(false);
  useEffect(() => {
    if (isLoaded) return;
    const t = setTimeout(() => setClerkTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    // ── Fast path: returning user with cached subjects ─────────────────────
    // Show the dashboard immediately from cache, then verify role + refresh
    // subjects in the background. Avoids waiting for Clerk API + DB cold start.
    const cached = localStorage.getItem('educate-user-subjects');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubjects(parsed);
          setLoading(false);

          // Background refresh: check role in case it changed, update subjects
          fetch('/api/profile')
            .then(r => r.ok ? r.json() : null)
            .then((profileData: { role?: string; org_id?: string | null } | null) => {
              if (!profileData) return;
              const role = profileData.role ?? 'student';
              if (['teacher', 'school_admin', 'super_admin'].includes(role)) {
                setRedirecting(true);
                router.replace('/teacher');
                return;
              }
              if (role === 'student' && profileData.org_id) {
                setRedirecting(true);
                router.replace('/student');
                return;
              }
              // Silently refresh subjects list
              fetch('/api/user-subjects')
                .then(r2 => r2.ok ? r2.json() : null)
                .then(data => {
                  if (data?.subjects?.length > 0) {
                    setSubjects(data.subjects);
                    localStorage.setItem('educate-user-subjects', JSON.stringify(data.subjects));
                  }
                })
                .catch(() => {});
            })
            .catch(() => {});
          return;
        }
      } catch {}
    }

    // ── Slow path: first-time or no cache ────────────────────────────────
    // Must determine role before showing anything (teacher redirect etc.)
    function fetchWithTimeout(url: string, ms: number) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), ms);
      return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
    }

    fetchWithTimeout('/api/profile', 10000)
      .then(r => r.ok ? r.json() : {})
      .then((profileData: { role?: string; org_id?: string | null }) => {
        const role = profileData.role ?? 'student';

        if (['teacher', 'school_admin', 'super_admin'].includes(role)) {
          setRedirecting(true);
          router.replace('/teacher');
          return;
        }
        if (role === 'student' && profileData.org_id) {
          setRedirecting(true);
          router.replace('/student');
          return;
        }

        fetchWithTimeout('/api/user-subjects', 8000)
          .then(r2 => r2.ok ? r2.json() : { subjects: [] })
          .then(data => {
            if (!data.subjects || data.subjects.length === 0) {
              setRedirecting(true);
              router.push('/onboarding');
            } else {
              setSubjects(data.subjects);
              localStorage.setItem('educate-user-subjects', JSON.stringify(data.subjects));
              setLoading(false);
            }
          })
          .catch(() => { setRedirecting(true); router.push('/onboarding'); });
      })
      .catch(() => { setRedirecting(true); router.push('/onboarding'); });
  }, [isSignedIn, isLoaded, router]);

  // Clerk didn't load in time, or user is not signed in — show guest view
  if (clerkTimedOut || (!isSignedIn && isLoaded)) {
    return <GuestHome />;
  }

  // Still waiting on Clerk or fetching subjects
  if (!isLoaded || loading || redirecting || !subjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading your subjects...</div>
      </div>
    );
  }

  const firstName = user?.firstName ?? 'there';

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex min-h-screen">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 sm:mb-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white m-0">
                Hey {firstName} {'\u{1F44B}'}
              </h1>
              <p className="text-neutral-500 mt-1 text-sm sm:text-base">
                What do you want to revise today?
              </p>
            </div>

            {/* Streak & Daily Goal */}
            <StreakWidget />

            {/* Exam Countdown + Weekly Challenges */}
            <ExamCountdownWidget />
            <WeeklyChallengesWidget />

            {/* Subject cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {subjects.map(({ subject, board }) => {
                const boardCfg = EXAM_BOARDS[board];
                const accent = boardCfg?.accent ?? '#6366f1';
                return (
                  <Link
                    key={`${board}-${subject}`}
                    href={`/${board}/${encodeURIComponent(subject)}`}
                    className="no-underline"
                  >
                    <div
                      className="bg-neutral-900 border-2 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 flex flex-col items-center text-center min-h-[120px] justify-center"
                      style={{ borderColor: '#2a2a2a' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = accent;
                        e.currentTarget.style.backgroundColor = `${accent}10`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#2a2a2a';
                        e.currentTarget.style.backgroundColor = '';
                      }}
                    >
                      <span className="text-2xl sm:text-3xl mb-2">{SUBJECT_ICONS[subject] ?? '\u{1F4D6}'}</span>
                      <span className="text-sm font-semibold text-white leading-tight">{subject}</span>
                      <span className="text-[10px] mt-1.5 px-2 py-0.5 rounded-md font-medium" style={{ color: accent, backgroundColor: `${accent}22` }}>
                        {board}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Today's Sessions from timetable */}
            <TodaySessions subjects={subjects} />

            {/* Free Practice Hub */}
            <div className="mt-8 mb-4">
              <Link href="/practice" className="no-underline block">
                <div className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 border border-indigo-500/25 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-indigo-500/50 transition-all cursor-pointer">
                  <span className="text-2xl sm:text-3xl">{'\u{1F4DD}'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white m-0">Free Practice Hub</h3>
                    <p className="text-neutral-400 text-xs m-0 truncate">Pick any subject &amp; practise from the question bank — 11+, GCSE, A-Level</p>
                  </div>
                  <span className="text-indigo-400 hidden sm:block font-bold">{'\u2192'}</span>
                </div>
              </Link>
            </div>

            {/* Quick links */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link href="/timetable" className="no-underline flex-1">
                <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex items-center gap-3 hover:border-amber-500/40 transition-all cursor-pointer">
                  <span className="text-2xl sm:text-3xl">{'\u{1F4C5}'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white m-0">Revision Timetable</h3>
                    <p className="text-neutral-400 text-xs m-0 truncate">Plan your revision schedule</p>
                  </div>
                  <span className="text-neutral-500 hidden sm:block">{'\u2192'}</span>
                </div>
              </Link>
              <Link href="/games" className="no-underline flex-1">
                <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-rose-500/20 rounded-2xl p-4 sm:p-5 flex items-center gap-3 hover:border-rose-500/40 transition-all cursor-pointer">
                  <span className="text-2xl sm:text-3xl">{'\u{1F3AE}'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white m-0">Game Zone</h3>
                    <p className="text-neutral-400 text-xs m-0 truncate">XP, leaderboard, mini-games</p>
                  </div>
                  <span className="text-neutral-500 hidden sm:block">{'\u2192'}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
      </div>
      <MobileNav />
    </div>
  );
}

function ExamCountdownWidget() {
  const [nextExam, setNextExam] = useState<ExamDate | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const exam = getNextExam();
    if (exam) {
      setNextExam(exam);
      setDaysLeft(getDaysUntil(exam.date));
    }
  }, []);

  if (!nextExam || daysLeft == null) return null;

  const urgencyColor = daysLeft <= 7 ? 'from-rose-500/15 to-red-500/10 border-rose-500/25' :
    daysLeft <= 30 ? 'from-amber-500/10 to-orange-500/10 border-amber-500/25' :
    'from-emerald-500/10 to-green-500/10 border-emerald-500/25';
  const textColor = daysLeft <= 7 ? 'text-rose-400' : daysLeft <= 30 ? 'text-amber-400' : 'text-emerald-400';

  return (
    <Link href="/exams" className="no-underline block mb-4">
      <div className={`bg-gradient-to-r ${urgencyColor} border rounded-2xl p-4 flex items-center gap-4 hover:opacity-90 transition-all cursor-pointer`}>
        <div className="text-center shrink-0">
          <p className={`text-2xl font-extrabold m-0 ${textColor}`}>
            {daysLeft === 0 ? 'TODAY' : daysLeft}
          </p>
          {daysLeft > 0 && <p className={`text-[10px] m-0 ${textColor}`}>days</p>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white m-0 truncate">
            {nextExam.subject} {'\u2014'} {nextExam.paper}
          </p>
          <p className="text-xs text-neutral-500 m-0">
            {new Date(nextExam.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            {nextExam.time ? ` at ${nextExam.time}` : ''}
          </p>
        </div>
        <span className="text-neutral-500 hidden sm:block">{'\u2192'}</span>
      </div>
    </Link>
  );
}

function WeeklyChallengesWidget() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const week = getChallenges();
    setChallenges(week.challenges);
  }, []);

  if (challenges.length === 0) return null;

  const completedCount = challenges.filter(c => c.completed).length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 m-0">
          {'\u{1F3AF}'} Weekly Challenges
        </h2>
        <span className="text-[10px] text-neutral-500">{completedCount}/{challenges.length} done</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {challenges.map(c => (
          <div
            key={c.id}
            className={`border rounded-xl p-3 ${
              c.completed
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">{c.completed ? '\u{2705}' : c.icon}</span>
              <span className={`text-xs font-bold ${c.completed ? 'text-emerald-400' : 'text-white'}`}>{c.title}</span>
            </div>
            <p className="text-[10px] text-neutral-500 m-0 mb-1.5">{c.description}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${c.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${Math.min((c.progress / c.target) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-neutral-600">{c.progress}/{c.target}</span>
              <span className="text-[9px] text-amber-500 font-bold">+{c.xpReward}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreakWidget() {
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [daily, setDaily] = useState({ earned: 0, goal: 50 });

  useEffect(() => {
    setStreak(getStreakData());
    setDaily(getDailyXP());
  }, []);

  const goalPct = daily.goal > 0 ? Math.min((daily.earned / daily.goal) * 100, 100) : 0;
  const goalMet = daily.earned >= daily.goal;

  return (
    <div className="flex gap-3 mb-6">
      {/* Streak card */}
      <div className="flex-1 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-3xl">{streak.currentStreak > 0 ? '\u{1F525}' : '\u{2744}\uFE0F'}</span>
        <div>
          <p className="text-lg font-bold text-white m-0">
            {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-neutral-500 m-0">
            {streak.currentStreak > 0 ? 'Current streak' : 'Start your streak!'}
          </p>
        </div>
      </div>
      {/* Daily XP goal */}
      <div className="flex-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-400">Daily Goal</span>
          <span className={`text-xs font-bold ${goalMet ? 'text-emerald-400' : 'text-indigo-400'}`}>
            {daily.earned}/{daily.goal} XP
          </span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${goalMet ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
            style={{ width: `${goalPct}%` }}
          />
        </div>
        {goalMet && (
          <p className="text-[10px] text-emerald-400 m-0 mt-1">{'\u2713'} Goal reached!</p>
        )}
      </div>
    </div>
  );
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SESSION_COLORS: Record<string, string> = {
  'Mathematics': '#a78bfa', 'English Language': '#f472b6', 'English Literature': '#f472b6',
  'Biology': '#4ade80', 'Chemistry': '#fb923c', 'Physics': '#60a5fa',
  'Combined Science': '#38bdf8', 'History': '#fbbf24', 'Geography': '#a3e635',
  'French': '#f87171', 'Spanish': '#f87171', 'German': '#fbbf24',
  'Computer Science': '#38bdf8', 'Business Studies': '#2dd4bf', 'Psychology': '#a78bfa',
  'Religious Studies': '#c084fc', 'Sociology': '#60a5fa', 'Economics': '#fbbf24',
};

function TodaySessions({ subjects }: { subjects: UserSubject[] }) {
  const sessions = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('educate-timetable');
      if (!raw) return [];
      const tt = JSON.parse(raw);
      const start = new Date(tt.startDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 0) return [];
      const totalDays = tt.weeks * 7;
      if (daysDiff >= totalDays) return [];

      const weekIndex = Math.floor(daysDiff / 7);
      const dayName = DAYS_OF_WEEK[today.getDay()];
      const key = `${weekIndex}-${dayName}`;
      const slots: { subject: string; time: string }[] = tt.schedule[key] || [];
      return slots.filter(s => s.subject);
    } catch { return []; }
  }, []);

  if (sessions.length === 0) return null;

  // Match subjects to boards for linking
  const subjectBoardMap = new Map(subjects.map(s => [s.subject, s.board]));

  return (
    <div className="mt-6 mb-2">
      <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        {'\u{1F4C5}'} Today{'\u2019'}s Sessions
      </h2>
      <div className="flex flex-col gap-2">
        {sessions.map((slot, i) => {
          const color = SESSION_COLORS[slot.subject] || '#6366f1';
          const board = subjectBoardMap.get(slot.subject);
          const href = board ? `/${board}/${encodeURIComponent(slot.subject)}` : null;
          const icon = SUBJECT_ICONS[slot.subject] ?? '\u{1F4D6}';

          return (
            <div
              key={i}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white m-0 truncate">{slot.subject}</p>
                <p className="text-xs text-neutral-500 m-0">{slot.time}</p>
              </div>
              {href && (
                <Link
                  href={href}
                  className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-lg no-underline hover:bg-indigo-500/25 transition-colors shrink-0"
                >
                  Start Revising
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Guest home — shows exam board cards (original layout) */
function GuestHome() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex min-h-screen">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent m-0">
              GCSE Revision, Sorted.
            </h1>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base">
              Sign in to personalise your dashboard, or pick an exam board to start
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
            {Object.entries(EXAM_BOARDS).map(([name, cfg]) => (
              <BoardCard key={name} name={name} board={cfg} />
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-8">
            <Link href="/games" className="no-underline block">
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20 rounded-2xl p-5 sm:p-6 flex items-center gap-4 hover:border-amber-500/40 transition-all cursor-pointer">
                <span className="text-3xl sm:text-4xl">{'\u{1F3AE}'}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white m-0">Game Zone</h3>
                  <p className="text-neutral-400 text-sm m-0">Earn XP, climb the leaderboard, play Noughts &amp; Crosses with friends</p>
                </div>
                <span className="text-neutral-500 text-xl hidden sm:block">{'\u2192'}</span>
              </div>
            </Link>
          </div>
        </div>
        
      </div>
      <MobileNav />
    </div>
  );
}
