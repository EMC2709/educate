'use client';

import { useState, useEffect, use } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { FlashcardDeck } from '@/components/flashcards/FlashcardDeck';
import type { Flashcard, ExamBoard } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Deck {
  id: string;
  name: string;
  subject: string | null;
  card_count: number;
  is_public: boolean;
  shared_by_name: string | null;
  updated_at: string;
}

interface Card {
  id: string;
  term: string;
  definition: string;
  example: string | null;
  position: number;
}

// Generic board config for user-created decks (indigo palette)
const CUSTOM_BOARD: ExamBoard = {
  color:       '#6366f1',
  accent:      '#818cf8',
  lightAccent: '#e0e7ff',
  logo:        '📇',
  tagline:     'My Flashcards',
  subjects:    [],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoaded, isSignedIn, user } = useUser();

  const [deck,    setDeck]    = useState<Deck | null>(null);
  const [cards,   setCards]   = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode,    setMode]    = useState<'edit' | 'study'>('edit');

  // Inline rename
  const [editingName, setEditingName] = useState(false);
  const [nameVal,     setNameVal]     = useState('');

  // Add-card form
  const [term,        setTerm]        = useState('');
  const [definition,  setDefinition]  = useState('');
  const [example,     setExample]     = useState('');
  const [addSaving,   setAddSaving]   = useState(false);

  // Edit-card inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTerm,  setEditTerm]  = useState('');
  const [editDef,   setEditDef]   = useState('');
  const [editEx,    setEditEx]    = useState('');

  // Share state
  const [isPublic,  setIsPublic]  = useState(false);
  const [toggling,  setToggling]  = useState(false);

  // ── Load deck ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { setLoading(false); return; }
    fetch(`/api/flashcards/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.deck) { setDeck(d.deck); setNameVal(d.deck.name); setIsPublic(d.deck.is_public ?? false); }
        if (d.cards) setCards(d.cards);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, isLoaded, isSignedIn]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const saveName = async () => {
    if (!nameVal.trim() || !deck) return;
    await fetch(`/api/flashcards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameVal.trim() }),
    });
    setDeck(prev => prev ? { ...prev, name: nameVal.trim() } : prev);
    setEditingName(false);
  };

  const addCard = async () => {
    if (!term.trim() || !definition.trim()) return;
    setAddSaving(true);
    try {
      const res = await fetch(`/api/flashcards/${id}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term:       term.trim(),
          definition: definition.trim(),
          example:    example.trim() || undefined,
        }),
      });
      const d = await res.json();
      if (d.card) {
        setCards(prev => [...prev, d.card]);
        setDeck(prev => prev ? { ...prev, card_count: prev.card_count + 1 } : prev);
        setTerm(''); setDefinition(''); setExample('');
      }
    } catch { /* silent */ }
    setAddSaving(false);
  };

  const deleteCard = async (cardId: string) => {
    await fetch(`/api/flashcards/${id}/cards/${cardId}`, { method: 'DELETE' });
    setCards(prev => prev.filter(c => c.id !== cardId));
    setDeck(prev => prev ? { ...prev, card_count: Math.max(0, prev.card_count - 1) } : prev);
  };

  const startEdit = (card: Card) => {
    setEditingId(card.id);
    setEditTerm(card.term);
    setEditDef(card.definition);
    setEditEx(card.example ?? '');
  };

  const saveEdit = async (cardId: string) => {
    await fetch(`/api/flashcards/${id}/cards/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term:       editTerm.trim(),
        definition: editDef.trim(),
        example:    editEx.trim() || null,
      }),
    });
    setCards(prev => prev.map(c =>
      c.id === cardId
        ? { ...c, term: editTerm.trim(), definition: editDef.trim(), example: editEx.trim() || null }
        : c,
    ));
    setEditingId(null);
  };

  const toggleShare = async () => {
    if (!deck) return;
    setToggling(true);
    const newPublic   = !isPublic;
    const displayName = user?.fullName || user?.firstName || 'Anonymous';
    await fetch(`/api/flashcards/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_public:      newPublic,
        shared_by_name: newPublic ? displayName : undefined,
      }),
    });
    setIsPublic(newPublic);
    setDeck(prev =>
      prev ? { ...prev, is_public: newPublic, shared_by_name: newPublic ? displayName : null } : prev
    );
    setToggling(false);
  };

  // ── Flashcard shape for FlashcardDeck ───────────────────────────────────────

  const flashcards: Flashcard[] = cards.map(c => ({
    term:       c.term,
    definition: c.definition,
    example:    c.example,
  }));

  // ── Loading / auth guards ───────────────────────────────────────────────────

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-neutral-500 text-sm">Loading…</p>
        </main>
        <MobileNav />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-neutral-500 mb-4">Sign in to view your flashcards.</p>
            <Link href="/login" className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm no-underline hover:bg-indigo-400">
              Sign in
            </Link>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-neutral-500 mb-4">Deck not found.</p>
            <Link href="/my-flashcards" className="text-indigo-400 text-sm no-underline hover:text-indigo-300">
              ← Back to My Flashcards
            </Link>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  // ── Study mode ──────────────────────────────────────────────────────────────

  if (mode === 'study') {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <FlashcardDeck
            cards={flashcards}
            board={CUSTOM_BOARD}
            subject={deck.subject ?? undefined}
            onBack={() => setMode('edit')}
            onNewDeck={() => setMode('edit')}
          />
        </main>
        <MobileNav />
      </div>
    );
  }

  // ── Edit mode ───────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">

          {/* ── Deck header ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/my-flashcards"
              className="text-neutral-500 hover:text-white transition-colors text-sm no-underline shrink-0"
            >
              ← Back
            </Link>

            <div className="flex-1 min-w-0">
              {editingName ? (
                <input
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveName();
                    if (e.key === 'Escape') { setEditingName(false); setNameVal(deck.name); }
                  }}
                  className="text-white font-bold text-xl bg-transparent border-b border-indigo-500 outline-none w-full"
                />
              ) : (
                <h1
                  className="text-white font-bold text-xl truncate cursor-pointer hover:text-indigo-300 transition-colors"
                  onClick={() => setEditingName(true)}
                  title="Click to rename"
                >
                  {deck.name}
                </h1>
              )}
              <p className="text-neutral-500 text-xs mt-0.5">
                {deck.card_count} card{deck.card_count !== 1 ? 's' : ''}
                {deck.subject ? ` · ${deck.subject}` : ''}
              </p>
            </div>

            <button
              onClick={toggleShare}
              disabled={toggling}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer border-none shrink-0 ${
                isPublic
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-rose-500/20 hover:text-rose-400'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
              }`}
              title={isPublic ? 'Click to make private' : 'Share publicly with other students'}
            >
              {toggling ? '…' : isPublic ? '🔓 Shared' : '🔒 Share'}
            </button>

            <button
              onClick={() => setMode('study')}
              disabled={cards.length === 0}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-none shrink-0"
            >
              Study →
            </button>
          </div>

          {/* ── Add-card form ────────────────────────────────────────────── */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-5">
            <h3 className="text-white font-semibold text-sm mb-3">Add a Card</h3>
            <input
              value={term}
              onChange={e => setTerm(e.target.value)}
              placeholder="Term / question"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-neutral-500 outline-none focus:border-indigo-500 mb-2"
            />
            <textarea
              value={definition}
              onChange={e => setDefinition(e.target.value)}
              placeholder="Definition / answer"
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-neutral-500 outline-none focus:border-indigo-500 mb-2 resize-none"
            />
            <input
              value={example}
              onChange={e => setExample(e.target.value)}
              placeholder="Example (optional)"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-neutral-500 outline-none focus:border-indigo-500 mb-3"
            />
            <button
              onClick={addCard}
              disabled={addSaving || !term.trim() || !definition.trim()}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-none"
            >
              {addSaving ? 'Adding…' : 'Add Card'}
            </button>
          </div>

          {/* ── Card list ────────────────────────────────────────────────── */}
          {cards.length === 0 ? (
            <div className="text-center py-10 text-neutral-600 text-sm">
              No cards yet. Add your first card above.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {cards.map((card, i) => (
                <div
                  key={card.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4"
                >
                  {editingId === card.id ? (
                    /* ── inline edit ── */
                    <div>
                      <input
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        value={editTerm}
                        onChange={e => setEditTerm(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-indigo-500 mb-2"
                      />
                      <textarea
                        value={editDef}
                        onChange={e => setEditDef(e.target.value)}
                        rows={3}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-indigo-500 mb-2 resize-none"
                      />
                      <input
                        value={editEx}
                        onChange={e => setEditEx(e.target.value)}
                        placeholder="Example (optional)"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm placeholder-neutral-500 outline-none focus:border-indigo-500 mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(card.id)}
                          className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs rounded-lg cursor-pointer border-none"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg cursor-pointer border-none"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── read view ── */
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-neutral-600 text-[10px] uppercase tracking-wide">#{i + 1}</span>
                        <p className="text-white font-medium text-sm mt-0.5 mb-1">{card.term}</p>
                        <p className="text-neutral-400 text-xs leading-relaxed">{card.definition}</p>
                        {card.example && (
                          <p className="text-neutral-500 text-[11px] mt-1.5 italic">{card.example}</p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(card)}
                          className="text-neutral-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1.5 text-sm"
                          title="Edit card"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteCard(card.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors bg-transparent border-none cursor-pointer p-1.5 text-sm"
                          title="Delete card"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <MobileNav />
    </div>
  );
}
