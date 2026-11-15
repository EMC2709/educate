'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

/**
 * `/` picks landing vs dashboard on the server, but Clerk's session token is
 * short-lived. A returning signed-in user whose token expired gets the landing
 * page on the first request; once Clerk has renewed the token in the browser,
 * re-render the route so the server sees the session and shows the dashboard.
 * Refreshes at most once per mount, so it can't loop if the server still
 * disagrees.
 */
export function SignedInRefresh() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || done.current) return;
    done.current = true;
    router.refresh();
  }, [isLoaded, isSignedIn, router]);

  return null;
}
