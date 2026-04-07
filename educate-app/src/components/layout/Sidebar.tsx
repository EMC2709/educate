'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { levelFromXP, levelProgress, getLevelTitle } from '@/lib/xp-client';
import { getStreakData } from '@/lib/streak';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '\u{1F3E0}' },
  { href: '/timetable', label: 'Timetable', icon: '\u{1F4C5}' },
  { href: '/exams', label: 'Exam Countdown', icon: '\u{23F3}' },
  { href: '/timer', label: 'Study Timer', icon: '\u{23F0}' },
  { href: '/notes', label: 'Notes', icon: '\u{1F4DD}' },
  { href: '/mastery', label: 'Topic Mastery', icon: '\u{1F5FA}\uFE0F' },
  { href: '/progress', label: 'Progress', icon: '\u{1F4CA}' },
  { href: '/achievements', label: 'Achievements', icon: '\u{1F3C6}' },
  { href: '/games', label: 'Games', icon: '\u{1F3AE}' },
  { href: '/boards', label: 'Exam Boards', icon: '\u{1F4CB}' },
  { href: '/export', label: 'Share & Export', icon: '\u{1F4E4}' },
];

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematics': '\u{1F4D0}', 'English Language': '\u{1F4DD}', 'English Literature': '\u{1F4DA}',
  'Biology': '\u{1F9EC}', 'Chemistry': '\u{2697}\uFE0F', 'Physics': '\u{269B}\uFE0F',
  'Combined Science': '\u{1F52C}', 'History': '\u{1F3DB}\uFE0F', 'Geography': '\u{1F30D}',
  'French': '\u{1F1EB}\u{1F1F7}', 'Spanish': '\u{1F1EA}\u{1F1F8}', 'German': '\u{1F1E9}\u{1F1EA}',
  'Chinese': '\u{1F1E8}\u{1F1F3}', 'Religious Studies': '\u{1F54C}', 'Computer Science': '\u{1F4BB}',
  'Art & Design': '\u{1F3A8}', 'Music': '\u{1F3B5}', 'Drama': '\u{1F3AD}',
  'Physical Education': '\u{26BD}', 'Sociology': '\u{1F465}', 'Psychology': '\u{1F9E0}',
  'Business Studies': '\u{1F4C8}', 'Economics': '\u{1F4B0}', 'Design & Technology': '\u{1F527}',
  'Food Preparation & Nutrition': '\u{1F373}', 'Graphic Communication': '\u{1F4D0}',
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const [subjectsOpen, setSubjectsOpen] = useState(true);
  const [xp, setXp] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<{ subject: string; board: string }[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/profile').then(r => r.json()).then(d => { if (d.xp != null) setXp(d.xp); }).catch(() => {});
      // Load subjects from localStorage
      try {
        const cached = localStorage.getItem('educate-user-subjects');
        if (cached) setSubjects(JSON.parse(cached));
      } catch {}
      // Load streak
      try {
        const sd = getStreakData();
        setStreak(sd.currentStreak);
      } catch {}
    }
  }, [isSignedIn]);

  const level = xp != null ? levelFromXP(xp) : null;
  const progress = xp != null ? levelProgress(xp) : null;
  const title = level != null ? getLevelTitle(level) : null;

  const initials = user?.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <aside className="w-[220px] shrink-0 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen sticky top-0 z-40 hidden md:flex">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 no-underline px-5 py-4 border-b border-neutral-800">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-lg flex items-center justify-center text-sm font-bold text-white">
          E
        </div>
        <span className="text-lg font-bold tracking-tight text-white">Educate</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-all duration-150 ${
                active
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* My Subjects */}
        {subjects.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-800">
            <button
              onClick={() => setSubjectsOpen(p => !p)}
              className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 bg-transparent border-none cursor-pointer hover:text-neutral-400 transition-colors"
            >
              My Subjects
              <span className="text-[8px]">{subjectsOpen ? '\u25B2' : '\u25BC'}</span>
            </button>
            {subjectsOpen && (
              <div className="flex flex-col gap-0.5 mt-1">
                {subjects.map(({ subject, board }) => {
                  const href = `/${board}/${encodeURIComponent(subject)}`;
                  const active = decodeURIComponent(pathname) === `/${board}/${subject}` || pathname.startsWith(`/${board}/${encodeURIComponent(subject)}/`);
                  return (
                    <Link
                      key={`${board}-${subject}`}
                      href={href}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs no-underline transition-all duration-150 ${
                        active
                          ? 'bg-indigo-500/15 text-indigo-400'
                          : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
                      }`}
                    >
                      <span className="text-sm">{SUBJECT_ICONS[subject] ?? '\u{1F4D6}'}</span>
                      <span className="truncate">{subject}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* XP / Level + User profile section */}
      {isLoaded && isSignedIn && user ? (
        <div className="border-t border-neutral-800 p-3 relative">
          {/* Streak */}
          {streak > 0 && (
            <div className="px-3 pb-1 mb-1 flex items-center gap-1.5">
              <span className="text-orange-400 text-sm">{'\u{1F525}'}</span>
              <span className="text-orange-400 text-xs font-bold">{streak} day streak</span>
            </div>
          )}
          {/* Level & XP bar */}
          {xp != null && level != null && progress != null && (
            <div className="px-3 pb-2 mb-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-amber-400 text-xs font-bold">Lvl {level}</span>
                <span className="text-neutral-500 text-[10px]">{xp.toLocaleString()} XP</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(progress.progress * 100)}%` }}
                />
              </div>
              <p className="text-neutral-600 text-[9px] mt-1 m-0">{title}</p>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(p => !p)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-transparent border-none cursor-pointer text-left hover:bg-neutral-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white m-0 truncate">{user.fullName || user.firstName || 'Student'}</p>
              <p className="text-[10px] text-neutral-500 m-0 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute bottom-full left-3 right-3 mb-1 z-50 bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg overflow-hidden">
                <Link
                  href="/onboarding"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-neutral-300 no-underline hover:bg-neutral-700 transition-colors"
                >
                  Edit my subjects
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ redirectUrl: '/' }); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 bg-transparent border-none cursor-pointer hover:bg-neutral-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      ) : isLoaded ? (
        <div className="border-t border-neutral-800 p-3">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold no-underline hover:bg-indigo-400 transition-colors"
          >
            Sign in
          </Link>
        </div>
      ) : null}
    </aside>
  );
}

const MOBILE_NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '\u{1F3E0}' },
  { href: '/timer', label: 'Timer', icon: '\u{23F0}' },
  { href: '/progress', label: 'Progress', icon: '\u{1F4CA}' },
  { href: '/notes', label: 'Notes', icon: '\u{1F4DD}' },
  { href: '/games', label: 'Games', icon: '\u{1F3AE}' },
];

/** Mobile bottom bar — shown on small screens instead of sidebar */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 flex items-center justify-around py-2 z-50 md:hidden">
      {MOBILE_NAV_ITEMS.map(item => {
        const active = item.href === '/'
          ? pathname === '/'
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 text-[10px] no-underline px-3 py-1 rounded-lg transition-colors ${
              active ? 'text-indigo-400' : 'text-neutral-500'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
