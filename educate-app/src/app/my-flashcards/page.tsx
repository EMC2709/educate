'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { FileImportModal } from '@/components/flashcards/FileImportModal';
import { DeckListSkeleton } from '@/components/ui/Skeleton';

interface Deck {
  id: string;
  name: string;
  subject: string | null;
  card_count: number;
  created_at: string;
  updated_at: string;
}

export default function MyFlashcardsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [decks, setDecks]         = useState<Deck[]>([]);
  const [loading, setLoading]     = useState(true);
  const [creating, setCreating]   = useState(false);
  const [newName, setNewName]     = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [saving, setSaving]       = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { setLoading(false); return; }
    fetch('/api/flashcards')
      .then(r => r.json())
      .then(d => setDecks(d.decks ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  const createDeck = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), subject: newSubject.trim() || undefined }),
      });
      const d = await res.json();
      if (d.deck) {
        setDecks(prev => [d.deck, ...prev]);
        setNewName('');
        setNewSubject('');
        setCreating(false);
      }
    } catch { /* silent */ }
    setSaving(false);
  };

  const deleteDeck = async (id: string) => {
    if (!confirm('Delete this deck? All cards will be permanently removed.')) return;
    await fetch(`/api/flashcards/${id}`, { method: 'DELETE' });
    setDecks(prev => prev.filter(d => d.id !== id));
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">My Flashcards</h1>
              <p className="text-neutral-500 text-sm mt-0.5">Create and study your own flashcard decks</p>
            </div>
            {isSignedIn && (
              <div className="flex gap-2">
                <button
                  onClick={() => setImportOpen(true)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-semibold rounded-xl transition-colors cursor-pointer border border-neutral-700"
                >
                  📂 Import
                </button>
                <button
                  onClick={() => setCreating(true)}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-none"
                >
                  + New Deck
                </button>
              </div>
            )}
          </div>

          {/* ── Create form ─────────────────────────────────────────────────── */}
          {creating && (
            <div className="bg-neutral-900 border border-indigo-500/30 rounded-2xl p-5 mb-5">
              <h3 className="text-white font-semibold mb-3 text-sm">New Deck</h3>
              <input
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') createDeck();
                  if (e.key === 'Escape') setCreating(false);
                }}
                placeholder="Deck name  (e.g. Biology: Cell Division)"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-neutral-500 outline-none focus:border-indigo-500 mb-2.5"
              />
              <input
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') createDeck();
                  if (e.key === 'Escape') setCreating(false);
                }}
                placeholder="Subject (optional)"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-neutral-500 outline-none focus:border-indigo-500 mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={createDeck}
                  disabled={saving || !newName.trim()}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-none"
                >
                  {saving ? 'Creating…' : 'Create Deck'}
                </button>
                <button
                  onClick={() => { setCreating(false); setNewName(''); setNewSubject(''); }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm rounded-xl transition-colors cursor-pointer border-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Signed-out state ────────────────────────────────────────────── */}
          {isLoaded && !isSignedIn && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📇</div>
              <h2 className="text-white font-semibold text-lg mb-2">Sign in to create flashcards</h2>
              <p className="text-neutral-500 text-sm mb-6">Your decks are saved to your account and accessible from any device.</p>
              <Link
                href="/login"
                className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold no-underline hover:bg-indigo-400 transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}

          {/* ── Loading state ───────────────────────────────────────────────── */}
          {loading && isSignedIn && <DeckListSkeleton count={4} />}

          {/* ── Empty state ─────────────────────────────────────────────────── */}
          {!loading && isSignedIn && decks.length === 0 && !creating && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📇</div>
              <h2 className="text-white font-semibold text-lg mb-2">No decks yet</h2>
              <p className="text-neutral-500 text-sm mb-6">Create a deck, add cards, and study with spaced repetition.</p>
              <button
                onClick={() => setCreating(true)}
                className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-400 transition-colors cursor-pointer border-none"
              >
                Create Your First Deck
              </button>
            </div>
          )}

          {/* ── Deck grid ───────────────────────────────────────────────────── */}
          {!loading && decks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {decks.map(deck => (
                <div
                  key={deck.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <Link href={`/my-flashcards/${deck.id}`} className="no-underline">
                        <h3 className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors truncate">
                          {deck.name}
                        </h3>
                      </Link>
                      {deck.subject && (
                        <span className="text-indigo-400 text-[11px] mt-0.5 block">{deck.subject}</span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteDeck(deck.id)}
                      className="text-neutral-600 hover:text-rose-400 transition-colors bg-transparent border-none cursor-pointer text-sm shrink-0 leading-none"
                      title="Delete deck"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 text-xs">
                      {deck.card_count} card{deck.card_count !== 1 ? 's' : ''} · {fmt(deck.updated_at)}
                    </span>
                    <Link
                      href={`/my-flashcards/${deck.id}`}
                      className="text-[11px] px-3 py-1 bg-indigo-500/15 text-indigo-400 rounded-lg no-underline hover:bg-indigo-500/25 transition-colors"
                    >
                      Open →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <MobileNav />

      {importOpen && (
        <FileImportModal
          onClose={() => setImportOpen(false)}
          onSaved={(deckId, deckName, cardCount) => {
            // Add the new deck to the top of the list
            setDecks(prev => [{
              id:         deckId,
              name:       deckName,
              subject:    null,
              card_count: cardCount,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, ...prev]);
            setImportOpen(false);
          }}
        />
      )}
    </div>
  );
}
