import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ensureProfile } from '@/lib/xp';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('user_subjects')
    .select('subject, board')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  // If table doesn't exist yet, treat as empty
  if (error) return NextResponse.json({ subjects: [] });

  return NextResponse.json({ subjects: data ?? [] });
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

  // Update display name if provided
  if (displayName && typeof displayName === 'string') {
    const profile = await ensureProfile(userId);
    await supabaseAdmin
      .from('profiles')
      .update({ display_name: displayName.slice(0, 30), updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  }

  // Clear existing subjects and insert new ones
  await supabaseAdmin.from('user_subjects').delete().eq('user_id', userId);

  const rows = subjects.map(s => ({
    user_id: userId,
    subject: s.subject,
    board: s.board,
  }));

  const { error } = await supabaseAdmin.from('user_subjects').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
