'use client';

import { useState, useRef, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ParsedCard {
  id: string;
  term: string;
  definition: string;
  example: string;
}

type DetectedFormat =
  | 'qa-labels'       // Q: … / A: … or Question: / Answer:
  | 'separator'       // term :: definition  |  tab  |  comma
  | 'block-pairs'     // blank-line-separated blocks, line 1 = term, rest = def
  | 'line-pairs'      // consecutive line pairs (fallback)
  | 'spreadsheet'     // xlsx column-based
  | 'unknown';

interface FileImportModalProps {
  onClose: () => void;
  onSaved: (deckId: string, deckName: string, cardCount: number) => void;
}

// ── Smart parser ──────────────────────────────────────────────────────────────

const Q_PREFIX = /^(?:q|question|q\.|term|front)\s*[:.\-–]\s*/i;
const A_PREFIX = /^(?:a|answer|ans|definition|def|back)\s*[:.\-–]\s*/i;

function uid() { return Math.random().toString(36).slice(2); }

/** Strategy 1 — Q:/A: or Question:/Answer: label pairs */
function parseQALabels(lines: string[]): ParsedCard[] {
  const cards: ParsedCard[] = [];
  let pendingTerm = '';
  for (const line of lines) {
    if (Q_PREFIX.test(line)) {
      pendingTerm = line.replace(Q_PREFIX, '').trim();
    } else if (A_PREFIX.test(line) && pendingTerm) {
      const definition = line.replace(A_PREFIX, '').trim();
      if (definition) {
        cards.push({ id: uid(), term: pendingTerm, definition, example: '' });
        pendingTerm = '';
      }
    }
  }
  return cards;
}

/** Parses a single CSV line respecting quoted fields */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"')      { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else                 { current += ch; }
  }
  result.push(current.trim());
  return result;
}

/** Strategy 2 — single-line separators: ::, tab, comma */
function parseSeparated(lines: string[]): ParsedCard[] {
  const cards: ParsedCard[] = [];
  for (const line of lines) {
    let parts: string[] = [];
    if      (line.includes(' :: '))  parts = line.split(' :: ').map(s => s.trim());
    else if (line.includes('\t'))    parts = line.split('\t').map(s => s.trim());
    else if (line.includes(','))     parts = parseCSVLine(line);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      cards.push({ id: uid(), term: parts[0], definition: parts[1], example: parts[2] ?? '' });
    }
  }
  return cards;
}

/** Strategy 3 — blank-line-separated blocks: first line = term, rest = definition */
function parseBlockPairs(text: string): ParsedCard[] {
  const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  if (blocks.length < 2) return [];
  return blocks.flatMap(block => {
    const bLines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (bLines.length < 2) return [];
    return [{ id: uid(), term: bLines[0], definition: bLines.slice(1).join(' '), example: '' }];
  });
}

/** Strategy 4 — fallback: odd lines = terms, even lines = definitions */
function parseLinePairs(lines: string[]): ParsedCard[] {
  const cards: ParsedCard[] = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    if (lines[i] && lines[i + 1]) {
      cards.push({ id: uid(), term: lines[i], definition: lines[i + 1], example: '' });
    }
  }
  return cards;
}

/** Run all text-based strategies and return the best result with its format name */
function smartParseText(text: string): { cards: ParsedCard[]; format: DetectedFormat } {
  const allLines  = text.split(/\r?\n/).map(l => l.trim());
  const lines     = allLines.filter(l => l && !l.startsWith('#'));

  const qa  = parseQALabels(lines);
  if (qa.length  > 0) return { cards: qa,  format: 'qa-labels'  };

  const sep = parseSeparated(lines);
  if (sep.length > 0) return { cards: sep, format: 'separator'  };

  const blk = parseBlockPairs(text);
  if (blk.length > 0) return { cards: blk, format: 'block-pairs' };

  const lp  = parseLinePairs(lines);
  if (lp.length  > 0) return { cards: lp,  format: 'line-pairs'  };

  return { cards: [], format: 'unknown' };
}

