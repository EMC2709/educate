/** Weekly Revision Challenges — localStorage based */

const CHALLENGES_KEY = 'educate-challenges';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  xpReward: number;
  type: 'quizzes' | 'accuracy' | 'subjects' | 'streak' | 'timer' | 'flashcards';
  completed: boolean;
}

interface ChallengeWeek {
  weekStart: string; // Monday YYYY-MM-DD
  challenges: Challenge[];
}

function getMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

const CHALLENGE_TEMPLATES: Omit<Challenge, 'id' | 'progress' | 'completed'>[] = [
  { title: 'Quiz Sprinter', description: 'Complete 5 quizzes this week', icon: '\u{1F3C3}', target: 5, xpReward: 50, type: 'quizzes' },
  { title: 'Accuracy Star', description: 'Score 80%+ on 3 quizzes', icon: '\u{1F3AF}', target: 3, xpReward: 75, type: 'accuracy' },
  { title: 'Subject Explorer', description: 'Study 3 different subjects', icon: '\u{1F30D}', target: 3, xpReward: 40, type: 'subjects' },
  { title: 'Streak Builder', description: 'Maintain a 5-day streak', icon: '\u{1F525}', target: 5, xpReward: 60, type: 'streak' },
  { title: 'Focus Champion', description: 'Complete 3 timer sessions', icon: '\u{23F0}', target: 3, xpReward: 45, type: 'timer' },
  { title: 'Quiz Marathon', description: 'Complete 10 quizzes this week', icon: '\u{1F3C5}', target: 10, xpReward: 100, type: 'quizzes' },
  { title: 'Sharp Shooter', description: 'Score 90%+ on 2 quizzes', icon: '\u{1F4A5}', target: 2, xpReward: 80, type: 'accuracy' },
  { title: 'Study All Rounder', description: 'Study 5 different subjects', icon: '\u{1F4DA}', target: 5, xpReward: 60, type: 'subjects' },
  { title: 'Card Master', description: 'Complete 5 flashcard decks', icon: '\u{1F0CF}', target: 5, xpReward: 50, type: 'flashcards' },
  { title: 'Deep Focus', description: 'Complete 5 timer sessions', icon: '\u{1F9D8}', target: 5, xpReward: 70, type: 'timer' },
];

function generateWeeklyChallenges(): Challenge[] {
  // Pick 4 random challenges, ensuring variety
  const shuffled = [...CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
  const types = new Set<string>();
  const picked: Challenge[] = [];

  for (const tmpl of shuffled) {
    if (picked.length >= 4) break;
    if (types.has(tmpl.type) && picked.length < 3) continue; // try for variety first
    types.add(tmpl.type);
    picked.push({
      ...tmpl,
      id: Math.random().toString(36).slice(2),
      progress: 0,
      completed: false,
    });
  }

  // Fill remaining if needed
  while (picked.length < 4) {
    const tmpl = shuffled[picked.length];
    picked.push({
      ...tmpl,
      id: Math.random().toString(36).slice(2),
      progress: 0,
      completed: false,
    });
  }

  return picked;
}

export function getChallenges(): ChallengeWeek {
  const monday = getMonday();
  try {
    const raw = localStorage.getItem(CHALLENGES_KEY);
    if (raw) {
      const week: ChallengeWeek = JSON.parse(raw);
      if (week.weekStart === monday) return week;
    }
  } catch {}

  // New week — generate fresh challenges
  const week: ChallengeWeek = {
    weekStart: monday,
    challenges: generateWeeklyChallenges(),
  };
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(week));
  return week;
}

export function updateChallengeProgress(
  type: Challenge['type'],
  increment: number = 1,
  conditionMet: boolean = true,
): { completed: Challenge[] } {
  if (!conditionMet) return { completed: [] };

  const week = getChallenges();
  const newlyCompleted: Challenge[] = [];

  week.challenges.forEach(c => {
    if (c.completed || c.type !== type) return;
    c.progress = Math.min(c.progress + increment, c.target);
    if (c.progress >= c.target) {
      c.completed = true;
      newlyCompleted.push(c);
    }
  });

  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(week));
  return { completed: newlyCompleted };
}

export function getSubjectsStudiedThisWeek(): string[] {
  try {
    const raw = localStorage.getItem('educate-weekly-subjects');
    if (raw) {
      const data = JSON.parse(raw);
      if (data.week === getMonday()) return data.subjects;
    }
  } catch {}
  return [];
}

export function recordSubjectStudied(subject: string): void {
  const monday = getMonday();
  const subjects = getSubjectsStudiedThisWeek();
  if (!subjects.includes(subject)) {
    subjects.push(subject);
    localStorage.setItem('educate-weekly-subjects', JSON.stringify({ week: monday, subjects }));
    updateChallengeProgress('subjects', 1);
  }
}
