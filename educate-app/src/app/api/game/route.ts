import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * Online games (tic-tac-toe, battleships, relay).
 *
 * Every method requires sign-in. The player id always comes from the session,
 * never from the request body, and only the two players can read or change a
 * game once it has started. Clerk user ids are never returned to the client.
 */

const MAX_STATE_CHARS = 20_000;   // generous for any board; stops multi-MB writes
const GAME_TYPES = ['tic-tac-toe', 'battleships', 'relay'];
const STATUSES = ['waiting', 'active', 'finished'];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type GameRow = Record<string, unknown> & { player_x: string; player_o: string | null; status: string };

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

const unauthorised = () => NextResponse.json({ error: 'Sign in to play online.' }, { status: 401 });
const failed = (where: string, err: unknown) => {
  console.error(`[game ${where}]`, err instanceof Error ? err.message : 'unknown error');
  return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
};

/** Hide Clerk user ids: clients only need to know whether each seat is taken. */
function publicRow(row: GameRow) {
  return { ...row, player_x: 'host', player_o: row.player_o ? 'guest' : null };
}

function cleanName(name: unknown, fallback: string): string {
  return (typeof name === 'string' ? name.trim().slice(0, 30) : '') || fallback;
}

/** Serialise client state, or return null if it is too large. */
function stateJson(state: unknown): string | null {
  const json = JSON.stringify(state ?? null);
  return json.length <= MAX_STATE_CHARS ? json : null;
}

async function prepare(): Promise<{ userId: string } | NextResponse> {
  const { userId } = await auth();
  if (!userId) return unauthorised();
  try {
    await ensureTables();
  } catch (err) {
    return failed('setup', err);
  }
  return { userId };
}

export async function POST(req: NextRequest) {
  const ctx = await prepare();
  if (ctx instanceof NextResponse) return ctx;

  let body: { subject?: string; playerName?: string; gameType?: string; initialState?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 80) : '';
  if (!subject) return NextResponse.json({ error: 'subject required' }, { status: 400 });

  const gt = GAME_TYPES.includes(body.gameType ?? '') ? body.gameType! : 'tic-tac-toe';
  const initBoard = body.initialState != null
    ? stateJson(body.initialState)
    : JSON.stringify(['', '', '', '', '', '', '', '', '']);
  if (initBoard === null) return NextResponse.json({ error: 'Game state too large' }, { status: 413 });

  try {
    // Generate a temporary UUID to derive room code from, then insert with that code
    const tempIdRows = await sql`SELECT gen_random_uuid()::text AS id`;
    const tempId = (tempIdRows as unknown as Array<{ id: string }>)[0].id;
    const roomCode = generateRoomCode(tempId);

    const rows = await sql`
      INSERT INTO game_sessions (room_code, game_type, player_x, player_x_name, subject, status, board_state, current_turn)
      VALUES (
        ${roomCode},
        ${gt},
        ${ctx.userId},
        ${cleanName(body.playerName, 'Player X')},
        ${subject},
        'waiting',
        ${initBoard}::jsonb,
        'X'
      )
      RETURNING id, room_code
    `;

    const row = (rows as unknown as Array<{ id: string; room_code: string }>)[0];
    return NextResponse.json({ gameId: row.id, roomCode: row.room_code });
  } catch (err) {
    return failed('POST', err);
  }
}

export async function GET(req: NextRequest) {
  const ctx = await prepare();
  if (ctx instanceof NextResponse) return ctx;

  const gameId = req.nextUrl.searchParams.get('id');
  const roomCode = req.nextUrl.searchParams.get('code');

  if (!gameId && !roomCode) {
    return NextResponse.json({ error: 'id or code required' }, { status: 400 });
  }
  if (gameId && !UUID_RE.test(gameId)) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  try {
    const rows = gameId
      ? await sql`SELECT * FROM game_sessions WHERE id = ${gameId}`
      : await sql`SELECT * FROM game_sessions WHERE room_code = ${roomCode!.toUpperCase().slice(0, 12)}`;

    const row = (rows as unknown as GameRow[])[0];
    if (!row) return NextResponse.json({ error: 'Game not found' }, { status: 404 });

    // A waiting game can be looked up by its code in order to join it;
    // after that only the two players may see it.
    const isPlayer = row.player_x === ctx.userId || row.player_o === ctx.userId;
    if (!isPlayer && row.status !== 'waiting') {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json(publicRow(row));
  } catch (err) {
    return failed('GET', err);
  }
}

export async function PATCH(req: NextRequest) {
  const ctx = await prepare();
  if (ctx instanceof NextResponse) return ctx;

  let body: { gameId?: string; boardState?: unknown; currentTurn?: string; winner?: string | null; status?: string; merge?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { gameId, boardState, merge } = body;
  if (!gameId || !UUID_RE.test(gameId)) return NextResponse.json({ error: 'gameId required' }, { status: 400 });
  if (boardState === undefined || boardState === null) {
    return NextResponse.json({ error: 'boardState required' }, { status: 400 });
  }

  const status = body.status && STATUSES.includes(body.status) ? body.status : null;
  const currentTurn = typeof body.currentTurn === 'string' ? body.currentTurn.slice(0, 8) : 'X';
  const winner = typeof body.winner === 'string' ? body.winner.slice(0, 40) : null;
  const board = stateJson(boardState);
  if (board === null) return NextResponse.json({ error: 'Game state too large' }, { status: 413 });

  try {
    // Only the two players can change a game
    const rows = merge
      ? await sql`
          UPDATE game_sessions
          SET board_state = board_state || ${board}::jsonb,
              status      = COALESCE(${status}, status),
              updated_at  = now()
          WHERE id = ${gameId} AND (player_x = ${ctx.userId} OR player_o = ${ctx.userId})
          RETURNING id
        `
      : await sql`
          UPDATE game_sessions
          SET board_state   = ${board}::jsonb,
              current_turn  = ${currentTurn},
              winner        = ${winner},
              status        = ${status ?? 'active'},
              updated_at    = now()
          WHERE id = ${gameId} AND (player_x = ${ctx.userId} OR player_o = ${ctx.userId})
          RETURNING id
        `;
    if ((rows as unknown[]).length === 0) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return failed('PATCH', err);
  }
}

export async function PUT(req: NextRequest) {
  const ctx = await prepare();
  if (ctx instanceof NextResponse) return ctx;

  let body: { roomCode?: string; playerName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const roomCode = typeof body.roomCode === 'string' ? body.roomCode.trim().toUpperCase().slice(0, 12) : '';
  if (!roomCode) return NextResponse.json({ error: 'roomCode required' }, { status: 400 });

  try {
    const rows = await sql`
      UPDATE game_sessions
      SET player_o      = ${ctx.userId},
          player_o_name = ${cleanName(body.playerName, 'Player O')},
          status        = 'active',
          updated_at    = now()
      WHERE room_code = ${roomCode}
        AND status    = 'waiting'
      RETURNING *
    `;

    const row = (rows as unknown as GameRow[])[0];
    if (!row) {
      return NextResponse.json({ error: 'Game not found or already started' }, { status: 404 });
    }
    return NextResponse.json(publicRow(row));
  } catch (err) {
    return failed('PUT', err);
  }
}
