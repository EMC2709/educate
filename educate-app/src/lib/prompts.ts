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

export function generateMCQPrompt(
  subject: string,
  board: string,
  focusStr: string | null
): string {
  const focusLine = focusStr
    ? `IMPORTANT: Every question MUST be specifically about these topics ONLY: ${focusStr}.`
    : '';

  return `You are a GCSE ${subject} examiner for ${board}. Generate exactly 10 multiple choice questions at GCSE level. ${focusLine}

Each question must have exactly 4 options (A, B, C, D) with only one correct answer.

Respond ONLY with a valid JSON array — no markdown, no backticks, no preamble:
[{"question":"Question text","options":["Option A","Option B","Option C","Option D"],"answer":0,"explanation":"Why the correct answer is right and why others are wrong","topic":"Topic name"}]

Rules:
- "answer" is the 0-based index of the correct option (0=A, 1=B, 2=C, 3=D)
- Make distractors plausible — not obviously wrong
- Cover a range of different topics within ${subject}
- Questions should test understanding, not just rote memorisation`;
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
    return `You are a fair GCSE ${subject} (${board}) examiner marking a past paper essay question worth ${marks} marks.

QUESTION: ${question}

MARK SCHEME: ${modelAnswer}

STUDENT ANSWER: ${userAnswer}

MARKING PRINCIPLES — follow these strictly:
- The mark scheme is a GUIDE, not a word-for-word script. Award marks for understanding shown.
- Accept paraphrasing, synonyms, and alternative correct phrasings freely.
- If the student clearly understands a concept, award the mark even if their wording differs from the mark scheme.
- Use a levels-based approach. Be fair and give the student the benefit of the doubt when their meaning is clear.

Set "correct" to true if the student scored 50% or more of the available marks.
In "feedback" (3-5 sentences): state the level awarded, specific strengths (quote the student where relevant), and specific gaps with reference to the mark scheme.
In "modelAnswer": reproduce the mark scheme formatted clearly with **bold** for level descriptors.

Respond ONLY with valid JSON, no backticks:
{"correct":true or false,"marksAwarded":number,"feedback":"Level X awarded. [Strengths]. [Gaps].","modelAnswer":"[Mark scheme formatted clearly]"}`;
  }

  const typeLabel: Record<string, string> = {
    short: 'short answer (1-2 marks)',
    mid: 'structured response (3-5 marks)',
    long: 'extended response (6-8 marks)',
  };

  // Detect command word from the question text to tailor marking guidance
  const qLower = question.toLowerCase();
  type CommandKey = 'calculate' | 'state' | 'describe' | 'explain' | 'evaluate' | 'compare' | 'suggest' | 'sketch' | 'plot' | 'write' | 'balance' | 'default';
  const commandWord: CommandKey = qLower.match(/\bcalculate\b|\bwork out\b|\bfind\b|\bcompute\b/) ? 'calculate'
    : qLower.match(/\bstate\b|\bname\b|\bidentify\b|\blist\b/) ? 'state'
    : qLower.match(/\bdescribe\b/) ? 'describe'
    : qLower.match(/\bexplain\b/) ? 'explain'
    : qLower.match(/\bevaluate\b|\bdiscuss\b|\bassess\b/) ? 'evaluate'
    : qLower.match(/\bcompare\b/) ? 'compare'
    : qLower.match(/\bsuggest\b/) ? 'suggest'
    : qLower.match(/\bsketch\b|\bplot\b|\bdraw\b/) ? 'sketch'
    : qLower.match(/\bwrite\b/) ? 'write'
    : qLower.match(/\bbalance\b/) ? 'balance'
    : 'default';

  const commandGuidance: Record<CommandKey, string> = {
    calculate: '- CALCULATE questions: check method (working shown), correct substitution, correct answer with units. Award method marks even if arithmetic is wrong. Do NOT penalise for missing units if the value is correct.',
    state:     '- STATE/NAME/IDENTIFY questions: award marks for the correct fact only. No explanation required. Single key word or phrase is sufficient.',
    describe:  '- DESCRIBE questions: award marks for what is observed or what happens. No explanation of why required. Look for correct factual points, not reasoning.',
    explain:   '- EXPLAIN questions: each mark requires a cause AND its effect/reason. "because", "so", "therefore" language expected. Award each linked cause-effect pair as 1 mark.',
    evaluate:  '- EVALUATE questions: award marks for: evidence/data cited, valid strength identified, valid limitation identified, balanced judgement or conclusion. A one-sided answer cannot get full marks.',
    compare:   '- COMPARE questions: marks require explicit comparison of BOTH items for each point. Simply describing one item without reference to the other scores 0 per point.',
    suggest:   '- SUGGEST questions: accept any scientifically valid and logical answer not contradicted by the question. Award marks for plausible, reasoned suggestions.',
    sketch:    '- SKETCH/PLOT/DRAW questions: describe in feedback what a correct sketch would show. Award marks for correct shape, labels, and any specific required features.',
    write:     '- WRITE questions: check accuracy of chemical formulae, equations, or expressions. Award marks for each correct component.',
    balance:   '- BALANCE questions: check that atoms of each element are equal on both sides. Award method marks for correct coefficients on at least one side.',
    default:   '- Award marks for correct understanding shown in any form. Accept paraphrasing and alternative correct phrasings freely.',
  };

  return `You are a fair GCSE ${subject} (${board}) examiner.
Question type: ${typeLabel[questionType] || questionType}
Command word detected: ${commandWord.toUpperCase()}
Question: ${question}
Mark scheme: ${modelAnswer}
Student answer: ${userAnswer}
Marks available: ${marks}

MARKING PRINCIPLES — follow these strictly:
- The mark scheme is a GUIDE. Award marks for correct understanding, NOT for matching specific words.
- Accept paraphrasing, synonyms, and alternative phrasings freely.
- If the student demonstrates they understand the concept, give the mark even if their wording differs.
- Be generous: give the benefit of the doubt when the student's meaning is clearly correct.
- For maths/science, accept any equivalent working or expression that reaches the right answer.
- Use LaTeX for maths: $inline$ or $$display$$. Use **bold** for key terms.
${commandGuidance[commandWord]}

In "feedback" (2-3 sentences): quote what the student got right, then say specifically what to add for full marks. If the command word is EXPLAIN, tell the student which cause-effect links they made and which they missed.
In "modelAnswer": write the ideal answer with LaTeX maths where relevant.

Respond ONLY with valid JSON, no backticks:
{"correct":true or false,"marksAwarded":number,"feedback":"...","modelAnswer":"..."}`;
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
