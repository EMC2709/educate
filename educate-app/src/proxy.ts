import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

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

/** Fetch role directly from the database — avoids relying on Clerk JWT template config. */
async function getRoleFromDb(userId: string): Promise<string> {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`SELECT role FROM profiles WHERE user_id = ${userId} LIMIT 1`;
    return (rows[0] as { role?: string } | undefined)?.role ?? 'student';
  } catch {
    return 'student';
  }
}

export default clerkMiddleware(async (auth, req) => {
  // Only enforce role-based checks on the sensitive paths.
  // All other routes are left untouched — they handle auth internally.
  if (!isAdminRoute(req) && !isTeacherRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Not signed in — redirect to login for pages, 401 for API calls
  if (!userId) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 401 });
    }
    const signIn = new URL('/login', req.url);
    signIn.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }

  // Signed in — fetch role from DB (reliable, no Clerk JWT template required)
  const role = await getRoleFromDb(userId);

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
