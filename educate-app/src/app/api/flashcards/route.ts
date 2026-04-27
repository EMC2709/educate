import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_flashcard_decks (
      id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id         text        NOT NULL,
      name            text        NOT NULL,
      subject         text,
      card_count      integer     NOT NULL DEFAULT 0,
      is_public       boolean     NOT NULL DEFAULT false,
      shared_by_name  text,
      created_at      timestamptz NOT NULL DEFAULT now(),
      updated_at      timestamptz NOT NULL DEFAULT now()
    )
  `;
  // Idempotent migrations — no-op if columns already exist
  await sql`ALTER TABLE user_flashcard_decks ADD COLUMN IF NOT EXISTS is_public      boolean NOT NULL DEFAULT false`;
  await sql`ALTER TABLE user_flashcard_decks ADD COLUMN IF NOT EXISTS shared_by_name text`;
  await sql`
    CREATE TABLE IF NOT EXISTS user_flashcards (
      id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
      deck_id    uuid        NOT NULL,
      user_id    text        NOT NULL,
      term       text        NOT NULL,
      definition text        NOT NULL,
      example    text,
      position   integer     NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

const createSchema = z.object({
  name:    z.string().min(1).max(100),
  subject: z.string().max(100).optional(),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ decks: [] });

  try {
    await ensureTables();
    const decks = await sql`
      SELECT id, name, subject, card_count, is_public, created_at, updated_at
      FROM   user_flashcard_decks
      WHERE  user_id = ${userId}
      ORDER  BY updated_at DESC
    `;
    return NextResponse.json({ decks });
  } catch (err) {
    console.error('[flashcards GET]', err);
    return NextResponse.json({ decks: [] });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const body = createSchema.parse(await request.json());

  try {
    await ensureTables();
    const rows = await sql`
      INSERT INTO user_flashcard_decks (user_id, name, subject)
      VALUES (${userId}, ${body.name}, ${body.subject ?? null})
      RETURNING id, name, subject, card_count, created_at, updated_at
    `;
    return NextResponse.json({ deck: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('[flashcards POST]', err);
    return NextResponse.json({ error: 'Failed to create deck' }, { status: 500 });
  }
}
