import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const rows = await sql`SELECT user_id, display_name, role FROM profiles WHERE user_id = ${userId}`;
    return NextResponse.json({
      clerkUserId: userId,
      profileRow: rows[0] ?? null,
      profileCount: rows.length,
    });
  } catch (err) {
    return NextResponse.json({ clerkUserId: userId, error: String(err) });
  }
}
