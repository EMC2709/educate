/** Exam dates manager — localStorage based */

const EXAM_DATES_KEY = 'educate-exam-dates';

export interface ExamDate {
  id: string;
  subject: string;
  board: string;
  paper: string;     // e.g. "Paper 1", "Paper 2"
  date: string;       // YYYY-MM-DD
  time?: string;      // e.g. "09:00"
}

export function getExamDates(): ExamDate[] {
  try {
    const raw = localStorage.getItem(EXAM_DATES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveExamDates(dates: ExamDate[]): void {
  localStorage.setItem(EXAM_DATES_KEY, JSON.stringify(dates));
}

export function addExamDate(exam: Omit<ExamDate, 'id'>): ExamDate {
  const dates = getExamDates();
  const entry: ExamDate = { ...exam, id: Math.random().toString(36).slice(2) };
  dates.push(entry);
  dates.sort((a, b) => a.date.localeCompare(b.date));
  saveExamDates(dates);
  return entry;
}

export function removeExamDate(id: string): void {
  const dates = getExamDates().filter(d => d.id !== id);
  saveExamDates(dates);
}

export function getNextExam(): ExamDate | null {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = getExamDates().filter(d => d.date >= today);
  return upcoming.length > 0 ? upcoming[0] : null;
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
