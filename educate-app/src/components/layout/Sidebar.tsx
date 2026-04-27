'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';

// ── Sidebar stub ──────────────────────────────────────────────────────────────
// The desktop sidebar has been replaced by the global TopNav bar.
// This export is kept so existing page components (which all render <Sidebar />)
// don't need to be changed — it simply renders nothing.
export function Sidebar() {
  return null;
}

// ── Mobile bottom nav ─────────────────────────────────────────────────────────

// Independent student (default)
const MOBILE_NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '\u{1F3E0}' },
  { href: '/mastery', label: 'Mastery', icon: '\u{1F5FA}️' },
  { href: '/progress', label: 'Progress', icon: '\u{1F4CA}' },
  { href: '/notes', label: 'Notes', icon: '\u{1F4DD}' },
  { href: '/games', label: 'Games', icon: '\u{1F3AE}' },
];

// School student
const SCHOOL_STUDENT_MOBILE_NAV = [
  { href: '/student', label: 'Hub', icon: '\u{1F3EB}', exact: true },
  { href: '/student/practice', label: 'Practice', icon: '\u{1F4DD}', exact: false },
  { href: '/progress', label: 'Progress', icon: '\u{1F4CA}', exact: false },
  { href: '/games', label: 'Games', icon: '\u{1F3AE}', exact: false },
];

// Teacher
const TEACHER_MOBILE_NAV = [
  { href: '/teacher', label: 'Dashboard', icon: '\u{1F4CA}', exact: true },
  { href: '/teacher/classes', label: 'Classes', icon: '\u{1F3EB}', exact: false },
  { href: '/progress', label: 'Progress', icon: '\u{1F4C8}', exact: false },
  { href: '/games', label: 'Games', icon: '\u{1F3AE}', exact: false },
];

/** Mobile bottom bar — shown on small screens instead of sidebar */
export function MobileNav() {
  const pathname = usePathname();
  const { chatOpen, setChatOpen } = useChat();
  const { isSignedIn } = useUser();
  const [role, setRole] = useState<string>('');
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/profile')
      .then(r => r.json())
      .then((d: { role?: string; org_id?: string | null }) => {
        setRole(d.role ?? 'student');
        setOrgId(d.org_id ?? null);
      })
      .catch(() => {});
  }, [isSignedIn]);

  const isTeacher = ['teacher', 'school_admin', 'super_admin'].includes(role);
  const isSchoolStudent = role === 'student' && orgId !== null;
  const [mobileUnread, setMobileUnread] = useState(0);

  useEffect(() => {
    if (!isSignedIn || !isSchoolStudent) return;
    fetch('/api/assignments/unread')
      .then(r => r.json())
      .then((u: { count?: number }) => setMobileUnread(u.count ?? 0))
      .catch(() => {});
  }, [isSignedIn, isSchoolStudent]);

  const navItems = isTeacher
    ? TEACHER_MOBILE_NAV
    : isSchoolStudent
    ? SCHOOL_STUDENT_MOBILE_NAV
    : MOBILE_NAV_ITEMS.map(i => ({ ...i, exact: i.href === '/' }));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur border-t border-neutral-800 flex items-center justify-around pt-2 pb-[max(8px,env(safe-area-inset-bottom))] z-50 md:hidden">
      {navItems.map(item => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const showBadge = isSchoolStudent && item.href === '/student' && mobileUnread > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center gap-0.5 text-[10px] no-underline px-2 py-1 rounded-lg transition-colors min-w-[48px] min-h-[44px] justify-center ${
              active ? 'text-indigo-400' : 'text-neutral-500'
            }`}
          >
            <span className="text-lg leading-none relative">
              {item.icon}
              {showBadge && (
                <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {mobileUnread > 9 ? '9+' : mobileUnread}
                </span>
              )}
            </span>
            <span className="leading-none mt-0.5">{item.label}</span>
          </Link>
        );
      })}
      {/* AI Tutor toggle */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={`flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 rounded-lg transition-colors min-w-[48px] min-h-[44px] justify-center border-0 cursor-pointer ${
          chatOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-neutral-500 bg-transparent'
        }`}
      >
        <span className="text-lg leading-none">{'\u{1F916}'}</span>
        <span className="leading-none mt-0.5">Tutor</span>
      </button>
    </nav>
  );
}
