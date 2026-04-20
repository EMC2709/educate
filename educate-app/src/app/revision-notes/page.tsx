'use client';

import { useState, useCallback } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { SUBJECT_TOPICS_MAP } from '@/data/subject-topics';

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'browse' | 'viewing';

interface NotesState {
  content: string | null;
  loading: boolean;
  error: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse **bold** markers into React-renderable segments */
function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{part}</strong> : part
  );
}

/** Convert raw AI output into bullet lines and an exam tip */
function parseNotes(raw: string): { bullets: string[]; examTip: string | null } {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const bullets: string[] = [];
  let examTip: string | null = null;

  for (const line of lines) {
    if (line.startsWith('⚡')) {
      examTip = line.replace(/^⚡\s*Key exam tip:\s*/i, '').trim();
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      bullets.push(line.replace(/^[•\-*]\s*/, '').trim());
    } else if (bullets.length > 0) {
      // Continuation of previous bullet or stray line — append to last
      bullets[bullets.length - 1] += ' ' + line;
    }
  }

  return { bullets, examTip };
}

const ALL_SUBJECTS = Object.keys(SUBJECT_TOPICS_MAP);

// ─── Sub-components ───────────────────────────────────────────────────────────

function SubjectTabs({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (s: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {ALL_SUBJECTS.map(subject => (
        <button
          key={subject}
          onClick={() => onSelect(subject)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 cursor-pointer ${
            selected === subject
              ? 'bg-indigo-500 border-indigo-500 text-white'
              : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'
          }`}
        >
          {subject}
        </button>
      ))}
    </div>
  );
}

function TopicGrid({
  subject,
  onSelect,
}: {
  subject: string;
  onSelect: (topic: string) => void;
}) {
  const topicGroups = SUBJECT_TOPICS_MAP[subject] ?? {};
  const topics = Object.keys(topicGroups);

  if (topics.length === 0) {
    return <p className="text-neutral-500 text-sm">No topics available for this subject.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {topics.map(topic => (
        <button
          key={topic}
          onClick={() => onSelect(topic)}
          className="group text-left p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-800 transition-all duration-150 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5 shrink-0">📖</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-snug mb-1">{topic}</p>
              <p className="text-xs text-neutral-500">
                {topicGroups[topic].length} subtopic{topicGroups[topic].length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
            <span>View Notes</span>
            <span className="text-base leading-none">→</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-neutral-700 mt-2 shrink-0" />
          <div
            className="h-4 bg-neutral-800 rounded"
            style={{ width: `${65 + (i % 3) * 10}%` }}
          />
        </div>
      ))}
      <div className="mt-6 p-4 rounded-xl bg-amber-900/20 border border-amber-700/30">
        <div className="h-4 bg-amber-900/40 rounded w-3/4" />
      </div>
    </div>
  );
}

function NotesViewer({
  subject,
  topic,
  notes,
  onBack,
  onRegenerate,
  onGenerate,
}: {
  subject: string;
  topic: string;
  notes: NotesState;
  onBack: () => void;
  onRegenerate: () => void;
  onGenerate: () => void;
}) {
  const parsed = notes.content ? parseNotes(notes.content) : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-neutral-300 hover:text-white hover:border-neutral-600 transition-all cursor-pointer"
        >
          ← Back to Topics
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-neutral-500 mb-0.5">{subject}</p>
          <h2 className="text-xl font-bold text-white leading-tight">{topic}</h2>
        </div>
      </div>

      {/* Notes card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        {notes.loading && (
          <>
            <p className="text-sm text-indigo-400 mb-4 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
              Generating revision notes…
            </p>
            <LoadingSkeleton />
          </>
        )}

        {!notes.loading && notes.error && (
          <div className="text-center py-8">
            <p className="text-rose-400 text-sm mb-4">{notes.error}</p>
            <button
              onClick={onGenerate}
              className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-400 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!notes.loading && !notes.error && notes.content === null && (
          <div className="text-center py-10">
            <span className="text-5xl mb-4 block">📖</span>
            <p className="text-neutral-300 font-semibold mb-1">No notes yet</p>
            <p className="text-neutral-500 text-sm mb-6">
              Generate AI revision notes for <strong className="text-neutral-300">{topic}</strong>
            </p>
            <button
              onClick={onGenerate}
              className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-400 transition-colors cursor-pointer"
            >
              Generate Notes
            </button>
          </div>
        )}

        {!notes.loading && !notes.error && parsed && (
          <>
            <ul className="space-y-3 mb-0 list-none p-0">
              {parsed.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span className="text-neutral-200 text-sm leading-relaxed">
                    {parseBold(bullet)}
                  </span>
                </li>
              ))}
            </ul>

            {parsed.examTip && (
              <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-wide mb-1">
                  ⚡ Key Exam Tip
                </p>
                <p className="text-amber-100 text-sm leading-relaxed">
                  {parseBold(parsed.examTip)}
                </p>
              </div>
            )}

            {/* Regenerate */}
            <div className="mt-5 pt-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-500 hover:text-neutral-300 border border-neutral-700 hover:border-neutral-600 transition-all cursor-pointer bg-transparent"
              >
                ↻ Regenerate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RevisionNotesPage() {
  const [phase, setPhase] = useState<Phase>('browse');
  const [selectedSubject, setSelectedSubject] = useState<string>(ALL_SUBJECTS[0] ?? '');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [notes, setNotes] = useState<NotesState>({ content: null, loading: false, error: null });

  const fetchNotes = useCallback(async (subject: string, topic: string) => {
    setNotes({ content: null, loading: true, error: null });
    try {
      const res = await fetch(
        `/api/revision-notes?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`
      );
      const data = await res.json();
      setNotes({ content: data.content ?? null, loading: false, error: null });
    } catch {
      setNotes({ content: null, loading: false, error: 'Failed to load notes.' });
    }
  }, []);

  const generateNotes = useCallback(async (subject: string, topic: string) => {
    setNotes(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch('/api/revision-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setNotes({ content: null, loading: false, error: data.error ?? 'Generation failed.' });
      } else {
        setNotes({ content: data.content, loading: false, error: null });
      }
    } catch {
      setNotes({ content: null, loading: false, error: 'Network error. Please try again.' });
    }
  }, []);

  const handleTopicSelect = useCallback(
    (topic: string) => {
      setSelectedTopic(topic);
      setPhase('viewing');
      fetchNotes(selectedSubject, topic);
    },
    [selectedSubject, fetchNotes]
  );

  const handleBack = useCallback(() => {
    setPhase('browse');
    setSelectedTopic('');
    setNotes({ content: null, loading: false, error: null });
  }, []);

  const handleSubjectSelect = useCallback((subject: string) => {
    setSelectedSubject(subject);
    if (phase === 'viewing') {
      setPhase('browse');
      setSelectedTopic('');
      setNotes({ content: null, loading: false, error: null });
    }
  }, [phase]);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Revision Notes</h1>
            <p className="text-neutral-400 text-sm">
              AI-generated bullet-point notes for every GCSE topic — concise, exam-focused, cached for instant access.
            </p>
          </div>

          {/* Subject tabs always visible */}
          <SubjectTabs selected={selectedSubject} onSelect={handleSubjectSelect} />

          {/* Content area */}
          {phase === 'browse' ? (
            <div>
              <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                {selectedSubject} — Topics
              </h2>
              <TopicGrid subject={selectedSubject} onSelect={handleTopicSelect} />
            </div>
          ) : (
            <NotesViewer
              subject={selectedSubject}
              topic={selectedTopic}
              notes={notes}
              onBack={handleBack}
              onRegenerate={() => generateNotes(selectedSubject, selectedTopic)}
              onGenerate={() => generateNotes(selectedSubject, selectedTopic)}
            />
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
