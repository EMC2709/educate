'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';

interface PublicDeck {
  id: string;
  name: string;
  subject: string | null;
  card_count: number;
  shared_by_name: string | null;
  updated_at: string;
}

export default function SharedFlashcardsPage() {
  const { isSignedIn } = useUser();
  const [decks,   setDecks]   = useState<PublicDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [query,   setQuery]   = useState('');   // debounced search
  const [cloning, setCloning] = useState<string | null>(null);
  const [cloned,  setCloned]  = useState<Set<string>>(new Set());

  const load = useCallback((q: string) => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '24' });
    if (q) params.set('search', q);
    fetch(`/api/shared-flashcards?${params}`)
      .then(r => r.json())
      .then(d => setDecks(d.decks ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(''); }, [load]);

  // Debounce search input by 400 ms
  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { load(query); }, [query, load]);

  const clone = async (deckId: string) => {
    if (!isSignedIn) return;
    setCloning(deckId);
    try {
      const res = await fetch(`/api/shared-flashcards/${deckId}/clone`, { method: 'POST' });
      if (res.ok) {
        setCloned(prev => new Set([...prev, deckId]));
      }
    } catch { /* silent */ }
    setCloning(null);
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Shared Decks</h1>
            <p className="text-neutral-500 text-sm mt-0.5">
              Browse and copy flashcard decks shared by other students
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none">
              🔍
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search decks by name or subject…"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-neutral-700 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          )}

          {/* Empty */}
          {!loading && decks.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🃏</div>
              <h2 className="text-white font-semibold text-lg mb-2">
                {query ? 'No decks matched your search' : 'No shared decks yet'}
              </h2>
              <p className="text-neutral-500 text-sm mb-6">
                {query
                  ? 'Try a different search term.'
                  : 'Be the first to share a deck! Open any of your decks and click "Share publicly".'}
              </p>
              <Link
                href="/my-flashcards"
                className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold no-underline hover:bg-indigo-400 transition-colors"
              >
                My Flashcards
              </Link>
            </div>
          )}

          {/* Grid */}
          {!loading && decks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {decks.map(deck => (
                <div
                  key={deck.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors flex flex-col gap-3"
                >
                  {/* Name + subject */}
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-snug">{deck.name}</h3>
                    {deck.subject && (
                      <span className="text-indigo-400 text-[11px] mt-0.5 block">{deck.subject}</span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                    <span>{deck.card_count} card{deck.card_count !== 1 ? 's' : ''}</span>
                    {deck.shared_by_name && (
                      <>
                        <span>·</span>
                        <span>by {deck.shared_by_name}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{fmt(deck.updated_at)}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto">
                    {!isSignedIn ? (
                      <Link
                        href="/login"
                        className="block text-center text-[11px] px-3 py-1.5 bg-indigo-500/15 text-indigo-400 rounded-lg no-underline hover:bg-indigo-500/25 transition-colors"
                      >
                        Sign in to copy →
                      </Link>
                    ) : cloned.has(deck.id) ? (
                      <div className="text-center text-[11px] px-3 py-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg">
                        ✓ Added to your decks
                      </div>
                    ) : (
                      <button
                        onClick={() => clone(deck.id)}
                        disabled={cloning === deck.id}
                        className="w-full text-[11px] px-3 py-1.5 bg-indigo-500/15 text-indigo-400 rounded-lg border-none cursor-pointer hover:bg-indigo-500/25 transition-colors disabled:opacity-50"
                      >
                        {cloning === deck.id ? 'Copying…' : '📋 Copy to my decks'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Link to own decks */}
          {!loading && decks.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/my-flashcards"
                className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors no-underline"
              >
                ← Back to My Flashcards
              </Link>
            </div>
          )}

        </div>
      </main>

      <MobileNav />
    </div>
  );
}
