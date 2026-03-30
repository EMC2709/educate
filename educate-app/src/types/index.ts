export interface Question {
  question: string;
  answer: string;
  marks: number;
  hint: string;
}

export interface Flashcard {
  term: string;
  definition: string;
  example: string | null;
}

export interface SubjectBank {
  short: Question[];
  mid: Question[];
  long: Question[];
  flashcard: Flashcard[];
}

export interface SubtopicContent {
  short?: Question[];
  mid?: Question[];
  long?: Question[];
  flashcard?: Flashcard[];
}

export type SubtopicBank = Record<string, Record<string, Record<string, SubtopicContent>>>;

export type QuestionType = 'short' | 'mid' | 'long' | 'flashcard';

export interface ExamBoard {
  color: string;
  accent: string;
  lightAccent: string;
  logo: string;
  tagline: string;
  subjects: string[];
}

export interface QuestionTypeConfig {
  type: QuestionType;
  label: string;
  icon: string;
  marks: string;
  color: string;
  desc: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface FeedbackResult {
  correct: boolean;
  marksAwarded: number;
  feedback: string;
  modelAnswer: string;
  loading?: boolean;
}

export type UserRole = 'student' | 'teacher' | 'admin';

export interface EducateUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}
