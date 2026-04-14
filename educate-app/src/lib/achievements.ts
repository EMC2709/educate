/** Achievements & Badges system — localStorage based */

const ACHIEVEMENTS_KEY = 'educate-achievements';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quiz' | 'streak' | 'xp' | 'exploration' | 'special';
  unlockedAt?: string; // ISO date
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Quiz achievements
  { id: 'first-quiz', title: 'First Steps', description: 'Complete your first quiz', icon: '\u{1F31F}', category: 'quiz' },
  { id: 'quiz-10', title: 'Quiz Enthusiast', description: 'Complete 10 quizzes', icon: '\u{1F4DD}', category: 'quiz' },
  { id: 'quiz-50', title: 'Quiz Master', description: 'Complete 50 quizzes', icon: '\u{1F3C6}', category: 'quiz' },
  { id: 'perfect-score', title: 'Perfection', description: 'Score 100% on a quiz', icon: '\u{1F4AF}', category: 'quiz' },
  { id: 'five-perfect', title: 'Flawless Five', description: 'Get 5 perfect scores', icon: '\u{1F48E}', category: 'quiz' },

  // Streak achievements
  { id: 'streak-3', title: 'Getting Started', description: 'Maintain a 3-day streak', icon: '\u{1F525}', category: 'streak' },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '\u{26A1}', category: 'streak' },
  { id: 'streak-14', title: 'Fortnight Force', description: 'Maintain a 14-day streak', icon: '\u{1F4AA}', category: 'streak' },
  { id: 'streak-30', title: 'Monthly Grinder', description: 'Maintain a 30-day streak', icon: '\u{1F451}', category: 'streak' },

  // XP achievements
  { id: 'xp-100', title: 'XP Hunter', description: 'Earn 100 XP total', icon: '\u{2B50}', category: 'xp' },
  { id: 'xp-500', title: 'XP Collector', description: 'Earn 500 XP total', icon: '\u{1F320}', category: 'xp' },
  { id: 'xp-1000', title: 'XP Hoarder', description: 'Earn 1,000 XP total', icon: '\u{1F3C5}', category: 'xp' },
  { id: 'daily-goal', title: 'Daily Target', description: 'Hit your daily XP goal', icon: '\u{1F3AF}', category: 'xp' },

  // Exploration achievements
  { id: 'all-subjects', title: 'Renaissance Student', description: 'Study all your subjects in one day', icon: '\u{1F4DA}', category: 'exploration' },
  { id: 'timetable-created', title: 'Planner', description: 'Create a revision timetable', icon: '\u{1F4C5}', category: 'exploration' },
  { id: 'flashcard-deck', title: 'Card Collector', description: 'Complete a flashcard deck', icon: '\u{1F0CF}', category: 'exploration' },
  { id: 'notes-created', title: 'Note Taker', description: 'Create your first revision note', icon: '\u{270F}\uFE0F', category: 'exploration' },

  // Special achievements
  { id: 'night-owl', title: 'Night Owl', description: 'Study after 10pm', icon: '\u{1F989}', category: 'special' },
  { id: 'early-bird', title: 'Early Bird', description: 'Study before 7am', icon: '\u{1F426}', category: 'special' },
  { id: 'weekend-warrior', title: 'Weekend Warrior', description: 'Study on a Saturday and Sunday', icon: '\u{1F6E1}\uFE0F', category: 'special' },

  // Rank achievements
  { id: 'rank-bronze', title: 'Bronze Ranked', description: 'Reach Bronze rank', icon: '\u{1F7E0}', category: 'xp' },
  { id: 'rank-silver', title: 'Silver Ranked', description: 'Reach Silver rank', icon: '\u26AA', category: 'xp' },
  { id: 'rank-gold', title: 'Gold Ranked', description: 'Reach Gold rank', icon: '\u{1F7E1}', category: 'xp' },
  { id: 'rank-platinum', title: 'Platinum Ranked', description: 'Reach Platinum rank', icon: '\u{1F537}', category: 'xp' },
  { id: 'rank-emerald', title: 'Emerald Ranked', description: 'Reach Emerald rank', icon: '\u{1F49A}', category: 'xp' },
  { id: 'rank-diamond', title: 'Diamond Ranked', description: 'Reach Diamond rank', icon: '\u{1F48E}', category: 'xp' },
  { id: 'rank-champion', title: 'Champion', description: 'Reach the highest rank', icon: '\u{1F451}', category: 'special' },
];

