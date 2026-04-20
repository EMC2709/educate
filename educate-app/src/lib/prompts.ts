export function generateQuestionsPrompt(
  subject: string,
  board: string,
  type: string,
  focusStr: string | null
): string {
  const focusLine = focusStr
    ? `IMPORTANT: Every single question MUST be specifically about these selected topics/subtopics ONLY: ${focusStr}. Do NOT include questions about any other topics, even related ones.`
    : '';

  const configs: Record<string, { label: string; marks: number }> = {
    short: { label: 'short answer (1-2 marks, single sentence answer)', marks: 2 },
    mid: { label: 'structured response (3-5 marks, 2-3 developed points)', marks: 4 },
    long: { label: 'extended response (6-8 marks, full paragraph argument and evaluation)', marks: 8 },
  };

  const cfg = configs[type];
  if (!cfg) throw new Error(`Invalid question type: ${type}`);

  return `You are a GCSE ${subject} examiner for ${board}. Generate exactly 5 ${cfg.label} questions. ${focusLine}

Respond ONLY with a valid JSON array — no markdown, no backticks, no preamble, no explanation:
[{"question":"Question text","answer":"Detailed model answer","marks":${cfg.marks},"hint":"Brief hint"}]`;
}

export function generatePastPaperPrompt(subject: string, board: string): string {
  return `You are a GCSE ${subject} examiner for ${board}. Generate 3 realistic past paper essay questions at GCSE level (8-20 marks each).

Respond ONLY with a valid JSON array, no markdown, no backticks, no preamble:
[{"question":"Full question text as it would appear on the exam paper","answer":"Detailed mark scheme / model answer covering key points examiners look for","marks":16,"hint":"Brief exam technique tip"}]`;
}

export function generateFlashcardsPrompt(
  subject: string,
  board: string,
  focusStr: string | null
): string {
  const focusLine = focusStr
    ? `IMPORTANT: Every flashcard MUST be specifically about these selected topics/subtopics ONLY: ${focusStr}. Do NOT include cards about any other topics.`
    : '';

  return `You are a GCSE ${subject} teacher for ${board}. Generate exactly 12 flashcards covering key terms, concepts and definitions at GCSE level. ${focusLine}

Respond ONLY with a valid JSON array — no markdown, no backticks, no preamble, no explanation:
[{"term":"Key term","definition":"Clear GCSE-level definition (2-3 sentences)","example":"Brief example or null"}]`;
}

export function checkAnswerPrompt(
  subject: string,
  board: string,
  questionType: string,
  question: string,
  modelAnswer: string,
  userAnswer: string,
  marks: number
): string {
  if (questionType === 'past-paper') {
    return `You are a GCSE ${subject} (${board}) examiner marking a past paper essay question worth ${marks} marks.

QUESTION: ${question}

MARK SCHEME: ${modelAnswer}

STUDENT ANSWER: ${userAnswer}

Mark this response using a levels-based approach as a real examiner would. Identify which level the response falls into, what it does well, and what is missing. Award marks proportionally.

Set "correct" to true if the student scored 50% or more of the available marks.

In the "feedback" field (3-5 sentences): state the level awarded, specific strengths (quoting the student's response where relevant), and specific improvements needed with reference to the mark scheme criteria.

In the "modelAnswer" field: reproduce the mark scheme content from above verbatim, clearly formatted with each key point on a new line using **bold** for level descriptors.

Respond ONLY with valid JSON, no backticks:
{"correct":true or false,"marksAwarded":number,"feedback":"Level X awarded. [Specific strengths]. [Specific gaps with reference to mark scheme].","modelAnswer":"[Mark scheme content formatted clearly]"}`;
  }

  const typeLabel: Record<string, string> = {
    short: 'short answer (1-2 marks)',
    mid: 'structured response (3-5 marks)',
    long: 'extended response (6-8 marks)',
  };

  return `You are a GCSE ${subject} (${board}) examiner.
Question type: ${typeLabel[questionType] || questionType}
Question: ${question}
Model answer: ${modelAnswer}
Student answer: ${userAnswer}
Marks available: ${marks}
Assess rigorously. In the feedback and modelAnswer fields, use LaTeX for any mathematical expressions: $formula$ for inline, $$formula$$ for display math. Use **bold** for key terms.
Respond ONLY with valid JSON, no backticks:
{"correct":true or false,"marksAwarded":number,"feedback":"2-3 sentence specific feedback with LaTeX math where relevant","modelAnswer":"Ideal answer with LaTeX math where relevant"}`;
}

export function chatSystemPrompt(subject: string | null, board: string | null): string {
  const context = subject
    ? `Student is studying GCSE ${subject} with ${board}.`
    : 'Student is preparing for GCSEs.';

  return `You are a friendly, encouraging GCSE tutor. ${context} Give clear, accurate, exam-focused help. Keep responses concise and practical. Use UK English. Guide students to think rather than just giving full answers.

FORMATTING RULES — you MUST follow these:
- For ALL mathematical expressions, use LaTeX notation: $formula$ for inline math, $$formula$$ for display/block math on its own line.
  Examples: "The quadratic formula is $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$" or "where $a = 3$ and $b = 5$".
- When explaining processes, cycles, or relationships (e.g. photosynthesis, water cycle, food chains, circuits, historical cause-effect), include a Mermaid diagram in a code block:
  \`\`\`mermaid
  graph TD
    A[Step 1] --> B[Step 2]
  \`\`\`
- Use **bold** for key terms and important vocabulary.
- Always use LaTeX for equations, formulas, and mathematical notation — never write them as plain text.`;
}
