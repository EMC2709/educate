import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';

const patchSchema = z.object({
  term:       z.string().min(1).max(500).optional(),
  definition: z.string().min(1).max(2000).optional(),
  example:    z.string().max(1000).nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; cardId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { cardId } = await params;
  const body = patchSchema.parse(await request.json());

  try {
    if (body.term !== undefined) {
      await sql`UPDATE user_flashcards SET term = ${body.term}             WHERE id = ${cardId} AND user_id = ${userId}`;
    }
    if (body.definition !== undefined) {
      await sql`UPDATE user_flashcards SET definition = ${body.definition} WHERE id = ${cardId} AND user_id = ${userId}`;
    }
    if (body.example !== undefined) {
      await sql`UPDATE user_flashcards SET example = ${body.example}       WHERE id = ${cardId} AND user_id = ${userId}`;
    }

    const rows = await sql`
      SELECT id, term, definition, example, position
      FROM   user_flashcards
      WHERE  id = ${cardId} AND user_id = ${userId}
    `;
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ card: rows[0] });
  } catch (err) {
    console.error('[flashcards cards PATCH]', err);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; cardId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id: deckId, cardId } = await params;

  try {
    await sql`DELETE FROM user_flashcards WHERE id = ${cardId} AND user_id = ${userId}`;
    await sql`
      UPDATE user_flashcard_decks
      SET    card_count = GREATEST(card_count - 1, 0), updated_at = now()
      WHERE  id = ${deckId} AND user_id = ${userId}
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[flashcards cards DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
