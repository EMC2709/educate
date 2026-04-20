'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QuestionCard, type Question } from '../../_components/QuestionCard';
import { SessionProgress } from '../../_components/SessionProgress';
import { CompletionCard } from '../../_components/CompletionCard';

interface Assignment {
  id: string;
  title: string;
  subject: string | null;
  topic: string | null;
  exam_type: string | null;
  due_date: string | null;
  class_id: string;
  class_name?: string;
}

interface Progress {
  questions_done: number;
  questions_total: number;
  score: number;
  completed: boolean;
  started_at: string | null;
}

type PageState = 'loading' | 'error' | 'session' | 'complete';

export default function AssignedPractice() {
  const params = useParams();
  const assignmentId = params.id as string;

  const [pageState, setPageState] = useState<PageState>('loading');
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      // Load assignment details + existing progress in parallel
      const [assignmentsRes, progressRes] = await Promise.all([
        fetch('/api/assignments'),
        fetch(`/api/assignments/${assignmentId}/progress`),
      ]);

      const assignmentsData = await assignmentsRes.json();
      const found: Assignment | undefined = (assignmentsData.assignments ?? []).find(
        (a: Assignment) => a.id === assignmentId
      );

      if (!found) {
        setErrorMsg('Assignment not found.');
        setPageState('error');
        return;
      }

      setAssignment(found);

      let existingProgress: Progress | null = null;
      if (progressRes.ok) {
        existingProgress = await progressRes.json();
      }

      // Fetch questions
      const params = new URLSearchParams({ random: 'true', limit: '10' });
      if (found.subject) params.set('subject', found.subject);
      if (found.exam_type) params.set('examType', found.exam_type);
      if (found.topic) params.set('topic', found.topic);

      const qRes = await fetch(`/api/questions?${params.toString()}`);
      const qData = await qRes.json();
      const fetchedQuestions: Question[] = qData.questions ?? [];
      setQuestions(fetchedQuestions);

      // Restore done state from existing progress
      if (existingProgress && existingProgress.questions_done > 0) {
        const set = new Set<number>();
        for (let i = 0; i < Math.min(existingProgress.questions_done, fetchedQuestions.length); i++) {
          set.add(i);
        }
        setDoneSet(set);
        if (existingProgress.completed) {
          setPageState('complete');
          return;
        }
        // Jump to first undone question
        const firstUndone = fetchedQuestions.findIndex((_, idx) => !set.has(idx));
        if (firstUndone >= 0) setCurrentIndex(firstUndone);
      }

      setPageState('session');
    } catch {
      setErrorMsg('Failed to load assignment. Please try again.');
      setPageState('error');
    }
  }, [assignmentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveProgress = useCallback(
    async (done: Set<number>, completed: boolean) => {
      if (!assignment) return;
      setSaving(true);
      try {
        await fetch(`/api/assignments/${assignmentId}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionsDone: done.size,
            questionsTotal: questions.length,
            score: done.size,
            completed,
          }),
        });
      } catch {
        // best-effort save
      } finally {
        setSaving(false);
      }
    },
    [assignment, assignmentId, questions.length]
  );

  const handleMarkDone = useCallback(async () => {
    const newDone = new Set(doneSet);
    newDone.add(currentIndex);
    setDoneSet(newDone);

    // Award XP for completing a question (fire-and-forget)
    const q = questions[currentIndex];
    if (q) {
      fetch('/api/award-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marksAwarded: q.marks ?? 1, questionType: 'short', attempted: true }),
      }).then(r => r.json()).then(data => {
        if ((data as { xpGained?: number }).xpGained ?? 0 > 0) {
          window.dispatchEvent(new Event('educate-xp-updated'));
        }
      }).catch(() => {});
    }

    const completed = newDone.size >= questions.length;
    await saveProgress(newDone, completed);

    if (completed) {
      setPageState('complete');
    } else {
      // Advance to next undone question
      let next = currentIndex + 1;
      while (next < questions.length && newDone.has(next)) next++;
      if (next < questions.length) {
        setCurrentIndex(next);
      } else {
        // wrap to first undone
        const firstUndone = questions.findIndex((_, idx) => !newDone.has(idx));
        if (firstUndone >= 0) setCurrentIndex(firstUndone);
      }
    }
  }, [doneSet, currentIndex, questions, saveProgress]);

  if (pageState === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <p className="text-rose-400 mb-4">{errorMsg ?? 'Something went wrong.'}</p>
          <Link
            href="/student"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl no-underline transition-colors"
          >
            Back to hub
          </Link>
        </div>
      </div>
    );
  }

  if (pageState === 'complete') {
    return (
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto">
          <CompletionCard
            done={doneSet.size}
            total={questions.length}
            mode="assignment"
            assignmentId={assignmentId}
          />
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalDone = doneSet.size;

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Breadcrumb + title */}
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <Link href="/student" className="hover:text-neutral-300 no-underline transition-colors">
              Student Hub
            </Link>
            <span>/</span>
            <span className="text-neutral-400">{assignment?.title ?? 'Assignment'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            {assignment?.title ?? 'Practice Session'}
          </h1>
          {assignment?.class_name && (
            <p className="text-neutral-500 text-sm mt-1">{assignment.class_name}</p>
          )}
        </div>

        {/* Progress bar */}
        <SessionProgress
          done={totalDone}
          total={questions.length}
          label="Progress"
        />

        {/* Saving indicator */}
        {saving && (
          <p className="text-xs text-neutral-500 text-right">Saving...</p>
        )}

        {/* Question card */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            total={questions.length}
            onMarkDone={handleMarkDone}
            isDone={doneSet.has(currentIndex)}
          />
        )}

        {/* Question navigator */}
        {questions.length > 1 && (
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors cursor-pointer border-0"
            >
              ← Previous
            </button>
            <div className="flex gap-1.5 flex-wrap justify-center">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 ${
                    idx === currentIndex
                      ? 'bg-indigo-500 text-white'
                      : doneSet.has(idx)
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors cursor-pointer border-0"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
