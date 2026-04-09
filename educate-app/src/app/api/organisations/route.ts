import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserRole, getUserOrg } from '@/lib/roles';

interface OrganisationRow {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  country: string;
  created_at: string;
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
      SELECT id, name, slug, domain, country, created_at
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
