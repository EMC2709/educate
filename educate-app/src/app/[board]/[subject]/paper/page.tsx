'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { PAST_PAPER_BANK } from '@/data/past-paper-bank';
import type { Question } from '@/types';
import { MessageContent } from '@/components/ui/MessageContent';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';

interface PaperInfo {
  paperTitle: string;
  year: string;
  tier: string;
  duration: string;
  totalMarks: number;
  component?: string | null;
  paperNumber?: string | null;
  board?: string | null;
}

type Mode = 'intro' | 'exam' | 'results';

// Detect whether a question needs MCQ, drawing, or written answer
function detectAnswerType(text: string): 'mcq' | 'drawing' | 'written' {
  // MCQ: 3+ lines matching "A) ...", "B) ...", "C) ..." or "A. " etc
  const mcqMatches = text.match(/(?:^|\n)\s*[A-D][.)]\s+\S/gm) ?? [];
  if (mcqMatches.length >= 3) return 'mcq';
  // Drawing questions
  if (/\b(draw|sketch|label|complete the diagram|plot|mark on|shade|circle the|underline)\b/i.test(text)) return 'drawing';
  return 'written';
}

// Parse MCQ question into stem + options
function parseMCQ(text: string): { stem: string; options: { letter: string; text: string }[] } {
  const lines = text.split('\n');
  const options: { letter: string; text: string }[] = [];
  const stemLines: string[] = [];
  for (const line of lines) {
    const m = line.match(/^\s*([A-D])[.)]\s+(.+)/);
    if (m) {
      options.push({ letter: m[1], text: m[2].trim() });
    } else if (options.length === 0) {
      stemLines.push(line);
    }
  }
  return { stem: stemLines.join('\n').trim(), options };
}

/* Lined answer box — draws CSS horizontal lines like real exam paper */
function LinedBox({
  value,
  onChange,
  lines,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  lines: number;
  placeholder?: string;
}) {
  const LINE_H = 32; // px per line
  const height = Math.max(lines, 2) * LINE_H;

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Lined background */}
      <div
        className="absolute inset-0 pointer-events-none rounded-sm"
        style={{
          backgroundImage: `repeating-linear-gradient(transparent, transparent ${LINE_H - 1}px, #d1d5db ${LINE_H - 1}px, #d1d5db ${LINE_H}px)`,
          backgroundPositionY: `${LINE_H - 1}px`,
        }}
      />
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? ''}
        className="absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none text-sm text-gray-900 px-1 py-0 font-[inherit] leading-8 placeholder-gray-300"
        style={{ lineHeight: `${LINE_H}px` }}
      />
    </div>
  );
}

/* MCQ answer selector */
function MCQBox({
  options,
  selected,
  onChange,
}: {
  options: { letter: string; text: string }[];
  selected: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2 mt-2">
      {options.map(opt => (
        <label
          key={opt.letter}
          className="flex items-start gap-3 cursor-pointer group"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          <div
            className="shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black mt-0.5 transition-all"
            style={
              selected === opt.letter
                ? { borderColor: '#6366f1', backgroundColor: '#6366f1', color: '#fff' }
                : { borderColor: '#9ca3af', backgroundColor: '#fff', color: '#6b7280' }
            }
            onClick={() => onChange(selected === opt.letter ? '' : opt.letter)}
          >
            {opt.letter}
          </div>
          <div
            className="flex-1 text-sm leading-relaxed py-0.5 px-3 rounded-lg border transition-all"
            style={
              selected === opt.letter
                ? { borderColor: '#6366f1', backgroundColor: '#eef2ff', color: '#3730a3' }
                : { borderColor: '#e5e7eb', backgroundColor: '#f9fafb', color: '#374151' }
            }
            onClick={() => onChange(selected === opt.letter ? '' : opt.letter)}
          >
            {opt.text}
          </div>
        </label>
      ))}
    </div>
  );
}

