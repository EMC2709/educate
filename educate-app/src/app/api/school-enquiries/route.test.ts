import { describe, it, expect, vi, beforeEach } from 'vitest';

const sqlMock = vi.fn();
vi.mock('@/lib/db', () => ({ sql: (...args: unknown[]) => sqlMock(...args) }));
const notifyMock = vi.fn();
vi.mock('@/lib/enquiry-email', () => ({ notifyEnquiry: (...args: unknown[]) => notifyMock(...args) }));

import { POST } from './route';

let ip = 0;
function post(body: unknown) {
  // A new address per request, so the per-IP rate limit doesn't carry between tests
  return POST(new Request('http://localhost/api/school-enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.0.${++ip}` },
    body: JSON.stringify(body),
  }));
}

const valid = {
  name: 'Sam Taylor',
  role: 'Head of department',
  organisation: 'Oakwood Academy',
  email: 'S.Taylor@Oakwood.sch.uk',
  studentCount: 240,
  message: 'Maths and science, AQA.',
};

describe('POST /api/school-enquiries', () => {
  beforeEach(() => {
    sqlMock.mockReset();
    sqlMock.mockResolvedValue([]);
    notifyMock.mockReset();
    notifyMock.mockResolvedValue(undefined);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('stores a valid enquiry, passing every field as a query parameter', async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const values = (sqlMock.mock.calls[0] as unknown[]).slice(1);
    expect(values).toEqual(['Sam Taylor', 'Head of department', 'Oakwood Academy', 's.taylor@oakwood.sch.uk', 240, 'Maths and science, AQA.']);
    expect(notifyMock).toHaveBeenCalledTimes(1);
    expect(notifyMock.mock.calls[0][0]).toMatchObject({ organisation: 'Oakwood Academy', email: 'S.Taylor@Oakwood.sch.uk' });
  });

  it('accepts an enquiry without the optional fields', async () => {
    const res = await post({ name: 'Sam', role: 'Other', organisation: 'Council', email: 'a@b.gov.uk' });
    expect(res.status).toBe(200);
    expect((sqlMock.mock.calls[0] as unknown[]).slice(5)).toEqual([null, null]);
  });

  it('refuses a bad email, an unknown role or a missing school', async () => {
    for (const bad of [
      { ...valid, email: 'not-an-email' },
      { ...valid, role: 'super_admin' },
      { ...valid, organisation: '   ' },
    ]) {
      expect((await post(bad)).status).toBe(400);
    }
    expect(sqlMock).not.toHaveBeenCalled();
    expect(notifyMock).not.toHaveBeenCalled();
  });

  it('answers a bot that fills the hidden field as if it worked, without storing anything', async () => {
    const res = await post({ ...valid, website: 'http://spam.example' });
    expect(res.status).toBe(200);
    expect(sqlMock).not.toHaveBeenCalled();
    expect(notifyMock).not.toHaveBeenCalled();
  });

  it('limits enquiries from one address', async () => {
    const send = () => POST(new Request('http://localhost/api/school-enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.9.9.9' },
      body: JSON.stringify(valid),
    }));
    for (let i = 0; i < 5; i++) expect((await send()).status).toBe(200);
    expect((await send()).status).toBe(429);
  });

  it('reports a database failure without details', async () => {
    sqlMock.mockRejectedValue(new Error('relation "school_enquiries" does not exist'));
    const res = await post(valid);
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain('relation');
    expect(notifyMock).not.toHaveBeenCalled();
  });
});
