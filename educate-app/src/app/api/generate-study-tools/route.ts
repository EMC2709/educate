import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const client = new Anthropic();

const schema = z.object({
  mode: z.enum(['flashcards', 'questions']),
  title: z.string().max(200),
  subject: z.string().max(80),
  content: z.string().max(8000),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Sign in required.' }, { status: 401 });
  }

  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const prompt =
    body.mode === 'flashcards'
      ? `Create exactly 8 flashcards from these revision notes about "${body.title}" (${body.subject}).

Notes:
${body.content}

Return ONLY a valid JSON array — no markdown, no explanation, no code fences. Example format:
[{"front":"What is photosynthesis?","back":"The process by which plants convert light energy into glucose using CO2 and water."},...]`
      : `Create exactly 5 exam-style questions from these revision notes about "${body.title}" (${body.subject}).

Notes:
${body.content}

Return ONLY a valid JSON array — no markdown, no explanation, no code fences. Example format:
[{"question":"Explain why plants need chlorophyll for photosynthesis.","marks":3,"answer":"Chlorophyll absorbs light energy (1). This energy drives the conversion of CO2 and water into glucose (1). Without chlorophyll, the light-dependent reactions cannot occur (1)."},...]`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system:
        'You are a GCSE revision tool. You output ONLY valid JSON arrays with no surrounding text, markdown, or code fences. Never add explanations before or after the JSON.',
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract the JSON array — handle any accidental markdown wrapping
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      return Response.json({ error: 'No JSON array in response.' }, { status: 500 });
    }

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return Response.json({ error: 'Empty result.' }, { status: 500 });
    }

    return Response.json({ items: parsed });
  } catch (err) {
    console.error('generate-study-tools error:', err);
    return Response.json({ error: 'Generation failed.' }, { status: 500 });
  }
}
