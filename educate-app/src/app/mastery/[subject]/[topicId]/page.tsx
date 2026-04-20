'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { MobileNav } from '@/components/layout/Sidebar';
import { MessageContent } from '@/components/ui/MessageContent';
import { SUBJECT_TOPICS } from '@/data/topic-map';


const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': '#a78bfa', 'English Language': '#f472b6', 'English Literature': '#ec4899',
  'Biology': '#4ade80', 'Chemistry': '#fb923c', 'Physics': '#60a5fa',
  'Combined Science': '#38bdf8', 'History': '#fbbf24', 'Geography': '#a3e635',
  'French': '#f87171', 'Spanish': '#fb7185', 'Computer Science': '#22d3ee',
  'Business Studies': '#2dd4bf', 'Psychology': '#c084fc', 'Sociology': '#f472b6',
  'Religious Studies': '#fcd34d', 'Economics': '#34d399',
};

type Phase = 'summary' | 'practice' | 'test' | 'complete';

interface Question { question: string; answer: string; marks: number; hint?: string }
interface CheckResult { correct: boolean; feedback: string; marksAwarded: number; modelAnswer?: string }
interface ChatMsg { role: 'user' | 'assistant'; content: string }

function phaseMeta(p: Phase) {
  return {
    summary:  { step: 1, label: 'Study',    icon: '📖' },
    practice: { step: 2, label: 'Practice', icon: '✏️' },
    test:     { step: 3, label: 'Test',     icon: '📝' },
    complete: { step: 4, label: 'Review',   icon: '🏆' },
  }[p];
}

