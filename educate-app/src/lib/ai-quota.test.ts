import { describe, it, expect, vi, beforeEach } from 'vitest';

const sqlMock = vi.fn();
vi.mock('./db', () => ({ sql: (...args: unknown[]) => sqlMock(...args) }));

import { takeAiUse, refundAiUse, aiLimitMessage, AI_DAILY_LIMITS } from './ai-quota';

describe('takeAiUse', () => {
  beforeEach(() => {
    sqlMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('allows the use while the row is under the limit', async () => {
    sqlMock.mockResolvedValue([{ uses: 3 }]);
    const r = await takeAiUse('user_1', 'tutor');
    expect(r).toEqual({ ok: true, limit: AI_DAILY_LIMITS.tutor, used: 3 });
  });

  it('refuses when the conditional update returns no row (limit reached)', async () => {
    sqlMock.mockResolvedValue([]);
    const r = await takeAiUse('user_1', 'paper_marking');
    expect(r.ok).toBe(false);
    expect(r.used).toBe(AI_DAILY_LIMITS.paper_marking);
  });

  it('passes the user, bucket and limit as query parameters, never in the SQL text', async () => {
    sqlMock.mockResolvedValue([{ uses: 1 }]);
    await takeAiUse("user_x'; DROP TABLE ai_usage;--", 'study');
    const [strings, ...values] = sqlMock.mock.calls[0] as [TemplateStringsArray, ...unknown[]];
    expect(strings.join('')).not.toContain('DROP TABLE');
    expect(values).toEqual(["user_x'; DROP TABLE ai_usage;--", 'study', AI_DAILY_LIMITS.study]);
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
  it('names the limit and when it comes back', () => {
    expect(aiLimitMessage('paper_marking')).toBe(
      `You've used today's ${AI_DAILY_LIMITS.paper_marking} AI-marked papers. You can use them again from midnight.`,
    );
  });
});
