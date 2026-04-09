import { sql } from './db';

export interface QuizResultInput {
  userId: string;
  subject: string;
  board: string;
  questionType: string;
  scoreCorrect: number;
  scoreTotal: number;
  topic?: string | null;
}

export async function saveQuizResult(input: QuizResultInput): Promise<void> {
  try {
    await sql`
      INSERT INTO quiz_results (user_id, subject, board, question_type, score, total, topic)
      VALUES (
        ${input.userId},
        ${input.subject},
        ${input.board},
        ${input.questionType},
        ${input.scoreCorrect},
        ${input.scoreTotal},
        ${input.topic ?? null}
      )
    `;
  } catch (err) {
    console.error('Failed to save quiz result:', err);
  }
}