/* Drawing canvas — supports mouse and touch */
function DrawingCanvas({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const tool = useRef<'pen' | 'eraser'>('pen');
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>('pen');

  // Restore saved drawing
  useEffect(() => {
    if (!value || !canvasRef.current) return;
    const img = new window.Image();
    img.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = value;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e, canvasRef.current);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || !canvasRef.current || !lastPos.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvasRef.current);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    if (tool.current === 'eraser') {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 18;
    } else {
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    if (!drawing.current || !canvasRef.current) return;
    drawing.current = false;
    lastPos.current = null;
    onChange(canvasRef.current.toDataURL());
  };

  const clear = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange('');
  };

  const switchTool = (t: 'pen' | 'eraser') => {
    tool.current = t;
    setActiveTool(t);
  };

  return (
    <div className="mt-2" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Draw here:</span>
        <button
          onClick={() => switchTool('pen')}
          className="text-[10px] px-2 py-0.5 rounded border transition-all"
          style={activeTool === 'pen'
            ? { borderColor: '#374151', backgroundColor: '#374151', color: '#fff' }
            : { borderColor: '#d1d5db', backgroundColor: '#fff', color: '#6b7280' }}
        >✏️ Pen</button>
        <button
          onClick={() => switchTool('eraser')}
          className="text-[10px] px-2 py-0.5 rounded border transition-all"
          style={activeTool === 'eraser'
            ? { borderColor: '#374151', backgroundColor: '#374151', color: '#fff' }
            : { borderColor: '#d1d5db', backgroundColor: '#fff', color: '#6b7280' }}
        >◻ Eraser</button>
        <button
          onClick={clear}
          className="text-[10px] px-2 py-0.5 rounded border border-red-200 text-red-400 hover:bg-red-50 transition-all"
        >✕ Clear</button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={220}
        className="border border-gray-400 bg-white w-full cursor-crosshair touch-none rounded-sm"
        style={{ display: 'block' }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
    </div>
  );
}

export default function ExamPaperPage({
  params,
}: {
  params: Promise<{ board: string; subject: string }>;
}) {
  const { board: boardName, subject: rawSubject } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const board = EXAM_BOARDS[boardName];

  if (!board || !board.subjects.includes(subject)) notFound();

  const staticQuestions: Question[] = PAST_PAPER_BANK[subject] ?? [];

  const [questions, setQuestions] = useState<Question[]>(staticQuestions);
  const [loadingDb, setLoadingDb] = useState(false);
  const [mode, setMode] = useState<Mode>('intro');
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ''));
  const [paperInfo, setPaperInfo] = useState<PaperInfo>({
    paperTitle: 'Paper 1',
    year: '',
    tier: '',
    duration: '1 hour 45 minutes',
    totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
  });
  const [revealed, setRevealed] = useState<boolean[]>(() => questions.map(() => false));
  const [elapsed, setElapsed] = useState<number>(0);
  const [driveFileId, setDriveFileId] = useState<string | null>(null);
  const [pdfPanelOpen, setPdfPanelOpen] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('educate-paper-info');
      if (stored) {
        const info = JSON.parse(stored) as Partial<PaperInfo>;
        setPaperInfo(prev => ({
          ...prev,
          paperTitle: info.paperTitle ?? prev.paperTitle,
          year: info.year ?? prev.year,
          tier: info.tier ?? prev.tier,
          duration: info.duration ?? prev.duration,
          totalMarks: info.totalMarks ?? prev.totalMarks,
          component: info.component ?? null,
          paperNumber: info.paperNumber ?? null,
          board: info.board ?? boardName,
        }));

        const gcseType = `GCSE_${info.board ?? boardName}`;
        const year      = info.year ?? '';
        const component = info.component ?? null;
        const paperNum  = info.paperNumber ?? null;  // e.g. "Paper 1"

        setLoadingDb(true);

        type PaperMeta = { id: string; year: number | null; paper_number: string | null; total_questions: number };
        type QRow = { question_text: string; marks: number; topic: string; mark_scheme?: string; question_number: string | number | null };

        // Parse "25(c)" → [25, 'c', 0]   "18(iii)" → [18, 0, 3]   "3" → [3,0,0]
        const parseQN = (qn: string | number | null | undefined): [number, number, number] => {
          if (qn == null) return [9999, 0, 0];
          const s = String(qn);
          const m = s.match(/^(\d+)\s*(?:\(([a-z]|[ivx]+)\))?\s*(?:\(([a-z]|[ivx]+)\))?/i);
          if (!m) return [9999, 0, 0];
          const main = parseInt(m[1]) || 9999;
          const letterToNum = (x?: string) => {
            if (!x) return 0;
            if (/^[a-z]$/i.test(x)) return x.toLowerCase().charCodeAt(0) - 96;
            // roman numeral
            const roman: Record<string, number> = { i:1, ii:2, iii:3, iv:4, v:5, vi:6, vii:7, viii:8, ix:9, x:10 };
            return roman[x.toLowerCase()] ?? 0;
          };
          return [main, letterToNum(m[2]), letterToNum(m[3])];
        };

        // Resolve which paper to load
        const resolvePaperId = async (): Promise<string | null> => {
          // Direct ID passed from papers list — use it immediately
          const directId = (info as { paperId?: string }).paperId ?? null;
          if (directId) return directId;

          // Otherwise find the best match by examType + component + year
          const base = new URLSearchParams({ limit: '100', examType: gcseType });
          if (component) base.set('component', component);
          if (paperNum) base.set('paperNumber', paperNum);
          let papers: PaperMeta[] = await fetch(`/api/past-papers?${base}`)
            .then(r => r.ok ? r.json() : null).then(d => d?.papers ?? []);

          // Fallback: drop paperNumber (many papers have null paper_number)
          if (papers.length === 0 && paperNum) {
            const noPN = new URLSearchParams({ limit: '100', examType: gcseType });
            if (component) noPN.set('component', component);
            papers = await fetch(`/api/past-papers?${noPN}`)
              .then(r => r.ok ? r.json() : null).then(d => d?.papers ?? []);
          }
          // Final fallback: just examType
          if (papers.length === 0) {
            const noComp = new URLSearchParams({ limit: '100', examType: gcseType });
            papers = await fetch(`/api/past-papers?${noComp}`)
              .then(r => r.ok ? r.json() : null).then(d => d?.papers ?? []);
          }

          const withQs = papers.filter(p => p.total_questions > 0);
          if (withQs.length === 0) return null;

          // Prefer exact year match, then deterministic index so different years give different papers
          const yearInt = parseInt(year) || 0;
          const byYear = withQs.find(p => p.year === yearInt);
          if (byYear) return byYear.id;
          const offset = yearInt > 2000 ? (2025 - yearInt) : 0;
          return withQs[offset % withQs.length].id;
        };

        resolvePaperId()
          .then(async paperId => {
            if (!paperId) return [];
            const res = await fetch(`/api/past-papers?id=${paperId}`);
            if (!res.ok) return [];
            const data = await res.json() as { paper?: { drive_file_id?: string }; questions?: QRow[] };
            if (data.paper?.drive_file_id) setDriveFileId(data.paper.drive_file_id);
            return data.questions ?? [];
          })
          .then((qs: QRow[]) => {
            if (qs.length === 0) return;

            // Sort by parsed question_number (supports "25(c)", "18(iii)", etc.)
            qs.sort((a, b) => {
              const [a1, a2, a3] = parseQN(a.question_number);
              const [b1, b2, b3] = parseQN(b.question_number);
              return a1 - b1 || a2 - b2 || a3 - b3;
            });

            const dbQs: Question[] = qs.map(q => ({
              question: q.question_text,
              answer:   q.mark_scheme || '',
              marks:    q.marks || 1,
              hint:     q.topic || '',
            }));
            setQuestions(dbQs);
            setAnswers(dbQs.map(() => ''));
            setRevealed(dbQs.map(() => false));
          })
          .catch(() => {})
          .finally(() => setLoadingDb(false));
      }
    } catch {}
  }, [subject, boardName]);

  useEffect(() => {
    if (mode === 'exam') {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mode]);

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const attemptedCount = answers.filter((a, i) => {
    if (!a) return false;
    const qType = detectAnswerType(questions[i]?.question ?? '');
    if (qType === 'drawing') return a.startsWith('data:');
    return a.trim().length > 0;
  }).length;

  function getTimeSince() {
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (loadingDb) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8 pb-20 md:pb-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-400 text-sm">Loading {paperInfo.component ? `${paperInfo.component} ` : ''}questions…</p>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // ── NO QUESTIONS ───────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8 pb-20 md:pb-8">
          <div className="text-center">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-neutral-300 font-semibold mb-2">No past paper questions available yet</p>
            <p className="text-neutral-500 text-sm mb-6">
              Questions for {subject}{paperInfo.component ? ` (${paperInfo.component})` : ''} are being added soon.
            </p>
            <Link href={`/${boardName}/${encodeURIComponent(subject)}/papers`} className="text-indigo-400 hover:text-indigo-300 text-sm underline">
              ← Back to papers
            </Link>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (mode === 'intro') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-2xl mx-auto">
            <Link href={`/${boardName}/${encodeURIComponent(subject)}/papers`} className="text-neutral-500 hover:text-neutral-300 text-sm flex items-center gap-1 mb-8 no-underline transition-colors">
              ← Back to papers
            </Link>

            <div className="bg-neutral-900 border-2 border-indigo-500/30 rounded-2xl p-6 sm:p-8 mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">{boardName} · GCSE</p>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-1">{subject}</h1>
                  <p className="text-neutral-400 text-sm">
                    {paperInfo.paperTitle}
                    {paperInfo.year ? ` · ${paperInfo.year}` : ''}
                    {paperInfo.tier ? ` · ${paperInfo.tier} Tier` : ''}
                    {paperInfo.component ? ` · ${paperInfo.component}` : ''}
                  </p>
                </div>
                <span className="text-4xl shrink-0">📄</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-neutral-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-neutral-500 mb-1">Questions</p>
                  <p className="text-xl font-bold text-white">{questions.length}</p>
                </div>
                <div className="bg-neutral-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-neutral-500 mb-1">Total marks</p>
                  <p className="text-xl font-bold text-white">{totalMarks}</p>
                </div>
                <div className="bg-neutral-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-neutral-500 mb-1">Time</p>
                  <p className="text-sm font-bold text-white">{paperInfo.duration}</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Instructions</h2>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0">•</span>Answer all questions in the spaces provided</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0">•</span>Multiple-choice questions: select the best answer</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0">•</span>Drawing questions: use the canvas to sketch your answer</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0">•</span>Marks for each question are shown in the right margin</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0">•</span>Use the hint button if stuck — but try without first</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 shrink-0">•</span>After finishing, model answers appear for self-marking</li>
              </ul>
            </div>

            <button
              onClick={() => setMode('exam')}
              className="w-full py-4 rounded-2xl font-bold text-base text-white border-none cursor-pointer transition-opacity"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Start Paper ✏️
            </button>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // ── EXAM (paper sheet mode) ────────────────────────────────────────────────
  if (mode === 'exam') {
    return (
      <div className="flex min-h-screen bg-neutral-950">
        <Sidebar />
        <div className={`flex-1 overflow-y-auto pb-20 md:pb-0 transition-all duration-300 ${pdfPanelOpen && driveFileId ? 'md:mr-[45vw]' : ''}`}>

          {/* Sticky bar */}
          <div className="sticky top-0 z-20 bg-neutral-950/95 backdrop-blur border-b border-neutral-800 px-4 sm:px-6 py-2.5">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-neutral-500 hidden sm:block">{boardName} · {subject}</span>
                <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-md font-mono">
                  ⏱ {getTimeSince()}
                </span>
                <span className="text-xs text-neutral-500">
                  {attemptedCount}/{questions.length} answered
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {driveFileId && (
                  <button
                    onClick={() => setPdfPanelOpen(o => !o)}
                    className={`text-xs font-bold px-3 py-2 rounded-lg border-none cursor-pointer transition-colors ${
                      pdfPanelOpen
                        ? 'bg-amber-500 hover:bg-amber-400 text-black'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                    }`}
                    title="Show original PDF pages (figures, diagrams)"
                  >
                    {pdfPanelOpen ? 'Hide PDF' : '📄 PDF Figures'}
                  </button>
                )}
                <button
                  onClick={() => setMode('results')}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold px-4 py-2 rounded-lg border-none cursor-pointer transition-colors"
                >
                  Finish &amp; Mark →
                </button>
              </div>
            </div>
          </div>

          {/* Paper sheet */}
          <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6">
            <div className="bg-white shadow-2xl shadow-black/40 rounded-sm" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>

              {/* Paper header — mimics real exam paper */}
              <div className="border-b-4 border-black px-8 pt-8 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                      {boardName} · GCSE
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-wide leading-tight">
                      {subject}
                      {paperInfo.component ? <span className="block text-lg">{paperInfo.component}</span> : null}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                      {paperInfo.paperTitle}
                      {paperInfo.year ? ` · ${paperInfo.year}` : ''}
                      {paperInfo.tier ? ` · ${paperInfo.tier} Tier` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div className="text-xs text-gray-500 mb-2 space-y-0.5">
                      <div>Time allowed: <strong className="text-gray-800">{paperInfo.duration}</strong></div>
                      <div>Total marks: <strong className="text-gray-800">{totalMarks}</strong></div>
                    </div>
                  </div>
                </div>

                {/* Instructions box */}
                <div className="mt-4 border border-black p-3" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <p className="text-xs font-black uppercase tracking-wider text-black mb-1.5">Instructions</p>
                  <ul className="text-xs text-gray-700 space-y-0.5 list-none">
                    <li>• Use black ink or ball-point pen</li>
                    <li>• Answer <strong>all</strong> questions</li>
                    <li>• The marks for each question are shown in brackets <strong>[like this]</strong></li>
                  </ul>
                </div>
              </div>

              {/* Questions */}
              <div className="px-8 py-6 space-y-0">
                {questions.map((q, i) => {
                  const qType = detectAnswerType(q.question);
                  return (
                    <div key={i} className="py-5 border-b border-gray-200 last:border-b-0">
                      {/* Question row: number | text | marks */}
                      <div className="flex gap-4">
                        {/* Q number */}
                        <div className="shrink-0 w-8 text-right">
                          <span className="text-sm font-black text-black">{i + 1}</span>
                        </div>

                        {/* Question body */}
                        <div className="flex-1 min-w-0">
                          {/* Topic label */}
                          {q.hint && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                              {q.hint}
                            </p>
                          )}

                          {/* Question text — for MCQ the stem is rendered in the answer block */}
                          {qType !== 'mcq' && (
                            <div className="text-sm text-black leading-relaxed mb-4 prose prose-sm max-w-none prose-p:my-0">
                              <MessageContent content={q.question} />
                            </div>
                          )}

                          {/* Answer area — type depends on question content */}
                          {(() => {
                            if (qType === 'mcq') {
                              const { stem, options } = parseMCQ(q.question);
                              return (
                                <>
                                  {stem && (
                                    <div className="text-sm text-black leading-relaxed mb-3 prose prose-sm max-w-none prose-p:my-0">
                                      <MessageContent content={stem} />
                                    </div>
                                  )}
                                  <MCQBox
                                    options={options}
                                    selected={answers[i]}
                                    onChange={v => setAnswers(prev => prev.map((a, idx) => idx === i ? v : a))}
                                  />
                                </>
                              );
                            }
                            if (qType === 'drawing') {
                              return (
                                <DrawingCanvas
                                  value={answers[i]}
                                  onChange={v => setAnswers(prev => prev.map((a, idx) => idx === i ? v : a))}
                                />
                              );
                            }
                            // Default: lined text area
                            const linesForAnswer = Math.max(4, q.marks * 4);
                            return (
                              <div className="border border-gray-400 bg-white" style={{ borderRadius: 0 }}>
                                <LinedBox
                                  value={answers[i]}
                                  onChange={v => setAnswers(prev => prev.map((a, idx) => idx === i ? v : a))}
                                  lines={linesForAnswer}
                                  placeholder="Write your answer here…"
                                />
                              </div>
                            );
                          })()}

                          {/* Hint */}
                          <details className="mt-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                            <summary className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer list-none transition-colors">
                              💡 Show hint
                            </summary>
                            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 mt-1 leading-relaxed">
                              {q.hint}
                            </p>
                          </details>
                        </div>

                        {/* Marks in right margin */}
                        <div className="shrink-0 w-14 text-right pt-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>
                          <span className="text-xs text-gray-600 font-semibold whitespace-nowrap">
                            [{q.marks}]
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Paper footer */}
              <div className="border-t-2 border-black px-8 py-4 flex items-center justify-between" style={{ fontFamily: 'Arial, sans-serif' }}>
                <p className="text-xs text-gray-500">
                  {boardName} · {subject} · {paperInfo.paperTitle}{paperInfo.year ? ` · ${paperInfo.year}` : ''}
                </p>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">End of questions</p>
              </div>
            </div>

            {/* Finish button below paper */}
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-500 mb-4">
                {attemptedCount} of {questions.length} questions answered
              </p>
              <button
                onClick={() => setMode('results')}
                className="px-8 py-4 rounded-2xl font-bold text-base text-white border-none cursor-pointer transition-opacity"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Finish &amp; See Model Answers →
              </button>
            </div>
          </div>
        </div>

        {/* PDF Reference Drawer — original paper pages for figures/diagrams */}
        {driveFileId && (
          <div
            className={`fixed top-0 right-0 h-screen bg-neutral-900 border-l border-neutral-800 shadow-2xl transition-transform duration-300 z-30 ${
              pdfPanelOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ width: 'min(92vw, 720px)' }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">📄</span>
                <span className="text-xs text-neutral-300 font-semibold">
                  Original Paper — Figures &amp; Diagrams
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://drive.google.com/file/d/${driveFileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-neutral-400 hover:text-white transition-colors"
                  title="Open in new tab"
                >
                  ↗ Open
                </a>
                <button
                  onClick={() => setPdfPanelOpen(false)}
                  className="text-neutral-400 hover:text-white bg-transparent border-none cursor-pointer text-lg leading-none"
                  aria-label="Close PDF panel"
                >
                  ×
                </button>
              </div>
            </div>
            <iframe
              src={`https://drive.google.com/file/d/${driveFileId}/preview`}
              className="w-full border-none"
              style={{ height: 'calc(100vh - 40px)' }}
              title="Original paper PDF"
              allow="autoplay"
            />
          </div>
        )}

        {/* Mobile-only: full-screen overlay when PDF panel open */}
        {driveFileId && pdfPanelOpen && (
          <div
            onClick={() => setPdfPanelOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 z-20"
          />
        )}

        <MobileNav />
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-8">

        {/* Results banner */}
        <div className="bg-neutral-950 border-b border-neutral-800 px-4 sm:px-6 py-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-3xl mb-2">📋</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-1">Paper Complete</h1>
            <p className="text-neutral-400 text-sm">
              {subject} · {boardName} · {paperInfo.paperTitle}
              {paperInfo.component ? ` · ${paperInfo.component}` : ''}
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-neutral-500">Answered</p>
                <p className="text-lg font-bold text-white">{attemptedCount}/{questions.length}</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-neutral-500">Total marks available</p>
                <p className="text-lg font-bold text-indigo-400">{totalMarks}</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-neutral-500">Time taken</p>
                <p className="text-lg font-bold text-white">{getTimeSince()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Marked paper sheet */}
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6">
          <div className="bg-white shadow-2xl shadow-black/40 rounded-sm" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>

            <div className="border-b-4 border-black px-8 pt-6 pb-4 flex items-center justify-between" style={{ fontFamily: 'Arial, sans-serif' }}>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-black">
                  {subject}{paperInfo.component ? ` — ${paperInfo.component}` : ''} · {paperInfo.paperTitle}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Model answers — for self-marking only</p>
              </div>
              <p className="text-xs font-bold uppercase text-gray-500">Marked copy</p>
            </div>

            <div className="px-8 py-6 space-y-0">
              {questions.map((q, i) => {
                const userAnswer = answers[i];
                const qType = detectAnswerType(q.question);
                const isAttempted = qType === 'drawing'
                  ? userAnswer.startsWith('data:')
                  : userAnswer.trim().length > 0;
                const isRevealed = revealed[i];

                return (
                  <div key={i} className="py-5 border-b border-gray-200 last:border-b-0">
                    <div className="flex gap-4">
                      {/* Q number */}
                      <div className="shrink-0 w-8 text-right pt-0.5">
                        <span className={`text-sm font-black ${isAttempted ? 'text-emerald-600' : 'text-gray-400'}`}>{i + 1}</span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Question */}
                        <div className="text-sm text-black leading-relaxed prose prose-sm max-w-none prose-p:my-0">
                          <MessageContent content={q.question} />
                        </div>

                        {/* Student answer */}
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ fontFamily: 'Arial, sans-serif', color: isAttempted ? '#059669' : '#9ca3af' }}>
                            Your answer
                          </p>
                          {(() => {
                            if (!isAttempted) {
                              return (
                                <div className="border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-400 italic" style={{ fontFamily: 'Arial, sans-serif' }}>
                                  Not attempted
                                </div>
                              );
                            }
                            if (qType === 'mcq') {
                              return (
                                <div className="border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-gray-800">
                                  Selected: {userAnswer}
                                </div>
                              );
                            }
                            if (qType === 'drawing') {
                              return userAnswer.startsWith('data:') ? (
                                <img src={userAnswer} alt="Your drawing" className="border border-emerald-300 max-w-full" style={{ maxHeight: 200 }} />
                              ) : (
                                <div className="border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-400 italic" style={{ fontFamily: 'Arial, sans-serif' }}>No drawing made</div>
                              );
                            }
                            return (
                              <div className="border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {userAnswer}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Model answer */}
                        {isRevealed ? (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1.5" style={{ fontFamily: 'Arial, sans-serif' }}>
                              Model answer
                            </p>
                            <div className="border-l-4 border-indigo-400 bg-indigo-50 px-4 py-3 text-sm text-gray-800 leading-relaxed">
                              <MessageContent content={q.answer} />
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRevealed(prev => prev.map((v, idx) => idx === i ? true : v))}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 bg-transparent border-none cursor-pointer transition-colors"
                            style={{ fontFamily: 'Arial, sans-serif' }}
                          >
                            ✓ Reveal model answer
                          </button>
                        )}
                      </div>

                      {/* Marks */}
                      <div className="shrink-0 w-14 text-right pt-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>
                        <span className="text-xs text-gray-600 font-semibold">[{q.marks}]</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t-2 border-black px-8 py-4" style={{ fontFamily: 'Arial, sans-serif' }}>
              <p className="text-xs text-gray-500 text-center">
                Total marks available: <strong>{totalMarks}</strong> · Practised on Educate
              </p>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <button
              onClick={() => {
                setAnswers(questions.map(() => ''));
                setRevealed(questions.map(() => false));
                setMode('intro');
              }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-neutral-300 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 cursor-pointer transition-colors"
            >
              ↺ Redo paper
            </button>
            <Link
              href={`/${boardName}/${encodeURIComponent(subject)}/papers`}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 text-center no-underline transition-colors flex items-center justify-center"
            >
              ← Back to papers
            </Link>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
