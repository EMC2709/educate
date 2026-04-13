import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS game_sessions (
      id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      room_code     text UNIQUE NOT NULL,
      game_type     text NOT NULL DEFAULT 'tic-tac-toe',
      player_x      text NOT NULL,
      player_x_name text NOT NULL DEFAULT 'Player X',
      player_o      text,
      player_o_name text,
      board_state   jsonb NOT NULL DEFAULT '["","","","","","","","",""]',
      current_turn  text NOT NULL DEFAULT 'X',
      winner        text,
      subject       text NOT NULL,
      status        text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','active','finished')),
      created_at    timestamptz NOT NULL DEFAULT now(),
      updated_at    timestamptz NOT NULL DEFAULT now()
    )
  `;
}

function generateRoomCode(uuid: string): string {
  // Take first 6 chars of UUID (hex digits), uppercase them
  return uuid.replace(/-/g, '').slice(0, 6).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    await ensureTables();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('DATABASE_URL')) {
      return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  let body: { subject?: string; playerName?: string; playerId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { subject, playerName, playerId } = body;
  if (!subject) return NextResponse.json({ error: 'subject required' }, { status: 400 });
  if (!playerId) return NextResponse.json({ error: 'playerId required' }, { status: 400 });

  const hostName = playerName?.trim() || 'Player X';

  try {
    // Generate a temporary UUID to derive room code from, then insert with that code
    const tempIdRows = await sql`SELECT gen_random_uuid()::text AS id`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tempId = ((tempIdRows as any[])[0] as { id: string }).id;
    const roomCode = generateRoomCode(tempId);

    const rows = await sql`
      INSERT INTO game_sessions (room_code, game_type, player_x, player_x_name, subject, status, board_state, current_turn)
      VALUES (
        ${roomCode},
        'tic-tac-toe',
        ${playerId},
        ${hostName},
        ${subject},
        'waiting',
        ${JSON.stringify(['', '', '', '', '', '', '', '', ''])}::jsonb,
        'X'
      )
      RETURNING id, room_code
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = (rows as any[])[0] as { id: string; room_code: string };
    return NextResponse.json({ gameId: row.id, roomCode: row.room_code });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureTables();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('DATABASE_URL')) {
      return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const gameId = req.nextUrl.searchParams.get('id');
  const roomCode = req.nextUrl.searchParams.get('code');

  if (!gameId && !roomCode) {
    return NextResponse.json({ error: 'id or code required' }, { status: 400 });
  }

  try {
    let rows;
    if (gameId) {
      rows = await sql`SELECT * FROM game_sessions WHERE id = ${gameId}`;
    } else {
      rows = await sql`SELECT * FROM game_sessions WHERE room_code = ${roomCode!.toUpperCase()}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowArr = rows as any[];
    if (rowArr.length === 0) return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    return NextResponse.json(rowArr[0]);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureTables();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('DATABASE_URL')) {
      return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  let body: { gameId?: string; boardState?: string[]; currentTurn?: string; winner?: string | null; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { gameId, boardState, currentTurn, winner, status } = body;
  if (!gameId) return NextResponse.json({ error: 'gameId required' }, { status: 400 });

  try {
    await sql`
      UPDATE game_sessions
      SET board_state   = ${JSON.stringify(boardState)}::jsonb,
          current_turn  = ${currentTurn ?? 'X'},
          winner        = ${winner ?? null},
          status        = ${status ?? 'active'},
          updated_at    = now()
      WHERE id = ${gameId}
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureTables();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('DATABASE_URL')) {
      return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  let body: { roomCode?: string; playerName?: string; playerId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { roomCode, playerName, playerId } = body;
  if (!roomCode) return NextResponse.json({ error: 'roomCode required' }, { status: 400 });
  if (!playerId) return NextResponse.json({ error: 'playerId required' }, { status: 400 });

  const joinerName = playerName?.trim() || 'Player O';

  try {
    const rows = await sql`
      UPDATE game_sessions
      SET player_o      = ${playerId},
          player_o_name = ${joinerName},
          status        = 'active',
          updated_at    = now()
      WHERE room_code = ${roomCode.toUpperCase()}
        AND status    = 'waiting'
      RETURNING *
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowArr = rows as any[];
    if (rowArr.length === 0) {
      return NextResponse.json({ error: 'Game not found or already started' }, { status: 404 });
    }

    return NextResponse.json(rowArr[0]);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
