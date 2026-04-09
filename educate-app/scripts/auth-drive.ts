/**
 * One-time Google OAuth2 authorisation.
 * Run once: npx tsx scripts/auth-drive.ts
 * Opens browser, you log in as Paul, token saved to scripts/token.json
 */
import { google } from 'googleapis';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

async function main() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('❌ credentials.json not found at', CREDENTIALS_PATH);
    console.error('   Download it from Google Cloud Console → APIs & Services → Credentials → your Desktop app → Download JSON');
    process.exit(1);
  }

  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = creds.installed;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3333/callback');

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('\n🔐 Opening browser for Google authorisation...');
  console.log('   If it does not open, paste this URL:\n');
  console.log('  ', authUrl, '\n');

  // Try to open browser
  const { exec } = await import('child_process');
  exec(`start "" "${authUrl}"`);

  // Local server to catch the callback
  await new Promise<void>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const qs = new url.URL(req.url!, 'http://localhost:3333').searchParams;
        const code = qs.get('code');
        if (!code) { res.end('No code'); return; }

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

        res.end('<h1>✅ Authorised! You can close this tab.</h1>');
        console.log('\n✅ Token saved to scripts/token.json');
        console.log('   Now run: npx tsx scripts/process-past-papers.ts\n');
        server.close();
        resolve();
      } catch (err) {
        res.end('Error: ' + err);
        reject(err);
      }
    });

    server.listen(3333, () => console.log('   Waiting for Google callback on http://localhost:3333/callback...'));
    server.on('error', reject);
  });
}

main().catch(console.error);
