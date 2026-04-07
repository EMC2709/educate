import { supabaseAdmin } from './supabase';

export interface QuizResultInput {
  userId: string;
  subject: string;
  board: string;
  questionType: string;
  scoreCorrect: number;
  scoreTotal: number;
}

export async function saveQuizResult(input: QuizResultInput): Promise<void> {
  const { error } = await supabaseAdmin.from('quiz_results').insert({
    user_id: input.userId,
    subject: input.subject,
    board: input.board,
    question_type: input.questionType,
    score_correct: input.scoreCorrect,
    score_total: input.scoreTotal,
  });
  if (error) console.error('Failed to save quiz result:', error.message);
}
