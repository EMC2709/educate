import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';

const patchSchema = z.object({
  name:            z.string().min(1).max(100).optional(),
  subject:         z.string().max(100).nullable().optional(),
  is_public:       z.boolean().optional(),
  shared_by_name:  z.string().max(100).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const decks = await sql`
      SELECT id, name, subject, card_count, is_public, shared_by_name, created_at, updated_at
      FROM   user_flashcard_decks
      WHERE  id = ${id} AND user_id = ${userId}
    `;
    if (!decks.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const cards = await sql`
      SELECT id, term, definition, example, position
      FROM   user_flashcards
      WHERE  deck_id = ${id} AND user_id = ${userId}
      ORDER  BY position ASC, created_at ASC
    `;
    return NextResponse.json({ deck: decks[0], cards });
  } catch (err) {
    console.error('[flashcards/[id] GET]', err);
    return NextResponse.json({ error: 'Failed to load deck' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id } = await params;
  const body = patchSchema.parse(await request.json());

  try {
    if (body.name !== undefined) {
      await sql`
        UPDATE user_flashcard_decks
        SET    name = ${body.name}, updated_at = now()
        WHERE  id = ${id} AND user_id = ${userId}
      `;
    }
    if (body.subject !== undefined) {
      await sql`
        UPDATE user_flashcard_decks
        SET    subject = ${body.subject}, updated_at = now()
        WHERE  id = ${id} AND user_id = ${userId}
      `;
    }
    if (body.is_public !== undefined) {
      await sql`
        UPDATE user_flashcard_decks
        SET    is_public = ${body.is_public},
               shared_by_name = ${body.shared_by_name ?? null},
               updated_at = now()
        WHERE  id = ${id} AND user_id = ${userId}
      `;
    }
    const rows = await sql`
      SELECT id, name, subject, card_count, is_public, shared_by_name, created_at, updated_at
      FROM   user_flashcard_decks
      WHERE  id = ${id} AND user_id = ${userId}
    `;
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ deck: rows[0] });
  } catch (err) {
    console.error('[flashcards/[id] PATCH]', err);
    return NextResponse.json({ error: 'Failed to update deck' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id } = await params;

  try {
    await sql`DELETE FROM user_flashcards        WHERE deck_id = ${id} AND user_id = ${userId}`;
    await sql`DELETE FROM user_flashcard_decks   WHERE id = ${id}      AND user_id = ${userId}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[flashcards/[id] DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete deck' }, { status: 500 });
  }
}
