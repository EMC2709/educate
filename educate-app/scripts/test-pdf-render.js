const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const envPath = path.join(__dirname, '..', '.env.local');
for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) {
    let v = m[2].trim().replace(/^"(.*)"$/, '$1').replace(/\\n/g, '').replace(/\r/g, '').trim();
    process.env[m[1].trim()] = v;
  }
}

(async () => {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`SELECT id, drive_file_id, title FROM past_papers
    WHERE drive_file_id IS NOT NULL AND total_questions > 20 LIMIT 1`;
  if (!rows.length) { console.log('no papers'); return; }
  const { id, drive_file_id, title } = rows[0];
  console.log(`Testing: ${title}  (drive_file_id=${drive_file_id})`);

  const { google } = require('googleapis');
  const creds = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json'), 'utf-8'));
  const token = JSON.parse(fs.readFileSync(path.join(__dirname, 'token.json'), 'utf-8'));
  const { client_id, client_secret } = creds.installed;
  const auth = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3333/callback');
  auth.setCredentials(token);
  const drive = google.drive({ version: 'v3', auth });

  const t0 = Date.now();
  const res = await drive.files.get({ fileId: drive_file_id, alt: 'media' }, { responseType: 'arraybuffer' });
  const buf = Buffer.from(res.data);
  console.log(`Downloaded ${buf.length} bytes in ${Date.now() - t0}ms`);

  // Try to render
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = '';
  const t1 = Date.now();
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buf),
    disableWorker: true,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;
  console.log(`Parsed PDF: ${doc.numPages} pages in ${Date.now() - t1}ms`);

  const { createCanvas } = require('@napi-rs/canvas');
  const page = await doc.getPage(1);
  const vp = page.getViewport({ scale: 1000 / page.getViewport({ scale: 1 }).width });
  const canvas = createCanvas(vp.width, vp.height);
  const ctx = canvas.getContext('2d');
  const factory = {
    create(w, h) { const c = createCanvas(w, h); return { canvas: c, context: c.getContext('2d') }; },
    reset(obj, w, h) { obj.canvas.width = w; obj.canvas.height = h; },
    destroy(obj) { obj.canvas.width = 0; obj.canvas.height = 0; },
  };
  const t2 = Date.now();
  await page.render({ canvasContext: ctx, viewport: vp, canvasFactory: factory, background: 'white' }).promise;
  const png = await canvas.encode('png');
  console.log(`Rendered page 1 → ${png.length} bytes in ${Date.now() - t2}ms`);

  const out = path.join(__dirname, 'test-render.png');
  fs.writeFileSync(out, png);
  console.log(`Saved to ${out}`);
  console.log(`Paper id for browser test: ${id}`);
})();
