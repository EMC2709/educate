'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { QUESTION_BANK } from '@/data/question-bank';
import { shuffle } from '@/lib/shuffle';
import type { Question } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'lobby' | 'waiting' | 'placing' | 'playing' | 'question' | 'finished';
type CellState = 'empty' | 'ship' | 'hit' | 'miss';
interface MCQData { options: string[]; correctIndex: number }
interface ShipInfo { name: string; size: number; cells: number[] }

interface BattleshipsState {
  x_ships: number[][];
  o_ships: number[][];
  x_shots: number[];
  o_shots: number[];
  x_placed: boolean;
  o_placed: boolean;
  current_turn: string;
  winner: string | null;
  q_index: number;
}

interface GameSession {
  id: string; room_code: string; player_x: string; player_x_name: string;
  player_o: string | null; player_o_name: string | null;
  board_state: BattleshipsState; current_turn: string; status: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SHIP_DEFS = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 },
];
const TOTAL_SHIP_CELLS = SHIP_DEFS.reduce((s, d) => s + d.size, 0);
const ROW_LABELS = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i));
const COL_LABELS = Array.from({ length: 10 }, (_, i) => String(i + 1));
const LABELS = ['A', 'B', 'C', 'D'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getShortQuestions(subject: string): Question[] {
  const bank = QUESTION_BANK[subject];
  return bank && Array.isArray(bank.short) ? [...bank.short] : [];
}
const AVAILABLE_SUBJECTS = Object.keys(QUESTION_BANK).filter(s => getShortQuestions(s).length >= 5);

function randomPlaceShips(sizes: number[]): number[][] {
  const occupied = Array(100).fill(false);
  const ships: number[][] = [];
  for (const size of sizes) {
    let placed = false;
    while (!placed) {
      const horiz = Math.random() > 0.5;
      const row = Math.floor(Math.random() * (horiz ? 10 : 11 - size));
      const col = Math.floor(Math.random() * (horiz ? 11 - size : 10));
      const cells = Array.from({ length: size }, (_, i) => horiz ? row * 10 + col + i : (row + i) * 10 + col);
      if (cells.every(c => !occupied[c])) {
        cells.forEach(c => (occupied[c] = true));
        ships.push(cells); placed = true;
      }
    }
  }
  return ships;
}

function buildShipInfo(shipCells: number[][]): ShipInfo[] {
  return shipCells.map((cells, i) => ({ name: SHIP_DEFS[i]?.name ?? `Ship ${i + 1}`, size: cells.length, cells }));
}

function generateMCQ(correct: string, pool: Question[]): MCQData {
  const correctClean = correct.split('\n')[0].replace(/^\d+[\.\)]\s*/, '').trim().slice(0, 80);
  const wrongs: string[] = [];
  const seen = new Set([correctClean.toLowerCase()]);
  for (const q of pool) {
    for (const c of [...(q.acceptedAnswers ?? []), q.answer.split('\n')[0].trim()]) {
      const t = c.trim().slice(0, 80);
      if (t.length > 3 && t.length < 80 && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase()); wrongs.push(t); if (wrongs.length >= 15) break;
      }
    }
    if (wrongs.length >= 15) break;
  }
  const distractors = shuffle(wrongs).slice(0, 3);
  while (distractors.length < 3)
    distractors.push(['Insufficient data', 'Not applicable', 'None of these'][distractors.length]);
  const opts = shuffle([correctClean, ...distractors]);
  return { options: opts, correctIndex: opts.indexOf(correctClean) };
}

function awardXP(isCorrect: boolean) {
  fetch('/api/award-xp', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marksAwarded: isCorrect ? 1 : 0, questionType: 'short', attempted: true }) })
    .then(r => r.json()).then((d: { xpGained?: number }) => {
      if ((d.xpGained ?? 0) > 0) window.dispatchEvent(new Event('educate-xp-updated'));
    }).catch(() => {});
}

// ─── Mini grid component ──────────────────────────────────────────────────────

