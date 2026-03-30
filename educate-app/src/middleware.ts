import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
  const isProtectedApi = isApiRoute && !isAuthRoute;

  // Protect AI API routes — require authentication
  if (isProtectedApi && !req.auth) {
    return NextResponse.json(
      { error: 'Sign in required to use AI features.' },
      { status: 401 }
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/api/chat', '/api/check', '/api/generate'],
};
