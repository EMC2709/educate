import { describe, it, expect } from 'vitest';
import { licenceStatus, ukToday, formatLicenceDate } from './licence-status';

describe('licenceStatus', () => {
  const today = '2026-11-15';

  it('reads no end date, or a malformed one, as no licence', () => {
    expect(licenceStatus(null, today)).toEqual({ state: 'none', daysLeft: null });
    expect(licenceStatus(undefined, today).state).toBe('none');
    expect(licenceStatus('next July', today).state).toBe('none');
  });

  it('counts the end date itself as licensed', () => {
    expect(licenceStatus('2026-11-15', today)).toEqual({ state: 'ending', daysLeft: 0 });
    expect(licenceStatus('2026-11-14', today)).toEqual({ state: 'ended', daysLeft: -1 });
  });

  it('shows the last 30 days as ending soon', () => {
    expect(licenceStatus('2026-12-14', today)).toEqual({ state: 'ending', daysLeft: 29 });
    expect(licenceStatus('2026-12-15', today)).toEqual({ state: 'active', daysLeft: 30 });
    expect(licenceStatus('2027-07-31', today).state).toBe('active');
  });

  it('counts days across the clocks changing', () => {
    expect(licenceStatus('2027-04-01', '2027-03-20').daysLeft).toBe(12);
  });
});

describe('ukToday', () => {
  it('uses the UK date, not UTC', () => {
    // 23:30 UTC on 30 June is 00:30 on 1 July in the UK (BST)
    expect(ukToday(new Date('2027-06-30T23:30:00Z'))).toBe('2027-07-01');
    expect(ukToday(new Date('2026-12-31T23:30:00Z'))).toBe('2026-12-31');
  });
});

describe('formatLicenceDate', () => {
  it('writes the date the British way', () => {
    expect(formatLicenceDate('2027-07-31')).toBe('31 Jul 2027');
  });
});
