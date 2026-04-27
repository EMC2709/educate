'use client';

import { use, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { SUBJECT_TOPICS_MAP } from '@/data/subject-topics';
import { QUESTION_BANK } from '@/data/question-bank';
import { PAST_PAPER_BANK } from '@/data/past-paper-bank';
import { Q_TYPES } from '@/data/question-types';
import { Navbar } from '@/components/layout/Navbar';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { AnswerInput } from '@/components/quiz/AnswerInput';
import { FeedbackPanel } from '@/components/quiz/FeedbackPanel';
import { QuizComplete } from '@/components/quiz/QuizComplete';
import { FlashcardDeck } from '@/components/flashcards/FlashcardDeck';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { useUser } from '@clerk/nextjs';
import { useChat } from '@/context/ChatContext';
import { shuffle } from '@/lib/shuffle';
import { getBankQuestionsForSelection, getBankCardsForSelection } from '@/lib/question-helpers';
import { checkAchievements, type Achievement } from '@/lib/achievements';
import { PhysicsEquationSheet } from '@/components/quiz/PhysicsEquationSheet';
import { MCQOptions } from '@/components/quiz/MCQOptions';
import { MCQ_BANK } from '@/data/mcq-bank';
import type { Question, Flashcard, FeedbackResult, QuestionType, MCQQuestion } from '@/types';

export default function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ board: string; subject: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { board: boardName, subject: rawSubject } = use(params);
  const { type: qType } = use(searchParams);
  const subject = decodeURIComponent(rawSubject);
  const board = EXAM_BOARDS[boardName];
  const questionType = (qType || 'short') as QuestionType;
  const qTypeCfg = Q_TYPES.find(t => t.type === questionType);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { setChatOpen, setChatInput } = useChat();

  const topicMap = useMemo(() => SUBJECT_TOPICS_MAP[subject] || {}, [subject]);

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingSource, setLoadingSource] = useState<string | null>(null);
  const resultSavedRef = useRef(false);
  const [xpToast, setXpToast] = useState<{ xp: number; levelUp?: boolean } | null>(null);
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const totalMarksAwarded = useRef(0);

  // ── MCQ-specific state ────────────────────────────────────────────────────
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [mcqDone, setMcqDone] = useState(false);

  if (!board || !board.subjects.includes(subject) || !qTypeCfg) notFound();

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setQuestions([]);
    setFlashcards([]);
    setMcqQuestions([]);
    setMcqDone(false);
    setCurrentQ(0);
    setFeedback(null);
    setUserAnswer('');
    setScore({ correct: 0, total: 0 });
    resultSavedRef.current = false;

    // Get stored selections
    const storedSubs = sessionStorage.getItem('educate-selected-subtopics');
    const storedTopics = sessionStorage.getItem('educate-selected-topics');
    const selectedSubtopics: Record<string, boolean> = storedSubs ? JSON.parse(storedSubs) : {};
    const selectedTopics: Record<string, boolean> = storedTopics ? JSON.parse(storedTopics) : {};

    // Build focus string
    const parts: string[] = [];
    Object.entries(topicMap).forEach(([topic, subs]) => {
      const selectedSubs = subs.filter(sub => selectedSubtopics[`${topic}||${sub}`]);
      if (selectedSubs.length === subs.length && selectedTopics[topic]) {
        parts.push(topic);
      } else if (selectedSubs.length > 0) {
        parts.push(`${topic} (${selectedSubs.join(', ')})`);
      }
    });
    const focusStr = parts.length > 0 ? parts.join('; ') : null;

    // ── MCQ ──────────────────────────────────────────────────────────────────
    if (questionType === 'mcq') {
      const bankQs = MCQ_BANK[subject] || [];
      if (bankQs.length > 0) {
        setLoadingSource('bank');
        setMcqQuestions(shuffle(bankQs).slice(0, 10));
      } else {
        // No static MCQ available — leave empty (UI will show "not available" message)
        setMcqQuestions([]);
      }
      setLoading(false);
      return;
    }

    if (questionType === 'past-paper') {
      const bankOnly = sessionStorage.getItem('educate-bank-only') === 'true';
      sessionStorage.removeItem('educate-bank-only');

      const allBankQs = PAST_PAPER_BANK[subject] || [];
      // Filter by selected topics if any selection was made
      const hasSelection = Object.values(selectedTopics).some(Boolean);
      const bankQs = hasSelection
        ? allBankQs.filter(q => !q.topic || selectedTopics[q.topic])
        : allBankQs;
      const questionsToUse = bankQs.length >= 1 ? bankQs : allBankQs;

      if (questionsToUse.length >= 1) {
        setLoadingSource('bank');
        setQuestions(shuffle(questionsToUse).slice(0, questionsToUse.length));
        setLoading(false);
        return;
      }

      // 2nd priority: try scraped past papers from the database (GCSE only)
      try {
        const gcseExamType = `GCSE_${boardName}`;
        const dbParams = new URLSearchParams({ subject, random: 'true', limit: '10', examType: gcseExamType });
        const dbRes = await fetch(`/api/questions?${dbParams}`);
        if (dbRes.ok) {
          const dbData = await dbRes.json();
          if (dbData.questions?.length >= 1) {
            setLoadingSource('bank');
            setQuestions(dbData.questions.map((q: { question_text: string; marks: number; topic: string; mark_scheme?: string }) => ({
              question: q.question_text,
              answer: q.mark_scheme || '',
              marks: q.marks || 1,
              hint: q.topic || '',
            })));
            setLoading(false);
            return;
          }
        }
      } catch { /* DB unavailable — fall through */ }

      // If bank-only flag is set, never fall through to AI generation
      if (bankOnly) {
        setQuestions([{
          question: 'No pre-loaded past paper questions are available for this subject yet. More are being added soon.',
          answer: '',
          marks: 0,
          hint: '',
        }]);
        setLoading(false);
        return;
      }

      // 3rd priority: AI generation (only if AI is enabled for this org)
      const aiEnabled = localStorage.getItem('educate-ai-disabled') !== 'true';
      if (!aiEnabled) {
        setQuestions([{
          question: 'AI question generation is disabled for your school. Questions are served from the exam paper bank only.',
          answer: '', marks: 0, hint: '',
        }]);
        setLoading(false);
        return;
      }

      setLoadingSource('api');
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, board: boardName, type: 'past-paper', focusStr: null }),
        });
        const data = await res.json();
        setQuestions(data.questions || [{ question: 'Failed to load. Please try again.', answer: '', marks: 0, hint: '' }]);
      } catch {
        setQuestions([{ question: 'Failed to load. Please try again.', answer: '', marks: 0, hint: '' }]);
      }
      setLoading(false);
      return;
    }

    if (questionType === 'flashcard') {
      const bankCards = getBankCardsForSelection(
        subject, topicMap, selectedSubtopics,
        QUESTION_BANK as unknown as Record<string, Record<string, Flashcard[]>>
      );
      if (bankCards && bankCards.length >= 3) {
        setLoadingSource('bank');
        setFlashcards(shuffle(bankCards).slice(0, 12));
        setLoading(false);
        return;
      }
      // Only use the whole-subject flashcard bank when no topic was selected.
      // If a selection was made and the subtopic bank is too small, go to AI so
      // focusStr is respected — otherwise cards from other topics leak in.
      if (!focusStr) {
        const mainCards = (QUESTION_BANK as unknown as Record<string, Record<string, Flashcard[]>>)[subject]?.flashcard;
        if (mainCards && mainCards.length >= 1) {
          setLoadingSource('bank');
          setFlashcards(shuffle(mainCards).slice(0, 12));
          setLoading(false);
          return;
        }
      }
      // AI flashcard generation (only if AI is enabled)
      const aiEnabledFlash = localStorage.getItem('educate-ai-disabled') !== 'true';
      if (!aiEnabledFlash) {
        setFlashcards([{ term: 'AI Disabled', definition: 'AI flashcard generation is disabled for your school. Flashcards are served from the question bank only.', example: null }]);
        setLoading(false);
        return;
      }
      setLoadingSource('api');
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, board: boardName, type: 'flashcard', focusStr }),
        });
        const data = await res.json();
        setFlashcards(data.flashcards || [{ term: 'Failed to load', definition: 'Please try again.', example: null }]);
      } catch {
        setFlashcards([{ term: 'Failed to load', definition: 'Please try again.', example: null }]);
      }
    } else {
      const bankQs = getBankQuestionsForSelection(
        subject, topicMap, selectedSubtopics, questionType,
        QUESTION_BANK as unknown as Record<string, Record<string, Question[]>>
      );
      if (bankQs && bankQs.length >= 3) {
        setLoadingSource('bank');
        setQuestions(shuffle(bankQs).slice(0, 5));
        setLoading(false);
        return;
      }

      // Only use the whole-subject bank when no topic was selected.
      // If a selection was made and the subtopic bank is too small, fall through to AI
      // so focusStr is respected — otherwise off-topic questions from the full bank leak in.
      if (!focusStr) {
        const mainBankQs = (QUESTION_BANK as unknown as Record<string, Record<string, Question[]>>)[subject]?.[questionType];
        if (mainBankQs && mainBankQs.length >= 1) {
          setLoadingSource('bank');
          setQuestions(shuffle(mainBankQs).slice(0, 5));
          setLoading(false);
          return;
        }
      }

      // 2nd fallback: try scraped questions from the database (GCSE only)
      try {
        const gcseExamType2 = `GCSE_${boardName}`;
        const dbParams = new URLSearchParams({ subject, random: 'true', limit: '5', examType: gcseExamType2 });
        if (focusStr) dbParams.set('topic', focusStr.split(';')[0].trim());
        const dbRes = await fetch(`/api/questions?${dbParams}`);
        if (dbRes.ok) {
          const dbData = await dbRes.json();
          if (dbData.questions?.length >= 1) {
            setLoadingSource('bank');
            setQuestions(dbData.questions.map((q: { question_text: string; marks: number; topic: string; mark_scheme?: string }) => ({
              question: q.question_text,
              answer: q.mark_scheme || '',
              marks: q.marks || 1,
              hint: q.topic || '',
            })));
            setLoading(false);
            return;
          }
        }
      } catch { /* DB unavailable — fall through */ }

      // 3rd fallback: AI generation (only if AI is enabled)
      const aiEnabled = localStorage.getItem('educate-ai-disabled') !== 'true';
      if (!aiEnabled) {
        setQuestions([{
          question: 'AI question generation is disabled for your school. Questions are served from the exam paper bank only.',
          answer: '', marks: 0, hint: '',
        }]);
        setLoading(false);
        return;
      }

      setLoadingSource('api');
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, board: boardName, type: questionType, focusStr }),
        });
        const data = await res.json();
        setQuestions(data.questions || [{ question: 'Failed to load. Please try again.', answer: '', marks: 0, hint: '' }]);
      } catch {
        setQuestions([{ question: 'Failed to load. Please try again.', answer: '', marks: 0, hint: '' }]);
      }
    }
    setLoading(false);
  }, [subject, boardName, questionType, topicMap]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const checkAnswer = async () => {
    if (!userAnswer.trim()) return;
    const q = questions[currentQ];
    setFeedback({ loading: true, correct: false, marksAwarded: 0, feedback: '', modelAnswer: '' });
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject, board: boardName, questionType, question: q.question,
          modelAnswer: q.answer, acceptedAnswers: q.acceptedAnswers, userAnswer, marks: q.marks,
        }),
      });
      if (res.status === 401) {
        setFeedback({ correct: false, feedback: 'Sign in to use AI answer marking.', modelAnswer: q.answer, marksAwarded: 0 });
        setScore(prev => ({ correct: prev.correct, total: prev.total + 1 }));
        return;
      }
      const parsed = await res.json();
      setFeedback(parsed);
      const newScore = { correct: score.correct + (parsed.correct ? 1 : 0), total: score.total + 1 };
      setScore(newScore);
      totalMarksAwarded.current += (parsed.marksAwarded ?? (parsed.correct ? q.marks : 0));

      // Check time-based achievements on every answer
      if (isSignedIn) {
        const timeBased = checkAchievements({});
        if (timeBased.length > 0) {
          setAchievementToast(timeBased[0]);
          setTimeout(() => setAchievementToast(null), 4000);
        }
      }

      // Award XP immediately after this question (even 0-mark attempts get 1 XP)
      if (isSignedIn) {
        fetch('/api/award-xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ marksAwarded: parsed.marksAwarded ?? 0, questionType, attempted: true }),
        })
          .then(r => r.json())
          .then(data => {
            if ((data.xpGained ?? 0) > 0) {
              setXpToast({ xp: data.xpGained, levelUp: data.xpResult?.leveledUp });
              setTimeout(() => setXpToast(null), 2500);
              window.dispatchEvent(new Event('educate-xp-updated'));
            }
          })
          .catch(console.error);
      }

      // Log quiz result at the end (for achievement / quiz count tracking)
      if (currentQ === questions.length - 1 && isSignedIn && !resultSavedRef.current) {
        resultSavedRef.current = true;
        const isPerfect = newScore.total > 0 && newScore.correct === newScore.total;

        fetch('/api/save-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject, board: boardName, questionType,
            scoreCorrect: newScore.correct,
            scoreTotal: newScore.total,
          }),
        })
          .then(() => fetch('/api/achievements').then(r => r.json()))
          .then((stats: { quizCount: number; perfectCount: number; xp: number; streak: number }) => {
            const newlyUnlocked = checkAchievements({
              quizCount: stats.quizCount,
              perfectCount: stats.perfectCount,
              xp: stats.xp,
              streak: stats.streak,
            });
            if (newlyUnlocked.length > 0) {
              setAchievementToast(newlyUnlocked[0]);
              setTimeout(() => setAchievementToast(null), 4000);
            }
          })
          .catch(console.error);
      }
    } catch {
      setFeedback({ correct: false, feedback: 'Could not assess. Try again.', modelAnswer: q.answer, marksAwarded: 0 });
    }
  };

  // ── MCQ answer handler ─────────────────────────────────────────────────────
  const handleMCQNext = (wasCorrect: boolean) => {
    const newScore = { correct: score.correct + (wasCorrect ? 1 : 0), total: score.total + 1 };
    setScore(newScore);

    if (isSignedIn) {
      fetch('/api/award-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marksAwarded: wasCorrect ? 1 : 0, questionType: 'mcq', attempted: true }),
      })
        .then(r => r.json())
        .then(data => {
          if ((data.xpGained ?? 0) > 0) {
            setXpToast({ xp: data.xpGained, levelUp: data.xpResult?.leveledUp });
            setTimeout(() => setXpToast(null), 2500);
            window.dispatchEvent(new Event('educate-xp-updated'));
          }
        })
        .catch(() => {});
    }

    if (currentQ < mcqQuestions.length - 1) {
      setCurrentQ(p => p + 1);
    } else {
      // Last question — save result and show completion screen
      setMcqDone(true);
      if (isSignedIn && !resultSavedRef.current) {
        resultSavedRef.current = true;
        fetch('/api/save-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject, board: boardName, questionType: 'mcq',
            scoreCorrect: newScore.correct,
            scoreTotal: newScore.total,
          }),
        }).catch(() => {});
      }
    }
  };

  const handleHint = () => {
    setChatOpen(true);
    setChatInput(`I'm doing a ${subject} question: "${questions[currentQ]?.question}" — can you give me a hint without giving the full answer?`);
  };

  const resetToTopics = () => {
    router.push(`/${boardName}/${encodeURIComponent(subject)}/topics?type=${questionType}`);
  };

  const isPhysicsSubject = subject === 'Physics' || subject === 'Combined Science';

  return (
    <div className="min-h-screen">
      <Navbar board={boardName} subject={subject} score={score} loadingSource={loadingSource} questionType={questionType} />
      <div className="flex min-h-[calc(100vh-56px)]">
        {isPhysicsSubject && <PhysicsEquationSheet />}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Loading */}
            {loading && (
              <div className="text-center py-16 sm:py-20">
                <div className="w-10 h-10 border-2 border-neutral-600 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-500 text-sm">Generating your {qTypeCfg.label.toLowerCase()}...</p>
              </div>
            )}

            {/* Flashcards */}
            {!loading && questionType === 'flashcard' && flashcards.length > 0 && (
              <FlashcardDeck cards={flashcards} board={board} subject={subject} onBack={resetToTopics} onNewDeck={loadQuiz} />
            )}

            {/* MCQ — no API marking needed, everything is client-side */}
            {!loading && questionType === 'mcq' && (
              <div>
                {mcqQuestions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-white font-semibold mb-2">MCQs not yet available for {subject}</h3>
                    <p className="text-neutral-500 text-sm mb-6">We&apos;re adding questions soon. Try Short Answer or Flashcards in the meantime.</p>
                    <Button variant="secondary" onClick={resetToTopics}>← Choose another type</Button>
                  </div>
                ) : mcqDone ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <Button variant="ghost" onClick={resetToTopics}>← Change Topics</Button>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-6 text-center mb-4">
                      <p className="text-3xl mb-2">
                        {score.correct === score.total ? '🏆' : score.correct >= score.total / 2 ? '✅' : '📚'}
                      </p>
                      <p className="text-emerald-400 font-bold text-lg m-0">
                        {score.correct}/{score.total} correct
                      </p>
                      <p className="text-neutral-400 text-sm mt-1 m-0">
                        {Math.round((score.correct / score.total) * 100)}% — {
                          score.correct === score.total ? 'Perfect score!' :
                          score.correct >= score.total * 0.8 ? 'Excellent work!' :
                          score.correct >= score.total * 0.6 ? 'Good effort — keep revising!' :
                          'Keep practising — you\'ll get there!'
                        }
                      </p>
                    </div>
                    <div className="flex gap-2.5">
                      <button
                        onClick={loadQuiz}
                        className="flex-1 border-none rounded-xl py-3 text-white font-bold text-sm cursor-pointer"
                        style={{ backgroundColor: board.accent }}
                      >
                        New Set
                      </button>
                      <Button variant="secondary" onClick={resetToTopics}>Change Topics</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <Button variant="ghost" onClick={resetToTopics}>← Change Topics</Button>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-neutral-500 hidden sm:inline">{subject} · {boardName}</span>
                        <span className="bg-neutral-800 rounded-full px-3.5 py-1 text-xs text-neutral-400">
                          {currentQ + 1}/{mcqQuestions.length}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <ProgressBar value={((currentQ + 1) / mcqQuestions.length) * 100} color="bg-[#06b6d4]" />
                    </div>

                    {/* key=currentQ forces a fresh MCQOptions mount (resets selected state) on each question */}
                    <MCQOptions
                      key={currentQ}
                      question={mcqQuestions[currentQ]}
                      questionNumber={currentQ + 1}
                      totalQuestions={mcqQuestions.length}
                      onNext={handleMCQNext}
                      isLast={currentQ === mcqQuestions.length - 1}
                      accentColor="#06b6d4"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Questions */}
            {!loading && questionType !== 'flashcard' && questionType !== 'mcq' && questions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <Button variant="ghost" onClick={resetToTopics}>&#8592; Change Topics</Button>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-neutral-500 hidden sm:inline">{subject} &middot; {boardName}</span>
                    <span className="bg-neutral-800 rounded-full px-3.5 py-1 text-xs text-neutral-400">
                      {currentQ + 1}/{questions.length}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <ProgressBar value={((currentQ + 1) / questions.length) * 100} color={`bg-[${qTypeCfg.color}]`} />
                </div>

                <QuestionCard
                  question={questions[currentQ]}
                  typeLabel={qTypeCfg.label}
                  typeColor={qTypeCfg.color}
                  questionType={questionType as 'short' | 'mid' | 'long' | 'flashcard' | 'past-paper'}
                />

                {!feedback ? (
                  <AnswerInput
                    value={userAnswer}
                    onChange={setUserAnswer}
                    questionType={questionType}
                    subject={subject}
                    accentColor={qTypeCfg.color}
                    onSubmit={checkAnswer}
                    onHint={handleHint}
                    disabled={!userAnswer.trim()}
                  />
                ) : (
                  <div>
                    <FeedbackPanel
                      feedback={feedback}
                      maxMarks={questions[currentQ]?.marks || 0}
                      questionType={questionType}
                      onExplain={() => {
                        setChatOpen(true);
                        setChatInput(`I got this ${subject} question wrong: "${questions[currentQ]?.question}" — can you explain the full answer and why my approach was incorrect?`);
                      }}
                    />
                    <div className="flex gap-2.5">
                      {currentQ < questions.length - 1 ? (
                        <button
                          onClick={() => { setCurrentQ(p => p + 1); setUserAnswer(''); setFeedback(null); }}
                          className="flex-1 border-none rounded-xl py-3 text-white font-bold text-sm sm:text-base cursor-pointer"
                          style={{ backgroundColor: board.accent }}
                        >
                          Next Question &#8594;
                        </button>
                      ) : (
                        <div className="flex-1">
                          <QuizComplete score={score} />
                        </div>
                      )}
                      <Button variant="secondary" onClick={loadQuiz}>New Set</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* XP Toast */}
      {xpToast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-bounce">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold">
            <span className="text-lg">&#9889;</span>
            +{xpToast.xp} XP
            {xpToast.levelUp && <span className="ml-1">&#127881; Level Up!</span>}
          </div>
        </div>
      )}

      {/* Achievement Toast */}
      {achievementToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]" style={{ animation: 'slideUp 0.4s ease' }}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[260px]">
            <span className="text-3xl">{achievementToast.icon}</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-200 m-0">Achievement Unlocked</p>
              <p className="text-sm font-bold m-0">{achievementToast.title}</p>
              <p className="text-xs text-indigo-200 m-0">{achievementToast.description}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
