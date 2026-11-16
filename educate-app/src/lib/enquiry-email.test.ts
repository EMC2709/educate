import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { enquiryEmail, notifyEnquiry } from './enquiry-email';

const enquiry = {
  name: 'Sam Taylor',
  role: 'Head of department',
  organisation: 'Oakwood Academy',
  email: 's.taylor@oakwood.sch.uk',
  studentCount: 240,
  message: 'Maths and science, AQA.\nAbout 8 classes.',
};

describe('enquiryEmail', () => {
  it('puts every field in a plain-text body with a link to /admin', () => {
    const { subject, text } = enquiryEmail(enquiry, 'https://educatethemasses.online/');
    expect(subject).toBe('School licence enquiry: Oakwood Academy');
    for (const part of ['Sam Taylor', 'Head of department', 's.taylor@oakwood.sch.uk', 'Students: 240', 'About 8 classes.']) {
      expect(text).toContain(part);
    }
    expect(text).toContain('https://educatethemasses.online/admin');
  });

  it('keeps typed line breaks out of the subject', () => {
    expect(enquiryEmail({ ...enquiry, organisation: 'Oak\r\nBcc: x@y.z' }).subject).toBe('School licence enquiry: Oak Bcc: x@y.z');
  });

  it('says when optional fields were left out', () => {
    const { text } = enquiryEmail({ ...enquiry, studentCount: null, message: undefined }, undefined);
    expect(text).toContain('Students: not given');
    expect(text).toContain('(none)');
    expect(text).not.toContain('/admin');
  });
});

describe('notifyEnquiry', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('ENQUIRY_NOTIFY_TO', 'team@example.com, sales@example.com');
    vi.stubEnv('ENQUIRY_NOTIFY_FROM', 'Educate <enquiries@example.com>');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('sends nothing until all three settings are there', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    await notifyEnquiry(enquiry);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it('sends to every address, with the enquirer as Reply-To', async () => {
    fetchMock.mockResolvedValue(new Response('{"id":"1"}', { status: 200 }));
    await notifyEnquiry(enquiry);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test');
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      from: 'Educate <enquiries@example.com>',
      to: ['team@example.com', 'sales@example.com'],
      reply_to: 's.taylor@oakwood.sch.uk',
      subject: 'School licence enquiry: Oakwood Academy',
    });
    expect(body.html).toBeUndefined();
  });

  it('logs a refused or failed send instead of throwing', async () => {
    fetchMock.mockResolvedValueOnce(new Response('domain not verified', { status: 403 }));
    await expect(notifyEnquiry(enquiry)).resolves.toBeUndefined();
    fetchMock.mockRejectedValueOnce(new Error('timeout'));
    await expect(notifyEnquiry(enquiry)).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});
