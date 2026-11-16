/**
 * Emails a new /schools licence enquiry to the Educate team, through Resend's HTTP API.
 *
 * Needs three environment variables (server-only):
 *   RESEND_API_KEY        a Resend API key with sending access
 *   ENQUIRY_NOTIFY_TO     who gets the email (comma-separated for more than one)
 *   ENQUIRY_NOTIFY_FROM   the sender, on a domain verified in Resend, e.g. "Educate <enquiries@example.com>"
 * If any is missing the email is skipped and logged; the enquiry is still saved and listed on /admin.
 *
 * Never throws: a failed email must not fail the enquiry. The body is plain text, so nothing
 * the enquirer typed can become HTML. Reply-To is the enquirer, so "Reply" answers them.
 */

export interface EnquiryForEmail {
  name: string;
  role: string;
  organisation: string;
  email: string;
  studentCount?: number | null;
  message?: string;
}

const RESEND_URL = 'https://api.resend.com/emails';
const TIMEOUT_MS = 5_000;

/** One line, no control characters, so typed text can't add lines to the subject */
function oneLine(s: string, max: number): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
}

export function enquiryEmail(e: EnquiryForEmail, appUrl = process.env.NEXT_PUBLIC_APP_URL) {
  const subject = `School licence enquiry: ${oneLine(e.organisation, 120)}`;
  const lines = [
    'A new licence enquiry came in through the /schools form.',
    '',
    `Name: ${oneLine(e.name, 200)}`,
    `Role: ${oneLine(e.role, 200)}`,
    `School or organisation: ${oneLine(e.organisation, 200)}`,
    `Email: ${oneLine(e.email, 254)}`,
    `Students: ${e.studentCount ?? 'not given'}`,
    '',
    'Message:',
    e.message?.trim() ? e.message.trim() : '(none)',
    '',
    'Reply to this email to answer them directly.',
  ];
  if (appUrl) lines.push(`All enquiries: ${appUrl.replace(/\/$/, '')}/admin`);
  return { subject, text: lines.join('\n') };
}

export async function notifyEnquiry(e: EnquiryForEmail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_TO;
  const from = process.env.ENQUIRY_NOTIFY_FROM;
  if (!key || !to || !from) {
    console.warn('[school-enquiries] email not set up (RESEND_API_KEY, ENQUIRY_NOTIFY_TO, ENQUIRY_NOTIFY_FROM); enquiry saved only');
    return;
  }

  const { subject, text } = enquiryEmail(e);
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: e.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[school-enquiries] email failed: ${res.status} ${detail.slice(0, 300)}`);
    }
  } catch (err) {
    console.error('[school-enquiries] email failed:', err instanceof Error ? err.message : err);
  }
}
