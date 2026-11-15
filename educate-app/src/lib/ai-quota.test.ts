import { describe, it, expect, vi, beforeEach } from 'vitest';

const sqlMock = vi.fn();
const tierMock = vi.fn();
vi.mock('./db', () => ({ sql: (...args: unknown[]) => sqlMock(...args) }));
vi.mock('./school-licence', () => ({ getAccessTier: (...args: unknown[]) => tierMock(...args) }));

import { takeAiUse, refundAiUse, aiLimitMessage, AI_DAILY_LIMITS } from './ai-quota';

describe('takeAiUse', () => {
  beforeEach(() => {
    sqlMock.mockReset();
    tierMock.mockReset();
    tierMock.mockResolvedValue('school');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('allows the use while the row is under the limit', async () => {
    sqlMock.mockResolvedValue([{ uses: 3 }]);
    const r = await takeAiUse('user_1', 'tutor');
    expect(r).toMatchObject({ ok: true, tier: 'school', limit: AI_DAILY_LIMITS.school.tutor, used: 3 });
  });

  it('refuses when the conditional update returns no row (limit reached)', async () => {
    sqlMock.mockResolvedValue([]);
    const r = await takeAiUse('user_1', 'paper_marking');
    expect(r.ok).toBe(false);
    expect(r.used).toBe(AI_DAILY_LIMITS.school.paper_marking);
    expect(r.message).toBe(aiLimitMessage('paper_marking', 'school'));
  });

  it('uses the free limits for a student without a school licence', async () => {
    tierMock.mockResolvedValue('free');
    sqlMock.mockResolvedValue([{ uses: 1 }]);
    await takeAiUse('user_1', 'tutor');
    const values = (sqlMock.mock.calls[0] as unknown[]).slice(1);
    expect(values).toContain(AI_DAILY_LIMITS.free.tutor);
    expect(AI_DAILY_LIMITS.free.tutor).toBeLessThan(AI_DAILY_LIMITS.school.tutor);
  });

  it('refuses whole-paper marking on the free tier without touching the database', async () => {
    tierMock.mockResolvedValue('free');
    const r = await takeAiUse('user_1', 'paper_marking');
    expect(r.ok).toBe(false);
    expect(sqlMock).not.toHaveBeenCalled();
    expect(r.message).toContain('school licence');
  });

  it('passes the user, bucket and limit as query parameters, never in the SQL text', async () => {
    sqlMock.mockResolvedValue([{ uses: 1 }]);
    await takeAiUse("user_x'; DROP TABLE ai_usage;--", 'study');
    const [strings, ...values] = sqlMock.mock.calls[0] as [TemplateStringsArray, ...unknown[]];
    expect(strings.join('')).not.toContain('DROP TABLE');
    expect(values).toEqual(["user_x'; DROP TABLE ai_usage;--", 'study', AI_DAILY_LIMITS.school.study]);
  });

  it('lets the request through when the database fails', async () => {
    sqlMock.mockRejectedValue(new Error('relation "ai_usage" does not exist'));
    const r = await takeAiUse('user_1', 'tutor');
    expect(r.ok).toBe(true);
    expect(r.used).toBeNull();
  });
});

describe('refundAiUse', () => {
  it('does not throw when the database fails', async () => {
    sqlMock.mockRejectedValue(new Error('down'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(refundAiUse('user_1', 'tutor')).resolves.toBeUndefined();
  });
});

describe('aiLimitMessage', () => {
  it('names the school limit and when it comes back', () => {
    expect(aiLimitMessage('paper_marking', 'school')).toBe(
      `You've used today's ${AI_DAILY_LIMITS.school.paper_marking} AI-marked papers. You can use them again from midnight.`,
    );
  });

  it('tells a free student what a school licence gives', () => {
    expect(aiLimitMessage('tutor', 'free')).toBe(
      `You've used today's ${AI_DAILY_LIMITS.free.tutor} free AI tutor messages. More from midnight. ` +
      `Schools with an Educate licence get ${AI_DAILY_LIMITS.school.tutor} a day.`,
    );
  });

  it('uses the singular when the free allowance is one', () => {
    expect(aiLimitMessage('study', 'free')).toContain("today's free AI study tool or set of notes.");
    // The notes page shows limit messages by looking for "midnight"
    expect(aiLimitMessage('study', 'free')).toContain('midnight');
  });
});
