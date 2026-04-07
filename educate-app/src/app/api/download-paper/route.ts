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

  const isAllowed = ALLOWED_DOMAINS.some(d => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`));
  if (!isAllowed) {
    return NextResponse.json({ error: 'Domain not permitted' }, { status: 403 });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        Accept: 'text/html,application/pdf,application/xhtml+xml,*/*',
      },
      redirect: 'follow',
    });

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const responseHeaders: Record<string, string> = { 'Content-Type': contentType };

    if (contentType.includes('pdf')) {
      // Force download with a sensible filename
      const filename = parsed.pathname.split('/').filter(Boolean).pop() ?? 'past-paper.pdf';
      responseHeaders['Content-Disposition'] = `attachment; filename="${filename}"`;
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 502 });
  }
}
