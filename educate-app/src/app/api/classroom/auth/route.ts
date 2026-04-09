// Add to Vercel env vars:
// GOOGLE_CLIENT_ID        - from Google Cloud Console OAuth credentials
// GOOGLE_CLIENT_SECRET    - from Google Cloud Console OAuth credentials
// NEXT_PUBLIC_APP_URL     - https://your-app.vercel.app

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const CLASSROOM_SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
];

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId || !clientSecret || !appUrl) {
    return NextResponse.json(
      { error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_APP_URL.' },
      { status: 500 }
    );
  }

  const redirectUri = `${appUrl}/api/classroom/callback`;

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: CLASSROOM_SCOPES,
    prompt: 'consent',
    state: userId,
  });

  return NextResponse.json({ authUrl });
}
