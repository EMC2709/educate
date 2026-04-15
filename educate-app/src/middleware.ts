import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Routes where the middleware enforces extra role checks.
 * Every other route is let through — individual API routes carry their own
 * auth() guard so there is no need to duplicate the check here.
 */
const isAdminRoute   = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);
const isTeacherRoute = createRouteMatcher([
  '/teacher(.*)',
  '/api/classes(.*)',
  '/api/assignments(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Only enforce role-based checks on the sensitive paths.
  // All other routes are left untouched — they handle auth internally.
  if (!isAdminRoute(req) && !isTeacherRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  // Not signed in — redirect to login for pages, 401 for API calls
  if (!userId) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 401 });
    }
    const signIn = new URL('/login', req.url);
    signIn.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }

  // Signed in — check role from Clerk public metadata
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? '';

  if (isAdminRoute(req) && role !== 'super_admin') {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isTeacherRoute(req) && !['teacher', 'school_admin', 'super_admin'].includes(role)) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
