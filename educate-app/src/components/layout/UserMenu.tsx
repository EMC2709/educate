'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';

export function UserMenu() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="bg-neutral-800 border border-neutral-700 rounded-full px-3 sm:px-4 py-1.5 text-white text-xs sm:text-sm no-underline hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
      >
        Sign in
      </Link>
    );
  }

  const initials = user.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer border-none hover:bg-indigo-400 transition-colors overflow-hidden"
      >
        {user.imageUrl ? (
          <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg min-w-[220px] overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-700">
              <p className="text-sm font-semibold text-white m-0 truncate">{user.fullName}</p>
              <p className="text-xs text-neutral-400 m-0 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <Link
              href="/student/classes"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-neutral-300 no-underline hover:bg-neutral-700 transition-colors"
            >
              <span>🏫</span> My Classes
            </Link>
            <div className="border-t border-neutral-700" />
            <button
              onClick={() => { setOpen(false); signOut({ redirectUrl: '/' }); }}
              className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 bg-transparent border-none cursor-pointer hover:bg-neutral-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
