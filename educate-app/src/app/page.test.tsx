import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactElement } from 'react';

const authMock = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({ auth: () => authMock() }));
// Stand-ins: the real components pull in Clerk hooks and next/font, which
// don't run under Vitest. This test is only about which one `/` picks.
vi.mock('@/components/home/HomeDashboard', () => ({ HomeDashboard: () => null }));
vi.mock('@/components/landing/Landing', () => ({ Landing: () => null }));

import HomePage from './page';
import { HomeDashboard } from '@/components/home/HomeDashboard';
import { Landing } from '@/components/landing/Landing';

describe('/ (home page)', () => {
  beforeEach(() => authMock.mockReset());

  it('shows the landing page to signed-out visitors', async () => {
    authMock.mockResolvedValue({ userId: null });
    const el = (await HomePage()) as ReactElement;
    expect(el.type).toBe(Landing);
  });

  it('keeps the signed-in dashboard (and its role routing) for signed-in users', async () => {
    authMock.mockResolvedValue({ userId: 'user_123' });
    const el = (await HomePage()) as ReactElement;
    expect(el.type).toBe(HomeDashboard);
  });
});