// ── File-type extractors (all client-side, no server/AI) ──────────────────────

async function extractPDF(file: File): Promise<string> {
  // Dynamic import keeps the large pdfjs bundle out of the initial JS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib = await import('pdfjs-dist') as any;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf         = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Join items; insert newline when vertical position changes significantly
    let lastY: number | null = null;
    let pageText = '';
    for (const item of content.items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const it = item as any;
      if (!('str' in it)) continue;
      const y = it.transform?.[5] ?? 0;
      if (lastY !== null && Math.abs(y - lastY) > 5) pageText += '\n';
      pageText += it.str;
      lastY = y;
    }
    pages.push(pageText);
  }
  return pages.join('\n\n');
}

async function extractDOCX(file: File): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mammoth     = await import('mammoth') as any;
  const arrayBuffer = await file.arrayBuffer();
  const result      = await mammoth.extractRawText({ arrayBuffer });
  return result.value as string;
}

async function extractXLSX(file: File): Promise<{ cards: ParsedCard[]; format: DetectedFormat }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const XLSX        = await import('xlsx') as any;
  const arrayBuffer = await file.arrayBuffer();
  const workbook    = XLSX.read(arrayBuffer, { type: 'array' });
  const sheet       = workbook.Sheets[workbook.SheetNames[0]];
  const rows: (string | number | undefined)[][] =
    XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Skip header row if first cell looks like a label
  const firstCell = String(rows[0]?.[0] ?? '').toLowerCase();
  const start = /^(term|question|front|q|word)$/.test(firstCell) ? 1 : 0;

  const cards: ParsedCard[] = rows
    .slice(start)
    .filter(row => row[0] != null && row[1] != null)
    .map(row => ({
      id:         uid(),
      term:       String(row[0]).trim(),
      definition: String(row[1]).trim(),
      example:    row[2] != null ? String(row[2]).trim() : '',
    }))
    .filter(c => c.term && c.definition);

  return { cards, format: 'spreadsheet' };
}

// ── Format labels ─────────────────────────────────────────────────────────────

const FORMAT_LABELS: Record<DetectedFormat, string> = {
  'qa-labels':   'Q: / A: labels detected',
  'separator':   ':: / tab / comma separator',
  'block-pairs': 'Block pairs (blank line separated)',
  'line-pairs':  'Alternating line pairs',
  'spreadsheet': 'Spreadsheet columns (A = term, B = definition)',
  'unknown':     'Format not recognised',
};
const FORMAT_COLOURS: Record<DetectedFormat, string> = {
  'qa-labels':   '#4ade80',
  'separator':   '#60a5fa',
  'block-pairs': '#f59e0b',
  'line-pairs':  '#a78bfa',
  'spreadsheet': '#34d399',
  'unknown':     '#f87171',
};

// ── Component ─────────────────────────────────────────────────────────────────

const ACCEPTED = '.txt,.csv,.tsv,.md,.pdf,.docx,.xlsx';

