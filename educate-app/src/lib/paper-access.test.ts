import { describe, it, expect, vi, beforeEach } from 'vitest';

const sqlMock = vi.fn();
const tierMock = vi.fn();
vi.mock('./db', () => ({ sql: (...args: unknown[]) => sqlMock(...args) }));
vi.mock('./school-licence', () => ({ getAccessTier: (...args: unknown[]) => tierMock(...args) }));

import { canOpenPaper, FREE_PAPER_LIMIT } from './paper-access';

let n = 0;
const fresh = () => `user_${++n}`; // the module caches allowed pairs, so each test uses new ids

describe('canOpenPaper', () => {
  beforeEach(() => {
    sqlMock.mockReset();
    tierMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('lets a licensed school open any paper without recording it', async () => {
    tierMock.mockResolvedValue('school');
    expect(await canOpenPaper(fresh(), 'paper-a')).toBe(true);
    expect(sqlMock).not.toHaveBeenCalled();
  });

  it('lets a free student open a paper while under the limit', async () => {
    tierMock.mockResolvedValue('free');
    sqlMock.mockResolvedValue([{ ok: true }]);
    expect(await canOpenPaper(fresh(), 'paper-a')).toBe(true);
    const values = (sqlMock.mock.calls[0] as unknown[]).slice(1);
    expect(values).toContain(FREE_PAPER_LIMIT);
  });

  it('refuses a free student over the limit', async () => {
    tierMock.mockResolvedValue('free');
    sqlMock.mockResolvedValue([{ ok: false }]);
    expect(await canOpenPaper(fresh(), 'paper-c')).toBe(false);
  });

  it('remembers an allowed paper, so page images do not repeat the lookup', async () => {
    tierMock.mockResolvedValue('free');
    sqlMock.mockResolvedValue([{ ok: true }]);
    const user = fresh();
    await canOpenPaper(user, 'paper-a');
    await canOpenPaper(user, 'paper-a');
    expect(sqlMock).toHaveBeenCalledTimes(1);
  });

  it('lets the paper through when the table cannot be reached', async () => {
    tierMock.mockResolvedValue('free');
    sqlMock.mockRejectedValue(new Error('relation "paper_opens" does not exist'));
    expect(await canOpenPaper(fresh(), 'paper-a')).toBe(true);
  });
});
