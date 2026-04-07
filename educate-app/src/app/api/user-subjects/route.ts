import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureProfile } from '@/lib/xp';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const rows = await sql`
      SELECT subject, board FROM user_subjects
      WHERE user_id = ${userId} ORDER BY created_at ASC
    `;
    return NextResponse.json({ subjects: rows });
  } catch {
    return NextResponse.json({ subjects: [] });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { displayName, subjects } = await req.json() as {
    displayName?: string;
    subjects: { subject: string; board: string }[];
  };

  if (!Array.isArray(subjects) || subjects.length === 0) {
    return NextResponse.json({ error: 'At least one subject required' }, { status: 400 });
  }

  try {
    if (displayName && typeof displayName === 'string') {
      await ensureProfile(userId);
      await sql`
        UPDATE profiles SET display_name = ${displayName.slice(0, 30)}, updated_at = now()
        WHERE user_id = ${userId}
      `;
    }

    await sql`DELETE FROM user_subjects WHERE user_id = ${userId}`;

    for (const s of subjects) {
      await sql`
        INSERT INTO user_subjects (user_id, subject, board) VALUES (${userId}, ${s.subject}, ${s.board})
        ON CONFLICT (user_id, subject, board) DO NOTHING
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
