import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface ClassRow {
  id: string;
  teacher_id: string;
  join_code: string | null;
}

function generateJoinCode(): string {
  // Unambiguous chars: no O/0, I/1/l
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function getClass(id: string): Promise<ClassRow | null> {
  const rows = await sql`
    SELECT id, teacher_id, join_code FROM classes WHERE id = ${id} LIMIT 1
  ` as ClassRow[];
  return rows[0] ?? null;
}

/** GET — return current join code (generates one if missing) */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const cls = await getClass(id);
  if (!cls) return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  if (cls.teacher_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let code = cls.join_code;
  if (!code) {
    // Generate a unique code
    let attempts = 0;
    do {
      code = generateJoinCode();
      attempts++;
      try {
        await sql`UPDATE classes SET join_code = ${code} WHERE id = ${id}`;
        break;
      } catch {
        if (attempts > 5) return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
      }
    } while (true);
  }

  return NextResponse.json({ code });
}

/** POST — regenerate (rotate) the join code */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const cls = await getClass(id);
  if (!cls) return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  if (cls.teacher_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let code = '';
  let attempts = 0;
  do {
    code = generateJoinCode();
    attempts++;
    try {
      await sql`UPDATE classes SET join_code = ${code} WHERE id = ${id}`;
      break;
    } catch {
      if (attempts > 5) return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
    }
  } while (true);

  return NextResponse.json({ code });
}
