import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const rows = await sql`
      SELECT * FROM quiz_results WHERE user_id = ${userId}
      ORDER BY created_at DESC LIMIT 100
    `;
    return NextResponse.json({ results: rows });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
