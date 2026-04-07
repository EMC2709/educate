import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin, supabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  if (!supabaseConfigured) {
    return NextResponse.json({ results: [] });
  }

  const { data, error } = await supabaseAdmin
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ results: [] });

  return NextResponse.json({ results: data ?? [] });
}
