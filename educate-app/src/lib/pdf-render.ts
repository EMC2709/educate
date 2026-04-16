/**
 * Render a single page of a PDF to PNG using pdfjs-dist + @napi-rs/canvas.
 * Runs in Node.js serverless (Vercel compatible).
 */
import { createCanvas } from '@napi-rs/canvas';

// Types only — dynamic import at runtime to avoid ESM/CJS bundling issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsLib: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPdfjs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // In Node/serverless, point workerSrc at the bundled worker file so pdfjs
  // can spin up its fake worker without trying to resolve a CDN URL.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRequire } = await import('node:module');
  const { pathToFileURL } = await import('node:url');
  const require = createRequire(import.meta.url);
  try {
    const p = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(p).href;
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';
  }
  return pdfjsLib;
}

interface CanvasFactoryResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any;
}

// Minimal CanvasFactory for pdfjs in Node
class NodeCanvasFactory {
  create(width: number, height: number): CanvasFactoryResult {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return { canvas, context };
  }
  reset(ctx: CanvasFactoryResult, width: number, height: number): void {
    ctx.canvas.width = width;
    ctx.canvas.height = height;
  }
  destroy(ctx: CanvasFactoryResult): void {
    ctx.canvas.width = 0;
    ctx.canvas.height = 0;
  }
}

export interface RenderOptions {
  pdfBuffer: Buffer;
  pageNumber: number;   // 1-based
  width?: number;       // target width in px (default 1000)
}

export interface RenderResult {
  png: Buffer;
  pageCount: number;
}

export async function renderPdfPage({ pdfBuffer, pageNumber, width = 1000 }: RenderOptions): Promise<RenderResult> {
  const pdfjs = await getPdfjs();

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;

  const pageCount = doc.numPages;
  const clamped = Math.min(Math.max(1, pageNumber), pageCount);

  const page = await doc.getPage(clamped);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = width / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const factory = new NodeCanvasFactory();
  const { canvas, context } = factory.create(viewport.width, viewport.height);

  await page.render({
    canvasContext: context,
    viewport,
    canvasFactory: factory,
    // pdfjs v4+ requires this explicit param in some cases
    background: 'white',
  }).promise;

  const png = await canvas.encode('png');

  await doc.cleanup();
  await doc.destroy();

  return { png, pageCount };
}

/** Get just the page count without rendering. */
export async function getPdfPageCount(pdfBuffer: Buffer): Promise<number> {
  const pdfjs = await getPdfjs();
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;
  const n = doc.numPages;
  await doc.destroy();
  return n;
}
