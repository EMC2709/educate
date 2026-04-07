import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedApi = createRouteMatcher(['/api/chat', '/api/check', '/api/generate']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedApi(req)) {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(
        { error: 'Sign in required to use AI features.' },
        { status: 401 }
      );
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
