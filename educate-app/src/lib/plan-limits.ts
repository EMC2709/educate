/**
 * What each tier gets: the free taster and the school licence (see lib/school-licence.ts).
 * Kept free of database code so pages can show the same numbers the server enforces.
 */
export type AccessTier = 'free' | 'school';

export type AiBucket = 'tutor' | 'study' | 'answer_marking' | 'question_gen' | 'paper_marking';

export const AI_DAILY_LIMITS: Record<AccessTier, Record<AiBucket, number>> = {
  free: {
    tutor: 5,
    study: 1,
    answer_marking: 5,
    question_gen: 1,
    paper_marking: 0,  // school licence only
  },
  school: {
    tutor: 40,          // tutor chat and topic chat messages (Sonnet 5.5), including "Generate with AI" on the notes page
    study: 10,          // study tools from notes (Sonnet 5.5) and revision notes (Haiku)
    answer_marking: 60, // AI marking of single answers (Haiku); over the limit, the built-in marker takes over
    question_gen: 10,   // AI-written questions for subjects with no built-in bank (Haiku)
    paper_marking: 2,   // marking a whole paper against its mark scheme (Opus): the expensive one
  },
};

/** Stored past papers a student without a school licence may open, for good */
export const FREE_PAPER_LIMIT = 2;
