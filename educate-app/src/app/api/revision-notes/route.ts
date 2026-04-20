import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS revision_notes (
      id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
      subject     text          NOT NULL,
      topic       text          NOT NULL,
      content     text          NOT NULL,
      created_at  timestamptz   NOT NULL DEFAULT now(),
      UNIQUE (subject, topic)
    )
  `;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const topic = searchParams.get('topic');

  if (!subject || !topic) {
    return NextResponse.json({ error: 'subject and topic are required' }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ content: null });
  }

  try {
    await ensureTable();
    const rows = await sql`
      SELECT content FROM revision_notes
      WHERE subject = ${subject} AND topic = ${topic}
      LIMIT 1
    `;
    if (rows.length > 0) {
      return NextResponse.json({ content: rows[0].content });
    }
    return NextResponse.json({ content: null });
  } catch (err) {
    console.error('[revision-notes GET]', err);
    return NextResponse.json({ content: null });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { subject, topic } = body as { subject?: string; topic?: string };

  if (!subject || !topic) {
    return NextResponse.json({ error: 'subject and topic are required' }, { status: 400 });
  }

  const prompt = `Generate concise GCSE revision notes for: ${subject} - ${topic}

Format as:
• 6-10 bullet points covering the key facts students need for exams
• Each bullet: 1-2 sentences, exam-focused
• Include key terms in bold using **term**
• Include any important numbers, formulas, or dates
• End with "⚡ Key exam tip:" with the most important thing to remember

Keep it brief and high-value. No fluff.`;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    if (process.env.DATABASE_URL) {
      try {
        await ensureTable();
        await sql`
          INSERT INTO revision_notes (subject, topic, content)
          VALUES (${subject}, ${topic}, ${content})
          ON CONFLICT (subject, topic) DO UPDATE SET content = ${content}, created_at = now()
        `;
      } catch (dbErr) {
        console.error('[revision-notes POST] DB cache write failed', dbErr);
      }
    }

    return NextResponse.json({ content });
  } catch (err) {
    console.error('[revision-notes POST]', err);
    return NextResponse.json({ error: 'Failed to generate notes' }, { status: 500 });
  }
}
