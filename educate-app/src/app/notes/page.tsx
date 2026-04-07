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

export default function NotesPage() {
  const { isSignedIn } = useUser();
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<{ subject: string; board: string }[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);

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

  // Group by subject
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
      // Update existing
      const updated = notes.map(n =>
        n.id === selectedNote.id
          ? { ...n, title, content, updatedAt: now }
          : n
      );
      saveNotes(updated);
      setNotes(updated);
      setSelectedNote({ ...selectedNote, title, content, updatedAt: now });
      setEditing(false);
      showToast({ icon: '\u{2705}', title: 'Note saved!', type: 'success' });
    } else {
      // Create new
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

      // Achievement
      const a = unlockAchievement('notes-created');
      if (a) {
        showToast({ icon: a.icon, title: 'Achievement Unlocked!', description: a.title, type: 'achievement', duration: 5000 });
      }
      showToast({ icon: '\u{1F4DD}', title: 'Note created!', type: 'success' });
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
      showToast({ icon: '\u{26A0}\uFE0F', title: 'Enter a topic title first', type: 'info' });
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Create concise GCSE revision notes for "${title}" in ${selectedSubject}. Use bullet points, key terms in bold, and include exam tips. Keep it under 500 words.` }],
          subject: selectedSubject,
          board: selectedBoard,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const text = await res.text();
      // Parse the SSE/text stream
      const lines = text.split('\n').filter(l => l.trim());
      let generated = '';
      for (const line of lines) {
        // Try to extract text from various stream formats
        if (line.startsWith('0:')) {
          try { generated += JSON.parse(line.slice(2)); } catch {}
        } else if (!line.startsWith('e:') && !line.startsWith('d:')) {
          generated += line;
        }
      }
      if (generated) {
        setContent(prev => prev ? prev + '\n\n---\n\n' + generated : generated);
        showToast({ icon: '\u{2728}', title: 'Notes generated!', type: 'success' });
      }
    } catch {
      showToast({ icon: '\u{274C}', title: 'Could not generate notes. Are you signed in?', type: 'info' });
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
                    {'\u2190'} Back
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
                        {generating ? 'Generating...' : '\u{2728} Generate with AI'}
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
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="text-neutral-500 bg-transparent border-none cursor-pointer text-sm hover:text-white sm:hidden"
                  >
                    {'\u2190'}
                  </button>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-white m-0">{selectedNote.title}</h1>
                    <p className="text-xs text-neutral-500 m-0 mt-1">
                      {selectedNote.subject} {'\u00B7'} {new Date(selectedNote.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => { setEditing(true); setTitle(selectedNote.title); setContent(selectedNote.content); }}
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-300 cursor-pointer hover:bg-neutral-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedNote.id)}
                    className="bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-400 cursor-pointer hover:bg-rose-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6">
                  <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {selectedNote.content || <span className="text-neutral-600 italic">No content yet. Click Edit to add notes.</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <span className="text-5xl mb-4">{'\u{1F4DD}'}</span>
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

                {/* Mobile: show notes list */}
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
    </div>
  );
}
