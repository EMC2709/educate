/**
 * How a school's licence end date reads on the page. No database code, so client pages
 * (the teacher dashboard, /admin) can use it. The server decides the tier itself in
 * lib/school-licence.ts with the same rule: a licence counts up to and including its end
 * date, UK time.
 */

/** Days before the end date from which a licence shows as "ending soon" */
export const LICENCE_ENDING_SOON_DAYS = 30;

export type LicenceState = 'none' | 'active' | 'ending' | 'ended';

export interface LicenceStatus {
  state: LicenceState;
  /** Days from today to the end date: 0 on the last day, negative once it has ended */
  daysLeft: number | null;
}

/** Today's date in the UK as YYYY-MM-DD */
export function ukToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(now);
}

/** "31 Jul 2027" from "2027-07-31" */
export function formatLicenceDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function dayNumber(iso: string): number {
  return Math.round(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
}

export function licenceStatus(endsOn: string | null | undefined, today: string = ukToday()): LicenceStatus {
  if (!endsOn || !/^\d{4}-\d{2}-\d{2}$/.test(endsOn)) return { state: 'none', daysLeft: null };
  const daysLeft = dayNumber(endsOn) - dayNumber(today);
  if (daysLeft < 0) return { state: 'ended', daysLeft };
  return { state: daysLeft < LICENCE_ENDING_SOON_DAYS ? 'ending' : 'active', daysLeft };
}
