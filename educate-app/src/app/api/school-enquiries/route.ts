import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { rateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';
import { ENQUIRY_ROLES, ENQUIRY_LIMITS } from '@/lib/school-enquiry';
import { notifyEnquiry } from '@/lib/enquiry-email';

const schema = z.object({
  name: z.string().trim().min(1).max(ENQUIRY_LIMITS.name),
  role: z.enum(ENQUIRY_ROLES),
  organisation: z.string().trim().min(1).max(ENQUIRY_LIMITS.organisation),
  email: z.string().trim().max(ENQUIRY_LIMITS.email).email(),
  studentCount: z.number().int().min(1).max(ENQUIRY_LIMITS.maxStudents).nullable().optional(),
  message: z.string().trim().max(ENQUIRY_LIMITS.message).optional(),
  // Hidden field that people never see; bots that fill every box fill it in
  website: z.string().max(500).optional(),
});

const LIMIT = 5;

/**
 * POST /api/school-enquiries — a school, trust or local authority asks about a licence.
 *
 * Public on purpose: the person asking usually has no Educate account. Rate limited per IP
 * (burst protection only; the limiter is in memory). Enquiries are stored for super_admins
 * to read on /admin, and emailed to the team when email is set up (lib/enquiry-email.ts).
 */
export async function POST(request: Request) {
  const rl = rateLimit(getRateLimitKey('school-enquiry', null, request), LIMIT, 60 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many enquiries from here. Please try again in an hour.' },
      { status: 429, headers: rateLimitHeaders(LIMIT, rl) },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the form: your name, role, school and a valid email are needed.' }, { status: 400 });
  }
  const e = parsed.data;

  // A filled-in hidden field means a bot: answer as if it worked, store nothing
  if (e.website) return NextResponse.json({ ok: true });

  try {
    await sql`
      INSERT INTO school_enquiries (name, role, organisation, email, student_count, message)
      VALUES (${e.name}, ${e.role}, ${e.organisation}, ${e.email.toLowerCase()},
              ${e.studentCount ?? null}, ${e.message ? e.message : null})
    `;
  } catch (err) {
    console.error('[school-enquiries] could not save an enquiry:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Your enquiry could not be sent. Please try again.' }, { status: 500 });
  }

  // Only after it is saved, so an email always has a row on /admin behind it. Never throws.
  await notifyEnquiry(e);
  return NextResponse.json({ ok: true });
}
