import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // userId passed as state
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  if (error) {
    return NextResponse.redirect(`${appUrl}/teacher?classroom=denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/teacher?classroom=error`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/teacher?classroom=error`);
  }

  const redirectUri = `${appUrl}/api/classroom/callback`;

  try {
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const { tokens } = await oAuth2Client.getToken(code);

    await sql`
      INSERT INTO teacher_google_tokens (user_id, tokens, updated_at)
      VALUES (${state}, ${JSON.stringify(tokens)}, now())
      ON CONFLICT (user_id)
      DO UPDATE SET tokens = ${JSON.stringify(tokens)}, updated_at = now()
    `;

    return NextResponse.redirect(`${appUrl}/teacher?classroom=connected`);
  } catch {
    return NextResponse.redirect(`${appUrl}/teacher?classroom=error`);
  }
}