export function getUnlockedAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function isUnlocked(id: string): boolean {
  return getUnlockedAchievements().some(a => a.id === id);
}

export function unlockAchievement(id: string): Achievement | null {
  if (isUnlocked(id)) return null;

  const def = ALL_ACHIEVEMENTS.find(a => a.id === id);
  if (!def) return null;

  const unlocked = getUnlockedAchievements();
  const achievement = { ...def, unlockedAt: new Date().toISOString() };
  unlocked.push(achievement);
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
  return achievement;
}

/** Check conditions and unlock any earned achievements. Returns newly unlocked ones. */
export function checkAchievements(context: {
  quizCount?: number;
  perfectCount?: number;
  streak?: number;
  xp?: number;
  dailyGoalMet?: boolean;
  subjectsStudiedToday?: number;
  totalSubjects?: number;
  timetableCreated?: boolean;
  flashcardDeckDone?: boolean;
  notesCreated?: boolean;
}): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  const tryUnlock = (id: string, condition: boolean) => {
    if (condition) {
      const a = unlockAchievement(id);
      if (a) newlyUnlocked.push(a);
    }
  };

  // Quiz
  tryUnlock('first-quiz', (context.quizCount ?? 0) >= 1);
  tryUnlock('quiz-10', (context.quizCount ?? 0) >= 10);
  tryUnlock('quiz-50', (context.quizCount ?? 0) >= 50);
  tryUnlock('perfect-score', (context.perfectCount ?? 0) >= 1);
  tryUnlock('five-perfect', (context.perfectCount ?? 0) >= 5);

  // Streak
  tryUnlock('streak-3', (context.streak ?? 0) >= 3);
  tryUnlock('streak-7', (context.streak ?? 0) >= 7);
  tryUnlock('streak-14', (context.streak ?? 0) >= 14);
  tryUnlock('streak-30', (context.streak ?? 0) >= 30);

  // XP
  tryUnlock('xp-100', (context.xp ?? 0) >= 100);
  tryUnlock('xp-500', (context.xp ?? 0) >= 500);
  tryUnlock('xp-1000', (context.xp ?? 0) >= 1000);
  tryUnlock('daily-goal', !!context.dailyGoalMet);

  // Rank milestones (Bronze V = 500 XP, Silver V = 2300, Gold V = 6500, etc.)
  tryUnlock('rank-bronze',   (context.xp ?? 0) >= 500);
  tryUnlock('rank-silver',   (context.xp ?? 0) >= 2_300);
  tryUnlock('rank-gold',     (context.xp ?? 0) >= 6_500);
  tryUnlock('rank-platinum', (context.xp ?? 0) >= 18_500);
  tryUnlock('rank-emerald',  (context.xp ?? 0) >= 45_000);
  tryUnlock('rank-diamond',  (context.xp ?? 0) >= 108_000);
  tryUnlock('rank-champion', (context.xp ?? 0) >= 270_000);

  // Exploration
  tryUnlock('all-subjects', (context.subjectsStudiedToday ?? 0) >= (context.totalSubjects ?? 999));
  tryUnlock('timetable-created', !!context.timetableCreated);
  tryUnlock('flashcard-deck', !!context.flashcardDeckDone);
  tryUnlock('notes-created', !!context.notesCreated);

  // Time-based
  const hour = new Date().getHours();
  tryUnlock('night-owl', hour >= 22 || hour < 4);
  tryUnlock('early-bird', hour >= 4 && hour < 7);

  const day = new Date().getDay();
  const streakData = localStorage.getItem('educate-streak');
  if (streakData) {
    try {
      const sd = JSON.parse(streakData);
      const activeDays: string[] = sd.activeDays || [];
      // Check if both Saturday and Sunday this week are in activeDays
      const thisWeekSat = getWeekday(6);
      const thisWeekSun = getWeekday(0);
      tryUnlock('weekend-warrior', activeDays.includes(thisWeekSat) && activeDays.includes(thisWeekSun));
    } catch {}
  }

  return newlyUnlocked;
}

function getWeekday(targetDay: number): string {
  const now = new Date();
  const currentDay = now.getDay();
  const diff = targetDay - currentDay;
  const date = new Date(now);
  date.setDate(date.getDate() + diff);
  return date.toISOString().split('T')[0];
}
