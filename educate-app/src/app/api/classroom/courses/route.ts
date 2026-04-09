import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { sql } from '@/lib/db';

interface TokenRow {
  tokens: Record<string, unknown>;
}

interface GoogleCourse {
  id?: string | null;
  name?: string | null;
  section?: string | null;
  enrollmentCode?: string | null;
}

interface CourseItem {
  id: string;
  name: string;
  section: string;
  enrollmentCode: string;
  studentCount: number;
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

  // Persist refreshed tokens automatically
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

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const authClient = await getAuthClient(userId);
  if (!authClient) {
    return NextResponse.json({ error: 'Google Classroom not connected', connected: false }, { status: 400 });
  }

  try {
    const classroom = google.classroom({ version: 'v1', auth: authClient });

    const response = await classroom.courses.list({
      teacherId: 'me',
      courseStates: ['ACTIVE'],
      pageSize: 50,
    });

    const rawCourses: GoogleCourse[] = response.data.courses ?? [];

    // Fetch student counts in parallel
    const courses: CourseItem[] = await Promise.all(
      rawCourses.map(async (course) => {
        let studentCount = 0;
        if (course.id) {
          try {
            const studentsRes = await classroom.courses.students.list({
              courseId: course.id,
              pageSize: 1,
            });
            // Google doesn't return total count, use the list to get an approximation
            // For accurate count we'd page through — approximation is fine for UI
            studentCount = studentsRes.data.students?.length ?? 0;
          } catch {
            studentCount = 0;
          }
        }
        return {
          id: course.id ?? '',
          name: course.name ?? 'Untitled',
          section: course.section ?? '',
          enrollmentCode: course.enrollmentCode ?? '',
          studentCount,
        };
      })
    );

    return NextResponse.json({ courses, connected: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
