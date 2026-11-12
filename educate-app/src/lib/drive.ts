/**
 * Google Drive helper (server-side only).
 *
 * Two auth modes, chosen from GOOGLE_CREDENTIALS_JSON (or scripts/credentials.json):
 *
 *  1. Service account — JSON with `type: "service_account"` (or `client_email` +
 *     `private_key`). Authenticates with a JWT, scope drive.readonly.
 *     GOOGLE_TOKEN_JSON is NOT needed. Share the PAPERS folder with the
 *     service account's client_email (Viewer) — the folder stays private.
 *
 *  2. OAuth2 client (desktop `installed` / `web` JSON) — also needs
 *     GOOGLE_TOKEN_JSON (or scripts/token.json) containing a refresh token.
 *
 * Env vars take precedence; scripts/*.json is the local-dev fallback.
 * Never log credential contents.
 */
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const DRIVE_READONLY_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

let cachedDrive: drive_v3.Drive | null = null;

function readLocal(file: string): string | undefined {
  const p = path.join(process.cwd(), 'scripts', file);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : undefined;
}

function parseJson(raw: string, label: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // Deliberately do not include the raw value in the error
    throw new Error(`Google Drive ${label} is not valid JSON`);
  }
}

function isServiceAccount(creds: Record<string, unknown>): boolean {
  return creds.type === 'service_account' ||
    (typeof creds.client_email === 'string' && typeof creds.private_key === 'string');
}

export function getDrive(): drive_v3.Drive {
  if (cachedDrive) return cachedDrive;

  const credsRaw = process.env.GOOGLE_CREDENTIALS_JSON || readLocal('credentials.json');
  if (!credsRaw) {
    throw new Error('Google Drive credentials not configured (set GOOGLE_CREDENTIALS_JSON)');
  }
  const creds = parseJson(credsRaw, 'credentials');

  // ── Mode 1: service account ──────────────────────────────────────────
  if (isServiceAccount(creds)) {
    const auth = new google.auth.JWT({
      email: creds.client_email as string,
      // Env vars sometimes carry literal "\n" sequences in the key
      key: (creds.private_key as string).replace(/\\n/g, '\n'),
      scopes: [DRIVE_READONLY_SCOPE],
    });
    cachedDrive = google.drive({ version: 'v3', auth });
    return cachedDrive;
  }

  // ── Mode 2: OAuth2 client + stored token ─────────────────────────────
  const tokenRaw = process.env.GOOGLE_TOKEN_JSON || readLocal('token.json');
  if (!tokenRaw) {
    throw new Error('Google Drive OAuth token not configured (set GOOGLE_TOKEN_JSON, or use a service account)');
  }
  const tokens = parseJson(tokenRaw, 'token');
  const installed = (creds.installed ?? creds.web ?? creds) as Record<string, string>;

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
    { fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'arraybuffer' },
  );
  return Buffer.from(res.data as ArrayBuffer);
}
