import { NextRequest, NextResponse } from 'next/server';
import { allowedOfficialUrl, boardPastPapersPage } from '@/lib/official-pdf';

/**
 * GET /api/download-paper?url=<official exam-board URL>
 *
 * Opens an official past paper or mark scheme. Only PDFs are served from this
 * origin; anything else (for example a board's past-papers web page) is opened
 * on the board's own site, so third-party HTML never runs on Educate's origin.
 * A dead PDF link sends the student to the board's past-papers page instead.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const parsed = allowedOfficialUrl(url);
  if (!parsed) {
    return NextResponse.json({ error: 'Domain not permitted' }, { status: 403 });
  }

  try {
    const upstream = await fetch(parsed, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        Accept: 'application/pdf,text/html,application/xhtml+xml,*/*',
      },
      redirect: 'follow',
      // Some board sites are slow or block server requests; don't leave the student waiting
      signal: AbortSignal.timeout(8000),
    });

    // A redirect must not take us off the allowlist
    if (!allowedOfficialUrl(upstream.url || parsed.toString())) {
      void upstream.body?.cancel().catch(() => {});
      return NextResponse.json({ error: 'Domain not permitted' }, { status: 403 });
    }

    if (upstream.status === 404 || upstream.status === 410) {
      // The board has moved or removed this file: open its past-papers page instead
      void upstream.body?.cancel().catch(() => {});
      return NextResponse.redirect(boardPastPapersPage(parsed.hostname) ?? parsed.toString(), 302);
    }

    const contentType = (upstream.headers.get('content-type') ?? '').toLowerCase();
    if (!upstream.ok || !contentType.includes('application/pdf')) {
      // Not a PDF: send the student to the official page itself
      void upstream.body?.cancel().catch(() => {});
      return NextResponse.redirect(parsed.toString(), 302);
    }

    const rawName = parsed.pathname.split('/').filter(Boolean).pop() ?? 'past-paper.pdf';
    const filename = rawName.replace(/[^A-Za-z0-9._-]+/g, '').slice(0, 120) || 'past-paper.pdf';

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    // Timed out or unreachable from here: open the official (allowlisted) page directly
    return NextResponse.redirect(parsed.toString(), 302);
  }
}
