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
import { ChatPanel } from '@/components/layout/ChatPanel';
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
import type { Question, Flashcard, FeedbackResult, QuestionType } from '@/types';

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
  const totalMarksAwarded = useRef(0);

  if (!board || !board.subjects.includes(subject) || !qTypeCfg) notFound();

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setQuestions([]);
    setFlashcards([]);
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
          modelAnswer: q.answer, userAnswer, marks: q.marks,
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

      // Show XP toast for marks earned this question
      if (isSignedIn && parsed.marksAwarded > 0) {
        const xpRates: Record<string, number> = { 'past-paper': 10, long: 8, mid: 6, short: 5 };
        const xpEarned = (parsed.marksAwarded ?? 0) * (xpRates[questionType] ?? 8);
        if (xpEarned > 0) {
          setXpToast({ xp: xpEarned });
          setTimeout(() => setXpToast(null), 2500);
        }
      }

      // Save result when quiz is complete (last question answered)
      if (currentQ === questions.length - 1 && isSignedIn && !resultSavedRef.current) {
        resultSavedRef.current = true;
        fetch('/api/save-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject, board: boardName, questionType,
            scoreCorrect: newScore.correct,
            scoreTotal: newScore.total,
            marksAwarded: totalMarksAwarded.current,
          }),
        }).then(r => r.json()).then(data => {
          if (data.xpResult?.leveledUp) {
            setXpToast({ xp: data.xpGained, levelUp: true });
            setTimeout(() => setXpToast(null), 4000);
          }
        }).catch(console.error);
      }
    } catch {
      setFeedback({ correct: false, feedback: 'Could not assess. Try again.', modelAnswer: q.answer, marksAwarded: 0 });
    }
  };

  const handleHint = () => {
    setChatOpen(true);
    setChatInput(`I'm doing a ${subject} question: "${questions[currentQ]?.question}" — can you give me a hint without giving the full answer?`);
  };

  const resetToTopics = () => {
    router.push(`/${boardName}/${encodeURIComponent(subject)}/topics?type=${questionType}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar board={boardName} subject={subject} score={score} loadingSource={loadingSource} questionType={questionType} />
      <div className="flex min-h-[calc(100vh-56px)]">
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
              <FlashcardDeck cards={flashcards} board={board} onBack={resetToTopics} onNewDeck={loadQuiz} />
            )}

            {/* Questions */}
            {!loading && questionType !== 'flashcard' && questions.length > 0 && (
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
                />

                {!feedback ? (
                  <AnswerInput
                    value={userAnswer}
                    onChange={setUserAnswer}
                    questionType={questionType}
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
        <ChatPanel subject={subject} board={boardName} />
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
    </div>
  );
}
