/**
 * Exam level configurations for future integration.
 * Each level maps DB exam_type values to subjects available in the scraped question bank.
 * Question counts are from the scrape as of April 2026 (56% complete — will grow).
 *
 * Currently active: GCSE only (served via quiz page)
 * Ready for integration: A-Level, KS2, SQA (National 5 / Higher / Advanced Higher), 11+
 */

export interface ExamLevel {
  id: string;
  label: string;
  description: string;
  dbExamTypes: string[];          // maps to past_papers.exam_type in the DB
  ageRange: string;
  country: string;
  subjects: string[];
  questionCount: number;          // approximate, grows as scrape completes
  enabled: boolean;               // whether this level is active in the app
}

export const EXAM_LEVELS: Record<string, ExamLevel> = {

  // ── Currently active ──────────────────────────────────────────────────────
  GCSE: {
    id: 'GCSE',
    label: 'GCSE',
    description: 'General Certificate of Secondary Education (Year 10-11)',
    dbExamTypes: ['GCSE_AQA', 'GCSE_OCR', 'GCSE_WJEC', 'GCSE_Eduqas'],
    ageRange: '14-16',
    country: 'England & Wales',
    subjects: [
      'Mathematics', 'English Language', 'English Literature',
      'Biology', 'Chemistry', 'Physics', 'Combined Science',
      'History', 'Geography', 'French', 'Spanish', 'German', 'Chinese',
      'Religious Studies', 'Computer Science', 'Art & Design', 'Music', 'Drama',
      'Physical Education', 'Sociology', 'Psychology',
      'Business Studies', 'Economics', 'Design & Technology',
      'Food Preparation & Nutrition', 'Graphic Communication',
    ],
    questionCount: 10587,
    enabled: true,
  },

  // ── Ready for integration ─────────────────────────────────────────────────
  'A-Level': {
    id: 'A-Level',
    label: 'A-Level',
    description: 'Advanced Level (Year 12-13, Sixth Form)',
    dbExamTypes: ['A-Level_AQA', 'A-Level_OCR', 'A-Level_WJEC', 'A-Level_Eduqas'],
    ageRange: '16-18',
    country: 'England & Wales',
    subjects: [
      'Mathematics', 'English Language', 'English Literature',
      'Biology', 'Chemistry', 'Physics',
      'History', 'Geography', 'French', 'Spanish', 'German',
      'Religious Studies', 'Computer Science', 'Music', 'Drama and Theatre',
      'Physical Education', 'Sociology', 'Psychology',
      'Economics', 'Law', 'Media Studies', 'Film Studies',
      'Art and Design',
    ],
    questionCount: 10437,
    enabled: false,
  },

  'National5_SQA': {
    id: 'National5_SQA',
    label: 'National 5',
    description: 'Scottish National 5 (equivalent to GCSE)',
    dbExamTypes: ['National5_SQA'],
    ageRange: '15-16',
    country: 'Scotland',
    subjects: [
      'Mathematics', 'Applications of Mathematics', 'English',
      'Biology', 'Chemistry', 'Physics', 'Environmental Science',
      'History', 'Geography', 'Modern Studies',
      'French', 'Spanish', 'German', 'Italian', 'Latin',
      'Computing Science', 'Engineering Science',
      'Music', 'Music Technology', 'Drama', 'Dance', 'Art and Design',
      'Psychology', 'Philosophy', 'Classical Studies',
      'Business Management', 'Accounting', 'Economics',
      'Design and Manufacture', 'Graphic Communication',
      'Health and Food Technology', 'Fashion and Textile Technology',
      'Administration and IT', 'Practical Electronics', 'Media',
    ],
    questionCount: 7641,
    enabled: false,
  },

  'Higher_SQA': {
    id: 'Higher_SQA',
    label: 'Higher',
    description: 'Scottish Higher (equivalent to AS-Level)',
    dbExamTypes: ['Higher_SQA'],
    ageRange: '16-17',
    country: 'Scotland',
    subjects: [
      'Mathematics', 'Applications of Mathematics', 'English',
      'Biology', 'Human Biology', 'Chemistry', 'Physics', 'Environmental Science',
      'History', 'Geography', 'Modern Studies', 'Politics',
      'French', 'Spanish', 'German', 'Italian', 'Latin',
      'Computing Science', 'Engineering Science',
      'Music', 'Music Technology', 'Drama', 'Dance',
      'Art and Design', 'Photography',
      'Psychology', 'Philosophy', 'Classical Studies',
      'Business Management', 'Accounting', 'Economics',
      'Design and Manufacture', 'Graphic Communication',
      'Health and Food Technology', 'Fashion and Textile Technology',
      'Administration and IT', 'Physical Education', 'Media',
    ],
    questionCount: 6493,
    enabled: false,
  },

  'AdvHigher_SQA': {
    id: 'AdvHigher_SQA',
    label: 'Advanced Higher',
    description: 'Scottish Advanced Higher (equivalent to A-Level)',
    dbExamTypes: ['AdvHigher_SQA'],
    ageRange: '17-18',
    country: 'Scotland',
    subjects: [
      'Mathematics', 'Statistics', 'English',
      'Biology', 'Chemistry', 'Physics',
      'History', 'Geography', 'Modern Studies',
      'French', 'Spanish', 'German', 'Italian', 'Latin',
      'Computing Science', 'Engineering Science',
      'Music', 'Drama',
      'Classical Studies',
      'Business Management', 'Accounting', 'Economics',
      'Design and Manufacture', 'Graphic Communication',
      'Health and Food Technology',
    ],
    questionCount: 4327,
    enabled: false,
  },

  KS2: {
    id: 'KS2',
    label: 'KS2 SATs',
    description: 'Key Stage 2 SATs (Year 6, age 10-11)',
    dbExamTypes: ['KS2_STA'],
    ageRange: '10-11',
    country: 'England',
    subjects: [
      'Mathematics', 'English Reading', 'English Grammar',
      'English Spelling', 'Science',
    ],
    questionCount: 1155,
    enabled: false,
  },

  KS3: {
    id: 'KS3',
    label: 'KS3',
    description: 'Key Stage 3 (Year 7-9)',
    dbExamTypes: ['KS3_STA'],
    ageRange: '11-14',
    country: 'England',
    subjects: [
      'Mathematics', 'English', 'Science',
    ],
    questionCount: 1040,
    enabled: false,
  },

  KS1: {
    id: 'KS1',
    label: 'KS1 SATs',
    description: 'Key Stage 1 SATs (Year 2, age 6-7)',
    dbExamTypes: ['KS1_STA'],
    ageRange: '6-7',
    country: 'England',
    subjects: [
      'Mathematics', 'English Reading', 'English Grammar',
    ],
    questionCount: 764,
    enabled: false,
  },

  '11Plus': {
    id: '11Plus',
    label: '11+',
    description: '11 Plus entrance exams (Year 5-6)',
    dbExamTypes: ['11Plus_Practice'],
    ageRange: '10-11',
    country: 'England',
    subjects: [
      'Mathematics', 'English', 'Verbal Reasoning', 'Non-Verbal Reasoning',
    ],
    questionCount: 380,
    enabled: false,
  },
};

/** Get all enabled exam levels */
export function getEnabledLevels(): ExamLevel[] {
  return Object.values(EXAM_LEVELS).filter(l => l.enabled);
}

/** Get all levels for a country */
export function getLevelsByCountry(country: string): ExamLevel[] {
  return Object.values(EXAM_LEVELS).filter(l =>
    l.country.toLowerCase().includes(country.toLowerCase())
  );
}

/** Get DB exam_type strings for a level */
export function getDbExamTypes(levelId: string): string[] {
  return EXAM_LEVELS[levelId]?.dbExamTypes ?? [];
}

/** Total questions across all levels */
export function getTotalQuestionCount(): number {
  return Object.values(EXAM_LEVELS).reduce((sum, l) => sum + l.questionCount, 0);
}
