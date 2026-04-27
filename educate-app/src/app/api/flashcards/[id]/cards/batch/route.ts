import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';

const batchSchema = z.object({
  cards: z
    .array(
      z.object({
        term:       z.string().min(1).max(500),
        definition: z.string().min(1).max(2000),
        example:    z.string().max(1000).optional(),
      }),
    )
    .min(1)
    .max(500),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id: deckId } = await params;

  // Verify deck ownership
  const decks = await sql`
    SELECT id FROM user_flashcard_decks WHERE id = ${deckId} AND user_id = ${userId}
  `;
  if (!decks.length) return NextResponse.json({ error: 'Deck not found' }, { status: 404 });

  const body = batchSchema.parse(await request.json());

  try {
    // Single-statement bulk insert via json_array_elements — avoids N round-trips
    const cardsJson = JSON.stringify(
      body.cards.map((c, i) => ({
        term:       c.term,
        definition: c.definition,
        example:    c.example ?? null,
        position:   i,
      })),
    );

    await sql`
      INSERT INTO user_flashcards (deck_id, user_id, term, definition, example, position)
      SELECT
        ${deckId},
        ${userId},
        c->>'term',
        c->>'definition',
        c->>'example',
        (c->>'position')::int
      FROM json_array_elements(${cardsJson}::json) AS c
    `;

    await sql`
      UPDATE user_flashcard_decks
      SET    card_count = ${body.cards.length}, updated_at = now()
      WHERE  id = ${deckId}
    `;

    return NextResponse.json({ inserted: body.cards.length }, { status: 201 });
  } catch (err) {
    console.error('[flashcards batch POST]', err);
    return NextResponse.json({ error: 'Failed to insert cards' }, { status: 500 });
  }
}
