/** Streak & Daily Goals tracking — all localStorage based */

const STREAK_KEY = 'educate-streak';
const DAILY_XP_KEY = 'educate-daily-xp';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDays: string[];   // list of YYYY-MM-DD
  shields: number;        // 0–3, awarded every 7-day streak milestone
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/**
 * If the user missed yesterday (but not earlier) and has a shield available,
 * consume one shield and backdate lastActiveDate to yesterday so the streak
 * continues unbroken. Returns true if a shield was used.
 */
export function useStreakShield(): boolean {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return false;
    const data: StreakData = JSON.parse(raw);
    const t = today();
    const yest = yesterday();

    // A shield is only useful when the user missed yesterday specifically —
    // if they were active today or have a gap longer than 1 day it doesn't apply.
    if (data.lastActiveDate === t || data.lastActiveDate === yest) return false;
    if (!data.shields || data.shields <= 0) return false;

    // Check the gap is exactly one day (i.e. lastActiveDate was the day before yesterday)
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    const dayBeforeYesterdayStr = dayBeforeYesterday.toISOString().split('T')[0];
    if (data.lastActiveDate !== dayBeforeYesterdayStr) return false;

    // Consume one shield and backdate to yesterday so streak won't reset
    data.shields -= 1;
    data.lastActiveDate = yest;
    if (!data.activeDays.includes(yest)) {
      data.activeDays.push(yest);
    }
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function getShieldCount(): number {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return 0;
    const data: StreakData = JSON.parse(raw);
    return data.shields ?? 0;
  } catch {
    return 0;
  }
}

export function getStreakData(): StreakData {
  // Transparently attempt to use a shield before returning data
  useStreakShield();

  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      const data: StreakData = JSON.parse(raw);
      // If last active was before yesterday, streak is broken
      if (data.lastActiveDate !== today() && data.lastActiveDate !== yesterday()) {
        data.currentStreak = 0;
      }
      if (data.shields === undefined) data.shields = 0;
      return data;
    }
  } catch {}
  return { currentStreak: 0, longestStreak: 0, lastActiveDate: '', activeDays: [], shields: 0 };
}

export function recordActivity(): StreakData {
  const data = getStreakData();
  const t = today();

  if (data.lastActiveDate === t) {
    // Already recorded today
    return data;
  }

  if (data.lastActiveDate === yesterday()) {
    data.currentStreak += 1;
  } else {
    data.currentStreak = 1;
  }

  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak;
  }

  // Award a shield for every 7-day milestone (up to max 3)
  if (data.currentStreak % 7 === 0 && (data.shields ?? 0) < 3) {
    data.shields = (data.shields ?? 0) + 1;
  }

  data.lastActiveDate = t;
  if (!data.activeDays.includes(t)) {
    data.activeDays.push(t);
    // Keep last 90 days only
    if (data.activeDays.length > 90) {
      data.activeDays = data.activeDays.slice(-90);
    }
  }

  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  return data;
}

// Daily XP tracking
interface DailyXP {
  date: string;
  earned: number;
  goal: number;
}

export function getDailyXP(): DailyXP {
  try {
    const raw = localStorage.getItem(DAILY_XP_KEY);
    if (raw) {
      const data: DailyXP = JSON.parse(raw);
      if (data.date === today()) return data;
    }
  } catch {}
  return { date: today(), earned: 0, goal: 50 };
}

export function addDailyXP(amount: number): DailyXP {
  const data = getDailyXP();
  data.earned += amount;
  data.date = today();
  localStorage.setItem(DAILY_XP_KEY, JSON.stringify(data));
  return data;
}

export function setDailyGoal(goal: number): void {
  const data = getDailyXP();
  data.goal = goal;
  localStorage.setItem(DAILY_XP_KEY, JSON.stringify(data));
}
