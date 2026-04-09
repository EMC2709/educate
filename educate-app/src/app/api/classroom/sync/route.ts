import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { sql } from '@/lib/db';

interface TokenRow {
  tokens: Record<string, unknown>;
}

interface ClassRow {
  id: string;
  teacher_id: string;
}

interface GoogleStudent {
  profile?: {
    emailAddress?: string | null;
    name?: { fullName?: string | null } | null;
  } | null;
}

async function getAuthClient(userId: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  if (!clientId || !clientSecret) return null;

  const rows = await sql`
    SELECT tokens FROM teacher_google_tokens WHERE user_id = ${userId}
  ` as TokenRow[];

  if (rows.length === 0) return null;

  const redirectUri = `${appUrl}/api/classroom/callback`;
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oAuth2Client.setCredentials(rows[0].tokens);

  oAuth2Client.on('tokens', async (tokens) => {
    const merged = { ...rows[0].tokens, ...tokens };
    await sql`
      UPDATE teacher_google_tokens
      SET tokens = ${JSON.stringify(merged)}, updated_at = now()
      WHERE user_id = ${userId}
    `;
  });

  return oAuth2Client;
}

async function fetchAllStudents(
  classroom: ReturnType<typeof google.classroom>,
  courseId: string
): Promise<GoogleStudent[]> {
  const all: GoogleStudent[] = [];
  let pageToken: string | undefined;

  do {
    const res = await classroom.courses.students.list({
      courseId,
      pageSize: 100,
      pageToken,
    });
    const students = res.data.students ?? [];
    all.push(...students);
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return all;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const body = await req.json() as { classId?: unknown; courseId?: unknown };
  const { classId, courseId } = body;

  if (!classId || typeof classId !== 'string') {
    return NextResponse.json({ error: 'classId is required' }, { status: 400 });
  }
  if (!courseId || typeof courseId !== 'string') {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
  }

  // Verify teacher owns the class
  const classRows = await sql`
    SELECT id, teacher_id FROM classes WHERE id = ${classId} LIMIT 1
  ` as ClassRow[];

  if (classRows.length === 0) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }
  if (classRows[0].teacher_id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const authClient = await getAuthClient(userId);
  if (!authClient) {
    return NextResponse.json({ error: 'Google Classroom not connected', connected: false }, { status: 400 });
  }

  try {
    const classroom = google.classroom({ version: 'v1', auth: authClient });
    const students = await fetchAllStudents(classroom, courseId);

    const total = students.length;
    let synced = 0;
    let pending = 0;

    const clerk = await clerkClient();

    for (const student of students) {
      const email = student.profile?.emailAddress;
      if (!email) {
        pending++;
        continue;
      }

      try {
        const clerkUsers = await clerk.users.getUserList({
          emailAddress: [email],
          limit: 1,
        });

        if (clerkUsers.data.length > 0) {
          const clerkUser = clerkUsers.data[0];
          await sql`
            INSERT INTO class_members (class_id, student_id)
            VALUES (${classId}, ${clerkUser.id})
            ON CONFLICT (class_id, student_id) DO NOTHING
          `;
          synced++;
        } else {
          // Student not yet on Educate — log as pending
          console.log(`[classroom-sync] Pending invite: ${email} not found in Clerk`);
          pending++;
        }
      } catch {
        pending++;
      }
    }

    // Link the Educate class to the Google Classroom course and record sync time
    await sql`
      UPDATE classes
      SET google_classroom_id = ${courseId}, last_synced_at = now()
      WHERE id = ${classId}
    `;

    return NextResponse.json({ synced, pending, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