export default function TopicLearningPage({ params }: { params: Promise<{ subject: string; topicId: string }> }) {
  const { subject: sp, topicId } = use(params);
  const subject = decodeURIComponent(sp);
  const topic = decodeURIComponent(topicId);
  const color = SUBJECT_COLORS[subject] || '#6366f1';

  // Resolve topic name + board from localStorage
  const [topicName, setTopicName] = useState(topic);
  const [board, setBoard] = useState('AQA');

  const [phase, setPhase] = useState<Phase>('summary');
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');
  const [xpToast, setXpToast] = useState<{ xp: number; levelUp?: boolean } | null>(null);

  // Practice
  const [practiceQs, setPracticeQs] = useState<Question[]>([]);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceChecking, setPracticeChecking] = useState(false);
  const [practiceResults, setPracticeResults] = useState<(CheckResult | null)[]>([]);
  const [showHint, setShowHint] = useState(false);

  // Test
  const [testQs, setTestQs] = useState<Question[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  const [testAnswers, setTestAnswers] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<CheckResult[]>([]);
  const [testSubmitting, setTestSubmitting] = useState(false);

  // Chat (phase 4 only)
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Resolve real topic name from data map
  useEffect(() => {
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (cached) {
        const subs = JSON.parse(cached);
        const found = subs.find((s: { subject: string; board: string }) => s.subject === subject);
        if (found) setBoard(found.board);
      }
    } catch {}
    const groups = SUBJECT_TOPICS[subject] || [];
    for (const g of groups) {
      const t = g.topics.find(t => t.id === topic);
      if (t) { setTopicName(t.name); break; }
    }
  }, [subject, topic]);

  // Load summary on mount
  useEffect(() => {
    setSummaryLoading(true);
    fetch('/api/topic-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, topic: topicName, board }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.summary) setSummary(d.summary);
        else setSummaryError(d.error || 'Could not load summary.');
      })
      .catch(() => setSummaryError('Network error. Please try again.'))
      .finally(() => setSummaryLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicName, board]);

  // Load practice questions when entering phase
  useEffect(() => {
    if (phase !== 'practice' || practiceQs.length > 0) return;
    setPracticeLoading(true);
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, board, type: 'short', focusStr: topicName }),
    })
      .then(r => r.json())
      .then(d => { if (d.questions) { setPracticeQs(d.questions); setPracticeResults(new Array(d.questions.length).fill(null)); } })
      .catch(() => {})
      .finally(() => setPracticeLoading(false));
  }, [phase, subject, board, topicName, practiceQs.length]);

  // Load test questions when entering phase
  useEffect(() => {
    if (phase !== 'test' || testQs.length > 0) return;
    setTestLoading(true);
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, board, type: 'short', focusStr: topicName }),
    })
      .then(r => r.json())
      .then(d => { if (d.questions) { setTestQs(d.questions); setTestAnswers(new Array(d.questions.length).fill('')); } })
      .catch(() => {})
      .finally(() => setTestLoading(false));
  }, [phase, subject, board, topicName, testQs.length]);

  // Scroll chat to bottom
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMsgs]);

  async function checkPracticeAnswer() {
    const q = practiceQs[practiceIdx];
    if (!q || !practiceInput.trim()) return;
    setPracticeChecking(true);
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, board, questionType: 'short', question: q.question, modelAnswer: q.answer, acceptedAnswers: q.acceptedAnswers, userAnswer: practiceInput, marks: q.marks }),
      });
      const result: CheckResult = await res.json();
      setPracticeResults(prev => { const n = [...prev]; n[practiceIdx] = result; return n; });

      // Award XP for answering
      fetch('/api/award-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marksAwarded: result.marksAwarded ?? 0, questionType: 'short', attempted: true }),
      }).then(r => r.json()).then(data => {
        if ((data.xpGained ?? 0) > 0) {
          setXpToast({ xp: data.xpGained, levelUp: data.xpResult?.leveledUp });
          setTimeout(() => setXpToast(null), 2500);
          window.dispatchEvent(new Event('educate-xp-updated'));
        }
      }).catch(() => {});
    } finally {
      setPracticeChecking(false);
      setShowHint(false);
    }
  }

  async function submitTest() {
    if (testAnswers.some(a => !a.trim())) return;
    setTestSubmitting(true);
    try {
      const results = await Promise.all(testQs.map((q, i) =>
        fetch('/api/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, board, questionType: 'short', question: q.question, modelAnswer: q.answer, acceptedAnswers: q.acceptedAnswers, userAnswer: testAnswers[i], marks: q.marks }),
        }).then(r => r.json())
      ));
      setTestResults(results);

      // Award XP for each answered test question
      results.forEach((r: CheckResult, i) => {
        if (testAnswers[i]?.trim()) {
          fetch('/api/award-xp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ marksAwarded: r.marksAwarded ?? 0, questionType: 'short', attempted: true }),
          }).then(r => r.json()).then(data => {
            if ((data.xpGained ?? 0) > 0) {
              setXpToast({ xp: data.xpGained, levelUp: data.xpResult?.leveledUp });
              setTimeout(() => setXpToast(null), 2500);
            }
          }).catch(() => {});
        }
      });

      // Save mastery to localStorage
      const totalMarks = testQs.reduce((s, q) => s + q.marks, 0);
      const earned = results.reduce((s: number, r: CheckResult) => s + (r.marksAwarded || 0), 0);
      const pct = totalMarks > 0 ? earned / totalMarks : 0;
      try {
        const raw = localStorage.getItem('educate-quiz-scores') || '{}';
        const scores = JSON.parse(raw);
        scores[`${subject}:${topic}`] = { correct: Math.round(earned), total: totalMarks };
        localStorage.setItem('educate-quiz-scores', JSON.stringify(scores));
      } catch {}
      // Seed the chat with test context
      const scoreStr = `${Math.round(pct * 100)}%`;
      setChatMsgs([{
        role: 'assistant',
        content: `Great work completing the ${topicName} test! You scored **${scoreStr}**. I'm here to help you understand anything you found difficult — what would you like to go over?`,
      }]);
      setPhase('complete');
    } finally {
      setTestSubmitting(false);
    }
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    const nextMsgs: ChatMsg[] = [...chatMsgs, { role: 'user', content: msg }];
    setChatMsgs(nextMsgs);
    setChatLoading(true);
    try {
      const res = await fetch('/api/topic-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMsgs, subject, board, topic: topicName }),
      });
      const data = await res.json();
      const reply = data.message ?? 'Sorry, I could not respond.';
      setChatMsgs(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setChatMsgs(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  }

  const testScore = testResults.length > 0 ? (() => {
    const total = testQs.reduce((s, q) => s + q.marks, 0);
    const earned = testResults.reduce((s, r) => s + (r.marksAwarded || 0), 0);
    return { earned, total, pct: total > 0 ? Math.round((earned / total) * 100) : 0 };
  })() : null;

  const practiceCurrentResult = practiceResults[practiceIdx] ?? null;
  const practiceAllDone = practiceResults.every(r => r !== null);

  const phases: Phase[] = ['summary', 'practice', 'test', 'complete'];

  return (
    <div className="min-h-screen pb-24 md:pb-8" style={{ background: '#0a0a0a' }}>

      {/* XP toast */}
      {xpToast && (
        <div className="fixed top-20 right-4 z-50 bg-yellow-400 text-black text-sm font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
          +{xpToast.xp} XP{xpToast.levelUp && ' 🎉 Level Up!'}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-neutral-800 px-4 py-3" style={{ backgroundColor: '#0a0a0aee', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href={`/mastery/${encodeURIComponent(subject)}`} className="text-neutral-400 hover:text-white text-sm no-underline shrink-0">← Back</Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-neutral-500 m-0 uppercase tracking-wide">{subject}</p>
            <h1 className="text-sm font-bold text-white m-0 truncate">{topicName}</h1>
          </div>
          {/* Phase stepper */}
          <div className="flex items-center gap-1 shrink-0">
            {phases.map((p, i) => {
              const meta = phaseMeta(p);
              const active = p === phase;
              const done = phases.indexOf(phase) > i;
              return (
                <div key={p} className="flex items-center gap-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                    style={{
                      backgroundColor: done ? color : active ? `${color}30` : '#1a1a1a',
                      color: done ? '#000' : active ? color : '#555',
                      border: `2px solid ${done || active ? color : '#333'}`,
                    }}
                  >
                    {done ? '✓' : meta.step}
                  </div>
                  {i < phases.length - 1 && <div className="w-4 h-px" style={{ backgroundColor: done ? color : '#333' }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* ── Phase 1: Summary ── */}
        {phase === 'summary' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📖</span>
              <h2 className="text-lg font-bold text-white m-0">Topic Summary</h2>
            </div>
            {summaryLoading ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: `${color}`, borderTopColor: 'transparent' }} />
                <p className="text-neutral-400 text-sm m-0">Preparing your summary…</p>
              </div>
            ) : summaryError ? (
              <div className="bg-red-950 border border-red-800 rounded-2xl p-6 text-center">
                <p className="text-red-400 text-sm m-0">{summaryError}</p>
              </div>
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 prose prose-invert max-w-none">
                <MessageContent content={summary} />
              </div>
            )}
            {!summaryLoading && !summaryError && (
              <button
                onClick={() => setPhase('practice')}
                className="mt-5 w-full py-3 rounded-2xl font-bold text-sm text-black cursor-pointer border-0 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: color }}
              >
                I&apos;m ready — Start Practice ✏️
              </button>
            )}
          </div>
        )}

        {/* ── Phase 2: Practice ── */}
        {phase === 'practice' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <h2 className="text-lg font-bold text-white m-0">Practice Questions</h2>
              </div>
              <span className="text-xs text-neutral-500">{practiceIdx + 1} / {practiceQs.length || 5}</span>
            </div>

            {practiceLoading ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
                <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: color, borderTopColor: 'transparent' }} />
                <p className="text-neutral-400 text-sm m-0">Generating practice questions…</p>
              </div>
            ) : practiceQs.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <div className="text-white text-sm font-medium mb-4"><MessageContent content={practiceQs[practiceIdx].question} /></div>

                  {/* Hint toggle */}
                  {!practiceCurrentResult && (
                    <button
                      onClick={() => setShowHint(h => !h)}
                      className="text-[11px] text-neutral-500 hover:text-neutral-300 cursor-pointer bg-transparent border-0 mb-3 p-0 underline"
                    >
                      {showHint ? 'Hide hint' : 'Show hint'}
                    </button>
                  )}
                  {showHint && practiceQs[practiceIdx].hint && (
                    <p className="text-xs text-amber-400 bg-amber-950 border border-amber-900 rounded-lg px-3 py-2 mb-3 m-0">
                      💡 {practiceQs[practiceIdx].hint}
                    </p>
                  )}

                  {!practiceCurrentResult ? (
                    <div>
                      <textarea
                        value={practiceInput}
                        onChange={e => setPracticeInput(e.target.value)}
                        placeholder="Type your answer here…"
                        rows={3}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={checkPracticeAnswer}
                        disabled={practiceChecking || !practiceInput.trim()}
                        className="mt-2 w-full py-2.5 rounded-xl font-bold text-sm text-black cursor-pointer border-0 disabled:opacity-50 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: color }}
                      >
                        {practiceChecking ? 'Checking…' : 'Check Answer'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div
                        className="rounded-xl p-4 mb-3"
                        style={{
                          backgroundColor: practiceCurrentResult.correct ? '#14532d' : '#450a0a',
                          borderColor: practiceCurrentResult.correct ? '#166534' : '#7f1d1d',
                          border: '1px solid',
                        }}
                      >
                        <p className="text-sm font-bold m-0 mb-1" style={{ color: practiceCurrentResult.correct ? '#4ade80' : '#f87171' }}>
                          {practiceCurrentResult.correct ? '✅ Correct' : '❌ Not quite'} — {practiceCurrentResult.marksAwarded}/{practiceQs[practiceIdx].marks} marks
                        </p>
                        <div className="text-xs text-neutral-300"><MessageContent content={practiceCurrentResult.feedback} /></div>
                      </div>
                      {!practiceCurrentResult.correct && (
                        <div className="bg-neutral-800 rounded-xl p-3 mb-3">
                          <p className="text-[11px] text-neutral-500 m-0 mb-1 font-semibold uppercase tracking-wide">Model answer</p>
                          <div className="text-xs text-neutral-300"><MessageContent content={practiceQs[practiceIdx].answer} /></div>
                        </div>
                      )}
                      {practiceIdx < practiceQs.length - 1 ? (
                        <button
                          onClick={() => { setPracticeIdx(i => i + 1); setPracticeInput(''); setShowHint(false); }}
                          className="w-full py-2.5 rounded-xl font-bold text-sm text-black cursor-pointer border-0 hover:opacity-90"
                          style={{ backgroundColor: color }}
                        >
                          Next Question →
                        </button>
                      ) : (
                        <button
                          onClick={() => setPhase('test')}
                          className="w-full py-2.5 rounded-xl font-bold text-sm text-black cursor-pointer border-0 hover:opacity-90"
                          style={{ backgroundColor: color }}
                        >
                          Take the Final Test 📝
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5 justify-center">
                  {practiceQs.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{
                      backgroundColor: practiceResults[i] ? (practiceResults[i]!.correct ? '#4ade80' : '#f87171') : i === practiceIdx ? color : '#333',
                    }} />
                  ))}
                </div>

                {/* Skip to test if all done */}
                {practiceAllDone && (
                  <button
                    onClick={() => setPhase('test')}
                    className="w-full py-3 rounded-2xl font-bold text-sm text-black cursor-pointer border-0 hover:opacity-90"
                    style={{ backgroundColor: color }}
                  >
                    Take the Final Test 📝
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* ── Phase 3: Final Test ── */}
        {phase === 'test' && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📝</span>
              <h2 className="text-lg font-bold text-white m-0">Final Test</h2>
            </div>
            <p className="text-xs text-neutral-500 mb-5 m-0">Answer all 5 questions then submit. No hints — this is the real thing.</p>

            {testLoading ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
                <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: color, borderTopColor: 'transparent' }} />
                <p className="text-neutral-400 text-sm m-0">Preparing your test…</p>
              </div>
            ) : (
              <div className="space-y-4">
                {testQs.map((q, i) => (
                  <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                    <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wide m-0 mb-1">Q{i + 1} — {q.marks} mark{q.marks !== 1 ? 's' : ''}</p>
                    <div className="text-sm text-white font-medium mb-3"><MessageContent content={q.question} /></div>
                    <textarea
                      value={testAnswers[i] || ''}
                      onChange={e => setTestAnswers(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
                      placeholder="Your answer…"
                      rows={2}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
                <button
                  onClick={submitTest}
                  disabled={testSubmitting || testAnswers.some(a => !a.trim())}
                  className="w-full py-3 rounded-2xl font-bold text-sm text-black cursor-pointer border-0 disabled:opacity-50 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: color }}
                >
                  {testSubmitting ? 'Marking…' : 'Submit Test →'}
                </button>
                <p className="text-[11px] text-neutral-600 text-center m-0">
                  {testAnswers.filter(a => a.trim()).length} / {testQs.length} answered
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Phase 4: Complete + AI Tutor ── */}
        {phase === 'complete' && testScore && (
          <div>
            {/* Score card */}
            <div
              className="rounded-2xl p-6 mb-5 text-center"
              style={{
                background: testScore.pct >= 70 ? 'linear-gradient(135deg,#14532d,#166534)' : 'linear-gradient(135deg,#450a0a,#7f1d1d)',
                border: `2px solid ${testScore.pct >= 70 ? '#4ade80' : '#f87171'}`,
              }}
            >
              <div className="text-4xl mb-2">{testScore.pct >= 90 ? '🏆' : testScore.pct >= 70 ? '⭐' : '💪'}</div>
              <p className="text-3xl font-black text-white m-0">{testScore.pct}%</p>
              <p className="text-sm text-neutral-300 m-0 mt-1">{testScore.earned} / {testScore.total} marks</p>
              <p className="text-xs mt-2 m-0 font-semibold" style={{ color: testScore.pct >= 70 ? '#4ade80' : '#f87171' }}>
                {testScore.pct >= 90 ? 'Outstanding — topic mastered!' : testScore.pct >= 70 ? 'Topic mastered! Well done.' : 'Keep revising — you\'ll get there.'}
              </p>
            </div>

            {/* Per-question results */}
            <div className="space-y-3 mb-6">
              {testQs.map((q, i) => {
                const r = testResults[i];
                if (!r) return null;
                return (
                  <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-sm shrink-0">{r.correct ? '✅' : '❌'}</span>
                      <div className="text-xs text-neutral-400 flex-1"><MessageContent content={q.question} /></div>
                      <span className="text-xs font-bold shrink-0" style={{ color: r.correct ? '#4ade80' : '#f87171' }}>
                        {r.marksAwarded}/{q.marks}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 pl-5"><MessageContent content={r.feedback} /></div>
                  </div>
                );
              })}
            </div>

            {/* AI Tutor — unlocked here */}
            <div className="bg-neutral-900 border rounded-2xl overflow-hidden" style={{ borderColor: `${color}50` }}>
              <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-2" style={{ background: `${color}10` }}>
                <span className="text-base">🤖</span>
                <div>
                  <p className="text-sm font-bold text-white m-0">AI Tutor — Unlocked</p>
                  <p className="text-[11px] text-neutral-500 m-0">Ask anything about {topicName}</p>
                </div>
              </div>
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {chatMsgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[85%] rounded-2xl px-4 py-2.5 text-xs"
                      style={m.role === 'user'
                        ? { backgroundColor: color, color: '#000' }
                        : { backgroundColor: '#1e1e1e', color: '#e5e5e5', border: '1px solid #2a2a2a' }}
                    >
                      {m.role === 'assistant' ? <MessageContent content={m.content} /> : m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl px-4 py-2.5">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 border-t border-neutral-800 flex gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                  placeholder="Ask a question about this topic…"
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={sendChat}
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black border-0 cursor-pointer disabled:opacity-40 hover:opacity-90"
                  style={{ backgroundColor: color }}
                >
                  Send
                </button>
              </div>
            </div>

            <Link
              href={`/mastery/${encodeURIComponent(subject)}`}
              className="mt-5 block text-center py-3 rounded-2xl font-bold text-sm text-neutral-400 bg-neutral-900 border border-neutral-800 no-underline hover:border-neutral-700 transition-colors"
            >
              ← Back to Pathway
            </Link>
          </div>
        )}
      </div>
      <MobileNav />
    </div>
  );
}
