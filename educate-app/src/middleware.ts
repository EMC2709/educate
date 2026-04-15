import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes — everything else requires a signed-in user
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/privacy',
  '/terms',
  '/api/webhook(.*)',
]);

// Admin-only routes (super_admin via Clerk public metadata)
const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);

// Teacher+ routes (teacher | school_admin | super_admin)
const isTeacherRoute = createRouteMatcher(['/teacher(.*)', '/api/classes(.*)', '/api/assignments(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes without authentication
  if (isPublicRoute(req)) return NextResponse.next();

  // Require authentication for everything else
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    // API routes get 401 JSON; pages get redirected to sign-in
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const signIn = new URL('/login', req.url);
    signIn.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }

  // Role-based guards via Clerk public metadata (set by /api/admin/roles)
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? '';

  if (isAdminRoute(req)) {
    if (role !== 'super_admin') {
      if (req.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (isTeacherRoute(req)) {
    const allowed = ['teacher', 'school_admin', 'super_admin'];
    if (!allowed.includes(role)) {
      if (req.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
