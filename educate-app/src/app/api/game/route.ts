import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { subject, opponentId } = await req.json();
  if (!subject) return NextResponse.json({ error: 'subject required' }, { status: 400 });

  try {
    const rows = await sql`
      INSERT INTO game_sessions (game_type, player_x, player_o, subject, status, board_state, current_turn)
      VALUES ('tic-tac-toe', ${userId}, ${opponentId || null}, ${subject},
              ${opponentId ? 'active' : 'waiting'},
              ${JSON.stringify(['', '', '', '', '', '', '', '', ''])}, 'X')
      RETURNING id
    `;
    return NextResponse.json({ gameId: (rows[0] as { id: string }).id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const gameId = req.nextUrl.searchParams.get('id');
  if (!gameId) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const rows = await sql`SELECT * FROM game_sessions WHERE id = ${gameId}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { gameId, boardState, currentTurn, winner, status } = await req.json();

  await sql`
    UPDATE game_sessions
    SET board_state = ${JSON.stringify(boardState)},
        current_turn = ${currentTurn},
        winner = ${winner || null},
        status = ${status || 'active'},
        updated_at = now()
    WHERE id = ${gameId}
  `;

  return NextResponse.json({ ok: true });
}
