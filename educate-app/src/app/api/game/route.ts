import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/** POST /api/game — create a new game session */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { subject, opponentId } = await req.json();
  if (!subject) return NextResponse.json({ error: 'subject required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('game_sessions')
    .insert({
      game_type: 'tic-tac-toe',
      player_x: userId,
      player_o: opponentId || null,
      subject,
      status: opponentId ? 'active' : 'waiting',
      board_state: ['', '', '', '', '', '', '', '', ''],
      current_turn: 'X',
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ gameId: data.id });
}

/** GET /api/game?id=xxx — get game state */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const gameId = req.nextUrl.searchParams.get('id');
  if (!gameId) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data } = await supabaseAdmin
    .from('game_sessions')
    .select('*')
    .eq('id', gameId)
    .single();

  if (!data) return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  return NextResponse.json(data);
}

/** PATCH /api/game — make a move */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { gameId, cellIndex, boardState, currentTurn, winner, status } = await req.json();

  await supabaseAdmin
    .from('game_sessions')
    .update({
      board_state: boardState,
      current_turn: currentTurn,
      winner: winner || null,
      status: status || 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', gameId);

  return NextResponse.json({ ok: true });
}
