import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeStr } = await params;
  const size = Math.min(Math.max(parseInt(sizeStr, 10) || 192, 16), 512);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #6366f1 0%, #f43f5e 100%)',
          borderRadius: size * 0.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          fontSize: size * 0.5,
          fontWeight: 900,
          letterSpacing: '-0.05em',
        }}
      >
        E
      </div>
    ),
    { width: size, height: size }
  );
}