export function FileImportModal({ onClose, onSaved }: FileImportModalProps) {
  const [cards,    setCards]    = useState<ParsedCard[]>([]);
  const [deckName, setDeckName] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [format,   setFormat]   = useState<DetectedFormat>('unknown');
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Process any supported file ──────────────────────────────────────────────

  const processFile = useCallback(async (file: File) => {
    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    const allowed = ['.txt', '.csv', '.tsv', '.md', '.pdf', '.docx', '.xlsx'];
    if (!allowed.includes(ext)) {
      setError(`Unsupported type "${ext}". Use: ${allowed.join(', ')}`);
      return;
    }
    setFileName(file.name);
    setError('');
    setLoading(true);

    try {
      let result: { cards: ParsedCard[]; format: DetectedFormat };

      if (ext === '.xlsx') {
        result = await extractXLSX(file);
      } else if (ext === '.pdf') {
        const text = await extractPDF(file);
        result = smartParseText(text);
      } else if (ext === '.docx') {
        const text = await extractDOCX(file);
        result = smartParseText(text);
      } else {
        // Plain text formats
        const text = await file.text();
        result = smartParseText(text);
      }

      if (result.cards.length === 0) {
        setError(
          result.format === 'unknown'
            ? 'No cards found. Try reformatting as "term :: definition" (one per line).'
            : 'Parsing found no valid pairs. Check the file structure.',
        );
        setCards([]);
      } else {
        setCards(result.cards);
        setFormat(result.format);
        if (!deckName) {
          setDeckName(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
        }
      }
    } catch (err) {
      console.error(err);
      setError(`Could not read this file. ${err instanceof Error ? err.message : ''}`);
    }
    setLoading(false);
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
      const deckRes = await fetch('/api/flashcards', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: deckName.trim() }),
      });
      if (!deckRes.ok) throw new Error('Could not create deck — are you signed in?');
      const { deck } = await deckRes.json();

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
      if (!batchRes.ok) throw new Error('Deck created but card insert failed.');

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
              .txt · .csv · .md · .pdf · .docx · .xlsx
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 border-none text-neutral-400 cursor-pointer hover:bg-neutral-700 transition-colors text-sm flex items-center justify-center"
          >✕</button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">

          {/* Drop zone */}
          {cards.length === 0 && !loading && (
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
              <p className="text-white font-semibold text-sm m-0 mb-1">Drop your file here</p>
              <p className="text-neutral-500 text-xs m-0">or click to browse</p>
              <p className="text-neutral-700 text-[11px] mt-2 m-0">
                .txt · .csv · .tsv · .md · .pdf · .docx · .xlsx
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

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-neutral-500 text-sm">Reading file…</p>
            </div>
          )}

          {/* Format guide */}
          {cards.length === 0 && !loading && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <p className="text-neutral-400 text-xs font-semibold mb-2 m-0">Auto-detected formats:</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: 'Q: / A: labels',        ex: 'Q: What is osmosis?\nA: Movement of water…' },
                  { label: ':: separator',           ex: 'Osmosis :: Movement of water from high to low water potential' },
                  { label: 'Tab / CSV',              ex: 'Osmosis\tMovement of water…' },
                  { label: 'Block pairs',            ex: 'Osmosis\nMovement of water…\n\nMitosis\nCell division…' },
                  { label: 'Excel columns A / B / C', ex: 'Column A = term, B = definition, C = example (optional)' },
                ].map(f => (
                  <div key={f.label} className="flex gap-2 items-start">
                    <span className="text-indigo-400 text-[10px] font-semibold shrink-0 mt-0.5 w-28">{f.label}</span>
                    <pre className="text-neutral-500 text-[10px] m-0 font-mono leading-relaxed whitespace-pre-wrap flex-1">{f.ex}</pre>
                  </div>
                ))}
              </div>
              <p className="text-neutral-700 text-[10px] mt-2 mb-0 m-0">Lines starting with # are ignored</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-4 mt-2">
              <p className="text-rose-400 text-sm m-0">{error}</p>
            </div>
          )}

          {/* Preview */}
          {cards.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <p className="text-white font-semibold text-sm m-0">
                  <span className="text-indigo-400">{cards.length}</span> cards — {fileName}
                </p>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ color: FORMAT_COLOURS[format], backgroundColor: `${FORMAT_COLOURS[format]}18` }}
                >
                  {FORMAT_LABELS[format]}
                </span>
                <button
                  onClick={() => { setCards([]); setFileName(''); setError(''); }}
                  className="text-xs text-neutral-500 hover:text-white bg-transparent border-none cursor-pointer ml-auto"
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
                    <span className="text-neutral-600 text-[10px] w-5 text-right shrink-0">{i + 1}</span>
                    <input
                      value={card.term}
                      onChange={e => updateCard(card.id, 'term', e.target.value)}
                      placeholder="Term"
                      className="w-28 shrink-0 bg-neutral-800 rounded-lg px-2 py-1 text-white text-xs outline-none border border-transparent focus:border-indigo-500"
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
                    >✕</button>
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
              {saving ? 'Saving…' : `Save ${cards.length} card${cards.length !== 1 ? 's' : ''} to My Flashcards`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
