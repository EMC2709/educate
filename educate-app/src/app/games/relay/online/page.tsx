'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { QUESTION_BANK } from '@/data/question-bank';
import { shuffle } from '@/lib/shuffle';
import type { Question } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type LobbyState = 'choose' | 'waiting' | 'active' | 'finished';
type Difficulty = 'easy' | 'hard';
interface MCQ { options: string[]; correctIndex: number }
interface RaceQuestion { question: Question; mcq: MCQ }
interface RelayBoardState {
  seed: number; subject: string; difficulty: string;
  x_correct: number; x_done: number;
  o_correct: number; o_done: number;
  winner: string | null;
}
interface GameSession {
  id: string; room_code: string; player_x: string; player_x_name: string;
  player_o: string | null; player_o_name: string | null;
  board_state: RelayBoardState; current_turn: string; status: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG = {
  easy: { total: 20, needed: 10 },
  hard: { total: 15, needed: 12 },
} as const;
const LABELS = ['A', 'B', 'C', 'D'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getShort(subject: string): Question[] {
  const bank = QUESTION_BANK[subject];
  return bank && Array.isArray(bank.short) ? bank.short : [];
}
const SUBJECTS = Object.keys(QUESTION_BANK).filter(s => getShort(s).length >= 5);

function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  const rng = seededRng(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateMCQ(correct: string, pool: Question[]): MCQ {
  const clean = (s: string) => s.split('\n')[0].replace(/^\d+[\.\)]\s*/, '').trim().slice(0, 80);
  const correctClean = clean(correct);
  const wrongs: string[] = [];
  const seen = new Set([correctClean.toLowerCase()]);
  for (const q of pool) {
    for (const c of [...(q.acceptedAnswers ?? []), q.answer.split('\n')[0].trim()]) {
      const t = c.trim().slice(0, 80);
      if (t.length > 3 && t.length < 80 && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase()); wrongs.push(t);
        if (wrongs.length >= 15) break;
      }
    }
    if (wrongs.length >= 15) break;
  }
  const distractors = shuffle(wrongs).slice(0, 3);
  while (distractors.length < 3)
    distractors.push(['Not applicable', 'Cannot be determined', 'None of the above'][distractors.length]);
  const opts = shuffle([correctClean, ...distractors]);
  return { options: opts, correctIndex: opts.indexOf(correctClean) };
}

function buildQuestions(subject: string, total: number, seed: number): RaceQuestion[] {
  const pool = seededShuffle(getShort(subject), seed);
  return pool.slice(0, Math.min(total, pool.length)).map(q => ({
    question: q, mcq: generateMCQ(q.answer, pool),
  }));
}

function awardXP(isCorrect: boolean) {
  fetch('/api/award-xp', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marksAwarded: isCorrect ? 1 : 0, questionType: 'short', attempted: true }),
  }).then(r => r.json()).then((d: { xpGained?: number }) => {
    if ((d.xpGained ?? 0) > 0) window.dispatchEvent(new Event('educate-xp-updated'));
  }).catch(() => {});
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RelayOnlinePage() {
  const { user } = useUser();
  const [subject, setSubject] = useState(SUBJECTS[0] ?? 'Biology');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [lobbyState, setLobbyState] = useState<LobbyState>('choose');
  const [gameId, setGameId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerRole, setPlayerRole] = useState<'X' | 'O'>('X');
  const [polledGame, setPolledGame] = useState<GameSession | null>(null);
  const [questions, setQuestions] = useState<RaceQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [won, setWon] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameIdRef = useRef('');
  const playerRoleRef = useRef<'X' | 'O'>('X');
  const lobbyRef = useRef<LobbyState>('choose');

  const cfg = DIFFICULTY_CONFIG[difficulty];

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

  // React to polled game updates
  useEffect(() => {
    if (!polledGame) return;
    const bs = polledGame.board_state as RelayBoardState;
    const currentLobby = lobbyRef.current;

    if (currentLobby === 'waiting' && polledGame.status === 'active') {
      const diff = (bs.difficulty as Difficulty) || difficulty;
      const diffCfg = DIFFICULTY_CONFIG[diff];
      const qs = buildQuestions(bs.subject || subject, diffCfg.total, bs.seed);
      setQuestions(qs);
      lobbyRef.current = 'active';
      setLobbyState('active');
    }

    if (currentLobby === 'active' && bs.winner) {
      stopPoll();
      setWon(bs.winner === playerRoleRef.current);
      lobbyRef.current = 'finished';
      setLobbyState('finished');
    }
  }, [polledGame, difficulty, subject, stopPoll]);

  const handleCreate = async () => {
    setLoading(true); setError('');
    try {
      const seed = Math.floor(Math.random() * 9000000) + 1000000;
      const res = await fetch('/api/game', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject, playerId: user?.id ?? 'anon',
          playerName: user?.fullName ?? user?.firstName ?? 'Racer',
          gameType: 'relay',
          initialState: { seed, subject, difficulty, x_correct: 0, x_done: 0, o_correct: 0, o_done: 0, winner: null },
        }),
      });
      const data = await res.json() as { gameId?: string; roomCode?: string; error?: string };
      if (data.error) throw new Error(data.error);
      setGameId(data.gameId!); gameIdRef.current = data.gameId!;
      setRoomCode(data.roomCode!);
      setPlayerRole('X'); playerRoleRef.current = 'X';
      lobbyRef.current = 'waiting';
      setLobbyState('waiting');
      startPolling(data.gameId!);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to create game'); }
    finally { setLoading(false); }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/game', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: joinCode.trim(),
          playerId: user?.id ?? 'anon',
          playerName: user?.fullName ?? user?.firstName ?? 'Racer',
        }),
      });
      const data = await res.json() as GameSession & { error?: string };
      if (data.error) throw new Error(data.error);
      const gid = data.id;
      setGameId(gid); gameIdRef.current = gid;
      setRoomCode(data.room_code);
      setPlayerRole('O'); playerRoleRef.current = 'O';
      const bs = data.board_state as RelayBoardState;
      const diff = (bs.difficulty as Difficulty) || difficulty;
      const diffCfg = DIFFICULTY_CONFIG[diff];
      setDifficulty(diff);
      const qs = buildQuestions(bs.subject || subject, diffCfg.total, bs.seed);
      setQuestions(qs);
      setPolledGame(data);
      lobbyRef.current = 'active';
      setLobbyState('active');
      startPolling(gid);
    } catch (e) { setError(e instanceof Error ? e.message : 'Game not found — check the code'); }
    finally { setLoading(false); }
  };

  const patchProgress = useCallback(async (newCorrect: number, newDone: number) => {
    const role = playerRoleRef.current;
    await fetch('/api/game', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: gameIdRef.current, merge: true,
        boardState: role === 'X'
          ? { x_correct: newCorrect, x_done: newDone }
          : { o_correct: newCorrect, o_done: newDone },
      }),
    }).catch(() => {});
  }, []);

  const patchWinner = useCallback(async (winner: string) => {
    await fetch('/api/game', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: gameIdRef.current, merge: true, boardState: { winner }, status: 'finished' }),
    }).catch(() => {});
  }, []);

  const selectOption = useCallback(async (idx: number) => {
    if (revealed || !questions[qIndex]) return;
    setSelected(idx); setRevealed(true);
    const isCorrect = idx === questions[qIndex].mcq.correctIndex;
    awardXP(isCorrect);
    const newCorrect = isCorrect ? correct + 1 : correct;
    const newDone = qIndex + 1;
    if (isCorrect) setCorrect(newCorrect);
    else setWrong(w => w + 1);
    await patchProgress(newCorrect, newDone);

    if (isCorrect && newCorrect >= cfg.needed) {
      await patchWinner(playerRoleRef.current);
      stopPoll();
      setWon(true);
      setTimeout(() => { lobbyRef.current = 'finished'; setLobbyState('finished'); }, 1400);
      return;
    }
    setTimeout(() => {
      const next = qIndex + 1;
      if (next >= questions.length) {
        stopPoll(); setWon(false); lobbyRef.current = 'finished'; setLobbyState('finished');
      } else { setQIndex(next); setSelected(null); setRevealed(false); }
    }, 1400);
  }, [revealed, questions, qIndex, correct, cfg.needed, patchProgress, patchWinner, stopPoll]);

  // Derived opponent data
  const bs = polledGame?.board_state as RelayBoardState | undefined;
  const myCorrect = correct;
  const opCorrect = playerRole === 'X' ? (bs?.o_correct ?? 0) : (bs?.x_correct ?? 0);
  const myProgress = Math.min((myCorrect / cfg.needed) * 100, 100);
  const opProgress = Math.min((opCorrect / cfg.needed) * 100, 100);
  const myLeft = Math.max(4, Math.min(myProgress, 88));
  const opLeft = Math.max(4, Math.min(opProgress, 88));
  const opName = playerRole === 'X'
    ? (polledGame?.player_o_name ?? 'Opponent')
    : (polledGame?.player_x_name ?? 'Opponent');
  const currentQ = questions[qIndex] ?? null;

  // ── Choose ─────────────────────────────────────────────────────────────────

  if (lobbyState === 'choose') return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Link href="/games/relay" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Relay (Solo)</Link>
        <div className="text-center mt-6 mb-6">
          <div className="text-5xl mb-2">&#127939;&#127939;</div>
          <h1 className="text-2xl font-bold text-white mb-1">Relay Race — Online</h1>
          <p className="text-neutral-500 text-sm">Race a friend! Same questions, first to {cfg.needed} wins.</p>
        </div>

        {/* Subject */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-4">
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-3">Subject</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {SUBJECTS.map(s => (
              <button key={s} onClick={() => setSubject(s)}
                className="text-xs py-2 px-3 rounded-lg border-2 bg-transparent cursor-pointer transition-all text-left truncate"
                style={subject === s
                  ? { borderColor: '#22c55e', backgroundColor: '#22c55e1a', color: '#22c55e' }
                  : { borderColor: '#262626', color: '#9ca3af' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-3">Difficulty</p>
          <div className="grid grid-cols-2 gap-3">
            {(['easy', 'hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className="rounded-xl border-2 p-4 text-left cursor-pointer transition-all bg-transparent"
                style={difficulty === d ? { borderColor: '#22c55e', backgroundColor: '#22c55e0d' } : { borderColor: '#262626' }}>
                <div className="text-xl mb-1">{d === 'easy' ? '🔥' : '⚡'}</div>
                <p className="font-bold text-white text-sm capitalize">{d}</p>
                <p className="text-neutral-500 text-xs mt-0.5">Need {DIFFICULTY_CONFIG[d].needed} correct</p>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-rose-400 text-sm text-center mb-4">{error}</p>}

        {/* Create or Join */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <button onClick={handleCreate} disabled={loading}
            className="py-4 rounded-2xl font-bold text-white border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
            {loading ? '…' : '🚀 Create Room'}
          </button>
          <div className="flex gap-2">
            <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ROOM CODE"
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm font-mono outline-none focus:border-emerald-500 uppercase"
              maxLength={6} onKeyDown={e => e.key === 'Enter' && handleJoin()} />
            <button onClick={handleJoin} disabled={loading || !joinCode.trim()}
              className="px-4 py-2 rounded-xl font-bold text-white border-none cursor-pointer disabled:opacity-40"
              style={{ backgroundColor: '#16a34a' }}>
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Waiting for opponent ───────────────────────────────────────────────────

  if (lobbyState === 'waiting') return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-md mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-5xl mb-4 animate-bounce">⏳</div>
        <h2 className="text-xl font-bold text-white mb-2">Waiting for opponent…</h2>
        <p className="text-neutral-500 text-sm mb-6">Share this code with your friend</p>
        <div className="bg-neutral-900 border-2 border-emerald-500/40 rounded-2xl px-8 py-5 text-center mb-6">
          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-widest">Room Code</p>
          <p className="text-4xl font-black font-mono tracking-widest" style={{ color: '#4ade80' }}>{roomCode}</p>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(roomCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="text-sm text-neutral-400 hover:text-white bg-neutral-800 border border-neutral-700 rounded-xl px-5 py-2 cursor-pointer transition-colors mb-4">
          {copied ? '✓ Copied!' : '📋 Copy Code'}
        </button>
        <p className="text-neutral-600 text-xs">{subject} · {difficulty} · {cfg.needed} to win</p>
      </div>
    </div>
  );

  // ── Finished ───────────────────────────────────────────────────────────────

  if (lobbyState === 'finished') return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-md mx-auto p-4 sm:p-6 text-center">
        <div className="mt-12 mb-6">
          {won === null ? null : won ? (
            <><div className="text-6xl mb-2">🏆</div>
              <div className="text-3xl mb-2">🎉🏃🎉</div>
              <h2 className="text-2xl font-bold text-white">You crossed first!</h2>
              <p className="text-emerald-400 text-sm mt-1">Outstanding performance!</p></>
          ) : (
            <><div className="text-6xl mb-2">🥈</div>
              <h2 className="text-2xl font-bold text-white">So close!</h2>
              <p className="text-neutral-500 text-sm mt-1">Your opponent just edged you out.</p></>
          )}
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6 text-left space-y-3">
          {[
            ['You', `${correct} correct`, '#4ade80'],
            ['Opponent', `${opCorrect} correct`, '#d4d4d4'],
            ['Subject', subject, '#d4d4d4'],
          ].map(([label, val, color]) => (
            <div key={label as string} className="flex justify-between">
              <span className="text-neutral-400 text-sm">{label}</span>
              <span className="font-bold text-sm" style={{ color: color as string }}>{val}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { lobbyRef.current = 'choose'; setLobbyState('choose'); setQIndex(0); setCorrect(0); setWrong(0); setWon(null); setPolledGame(null); setJoinCode(''); }}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm border-none cursor-pointer hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
            🔄 Play Again
          </button>
          <Link href="/games" className="flex-1 py-3 rounded-xl font-bold text-white text-sm no-underline flex items-center justify-center cursor-pointer hover:bg-neutral-700 transition-colors"
            style={{ backgroundColor: '#262626' }}>
            🏠 Games
          </Link>
        </div>
      </div>
    </div>
  );

  // ── Active: racing ─────────────────────────────────────────────────────────

  const correctNeeded = Math.max(0, cfg.needed - correct);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-neutral-600 font-mono">{roomCode}</span>
          <span className="text-xs text-neutral-500">vs {opName}</span>
        </div>

        {/* Track — You */}
        <div className="mb-2">
          <p className="text-xs text-neutral-500 mb-1 flex justify-between">
            <span>You ({subject})</span>
            <span className="text-emerald-400 font-bold">{myCorrect}/{cfg.needed}</span>
          </p>
          <div className="relative rounded-xl overflow-hidden"
            style={{ background: 'linear-gradient(180deg,#14532d,#15803d 50%,#166534)', height: '64px', border: '1px solid #166534' }}>
            {[0.5].map(pos => (
              <div key={pos} className="absolute w-full pointer-events-none"
                style={{ top: `${pos * 100}%`, height: '1px',
                  background: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.1) 0,rgba(255,255,255,0.1) 8px,transparent 8px,transparent 16px)' }} />
            ))}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">🏁</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">🏆</div>
            <div className="absolute top-1/2 -translate-y-1/2 text-2xl select-none"
              style={{ left: `calc(${myLeft}% - 12px)`, transition: 'left 0.5s ease',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
                animation: revealed ? 'none' : 'runnerBounce 0.6s ease-in-out infinite alternate' }}>
              🏃
            </div>
            <div className="absolute bottom-0 left-0 h-1 rounded-full"
              style={{ width: `${myProgress}%`, background: 'linear-gradient(90deg,#4ade80,#86efac)', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Track — Opponent */}
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-1 flex justify-between">
            <span>{opName}</span>
            <span className="text-sky-400 font-bold">{opCorrect}/{cfg.needed}</span>
          </p>
          <div className="relative rounded-xl overflow-hidden"
            style={{ background: 'linear-gradient(180deg,#1e3a5f,#1e40af 50%,#1d4ed8)', height: '64px', border: '1px solid #1d4ed8' }}>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">🏁</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">🏆</div>
            <div className="absolute top-1/2 -translate-y-1/2 text-2xl select-none"
              style={{ left: `calc(${opLeft}% - 12px)`, transition: 'left 0.5s ease',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>
              🏃
            </div>
            <div className="absolute bottom-0 left-0 h-1 rounded-full"
              style={{ width: `${opProgress}%`, background: 'linear-gradient(90deg,#38bdf8,#7dd3fc)', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { val: correct, label: 'Correct', color: '#4ade80' },
            { val: wrong, label: 'Wrong', color: '#f87171' },
            { val: correctNeeded, label: 'Needed', color: '#fbbf24' },
            { val: questions.length - qIndex, label: 'Left', color: '#d4d4d4' },
          ].map(({ val, label, color }) => (
            <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-center">
              <div className="font-bold text-base" style={{ color }}>{val}</div>
              <div className="text-neutral-600 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Question */}
        {currentQ && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <div className="flex justify-between mb-3">
              <span className="text-xs text-neutral-500">Q {qIndex + 1} of {questions.length}</span>
              <span className="text-xs text-neutral-600">{subject}</span>
            </div>
            <p className="text-white text-sm font-medium leading-relaxed mb-4">{currentQ.question.question}</p>
            <div className="space-y-2">
              {currentQ.mcq.options.map((opt, i) => {
                const isCorrectOpt = i === currentQ.mcq.correctIndex;
                const isChosen = selected === i;
                let bg = '#1a1a1a', border = '#2a2a2a', textColor = '#d4d4d4';
                if (revealed) {
                  if (isCorrectOpt) { bg = '#14532d'; border = '#22c55e'; textColor = '#4ade80'; }
                  else if (isChosen) { bg = '#450a0a'; border = '#ef4444'; textColor = '#fca5a5'; }
                }
                return (
                  <button key={i} onClick={() => selectOption(i)} disabled={revealed}
                    className="w-full text-left rounded-xl border-2 px-4 py-3 text-sm font-medium cursor-pointer transition-all disabled:cursor-default flex items-center gap-3"
                    style={{ backgroundColor: bg, borderColor: border, color: textColor }}>
                    <span className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: revealed && isCorrectOpt ? '#22c55e' : revealed && isChosen ? '#ef4444' : '#2a2a2a',
                        color: revealed && (isCorrectOpt || isChosen) ? '#fff' : '#9ca3af' }}>
                      {LABELS[i]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {revealed && isCorrectOpt && <span className="text-emerald-400">✓</span>}
                    {revealed && isChosen && !isCorrectOpt && <span className="text-red-400">✗</span>}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <div className="mt-4 rounded-xl px-4 py-3 text-center text-sm font-semibold"
                style={selected === currentQ.mcq.correctIndex
                  ? { backgroundColor: '#14532d', color: '#4ade80' }
                  : { backgroundColor: '#450a0a', color: '#fca5a5' }}>
                {selected === currentQ.mcq.correctIndex ? '✅ Correct! Keep running!' : `❌ Wrong! Answer: ${currentQ.mcq.options[currentQ.mcq.correctIndex]}`}
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes runnerBounce { from { transform: translateY(-50%) translateY(0px); } to { transform: translateY(-50%) translateY(-5px); } }`}</style>
    </div>
  );
}
