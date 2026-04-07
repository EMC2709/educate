/** SM-2 Spaced Repetition Algorithm — localStorage based */

const SR_KEY = 'educate-sr-data';

export interface SRCard {
  id: string;           // unique card ID (e.g. "subject:topic:term")
  term: string;
  definition: string;
  easeFactor: number;   // starts at 2.5
  interval: number;     // days until next review
  repetitions: number;  // consecutive correct reviews
  nextReview: string;   // ISO date
  lastReview: string;   // ISO date
}

export type SRGrade = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout, 1 = incorrect but recognized, 2 = incorrect but easy to recall
// 3 = correct with difficulty, 4 = correct, 5 = perfect/easy

interface SRStore {
  cards: Record<string, SRCard>;
}

function getStore(): SRStore {
  try {
    const raw = localStorage.getItem(SR_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { cards: {} };
}

function saveStore(store: SRStore): void {
  localStorage.setItem(SR_KEY, JSON.stringify(store));
}

export function getCard(id: string): SRCard | null {
  return getStore().cards[id] ?? null;
}

export function initCard(id: string, term: string, definition: string): SRCard {
  const store = getStore();
  if (store.cards[id]) return store.cards[id];

  const card: SRCard = {
    id,
    term,
    definition,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString().split('T')[0],
    lastReview: '',
  };
  store.cards[id] = card;
  saveStore(store);
  return card;
}

export function gradeCard(id: string, grade: SRGrade): SRCard {
  const store = getStore();
  const card = store.cards[id];
  if (!card) throw new Error(`Card ${id} not found`);

  const today = new Date().toISOString().split('T')[0];
  card.lastReview = today;

  if (grade >= 3) {
    // Correct response
    if (card.repetitions === 0) {
      card.interval = 1;
    } else if (card.repetitions === 1) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.easeFactor);
    }
    card.repetitions += 1;
  } else {
    // Incorrect response — reset
    card.repetitions = 0;
    card.interval = 0; // review again today/tomorrow
  }

  // Update ease factor (SM-2 formula)
  card.easeFactor = card.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (card.easeFactor < 1.3) card.easeFactor = 1.3;

  // Set next review date
  const next = new Date();
  next.setDate(next.getDate() + Math.max(card.interval, 1));
  card.nextReview = next.toISOString().split('T')[0];

  store.cards[id] = card;
  saveStore(store);
  return card;
}

/** Get cards due for review today for a given subject prefix */
export function getDueCards(subjectPrefix: string): SRCard[] {
  const store = getStore();
  const today = new Date().toISOString().split('T')[0];
  return Object.values(store.cards)
    .filter(c => c.id.startsWith(subjectPrefix) && c.nextReview <= today)
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview));
}

/** Get all cards for a subject */
export function getAllCards(subjectPrefix: string): SRCard[] {
  const store = getStore();
  return Object.values(store.cards).filter(c => c.id.startsWith(subjectPrefix));
}

/** Get stats for a subject */
export function getSRStats(subjectPrefix: string) {
  const cards = getAllCards(subjectPrefix);
  const today = new Date().toISOString().split('T')[0];
  const due = cards.filter(c => c.nextReview <= today).length;
  const mastered = cards.filter(c => c.repetitions >= 3 && c.interval >= 21).length;
  const learning = cards.filter(c => c.repetitions > 0 && c.repetitions < 3).length;
  const newCards = cards.filter(c => c.repetitions === 0).length;
  return { total: cards.length, due, mastered, learning, new: newCards };
}

/** Map flashcard confidence buttons to SM-2 grades */
export function confidenceToGrade(confidence: 'again' | 'hard' | 'good' | 'easy'): SRGrade {
  switch (confidence) {
    case 'again': return 1;
    case 'hard': return 3;
    case 'good': return 4;
    case 'easy': return 5;
  }
}
