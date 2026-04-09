'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PracticeFilterBar, type PracticeFilters } from '../_components/PracticeFilterBar';
import { QuestionCard, type Question } from '../_components/QuestionCard';
import { SessionProgress } from '../_components/SessionProgress';
import { CompletionCard } from '../_components/CompletionCard';

type PageState = 'filters' | 'loading' | 'session' | 'complete' | 'error';

interface SaveResultPayload {
  subject: string;
  examType: string;
  topic: string;
  score: number;
  total: number;
  questions_done: number;
}

function FreePracticeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<PracticeFilters>({
    subject: searchParams.get('subject') ?? '',
    examType: searchParams.get('examType') ?? '',
    topic: searchParams.get('topic') ?? '',
    limit: Number(searchParams.get('limit') ?? '10'),
  });

  const [pageState, setPageState] = useState<PageState>(
    filters.subject ? 'loading' : 'filters'
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchQuestions = useCallback(async (f: PracticeFilters) => {
    setPageState('loading');
    setDoneSet(new Set());
    setCurrentIndex(0);
    setErrorMsg(null);

    try {
      const params = new URLSearchParams({ random: 'true', limit: String(f.limit) });
      if (f.subject) params.set('subject', f.subject);
      if (f.examType) params.set('examType', f.examType);
      if (f.topic) params.set('topic', f.topic);

      const res = await fetch(`/api/questions?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      const fetched: Question[] = data.questions ?? [];

      if (fetched.length === 0) {
        setErrorMsg('No questions found for these filters. Try broadening your search.');
        setPageState('error');
        return;
      }

      setQuestions(fetched);
      setPageState('session');

      // Update URL without navigation
      const newParams = new URLSearchParams();
      if (f.subject) newParams.set('subject', f.subject);
      if (f.examType) newParams.set('examType', f.examType);
      if (f.topic) newParams.set('topic', f.topic);
      if (f.limit !== 10) newParams.set('limit', String(f.limit));
      router.replace(`/student/practice?${newParams.toString()}`, { scroll: false });
    } catch {
      setErrorMsg('Failed to load questions. Please try again.');
      setPageState('error');
    }
  }, [router]);

  // Auto-fetch if arriving with query params
  useEffect(() => {
    if (filters.subject && pageState === 'loading') {
      fetchQuestions(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkDone = useCallback(() => {
    const newDone = new Set(doneSet);
    newDone.add(currentIndex);
    setDoneSet(newDone);

    if (newDone.size >= questions.length) {
      setPageState('complete');
      return;
    }

    let next = currentIndex + 1;
    while (next < questions.length && newDone.has(next)) next++;
    if (next < questions.length) {
      setCurrentIndex(next);
    } else {
      const firstUndone = questions.findIndex((_, idx) => !newDone.has(idx));
      if (firstUndone >= 0) setCurrentIndex(firstUndone);
    }
  }, [doneSet, currentIndex, questions]);

  const handleSaveHistory = useCallback(async () => {
    setSaving(true);
    const payload: SaveResultPayload = {
      subject: filters.subject,
      examType: filters.examType,
      topic: filters.topic,
      score: doneSet.size,
      total: questions.length,
      questions_done: doneSet.size,
    };
    try {
      await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSaved(true);
    } catch {
      // best-effort
    } finally {
      setSaving(false);
    }
  }, [filters, doneSet, questions]);

  const handleSearch = useCallback(() => {
    fetchQuestions(filters);
  }, [filters, fetchQuestions]);

  // --- Render states ---

  if (pageState === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pageState === 'complete') {
    return (
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto space-y-5">
          <CompletionCard
            done={doneSet.size}
            total={questions.length}
            mode="free"
            onSaveHistory={handleSaveHistory}
            saving={saving}
            saved={saved}
          />
          <div className="text-center">
            <button
              onClick={() => {
                setPageState('filters');
                setSaved(false);
              }}
              className="text-sm text-indigo-400 hover:text-indigo-300 no-underline transition-colors bg-transparent border-0 cursor-pointer"
            >
              Start another session →
            </button>
          </div>
        </div>
      </main>
    );
  }

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
            <span className="text-neutral-400">Free Practice</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Free Practice</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Pick your subject and filters, then work through random exam questions.
          </p>
        </div>

        {/* Filter bar — always visible for quick re-search */}
        <PracticeFilterBar
          filters={filters}
          onChange={setFilters}
          onSearch={handleSearch}
          loading={false}
        />

        {/* Error state */}
        {pageState === 'error' && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-5 text-center">
            <p className="text-rose-400">{errorMsg}</p>
          </div>
        )}

        {/* Active session */}
        {pageState === 'session' && questions.length > 0 && (
          <>
            {/* Progress */}
            <SessionProgress
              done={doneSet.size}
              total={questions.length}
              label={filters.subject || 'Practice'}
            />

            {/* Question card */}
            <QuestionCard
              question={questions[currentIndex]}
              index={currentIndex}
              total={questions.length}
              onMarkDone={handleMarkDone}
              isDone={doneSet.has(currentIndex)}
            />

            {/* Navigator */}
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
          </>
        )}
      </div>
    </main>
  );
}

export default function FreePracticePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FreePracticeInner />
    </Suspense>
  );
}
