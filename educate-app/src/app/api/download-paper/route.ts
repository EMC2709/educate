import { NextRequest, NextResponse } from 'next/server';

// Allowlist of domains we'll proxy past papers from
const ALLOWED_DOMAINS = [
  'physicsandmathstutor.com',
  'pmt.physicsandmathstutor.com',
  'aqa.org.uk',
  'filestore.aqa.org.uk',
  'qualifications.pearson.com',
  'ocr.org.uk',
  'wjec.co.uk',
  'eduqas.co.uk',
  'revisionworld.com',
];

function isAllowedHost(hostname: string): boolean {
  return ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`));
}

/**
 * GET /api/download-paper?url=<official exam-board URL>
 *
 * Opens an official past paper or mark scheme. Only PDFs are served from this
 * origin; anything else (for example a board's past-papers web page) is opened
 * on the board's own site, so third-party HTML never runs on Educate's origin.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  if (parsed.protocol !== 'https:' || !isAllowedHost(parsed.hostname)) {
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
    let finalUrl: URL;
    try {
      finalUrl = new URL(upstream.url || parsed.toString());
    } catch {
      finalUrl = parsed;
    }
    if (finalUrl.protocol !== 'https:' || !isAllowedHost(finalUrl.hostname)) {
      void upstream.body?.cancel().catch(() => {});
      return NextResponse.json({ error: 'Domain not permitted' }, { status: 403 });
    }

    const contentType = (upstream.headers.get('content-type') ?? '').toLowerCase();
    if (!upstream.ok || !contentType.includes('application/pdf')) {
      // Not a PDF (or not found): send the student to the official page itself
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
