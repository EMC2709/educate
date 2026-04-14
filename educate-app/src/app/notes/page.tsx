'use client';

import { useState, useEffect } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { useToast } from '@/components/ui/Toast';
import { unlockAchievement } from '@/lib/achievements';
import { useUser } from '@clerk/nextjs';

const NOTES_KEY = 'educate-notes';

interface Note {
  id: string;
  subject: string;
  board: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Flashcard { front: string; back: string; }
interface CustomQuestion { question: string; marks: number; answer: string; }

function getNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
function saveNotes(notes: Note[]): void {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// ── Convert Modal ──────────────────────────────────────────────────────────────
function ConvertModal({
  note,
  mode,
  onClose,
}: {
  note: Note;
  mode: 'flashcards' | 'questions';
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [cardIdx, setCardIdx] = useState(0);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generate() {
    setLoading(true);
    setError('');
    const prompt = mode === 'flashcards'
      ? `Based on these revision notes about "${note.title}" (${note.subject}), generate exactly 8 flashcards as JSON.\n\nNotes:\n${note.content}\n\nReturn ONLY a JSON array like:\n[{"front":"Term or question","back":"Definition or answer"},...]`
      : `Based on these revision notes about "${note.title}" (${note.subject}), generate 5 exam-style questions as JSON.\n\nNotes:\n${note.content}\n\nReturn ONLY a JSON array like:\n[{"question":"...","marks":3,"answer":"Model answer..."},...]`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ id: 'gen', role: 'user', parts: [{ type: 'text', text: prompt }] }],
          subject: note.subject,
          board: note.board,
        }),
      });
      if (!res.ok) throw new Error('API error');

      // Read the AI SDK stream
      const text = await res.text();
      let combined = '';
      for (const line of text.split('\n')) {
        if (line.startsWith('0:"')) {
          try { combined += JSON.parse(line.slice(2)); } catch {}
        } else if (line.startsWith('0:')) {
          try { combined += JSON.parse(line.slice(2)); } catch {}
        }
      }

      // Extract JSON array from response
      const match = combined.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON found');
      const parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Empty result');

      if (mode === 'flashcards') setFlashcards(parsed as Flashcard[]);
      else setQuestions(parsed as CustomQuestion[]);
    } catch {
      setError('Could not generate — make sure you are signed in.');
    }
    setLoading(false);
  }

  const isFlashcards = mode === 'flashcards';
  const card = flashcards[cardIdx];

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-xl bg-neutral-950 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-800 shrink-0">
          <span className="text-xl">{isFlashcards ? '📇' : '❓'}</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white m-0">
              {isFlashcards ? 'Flashcards' : 'Practice Questions'} from Notes
            </p>
            <p className="text-[11px] text-neutral-500 m-0 truncate">{note.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 border-none text-neutral-400 cursor-pointer hover:bg-neutral-700 transition-colors text-sm flex items-center justify-center"
          >✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-neutral-500 text-sm">
                {isFlashcards ? 'Creating flashcards…' : 'Generating questions…'}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button
                onClick={generate}
                className="bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-xl border-none cursor-pointer hover:bg-indigo-400"
              >Retry</button>
            </div>
          ) : isFlashcards ? (
            /* ── Flashcard view ── */
            <div>
              {/* Progress */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-neutral-500">{cardIdx + 1} / {flashcards.length}</span>
                <div className="flex gap-1">
                  {flashcards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCardIdx(i); setFlipped({}); }}
                      className="w-2 h-2 rounded-full border-none cursor-pointer transition-colors"
                      style={{ backgroundColor: i === cardIdx ? '#6366f1' : '#2a2a2a' }}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-500">{flipped[cardIdx] ? 'Answer' : 'Question'}</span>
              </div>

              {/* Card */}
              <div
                className="relative cursor-pointer select-none"
                style={{ perspective: '1000px', height: '220px' }}
                onClick={() => setFlipped(f => ({ ...f, [cardIdx]: !f[cardIdx] }))}
              >
                <div
                  className="w-full h-full transition-transform duration-500 relative"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped[cardIdx] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(135deg, #1e1b4b, #1e1e2e)',
                      border: '1px solid #6366f133',
                    }}
                  >
                    <p className="text-[10px] text-indigo-400 uppercase tracking-widest mb-3 m-0">Tap to reveal</p>
                    <p className="text-white text-base font-semibold leading-relaxed m-0">{card?.front}</p>
                  </div>
                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: 'linear-gradient(135deg, #064e3b, #0f2318)',
                      border: '1px solid #10b98133',
                    }}
                  >
                    <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-3 m-0">Answer</p>
                    <p className="text-white text-sm leading-relaxed m-0">{card?.back}</p>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { setCardIdx(i => Math.max(0, i - 1)); setFlipped({}); }}
                  disabled={cardIdx === 0}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-700 bg-transparent text-neutral-400 cursor-pointer hover:border-neutral-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >← Prev</button>
                <button
                  onClick={() => { setCardIdx(i => Math.min(flashcards.length - 1, i + 1)); setFlipped({}); }}
                  disabled={cardIdx === flashcards.length - 1}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500 text-white border-none cursor-pointer hover:bg-indigo-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >Next →</button>
              </div>

              <p className="text-center text-neutral-600 text-xs mt-3">Tap a card to flip it</p>
            </div>
          ) : (
            /* ── Questions view ── */
            <div className="flex flex-col gap-4">
              {questions.map((q, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm font-semibold text-white m-0 flex-1 leading-relaxed">{q.question}</p>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap">
                      {q.marks} mark{q.marks !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {!revealed[i] ? (
                    <>
                      <textarea
                        value={userAnswers[i] ?? ''}
                        onChange={e => setUserAnswers(a => ({ ...a, [i]: e.target.value }))}
                        placeholder="Write your answer here…"
                        rows={3}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none placeholder:text-neutral-600 mb-2"
                        onFocus={e => (e.target.style.borderColor = '#6366f1')}
                        onBlur={e => (e.target.style.borderColor = '#404040')}
                      />
                      <button
                        onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
                        className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-amber-500/20 transition-colors border-none"
                      >
                        👁 Reveal Model Answer
                      </button>
                    </>
                  ) : (
                    <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-3 mt-1">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 m-0 mb-1">Model Answer</p>
                      <p className="text-sm text-neutral-200 m-0 leading-relaxed">{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — regenerate */}
        {!loading && !error && (
          <div className="px-5 py-3 border-t border-neutral-800 shrink-0">
            <button
              onClick={generate}
              className="w-full py-2 rounded-xl text-xs font-semibold text-neutral-500 bg-neutral-900 border border-neutral-800 cursor-pointer hover:text-neutral-300 hover:border-neutral-700 transition-colors"
            >
              ↻ Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function NotesPage() {
  const { isSignedIn } = useUser();
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<{ subject: string; board: string }[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [convertMode, setConvertMode] = useState<'flashcards' | 'questions' | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setNotes(getNotes());
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (cached) {
        const subs = JSON.parse(cached);
        setSubjects(subs);
        if (subs.length > 0) {
          setSelectedSubject(subs[0].subject);
          setSelectedBoard(subs[0].board);
        }
      }
    } catch {}
  }, []);

  const filteredNotes = searchQuery
    ? notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  const grouped: Record<string, Note[]> = {};
  filteredNotes.forEach(n => {
    if (!grouped[n.subject]) grouped[n.subject] = [];
    grouped[n.subject].push(n);
  });

  function handleCreate() {
    setCreating(true);
    setEditing(false);
    setSelectedNote(null);
    setTitle('');
    setContent('');
    if (subjects.length > 0) {
      setSelectedSubject(subjects[0].subject);
      setSelectedBoard(subjects[0].board);
    }
  }

  function handleSave() {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    if (selectedNote && editing) {
      const updated = notes.map(n =>
        n.id === selectedNote.id ? { ...n, title, content, updatedAt: now } : n
      );
      saveNotes(updated);
      setNotes(updated);
      setSelectedNote({ ...selectedNote, title, content, updatedAt: now });
      setEditing(false);
      showToast({ icon: '✅', title: 'Note saved!', type: 'success' });
    } else {
      const note: Note = {
        id: Math.random().toString(36).slice(2),
        subject: selectedSubject,
        board: selectedBoard,
        title,
        content,
        createdAt: now,
        updatedAt: now,
      };
      const updated = [note, ...notes];
      saveNotes(updated);
      setNotes(updated);
      setSelectedNote(note);
      setCreating(false);
      const a = unlockAchievement('notes-created');
      if (a) showToast({ icon: a.icon, title: 'Achievement Unlocked!', description: a.title, type: 'achievement', duration: 5000 });
      showToast({ icon: '📝', title: 'Note created!', type: 'success' });
    }
  }

  function handleDelete(id: string) {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
    setNotes(updated);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setEditing(false);
    }
  }

  async function handleGenerate() {
    if (!selectedSubject || !title.trim()) {
      showToast({ icon: '⚠️', title: 'Enter a topic title first', type: 'info' });
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ id: 'gen', role: 'user', parts: [{ type: 'text', text: `Create concise GCSE revision notes for "${title}" in ${selectedSubject}. Use bullet points, key terms in bold, and include exam tips. Keep it under 500 words.` }] }],
          subject: selectedSubject,
          board: selectedBoard,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const text = await res.text();
      let generated = '';
      for (const line of text.split('\n')) {
        if (line.startsWith('0:"')) {
          try { generated += JSON.parse(line.slice(2)); } catch {}
        } else if (line.startsWith('0:')) {
          try { generated += JSON.parse(line.slice(2)); } catch {}
        }
      }
      if (generated) {
        setContent(prev => prev ? prev + '\n\n---\n\n' + generated : generated);
        showToast({ icon: '✨', title: 'Notes generated!', type: 'success' });
      }
    } catch {
      showToast({ icon: '❌', title: 'Could not generate notes. Are you signed in?', type: 'info' });
    }
    setGenerating(false);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="flex h-screen">
          {/* Notes list sidebar */}
          <div className="w-72 border-r border-neutral-800 flex flex-col bg-neutral-950 shrink-0 hidden sm:flex">
            <div className="p-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-bold text-white m-0 flex-1">Notes</h2>
                <button
                  onClick={handleCreate}
                  className="bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer hover:bg-indigo-400 transition-colors"
                >
                  + New
                </button>
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none placeholder:text-neutral-600 focus:border-neutral-700"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {Object.keys(grouped).length === 0 ? (
                <p className="text-neutral-600 text-xs text-center py-8">No notes yet</p>
              ) : (
                Object.entries(grouped).map(([subject, subNotes]) => (
                  <div key={subject} className="mb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 px-2 mb-1">{subject}</p>
                    {subNotes.map(n => (
                      <button
                        key={n.id}
                        onClick={() => { setSelectedNote(n); setCreating(false); setEditing(false); setTitle(n.title); setContent(n.content); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs border-none cursor-pointer transition-colors mb-0.5 ${
                          selectedNote?.id === n.id
                            ? 'bg-indigo-500/15 text-indigo-400'
                            : 'bg-transparent text-neutral-400 hover:bg-neutral-900'
                        }`}
                      >
                        <p className="m-0 font-semibold truncate">{n.title}</p>
                        <p className="m-0 text-neutral-600 text-[10px] mt-0.5">
                          {new Date(n.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Editor / viewer */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {creating || editing ? (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => { setCreating(false); setEditing(false); }}
                    className="text-neutral-500 bg-transparent border-none cursor-pointer text-sm hover:text-white"
                  >
                    ← Back
                  </button>
                  <h2 className="text-lg font-bold text-white m-0 flex-1">
                    {editing ? 'Edit Note' : 'New Note'}
                  </h2>
                </div>

                {!editing && (
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-neutral-400 block mb-1">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={e => {
                        setSelectedSubject(e.target.value);
                        const match = subjects.find(s => s.subject === e.target.value);
                        if (match) setSelectedBoard(match.board);
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                    >
                      {subjects.map(s => (
                        <option key={s.subject} value={s.subject}>{s.subject} ({s.board})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mb-4">
                  <label className="text-xs font-semibold text-neutral-400 block mb-1">Title / Topic</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Cell Division, Trigonometry, WW2 Causes..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder:text-neutral-600"
                  />
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-400">Content</label>
                    {isSignedIn && (
                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-3 py-1 cursor-pointer hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
                      >
                        {generating ? 'Generating...' : '✨ Generate with AI'}
                      </button>
                    )}
                  </div>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Write your revision notes here, or use AI to generate them..."
                    rows={16}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-neutral-600 resize-y leading-relaxed"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={!title.trim()}
                    className="bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl border-none cursor-pointer hover:bg-indigo-400 transition-colors disabled:opacity-50 text-sm"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => { setCreating(false); setEditing(false); }}
                    className="bg-neutral-800 text-neutral-400 font-semibold px-6 py-2.5 rounded-xl border-none cursor-pointer hover:bg-neutral-700 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : selectedNote ? (
              <div className="max-w-2xl mx-auto">
                {/* Note header */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="text-neutral-500 bg-transparent border-none cursor-pointer text-sm hover:text-white sm:hidden"
                  >←</button>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-white m-0">{selectedNote.title}</h1>
                    <p className="text-xs text-neutral-500 m-0 mt-1">
                      {selectedNote.subject} · {new Date(selectedNote.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => { setEditing(true); setTitle(selectedNote.title); setContent(selectedNote.content); }}
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-300 cursor-pointer hover:bg-neutral-700 transition-colors"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(selectedNote.id)}
                    className="bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-400 cursor-pointer hover:bg-rose-500/20 transition-colors"
                  >Delete</button>
                </div>

                {/* ── Convert to Study Tools ── */}
                {selectedNote.content.trim() && isSignedIn && (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white m-0">Turn into Study Tools</p>
                      <p className="text-[11px] text-neutral-500 m-0 mt-0.5">Generate flashcards or practice questions from this note</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setConvertMode('flashcards')}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                      >
                        📇 Flashcards
                      </button>
                      <button
                        onClick={() => setConvertMode('questions')}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}
                      >
                        ❓ Questions
                      </button>
                    </div>
                  </div>
                )}

                {/* Note content */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6">
                  <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {selectedNote.content || <span className="text-neutral-600 italic">No content yet. Click Edit to add notes.</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <span className="text-5xl mb-4">📝</span>
                <h2 className="text-lg font-bold text-white mb-2">Revision Notes</h2>
                <p className="text-neutral-500 text-sm mb-6 max-w-sm">
                  Create and organise your revision notes by subject. Use AI to generate summaries for any topic.
                </p>
                <button
                  onClick={handleCreate}
                  className="bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl border-none cursor-pointer hover:bg-indigo-400 transition-colors"
                >
                  Create First Note
                </button>
                <div className="sm:hidden w-full mt-8">
                  {notes.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {notes.map(n => (
                        <button
                          key={n.id}
                          onClick={() => setSelectedNote(n)}
                          className="w-full text-left bg-neutral-900 border border-neutral-800 rounded-xl p-3 cursor-pointer"
                        >
                          <p className="text-sm font-semibold text-white m-0">{n.title}</p>
                          <p className="text-xs text-neutral-500 m-0 mt-1">{n.subject}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />

      {/* Convert modal */}
      {convertMode && selectedNote && (
        <ConvertModal
          note={selectedNote}
          mode={convertMode}
          onClose={() => setConvertMode(null)}
        />
      )}
    </div>
  );
}
