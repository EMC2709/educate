import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!token || token.length < 10) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  try {
    // Ensure column exists, then look up profile by token
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_token text`;
    const profiles = await sql`
      SELECT user_id, display_name, xp FROM profiles WHERE parent_token = ${token}
    `;

    if (!profiles[0]) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const profile = profiles[0] as { user_id: string; display_name: string; xp: number };

    // Fetch recent quiz history (last 50 results)
    const results = await sql`
      SELECT subject, board, question_type, score_correct, score_total, created_at
      FROM quiz_results
      WHERE user_id = ${profile.user_id}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    // Compute summary stats
    const quizResults = results as Array<{
      subject: string;
      board: string;
      question_type: string;
      score_correct: number;
      score_total: number;
      created_at: string;
    }>;

    const totalSessions = quizResults.length;
    const totalCorrect = quizResults.reduce((a, r) => a + Number(r.score_correct), 0);
    const totalQuestions = quizResults.reduce((a, r) => a + Number(r.score_total), 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Subjects studied
    const subjects = [...new Set(quizResults.map(r => r.subject))];

    // Last 7 days activity
    const today = new Date();
    const byDay: Record<string, number> = {};
    quizResults.forEach(r => {
      const day = r.created_at.split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
    });
    const last7: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      last7.push({ day: d.toLocaleDateString('en-GB', { weekday: 'short' }), count: byDay[key] || 0 });
    }

    return NextResponse.json({
      displayName: profile.display_name,
      xp: profile.xp,
      totalSessions,
      accuracy,
      subjects,
      last7,
      recentResults: quizResults.slice(0, 10),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
