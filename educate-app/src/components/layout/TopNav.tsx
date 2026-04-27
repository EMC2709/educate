'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { levelFromXP, getLevelTitle } from '@/lib/xp-client';
import { getStreakData } from '@/lib/streak';
import { useChat } from '@/context/ChatContext';

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: '/',                   label: 'Home',           icon: '🏠' },
  { href: '/practice',           label: 'Practice',       icon: '📝' },
  { href: '/practice/diagnosis', label: 'Diagnosis',      icon: '🔍' },
  { href: '/timetable',          label: 'Timetable',      icon: '📅' },
  { href: '/exams',              label: 'Exams',          icon: '⏳' },
  { href: '/timer',              label: 'Timer',          icon: '⏰' },
  { href: '/notes',              label: 'Notes',          icon: '🗂️' },
  { href: '/revision-notes',     label: 'Revision',       icon: '📖' },
  { href: '/checklist',          label: 'Checklist',      icon: '✅' },
  { href: '/mastery',            label: 'Mastery',        icon: '🗺️' },
  { href: '/progress',           label: 'Progress',       icon: '📊' },
  { href: '/achievements',       label: 'Achievements',   icon: '🏆' },
  { href: '/games',              label: 'Games',          icon: '🎮' },
  { href: '/profile',            label: 'Profile',        icon: '👤' },
  { href: '/marketplace',        label: 'Marketplace',    icon: '🛒' },
  { href: '/boards',             label: 'Exam Boards',    icon: '📋' },
  { href: '/export',             label: 'Export',         icon: '📤' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function TopNav() {
  const pathname                = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut }             = useClerk();
  const { chatOpen, setChatOpen } = useChat();

  const [xp,     setXp]     = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState<string>('student');
  const [orgId, setOrgId] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        if (d.xp != null) setXp(d.xp);
        if (d.role) setRole(d.role);
        setOrgId(d.org_id ?? null);
        if (d.role === 'student' && d.org_id) {
          fetch('/api/assignments/unread')
            .then(r2 => r2.json())
            .then((u: { count?: number }) => setUnread(u.count ?? 0))
            .catch(() => {});
        }
      })
      .catch(() => {});

    try { setStreak(getStreakData().currentStreak); } catch {}

    const onXp = () => fetch('/api/profile').then(r => r.json()).then(d => { if (d.xp != null) setXp(d.xp); }).catch(() => {});
    window.addEventListener('educate-xp-updated', onXp);
    return () => window.removeEventListener('educate-xp-updated', onXp);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const isTeacher      = ['teacher', 'school_admin', 'super_admin'].includes(role);
  const isSchoolStudent = role === 'student' && orgId !== null;
  const isSuperAdmin   = role === 'super_admin';

  const level  = xp != null ? levelFromXP(xp) : null;
  const title  = level != null ? getLevelTitle(level) : null;

  const initials = user?.fullName
    ?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  // Build the full nav list based on role
  const allItems = [
    ...NAV_ITEMS,
    ...(isSchoolStudent ? [
      { href: '/student',          label: 'Hub',      icon: '🏫', badge: unread },
      { href: '/student/practice', label: 'Practice', icon: '📝', badge: 0 },
    ] : []),
    ...(isTeacher ? [
      { href: '/teacher',         label: 'Dashboard', icon: '📈', badge: 0 },
      { href: '/teacher/classes', label: 'Classes',   icon: '🏫', badge: 0 },
    ] : []),
    ...(isSuperAdmin ? [{ href: '/admin', label: 'Admin', icon: '⚙️', badge: 0 }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-neutral-900 border-b border-neutral-800 flex items-center gap-3 px-4">

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <Link
        href="/"
        className="flex items-center gap-2 no-underline shrink-0 mr-2"
      >
        <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-lg flex items-center justify-center text-xs font-bold text-white select-none">
          E
        </div>
        <span className="hidden sm:block text-sm font-bold text-white tracking-tight">
          Educate
        </span>
      </Link>

      {/* ── Nav items (horizontally scrollable) ───────────────────────── */}
      <nav className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 min-w-max">
          {allItems.map(item => {
            const active = item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                  text-xs font-medium no-underline transition-all duration-150
                  whitespace-nowrap select-none
                  ${active
                    ? 'bg-indigo-500/15 text-indigo-400'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }
                `}
              >
                <span className="text-sm leading-none">{item.icon}</span>
                <span>{item.label}</span>
                {'badge' in item && item.badge > 0 && (
                  <span className="min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Right side ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0 ml-2">

        {/* AI Tutor button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium
            border-none cursor-pointer transition-all duration-150
            ${chatOpen
              ? 'bg-indigo-500/20 text-indigo-400'
              : 'bg-transparent text-neutral-500 hover:bg-neutral-800 hover:text-white'
            }
          `}
          title="AI Tutor"
        >
          <span className="text-sm leading-none">🤖</span>
          <span className="hidden lg:block">Tutor</span>
        </button>

        {/* Streak badge */}
        {streak > 0 && (
          <div className="hidden sm:flex items-center gap-1 text-orange-400 text-xs font-bold">
            <span>🔥</span>
            <span>{streak}</span>
          </div>
        )}

        {/* Level badge */}
        {level != null && (
          <div
            className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-bold cursor-default"
            title={title ?? ''}
          >
            <span>⭐</span>
            <span>Lvl {level}</span>
          </div>
        )}

        {/* User avatar / sign-in */}
        {isLoaded && !isSignedIn && (
          <Link
            href="/login"
            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-xl no-underline transition-colors"
          >
            Sign in
          </Link>
        )}

        {isLoaded && isSignedIn && user && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center text-white text-xs font-bold cursor-pointer border-none transition-colors overflow-hidden"
            >
              {user.imageUrl
                ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                : initials
              }
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute top-full right-0 mt-1 z-50 w-52 bg-neutral-800 border border-neutral-700 rounded-2xl shadow-xl overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-neutral-700">
                    <p className="text-sm font-semibold text-white m-0 truncate">
                      {user.fullName || user.firstName || 'Student'}
                    </p>
                    <p className="text-[11px] text-neutral-500 m-0 truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                    {xp != null && (
                      <p className="text-[10px] text-amber-400 m-0 mt-1">
                        {xp.toLocaleString()} XP · {title}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/onboarding?edit=true"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-neutral-300 no-underline hover:bg-neutral-700 transition-colors"
                  >
                    Edit my subjects
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-neutral-300 no-underline hover:bg-neutral-700 transition-colors"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); signOut({ redirectUrl: '/' }); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 bg-transparent border-none cursor-pointer hover:bg-neutral-700 transition-colors border-t border-neutral-700"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
