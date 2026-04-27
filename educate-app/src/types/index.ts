export interface Question {
  question: string;
  answer: string;
  acceptedAnswers?: string[];
  marks: number;
  hint: string;
  topic?: string;
  /** Boards this question is specific to. Absent = shared across all boards. */
  boards?: ('AQA' | 'Edexcel' | 'OCR' | 'WJEC')[];
  /** Tier restriction. Absent = both tiers. */
  tier?: 'foundation' | 'higher';
  /** True if a calculator is permitted/required. Maths / science only. */
  calculator?: boolean;
  /** True if this question relates to a required practical. */
  required_practical?: boolean;
}

export interface Flashcard {
  term: string;
  definition: string;
  example: string | null;
  /** Optional topic tag for filtering flashcards by topic */
  topic?: string;
  /** Boards this flashcard is specific to. Absent = all boards. */
  boards?: ('AQA' | 'Edexcel' | 'OCR' | 'WJEC')[];
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

export type QuestionType = 'short' | 'mid' | 'long' | 'flashcard' | 'past-paper' | 'mcq';

export interface MCQQuestion {
  /** The question text */
  question: string;
  /** Exactly four answer options */
  options: [string, string, string, string];
  /** 0-based index of the correct option */
  answer: 0 | 1 | 2 | 3;
  /** Shown after the student answers */
  explanation?: string;
  topic?: string;
  boards?: ('AQA' | 'Edexcel' | 'OCR' | 'WJEC')[];
}

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
