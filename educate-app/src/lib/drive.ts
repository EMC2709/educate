/**
 * Google Drive OAuth helper.
 *
 * Reads credentials from env vars in production (Vercel):
 *   GOOGLE_CREDENTIALS_JSON — full credentials.json contents (stringified)
 *   GOOGLE_TOKEN_JSON       — full token.json contents (stringified)
 *
 * Falls back to scripts/credentials.json + scripts/token.json for local dev.
 */
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

let cachedDrive: drive_v3.Drive | null = null;

export function getDrive(): drive_v3.Drive {
  if (cachedDrive) return cachedDrive;

  let credsRaw = process.env.GOOGLE_CREDENTIALS_JSON;
  let tokenRaw = process.env.GOOGLE_TOKEN_JSON;

  if (!credsRaw || !tokenRaw) {
    const credsPath = path.join(process.cwd(), 'scripts', 'credentials.json');
    const tokenPath = path.join(process.cwd(), 'scripts', 'token.json');
    if (fs.existsSync(credsPath) && fs.existsSync(tokenPath)) {
      credsRaw = fs.readFileSync(credsPath, 'utf-8');
      tokenRaw = fs.readFileSync(tokenPath, 'utf-8');
    }
  }

  if (!credsRaw || !tokenRaw) {
    throw new Error('Google Drive credentials not configured (set GOOGLE_CREDENTIALS_JSON + GOOGLE_TOKEN_JSON)');
  }

  const creds  = JSON.parse(credsRaw);
  const tokens = JSON.parse(tokenRaw);
  const installed = creds.installed ?? creds.web ?? creds;

  const auth = new google.auth.OAuth2(
    installed.client_id,
    installed.client_secret,
    'http://localhost:3333/callback',
  );
  auth.setCredentials(tokens);

  cachedDrive = google.drive({ version: 'v3', auth });
  return cachedDrive;
}

/** Download a PDF from Drive and return it as a Buffer. */
export async function downloadPdfBuffer(fileId: string): Promise<Buffer> {
  const drive = getDrive();
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' },
  );
  return Buffer.from(res.data as ArrayBuffer);
}
