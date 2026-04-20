import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// Generates a random URL-safe token
function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    // Ensure column exists
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_token text`;

    const rows = await sql`SELECT parent_token FROM profiles WHERE user_id = ${userId}`;
    let token = (rows[0] as { parent_token?: string })?.parent_token;

    if (!token) {
      token = randomToken();
      await sql`
        UPDATE profiles SET parent_token = ${token} WHERE user_id = ${userId}
      `;
    }

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: 'Could not create parent link' }, { status: 500 });
  }
}

// DELETE — revoke and regenerate token
export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const newToken = randomToken();
    await sql`UPDATE profiles SET parent_token = ${newToken} WHERE user_id = ${userId}`;
    return NextResponse.json({ token: newToken });
  } catch {
    return NextResponse.json({ error: 'Could not regenerate link' }, { status: 500 });
  }
}
