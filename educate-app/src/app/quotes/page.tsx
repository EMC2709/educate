'use client';

import { useState, useMemo } from 'react';
import { MobileNav } from '@/components/layout/Sidebar';
import { ENGLISH_LIT_QUOTES, QUOTE_TEXTS, QUOTE_THEMES, type Quote } from '@/data/quotes/english-literature';

const TEXT_COLORS: Record<string, string> = {
  'Macbeth':               '#a78bfa',
  'A Christmas Carol':     '#34d399',
  'An Inspector Calls':    '#f472b6',
  'Power & Conflict Poetry': '#fb923c',
};

const TEXT_ICONS: Record<string, string> = {
  'Macbeth':               '🗡️',
  'A Christmas Carol':     '🕯️',
  'An Inspector Calls':    '📞',
  'Power & Conflict Poetry': '✍️',
};

function QuoteCard({ quote, color }: { quote: Quote; color: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '220px',
        }}
      >
        {/* Front — the quote */}
        <div
          className="absolute inset-0 rounded-2xl border p-5 flex flex-col gap-3"
          style={{
            backfaceVisibility: 'hidden',
            backgroundColor: '#111',
            borderColor: `${color}40`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {TEXT_ICONS[quote.text_title]} {quote.text_title}
            </span>
            <span className="text-[10px] text-neutral-600 shrink-0">{quote.source}</span>
          </div>

          <blockquote
            className="text-white text-sm font-medium leading-relaxed italic flex-1 m-0"
            style={{ borderLeft: `3px solid ${color}`, paddingLeft: '12px' }}
          >
            &ldquo;{quote.text}&rdquo;
          </blockquote>

          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">— {quote.speaker}</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {quote.themes.map(t => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-neutral-600 text-center m-0 mt-1">Tap to see analysis ↻</p>
        </div>

        {/* Back — analysis + context */}
        <div
          className="absolute inset-0 rounded-2xl border p-5 flex flex-col gap-3"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: `${color}10`,
            borderColor: `${color}50`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color }}>
              Analysis
            </span>
            <span className="text-[10px] text-neutral-500">{quote.speaker} — {quote.source}</span>
          </div>

          <p className="text-sm text-neutral-200 leading-relaxed flex-1 m-0">{quote.analysis}</p>

          <div className="border-t pt-3 mt-1" style={{ borderColor: `${color}30` }}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 m-0 mb-1">Context</p>
            <p className="text-xs text-neutral-400 m-0">{quote.context}</p>
          </div>

          <p className="text-[10px] text-neutral-600 text-center m-0">Tap to see quote ↻</p>
        </div>
      </div>
    </div>
  );
}

export default function QuotesPage() {
  const [selectedText, setSelectedText] = useState<string>('All');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [flippedAll, setFlippedAll] = useState(false);

  const filtered = useMemo(() => {
    return ENGLISH_LIT_QUOTES.filter(q => {
      if (selectedText !== 'All' && q.text_title !== selectedText) return false;
      if (selectedTheme !== 'All' && !q.themes.includes(selectedTheme)) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!q.text.toLowerCase().includes(s) &&
            !q.speaker.toLowerCase().includes(s) &&
            !q.analysis.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [selectedText, selectedTheme, search]);

  return (
    <div className="min-h-screen pb-24 md:pb-8" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-neutral-800 px-4 py-4" style={{ backgroundColor: '#0a0a0aee', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-black text-white m-0">📖 Quotes Bank</h1>
              <p className="text-xs text-neutral-500 m-0">English Literature — tap any card to reveal analysis</p>
            </div>
            <span className="text-xs text-neutral-500 bg-neutral-800 px-3 py-1 rounded-full">
              {filtered.length} quote{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search quotes, speakers or analysis…"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 mb-3"
          />

          {/* Text filter */}
          <div className="flex gap-2 flex-wrap mb-2">
            {['All', ...QUOTE_TEXTS].map(t => {
              const color = TEXT_COLORS[t] ?? '#6366f1';
              const active = selectedText === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedText(t)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold border-0 cursor-pointer transition-all"
                  style={{
                    backgroundColor: active ? color : '#1a1a1a',
                    color: active ? '#000' : '#888',
                    outline: active ? 'none' : '1px solid #333',
                  }}
                >
                  {t === 'All' ? '📚 All Texts' : `${TEXT_ICONS[t]} ${t}`}
                </button>
              );
            })}
          </div>

          {/* Theme filter */}
          <div className="flex gap-1.5 flex-wrap">
            {['All', ...QUOTE_THEMES].map(th => (
              <button
                key={th}
                onClick={() => setSelectedTheme(th)}
                className="text-[10px] px-2.5 py-1 rounded-full border-0 cursor-pointer transition-all"
                style={{
                  backgroundColor: selectedTheme === th ? '#6366f1' : '#1a1a1a',
                  color: selectedTheme === th ? '#fff' : '#666',
                  outline: selectedTheme === th ? 'none' : '1px solid #2a2a2a',
                }}
              >
                {th}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-sm">No quotes match your filters.</p>
            <button
              onClick={() => { setSelectedText('All'); setSelectedTheme('All'); setSearch(''); }}
              className="mt-3 text-xs text-indigo-400 underline cursor-pointer bg-transparent border-0"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Group by text when showing all */}
            {selectedText === 'All' ? (
              QUOTE_TEXTS.map(textTitle => {
                const textQuotes = filtered.filter(q => q.text_title === textTitle);
                if (textQuotes.length === 0) return null;
                const color = TEXT_COLORS[textTitle] ?? '#6366f1';
                return (
                  <div key={textTitle} className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl">{TEXT_ICONS[textTitle]}</span>
                      <h2 className="text-base font-bold m-0" style={{ color }}>{textTitle}</h2>
                      <span className="text-[10px] text-neutral-600">{textQuotes.length} quotes</span>
                      <div className="flex-1 h-px bg-neutral-800" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {textQuotes.map(q => (
                        <QuoteCard key={q.id} quote={q} color={color} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map(q => (
                  <QuoteCard key={q.id} quote={q} color={TEXT_COLORS[q.text_title] ?? '#6366f1'} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <MobileNav />
    </div>
  );
}
