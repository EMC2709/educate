/** Streak & Daily Goals tracking — all localStorage based */

const STREAK_KEY = 'educate-streak';
const DAILY_XP_KEY = 'educate-daily-xp';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDays: string[];   // list of YYYY-MM-DD
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      const data: StreakData = JSON.parse(raw);
      // If last active was before yesterday, streak is broken
      if (data.lastActiveDate !== today() && data.lastActiveDate !== yesterday()) {
        data.currentStreak = 0;
      }
      return data;
    }
  } catch {}
  return { currentStreak: 0, longestStreak: 0, lastActiveDate: '', activeDays: [] };
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
