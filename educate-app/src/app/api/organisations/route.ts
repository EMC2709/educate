import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserRole, getUserOrg } from '@/lib/roles';
import { rateLimit } from '@/lib/rate-limit';

interface OrganisationRow {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  country: string;
  created_at: string;
  ai_disabled?: boolean;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const role = await getUserRole(userId);

    // super_admin gets all organisations
    if (role === 'super_admin') {
      const rows = await sql`
        SELECT id, name, slug, domain, country, created_at
        FROM organisations
        ORDER BY name ASC
      ` as OrganisationRow[];
      return NextResponse.json({ organisations: rows });
    }

    const orgId = await getUserOrg(userId);
    if (!orgId) return NextResponse.json({ organisation: null });

    const rows = await sql`
      SELECT id, name, slug, domain, country, created_at, ai_disabled
      FROM organisations
      WHERE id = ${orgId}
      LIMIT 1
    ` as OrganisationRow[];

    return NextResponse.json({ organisation: rows[0] ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * The school "AI off" switch. A teacher (or above) changes it for their own school only;
 * the school is taken from their profile, never from the request.
 */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!rateLimit(`org-settings:user:${userId}`, 20, 60_000).ok) {
    return NextResponse.json({ error: 'Too many changes. Please wait a minute and try again.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null) as { aiDisabled?: unknown } | null;
  if (typeof body?.aiDisabled !== 'boolean') {
    return NextResponse.json({ error: 'aiDisabled must be true or false' }, { status: 400 });
  }

  try {
    const role = await getUserRole(userId);
    if (!['teacher', 'school_admin', 'super_admin'].includes(role)) {
      return NextResponse.json({ error: 'Requires teacher role or above' }, { status: 403 });
    }
    const orgId = await getUserOrg(userId);
    if (!orgId) return NextResponse.json({ error: 'Set up your school first.' }, { status: 400 });

    const rows = await sql`
      UPDATE organisations SET ai_disabled = ${body.aiDisabled}
      WHERE id = ${orgId}
      RETURNING ai_disabled
    ` as Array<{ ai_disabled: boolean }>;
    if (rows.length === 0) return NextResponse.json({ error: 'School not found.' }, { status: 404 });

    return NextResponse.json({ aiDisabled: rows[0].ai_disabled });
  } catch (err) {
    console.error('[organisations] could not change the AI setting:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Could not save the setting. Please try again.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const role = await getUserRole(userId);
    if (!['teacher', 'school_admin', 'super_admin'].includes(role)) {
      return NextResponse.json({ error: 'Requires teacher role or above' }, { status: 403 });
    }

    const body = await req.json() as {
      name?: unknown;
      slug?: unknown;
      domain?: unknown;
      country?: unknown;
    };

    const { name, slug, domain, country } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'slug is required and must be lowercase alphanumeric with hyphens' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO organisations (name, slug, domain, country)
      VALUES (
        ${name.trim()},
        ${slug.trim()},
        ${typeof domain === 'string' ? domain.trim() : null},
        ${typeof country === 'string' && country.trim() ? country.trim() : 'England'}
      )
      RETURNING id, name, slug, domain, country, created_at
    ` as OrganisationRow[];

    const org = rows[0];

    // Associate the creating admin with this organisation
    await sql`
      UPDATE profiles SET org_id = ${org.id} WHERE user_id = ${userId}
    `;

    return NextResponse.json({ organisation: org }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'slug already taken' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