function MiniGrid({ grid, onCellClick, clickable }: {
  grid: CellState[]; onCellClick?: (i: number) => void; clickable?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <div style={{ display: 'inline-block' }}>
        <div style={{ display: 'flex', marginBottom: 2, paddingLeft: 20 }}>
          {COL_LABELS.map(l => <div key={l} style={{ width: 26, textAlign: 'center', fontSize: 9, color: '#52525b', flexShrink: 0 }}>{l}</div>)}
        </div>
        {ROW_LABELS.map((rowLabel, row) => (
          <div key={row} style={{ display: 'flex', marginBottom: 2, alignItems: 'center' }}>
            <div style={{ width: 18, fontSize: 9, color: '#52525b', flexShrink: 0 }}>{rowLabel}</div>
            {Array.from({ length: 10 }, (_, col) => {
              const i = row * 10 + col;
              const state = grid[i];
              let bg = '#1a1a1a', border = '#2a2a2a', emoji = '';
              if (state === 'hit') { bg = 'rgba(239,68,68,0.25)'; border = '#ef4444'; emoji = '🔥'; }
              else if (state === 'miss') { bg = 'rgba(99,102,241,0.08)'; border = '#3f3f46'; emoji = '💦'; }
              else if (state === 'ship') { bg = 'rgba(99,102,241,0.2)'; border = 'rgba(99,102,241,0.5)'; }
              const canClick = clickable && state === 'empty';
              return (
                <button key={col} onClick={() => canClick && onCellClick?.(i)}
                  title={`${rowLabel}${col + 1}`}
                  style={{ width: 26, height: 26, backgroundColor: bg, border: `1px solid ${border}`,
                    borderRadius: 3, cursor: canClick ? 'crosshair' : 'default', fontSize: 11,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginRight: 2, padding: 0, transition: 'background 0.15s' }}>
                  {emoji}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BattleshipsOnlinePage() {
  const { user } = useUser();
  const [subject, setSubject] = useState(AVAILABLE_SUBJECTS[0] ?? 'Biology');
  const [phase, setPhase] = useState<Phase>('setup');
  const [gameId, setGameId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerRole, setPlayerRole] = useState<'X' | 'O'>('X');
  const [polledGame, setPolledGame] = useState<GameSession | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Ship placement
  const [myShipCells, setMyShipCells] = useState<number[][]>([]);
  const [myGrid, setMyGrid] = useState<CellState[]>(Array(100).fill('empty'));
  const [myShips, setMyShips] = useState<ShipInfo[]>([]);

  // Combat state (derived from polledGame)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pending, setPending] = useState<{ cell: number; mcq: MCQData; q: Question } | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameIdRef = useRef('');
  const playerRoleRef = useRef<'X' | 'O'>('X');
  const phaseRef = useRef<Phase>('setup');

  const stopPoll = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);
  useEffect(() => () => stopPoll(), [stopPoll]);

  const startPolling = useCallback((gid: string) => {
    stopPoll();
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/game?id=${gid}`);
        if (!res.ok) return;
        const game = await res.json() as GameSession;
        setPolledGame(game);
      } catch { /* ignore */ }
    }, 2000);
  }, [stopPoll]);

  // React to polled state
  useEffect(() => {
    if (!polledGame) return;
    const bs = polledGame.board_state as BattleshipsState;
    const cur = phaseRef.current;

    // Opponent joined — both need to confirm ships placed
    if (cur === 'waiting' && polledGame.status === 'active') {
      phaseRef.current = 'placing';
      setPhase('placing');
      setStatusMsg('Opponent joined! Place your ships then confirm.');
    }

    // Both placed → start playing
    if ((cur === 'placing' || cur === 'waiting') && bs.x_placed && bs.o_placed) {
      const qs = shuffle(getShortQuestions(polledGame.board_state?.['subject' as keyof BattleshipsState] as string || subject));
      setQuestions(qs);
      phaseRef.current = 'playing';
      setPhase('playing');
      setStatusMsg(bs.current_turn === playerRoleRef.current ? 'Your turn — click a cell to attack!' : "Opponent's turn…");
    }

    // Playing: sync state
    if (cur === 'playing' || cur === 'question') {
      if (bs.winner) {
        stopPoll();
        phaseRef.current = 'finished';
        setPhase('finished');
      } else {
        const isMyTurn = bs.current_turn === playerRoleRef.current;
        if (cur !== 'question') setStatusMsg(isMyTurn ? 'Your turn — click a cell to attack!' : "Opponent's turn…");
      }
    }
  }, [polledGame, subject, stopPoll]);

  const autoPlace = useCallback(() => {
    const cells = randomPlaceShips(SHIP_DEFS.map(s => s.size));
    const grid: CellState[] = Array(100).fill('empty');
    cells.forEach(ship => ship.forEach(c => (grid[c] = 'ship')));
    setMyShipCells(cells); setMyGrid(grid); setMyShips(buildShipInfo(cells));
  }, []);

  const handleCreate = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/game', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject, playerId: user?.id ?? 'anon',
          playerName: user?.fullName ?? user?.firstName ?? 'Captain',
          gameType: 'battleships',
          initialState: { x_ships: [], o_ships: [], x_shots: [], o_shots: [], x_placed: false, o_placed: false, current_turn: 'X', winner: null, q_index: 0, subject },
        }),
      });
      const data = await res.json() as { gameId?: string; roomCode?: string; error?: string };
      if (data.error) throw new Error(data.error);
      setGameId(data.gameId!); gameIdRef.current = data.gameId!;
      setRoomCode(data.roomCode!);
      setPlayerRole('X'); playerRoleRef.current = 'X';
      phaseRef.current = 'waiting';
      setPhase('waiting');
      startPolling(data.gameId!);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/game', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: joinCode.trim(), playerId: user?.id ?? 'anon',
          playerName: user?.fullName ?? user?.firstName ?? 'Captain' }),
      });
      const data = await res.json() as GameSession & { error?: string };
      if (data.error) throw new Error(data.error);
      setGameId(data.id); gameIdRef.current = data.id;
      setRoomCode(data.room_code);
      setPlayerRole('O'); playerRoleRef.current = 'O';
      setPolledGame(data);
      phaseRef.current = 'placing';
      setPhase('placing');
      startPolling(data.id);
    } catch (e) { setError(e instanceof Error ? e.message : 'Game not found'); }
    finally { setLoading(false); }
  };

  const confirmShips = async () => {
    if (myShipCells.length === 0) return;
    const role = playerRoleRef.current;
    const key_ships = role === 'X' ? 'x_ships' : 'o_ships';
    const key_placed = role === 'X' ? 'x_placed' : 'o_placed';
    await fetch('/api/game', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: gameIdRef.current, merge: true, boardState: { [key_ships]: myShipCells, [key_placed]: true } }),
    }).catch(() => {});
    setStatusMsg('Ships placed! Waiting for opponent…');
  };

  const handleCellClick = useCallback((cell: number) => {
    if (!polledGame) return;
    const bs = polledGame.board_state as BattleshipsState;
    if (bs.current_turn !== playerRoleRef.current) return;
    const myShots = playerRoleRef.current === 'X' ? (bs.x_shots ?? []) : (bs.o_shots ?? []);
    if (myShots.includes(cell)) return;
    const qi = (bs.q_index ?? 0) % Math.max(1, questions.length);
    const q = questions[qi] ?? questions[0];
    if (!q) return;
    const mcq = generateMCQ(q.answer, questions);
    setPending({ cell, mcq, q });
    setSelectedOption(null);
    setAnswerResult(null);
    phaseRef.current = 'question';
    setPhase('question');
  }, [polledGame, questions]);

  const handleFire = useCallback(() => {
    if (!pending || selectedOption === null || answerResult !== null || !polledGame) return;
    const isCorrect = selectedOption === pending.mcq.correctIndex;
    setAnswerResult(isCorrect ? 'correct' : 'wrong');
    awardXP(isCorrect);

    setTimeout(async () => {
      const role = playerRoleRef.current;
      const bs = polledGame.board_state as BattleshipsState;
      const oppShips: number[][] = role === 'X' ? (bs.o_ships ?? []) : (bs.x_ships ?? []);
      const myShots: number[] = [...(role === 'X' ? (bs.x_shots ?? []) : (bs.o_shots ?? []))];
      myShots.push(pending.cell);
      const isHit = isCorrect && oppShips.some((ship: number[]) => ship.includes(pending.cell));

      // Check win: all opponent cells hit
      const allOppCells = oppShips.flat();
      const allSunk = allOppCells.length > 0 && allOppCells.every((c: number) => myShots.includes(c));
      const nextTurn = role === 'X' ? 'O' : 'X';
      const newQIndex = (bs.q_index ?? 0) + 1;

      const shots_key = role === 'X' ? 'x_shots' : 'o_shots';
      await fetch('/api/game', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameIdRef.current, merge: true,
          boardState: { [shots_key]: myShots, current_turn: nextTurn, winner: allSunk ? role : null, q_index: newQIndex },
          ...(allSunk ? { status: 'finished' } : {}),
        }),
      }).catch(() => {});

      const hitMsg = isHit ? (allSunk ? '🎯 Hit — all ships sunk! YOU WIN!' : '🎯 Hit!') : (isCorrect ? '💦 Miss — empty water' : '💨 Wrong answer — shot missed');
      setStatusMsg(hitMsg);
      setPending(null); setSelectedOption(null); setAnswerResult(null);
      phaseRef.current = 'playing';
      setPhase('playing');
    }, 1200);
  }, [pending, selectedOption, answerResult, polledGame]);

  // Build display grids from polledGame
  const bs = polledGame?.board_state as BattleshipsState | undefined;
  const role = playerRole;
  const myShots: number[] = bs ? (role === 'X' ? (bs.x_shots ?? []) : (bs.o_shots ?? [])) : [];
  const oppShots: number[] = bs ? (role === 'X' ? (bs.o_shots ?? []) : (bs.x_shots ?? [])) : [];
  const oppShipCells: number[][] = bs ? (role === 'X' ? (bs.o_ships ?? []) : (bs.x_ships ?? [])) : [];

  // My grid: show my ships + where opponent has shot
  const myDisplayGrid: CellState[] = Array(100).fill('empty');
  myShipCells.forEach(ship => ship.forEach(c => (myDisplayGrid[c] = 'ship')));
  oppShots.forEach(c => {
    if (myDisplayGrid[c] === 'ship') myDisplayGrid[c] = 'hit';
    else myDisplayGrid[c] = 'miss';
  });

  // Enemy grid: show only hits/misses of MY shots (hide their ships)
  const enemyDisplayGrid: CellState[] = Array(100).fill('empty');
  myShots.forEach(c => {
    const isHit = oppShipCells.some(ship => ship.includes(c));
    enemyDisplayGrid[c] = isHit ? 'hit' : 'miss';
  });

  const isMyTurn = bs?.current_turn === role;
  const opName = role === 'X' ? (polledGame?.player_o_name ?? 'Opponent') : (polledGame?.player_x_name ?? 'Opponent');
  const myHits = myShots.filter(c => oppShipCells.some(s => s.includes(c))).length;
  const oppHits = oppShots.filter(c => myShipCells.some(s => s.flat().includes(c))).length;
  const winner = bs?.winner;

  // ── Setup ──────────────────────────────────────────────────────────────────

  if (phase === 'setup') return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Link href="/games/battleships" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Battleships (Solo)</Link>
        <div className="text-center mt-6 mb-6">
          <div className="text-5xl mb-2">🚢⚔️🚢</div>
          <h1 className="text-2xl font-bold text-white mb-1">Battleships — Online</h1>
          <p className="text-neutral-500 text-sm">Challenge a friend — answer MCQs to fire!</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
          <label className="text-xs text-neutral-400 font-semibold mb-2 block uppercase tracking-wide">Subject</label>
          <select value={subject} onChange={e => setSubject(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500">
            {AVAILABLE_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {error && <p className="text-rose-400 text-sm text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={handleCreate} disabled={loading}
            className="py-4 rounded-2xl font-bold text-white border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)' }}>
            {loading ? '…' : '🚀 Create Room'}
          </button>
          <div className="flex gap-2">
            <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ROOM CODE" maxLength={6}
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm font-mono outline-none focus:border-indigo-500 uppercase"
              onKeyDown={e => e.key === 'Enter' && handleJoin()} />
            <button onClick={handleJoin} disabled={loading || !joinCode.trim()}
              className="px-4 py-2 rounded-xl font-bold text-white border-none cursor-pointer disabled:opacity-40"
              style={{ backgroundColor: '#4f46e5' }}>
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Waiting for opponent ───────────────────────────────────────────────────

  if (phase === 'waiting') return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-md mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-5xl mb-4 animate-bounce">⚓</div>
        <h2 className="text-xl font-bold text-white mb-2">Waiting for opponent…</h2>
        <p className="text-neutral-500 text-sm mb-6">Share your room code</p>
        <div className="bg-neutral-900 border-2 border-indigo-500/40 rounded-2xl px-8 py-5 text-center mb-6">
          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-widest">Room Code</p>
          <p className="text-4xl font-black font-mono tracking-widest text-indigo-400">{roomCode}</p>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(roomCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="text-sm text-neutral-400 hover:text-white bg-neutral-800 border border-neutral-700 rounded-xl px-5 py-2 cursor-pointer transition-colors">
          {copied ? '✓ Copied!' : '📋 Copy Code'}
        </button>
      </div>
    </div>
  );

  // ── Place ships ────────────────────────────────────────────────────────────

  if (phase === 'placing') return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="text-center mt-4 mb-5">
          <h2 className="text-xl font-bold text-white">Place Your Fleet</h2>
          <p className="text-neutral-500 text-sm mt-1">{statusMsg || 'Position your ships before battle!'}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-neutral-300">Your Fleet</p>
            <button onClick={autoPlace}
              className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 rounded-lg px-3 py-1 cursor-pointer hover:bg-indigo-500/30">
              Auto-Place
            </button>
          </div>
          <div className="flex justify-center"><MiniGrid grid={myGrid} /></div>
          {myShips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
              {myShips.map(s => <span key={s.name} className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5">{s.name} ({s.size})</span>)}
            </div>
          )}
        </div>
        <button onClick={confirmShips} disabled={myShipCells.length === 0}
          className="w-full py-3.5 rounded-2xl font-bold text-white border-none cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)' }}>
          {myShipCells.length === 0 ? 'Auto-place ships first' : '⚓ Confirm Fleet & Ready Up!'}
        </button>
        {bs?.x_placed !== bs?.o_placed && (
          <p className="text-center text-xs text-neutral-600 mt-3">Waiting for opponent to place their ships…</p>
        )}
      </div>
    </div>
  );

  // ── Finished ───────────────────────────────────────────────────────────────

  if (phase === 'finished') {
    const iWon = winner === role;
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
        <Navbar />
        <div className="max-w-md mx-auto p-4 sm:p-6 text-center">
          <div className="mt-10 mb-6">
            {iWon ? (
              <><div className="text-6xl mb-2">🏆</div>
                <h2 className="text-2xl font-bold text-emerald-400">Victory!</h2>
                <p className="text-neutral-400 text-sm mt-1">You sunk all enemy ships!</p></>
            ) : (
              <><div className="text-6xl mb-2">💀</div>
                <h2 className="text-2xl font-bold text-rose-400">Defeat!</h2>
                <p className="text-neutral-400 text-sm mt-1">{opName} sunk your fleet.</p></>
            )}
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6 text-left space-y-3">
            {[
              ['Your hits', String(myHits), '#4ade80'],
              ['Opponent hits', String(oppHits), '#f87171'],
              ['Subject', subject, '#d4d4d4'],
            ].map(([label, val, color]) => (
              <div key={label as string} className="flex justify-between">
                <span className="text-neutral-400 text-sm">{label}</span>
                <span className="font-bold text-sm" style={{ color: color as string }}>{val}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { phaseRef.current = 'setup'; setPhase('setup'); setPolledGame(null); setMyShipCells([]); setMyGrid(Array(100).fill('empty')); setMyShips([]); setJoinCode(''); stopPoll(); }}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm border-none cursor-pointer hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)' }}>
              🔄 Play Again
            </button>
            <Link href="/games" className="flex-1 py-3 rounded-xl font-bold text-white text-sm no-underline flex items-center justify-center hover:bg-neutral-700 transition-colors"
              style={{ backgroundColor: '#262626' }}>
              🏠 Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing / question ─────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-neutral-600 font-mono">{roomCode}</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isMyTurn ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-xs text-neutral-400">{isMyTurn ? 'Your turn' : `${opName}'s turn`}</span>
          </div>
          <span className="text-xs text-neutral-500">vs {opName}</span>
        </div>

        {statusMsg && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 mb-3 text-center">
            <p className="text-xs text-neutral-400">{statusMsg}</p>
          </div>
        )}

        {/* Score row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-emerald-400">{myHits}</div>
            <div className="text-xs text-neutral-500">Your hits</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-neutral-400 mb-0.5">{TOTAL_SHIP_CELLS} cells</div>
            <div className="text-xs text-neutral-600">to sink all</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-rose-400">{oppHits}</div>
            <div className="text-xs text-neutral-500">Opponent hits</div>
          </div>
        </div>

        {/* Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />Your Fleet
            </h3>
            <div className="flex justify-center"><MiniGrid grid={myDisplayGrid} /></div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />Enemy Waters
              {isMyTurn && phase === 'playing' && (
                <span className="text-xs text-emerald-400 font-normal ml-auto animate-pulse">Click to attack!</span>
              )}
            </h3>
            <div className="flex justify-center">
              <MiniGrid grid={enemyDisplayGrid} onCellClick={handleCellClick} clickable={isMyTurn && phase === 'playing'} />
            </div>
          </div>
        </div>

        {/* MCQ */}
        {phase === 'question' && pending && (
          <div className="bg-neutral-900 border-2 border-indigo-500/40 rounded-2xl p-5 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5 font-semibold">{subject}</span>
              <span className="text-xs text-neutral-500">Answer correctly to fire on target!</span>
            </div>
            <p className="text-sm text-white font-medium mb-4 leading-relaxed">{pending.q.question}</p>
            {answerResult === null ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {pending.mcq.options.map((opt, idx) => (
                    <button key={idx} onClick={() => setSelectedOption(idx)}
                      className="text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer flex items-center gap-2"
                      style={{ backgroundColor: selectedOption === idx ? 'rgba(99,102,241,0.2)' : '#1a1a1a',
                        borderColor: selectedOption === idx ? '#6366f1' : '#2a2a2a',
                        color: selectedOption === idx ? '#a5b4fc' : '#d4d4d8' }}>
                      <span className="font-bold text-neutral-500">{LABELS[idx]}.</span>{opt}
                    </button>
                  ))}
                </div>
                <button onClick={handleFire} disabled={selectedOption === null}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-500 hover:bg-indigo-400 transition-colors">
                  🔫 Fire!
                </button>
              </>
            ) : (
              <div className={`text-center py-5 rounded-xl ${answerResult === 'correct' ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
                <span className="text-3xl">{answerResult === 'correct' ? '🎯' : '💨'}</span>
                <p className={`text-sm font-bold mt-2 ${answerResult === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {answerResult === 'correct' ? 'Correct — shot fired!' : 'Wrong — shot missed!'}
                </p>
                <p className="text-xs text-neutral-600 mt-2">Resolving…</p>
              </div>
            )}
          </div>
        )}

        {!isMyTurn && phase === 'playing' && (
          <div className="text-center py-6">
            <div className="text-3xl mb-2 animate-pulse">⏳</div>
            <p className="text-neutral-500 text-sm">{opName} is taking their shot…</p>
          </div>
        )}
      </div>
    </div>
  );
}
