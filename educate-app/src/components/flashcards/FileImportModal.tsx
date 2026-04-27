'use client';

import { useState, useRef, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ParsedCard {
  id: string;            // local key only — not sent to server
  term: string;
  definition: string;
  example: string;
}

interface FileImportModalProps {
  onClose: () => void;
  /** Called after a successful save with the new deck's id, name, and card count. */
  onSaved: (deckId: string, deckName: string, cardCount: number) => void;
}

// ── Parser ─────────────────────────────────────────────────────────────────────
// Supported separators (tried in order): " :: ", tab, comma (CSV)
// Lines starting with # are treated as comments and skipped.
// Each valid line: term SEPARATOR definition [SEPARATOR example]

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseFileContent(text: string): ParsedCard[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
  const cards: ParsedCard[] = [];

  for (const line of lines) {
    let parts: string[] = [];

    if (line.includes(' :: ')) {
      parts = line.split(' :: ').map(s => s.trim());
    } else if (line.includes('\t')) {
      parts = line.split('\t').map(s => s.trim());
    } else if (line.includes(',')) {
      parts = parseCSVLine(line);
    }

    if (parts.length >= 2 && parts[0] && parts[1]) {
      cards.push({
        id:         Math.random().toString(36).slice(2),
        term:       parts[0],
        definition: parts[1],
        example:    parts[2] ?? '',
      });
    }
  }
  return cards;
}

// ── Component ─────────────────────────────────────────────────────────────────

const ACCEPTED = '.txt,.csv,.tsv,.md';

export function FileImportModal({ onClose, onSaved }: FileImportModalProps) {
  const [cards,    setCards]    = useState<ParsedCard[]>([]);
  const [deckName, setDeckName] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── File processing ─────────────────────────────────────────────────────────

  const processFile = useCallback((file: File) => {
    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    if (!['.txt', '.csv', '.tsv', '.md'].includes(ext)) {
      setError('Unsupported file type. Please use .txt, .csv, .tsv or .md.');
      return;
    }
    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = e => {
      const text = (e.target?.result as string) ?? '';
      const parsed = parseFileContent(text);
      if (parsed.length === 0) {
        setError('No cards found. Check that each line uses: term :: definition');
        setCards([]);
      } else {
        setCards(parsed);
        if (!deckName) {
          setDeckName(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
        }
      }
    };
    reader.readAsText(file);
  }, [deckName]);

  // ── Drag & drop ─────────────────────────────────────────────────────────────

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // ── Card editing ────────────────────────────────────────────────────────────

  const removeCard = (id: string) =>
    setCards(prev => prev.filter(c => c.id !== id));

  const updateCard = (id: string, field: 'term' | 'definition' | 'example', value: string) =>
    setCards(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  // ── Save ────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!deckName.trim() || cards.length === 0) return;
    setSaving(true);
    setError('');

    try {
      // 1. Create the deck
      const deckRes = await fetch('/api/flashcards', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: deckName.trim() }),
      });
      if (!deckRes.ok) throw new Error('Could not create deck — are you signed in?');
      const { deck } = await deckRes.json();

      // 2. Bulk-insert all cards in one request
      const batchRes = await fetch(`/api/flashcards/${deck.id}/cards/batch`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          cards: cards.map(c => ({
            term:       c.term,
            definition: c.definition,
            ...(c.example ? { example: c.example } : {}),
          })),
        }),
      });
      if (!batchRes.ok) throw new Error('Cards saved — deck created but card insert failed.');

      onSaved(deck.id, deck.name, cards.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
    setSaving(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-2xl bg-neutral-950 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-800 shrink-0">
          <span className="text-xl">📂</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white m-0">Import Flashcards from File</p>
            <p className="text-[11px] text-neutral-500 m-0">
              .txt / .csv / .tsv / .md · one card per line
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 border-none text-neutral-400 cursor-pointer hover:bg-neutral-700 transition-colors text-sm flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">

          {/* Drop zone — shown until a file is loaded */}
          {cards.length === 0 && (
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors mb-4"
              style={{
                borderColor:     dragging ? '#6366f1' : '#2a2a2a',
                backgroundColor: dragging ? '#6366f108' : 'transparent',
              }}
            >
              <div className="text-4xl mb-3">📂</div>
              <p className="text-white font-semibold text-sm m-0 mb-1">
                Drop your file here
              </p>
              <p className="text-neutral-500 text-xs m-0">
                or click to browse
              </p>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]); }}
              />
            </div>
          )}

          {/* Format guide — shown while no file is loaded */}
          {cards.length === 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <p className="text-neutral-400 text-xs font-semibold mb-2 m-0">
                File format — one card per line:
              </p>
              <pre className="text-emerald-400 text-xs m-0 leading-relaxed font-mono whitespace-pre-wrap">{
`Mitosis :: Cell division producing 2 identical daughter cells
Meiosis :: Division producing 4 genetically unique gametes
Osmosis :: Movement of water from high to low water potential :: e.g. root hair cells

# Tab-separated (Anki export format):
term[TAB]definition

# CSV:
term,definition,optional example`
              }</pre>
              <p className="text-neutral-600 text-[11px] mt-2 mb-0 m-0">
                Lines starting with # are ignored
              </p>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-4 mt-2">
              <p className="text-rose-400 text-sm m-0">{error}</p>
            </div>
          )}

          {/* Preview + edit */}
          {cards.length > 0 && (
            <>
              {/* File info + deck name */}
              <div className="flex items-center gap-3 mb-3">
                <p className="text-white font-semibold text-sm m-0 flex-1">
                  <span className="text-indigo-400">{cards.length}</span> cards from{' '}
                  <span className="text-neutral-400">{fileName}</span>
                </p>
                <button
                  onClick={() => { setCards([]); setFileName(''); setError(''); }}
                  className="text-xs text-neutral-500 hover:text-white bg-transparent border-none cursor-pointer"
                >
                  Change file
                </button>
              </div>

              <input
                value={deckName}
                onChange={e => setDeckName(e.target.value)}
                placeholder="Deck name"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-neutral-500 outline-none focus:border-indigo-500 mb-3"
              />

              {/* Card list */}
              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
                {cards.map((card, i) => (
                  <div
                    key={card.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 flex items-center gap-2"
                  >
                    <span className="text-neutral-600 text-[10px] w-5 text-right shrink-0">
                      {i + 1}
                    </span>
                    <input
                      value={card.term}
                      onChange={e => updateCard(card.id, 'term', e.target.value)}
                      placeholder="Term"
                      className="w-32 shrink-0 bg-neutral-800 rounded-lg px-2 py-1 text-white text-xs outline-none border border-transparent focus:border-indigo-500"
                    />
                    <input
                      value={card.definition}
                      onChange={e => updateCard(card.id, 'definition', e.target.value)}
                      placeholder="Definition"
                      className="flex-1 min-w-0 bg-neutral-800 rounded-lg px-2 py-1 text-neutral-300 text-xs outline-none border border-transparent focus:border-indigo-500"
                    />
                    <button
                      onClick={() => removeCard(card.id)}
                      className="text-neutral-600 hover:text-rose-400 bg-transparent border-none cursor-pointer text-xs shrink-0 px-1"
                      title="Remove card"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        {cards.length > 0 && (
          <div className="px-5 py-4 border-t border-neutral-800 shrink-0 flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-neutral-800 text-neutral-300 text-sm rounded-xl border-none cursor-pointer hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !deckName.trim()}
              className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl border-none cursor-pointer transition-colors"
            >
              {saving
                ? 'Saving…'
                : `Save ${cards.length} card${cards.length !== 1 ? 's' : ''} to My Flashcards`}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
