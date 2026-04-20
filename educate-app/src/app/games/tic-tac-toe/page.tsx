'use client';

import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { QUESTION_BANK } from '@/data/question-bank';
import { shuffle } from '@/lib/shuffle';
import type { Question } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

type Player = 'X' | 'O';
type CellState = '' | 'X' | 'O';
type GamePhase = 'setup' | 'playing' | 'question' | 'finished';
type GameMode = 'pick' | 'local' | 'online-create' | 'online-join' | 'online-waiting' | 'online-game';

interface GameSession {
  id: string;
  room_code: string;
  player_x: string;
  player_x_name: string;
  player_o: string | null;
  player_o_name: string | null;
  board_state: CellState[];
  current_turn: string;
  winner: string | null;
  subject: string;
  status: 'waiting' | 'active' | 'finished';
}

interface MCQState {
  options: string[];
  correctIndex: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: CellState[]): CellState {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
  }
  return '';
}

function isDraw(board: CellState[]): boolean {
  return board.every(c => c !== '') && !checkWinner(board);
}

function getSubjectQuestions(subject: string): Question[] {
  const bank = QUESTION_BANK[subject];
  if (!bank) return [];
  const all: Question[] = [];
  if (Array.isArray(bank.short)) all.push(...bank.short);
  if (Array.isArray(bank.mid)) all.push(...bank.mid);
  return all;
}

const AVAILABLE_SUBJECTS = Object.keys(QUESTION_BANK).filter(s => getSubjectQuestions(s).length >= 9);

function seededShuffle<T>(arr: T[], seed: string): T[] {
  let hash = 0;
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  let state = hash >>> 0;
  const rand = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getOrCreatePlayerId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('educate-player-id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('educate-player-id', id);
  }
  return id;
}

function generateMCQ(correct: string, allQuestions: Question[]): MCQState {
  const correctClean = correct.split('\n')[0].replace(/^\d+[\.\)]\s*/, '').trim().slice(0, 80);

  const wrongs: string[] = [];
  const seen = new Set([correctClean.toLowerCase()]);
  for (const q of allQuestions) {
    const candidates = [
      ...(q.acceptedAnswers ?? []),
      q.answer.split('\n')[0].replace(/^\d+[\.\)]\s*/, '').trim(),
    ];
    for (const c of candidates) {
      const clean = c.trim().slice(0, 80);
      if (clean.length > 3 && clean.length < 80 && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        wrongs.push(clean);
        if (wrongs.length >= 20) break;
      }
    }
    if (wrongs.length >= 20) break;
  }

  const shuffledWrongs = shuffle(wrongs);
  const distractors = shuffledWrongs.slice(0, 3);
  while (distractors.length < 3) {
    distractors.push(['Not enough information', 'Cannot be determined', 'None of the above'][distractors.length]);
  }

  const opts = shuffle([correctClean, ...distractors]);
  return { options: opts, correctIndex: opts.indexOf(correctClean) };
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function TicTacToeInner() {
  const searchParams = useSearchParams();
  const joinCodeFromUrl = searchParams.get('join');

  // ── Local game state ──
  const [mode, setMode] = useState<GameMode>(joinCodeFromUrl ? 'online-join' : 'pick');
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [subject, setSubject] = useState(AVAILABLE_SUBJECTS[0] ?? 'Biology');
  const [playerNames, setPlayerNames] = useState({ X: 'Player 1', O: 'Player 2' });
  const [board, setBoard] = useState<CellState[]>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [mcq, setMcq] = useState<MCQState | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  const [winner, setWinner] = useState<CellState | 'draw' | null>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  // ── Online game state ──
  const [onlineName, setOnlineName] = useState('');
  const [joinCode, setJoinCode] = useState(joinCodeFromUrl ?? '');
  const [onlineSubject, setOnlineSubject] = useState(AVAILABLE_SUBJECTS[0] ?? 'Biology');
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [myPlayerId, setMyPlayerId] = useState('');
  const [mySymbol, setMySymbol] = useState<Player>('X');
  const [onlineError, setOnlineError] = useState('');
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [dbUnavailable, setDbUnavailable] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [onlineQuestions, setOnlineQuestions] = useState<Question[]>([]);
  const [onlineSelectedCell, setOnlineSelectedCell] = useState<number | null>(null);
  const [onlineCurrentQuestion, setOnlineCurrentQuestion] = useState<Question | null>(null);
  const [onlineMcq, setOnlineMcq] = useState<MCQState | null>(null);
  const [onlineSelectedOption, setOnlineSelectedOption] = useState<number | null>(null);
  const [onlineAnswerResult, setOnlineAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  const [onlineResolving, setOnlineResolving] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMyPlayerId(getOrCreatePlayerId());
  }, []);

  // ── Polling ──
  const startPolling = useCallback((code: string, onUpdate: (session: GameSession) => void) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/game?code=${code}`);
        if (res.ok) {
          const data = await res.json();
          onUpdate(data as GameSession);
        }
      } catch {
        // ignore transient errors
      }
    }, 2000);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  // ── Online: Create game ──
  const handleCreateGame = async () => {
    if (!onlineName.trim()) { setOnlineError('Enter your name first'); return; }
    setOnlineLoading(true);
    setOnlineError('');
    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: onlineSubject, playerName: onlineName.trim(), playerId: myPlayerId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 503 || (data.error as string)?.includes('DATABASE_URL')) {
          setDbUnavailable(true);
        } else {
          setOnlineError(data.error ?? 'Failed to create game');
        }
        return;
      }
      const qs = seededShuffle(getSubjectQuestions(onlineSubject), data.gameId as string);
      setOnlineQuestions(qs);
      setMySymbol('X');
      const sessionRes = await fetch(`/api/game?id=${data.gameId}`);
      const session = await sessionRes.json() as GameSession;
      setGameSession(session);
      setMode('online-waiting');
      startPolling(data.roomCode as string, (updated) => {
        setGameSession(updated);
        if (updated.status === 'active') {
          stopPolling();
          setMode('online-game');
        }
      });
    } catch {
      setOnlineError('Network error. Please try again.');
    } finally {
      setOnlineLoading(false);
    }
  };

  // ── Online: Join game ──
  const handleJoinGame = async () => {
    if (!onlineName.trim()) { setOnlineError('Enter your name first'); return; }
    if (!joinCode.trim()) { setOnlineError('Enter the room code'); return; }
    setOnlineLoading(true);
    setOnlineError('');
    try {
      const res = await fetch('/api/game', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: joinCode.trim(), playerName: onlineName.trim(), playerId: myPlayerId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 503 || (data.error as string)?.includes('DATABASE_URL')) {
          setDbUnavailable(true);
        } else {
          setOnlineError(data.error ?? 'Failed to join game');
        }
        return;
      }
      const session = data as GameSession;
      const qs = seededShuffle(getSubjectQuestions(session.subject), session.id);
      setOnlineQuestions(qs);
      setMySymbol('O');
      setGameSession(session);
      setMode('online-game');
      startPolling(session.room_code, (updated) => {
        setGameSession(updated);
        if (updated.status === 'finished') stopPolling();
      });
    } catch {
      setOnlineError('Network error. Please try again.');
    } finally {
      setOnlineLoading(false);
    }
  };

  // ── Online: click a cell ──
  const handleOnlineCellClick = (i: number) => {
    if (!gameSession) return;
    const onlineBoard = gameSession.board_state as CellState[];
    if (onlineBoard[i]) return;
    if (gameSession.current_turn !== mySymbol) return;
    if (gameSession.status !== 'active') return;
    if (onlineCurrentQuestion) return;
    const filledCount = onlineBoard.filter(c => c !== '').length;
    const q = onlineQuestions[filledCount % onlineQuestions.length];
    const newMcq = generateMCQ(q.answer, onlineQuestions);
    setOnlineSelectedCell(i);
    setOnlineCurrentQuestion(q);
    setOnlineMcq(newMcq);
    setOnlineSelectedOption(null);
    setOnlineAnswerResult(null);
  };

  // ── Online: select MCQ option ──
  const handleOnlineSelectOption = async (i: number) => {
    if (!onlineCurrentQuestion || !onlineMcq || onlineSelectedOption !== null || onlineResolving || !gameSession) return;
    setOnlineSelectedOption(i);
    setOnlineResolving(true);

    const isCorrect = i === onlineMcq.correctIndex;
    setOnlineAnswerResult(isCorrect ? 'correct' : 'wrong');

    // Award XP (fire-and-forget)
    fetch('/api/award-xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marksAwarded: isCorrect ? onlineCurrentQuestion.marks : 0, questionType: 'short', attempted: true }),
    }).then(r => r.json()).then(data => {
      if ((data as { xpGained?: number }).xpGained ?? 0 > 0) {
        window.dispatchEvent(new Event('educate-xp-updated'));
      }
    }).catch(() => {});

    setTimeout(async () => {
      const currentBoard = [...(gameSession.board_state as CellState[])];
      let newBoard = currentBoard;
      const nextTurn: Player = mySymbol === 'X' ? 'O' : 'X';
      let newWinner: string | null = null;
      let newStatus: string = gameSession.status;

      if (isCorrect && onlineSelectedCell !== null) {
        newBoard = [...currentBoard];
        newBoard[onlineSelectedCell] = mySymbol;
        const w = checkWinner(newBoard);
        if (w) {
          newWinner = w;
          newStatus = 'finished';
        } else if (isDraw(newBoard)) {
          newWinner = 'draw';
          newStatus = 'finished';
        }
      }

      try {
        await fetch('/api/game', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameId: gameSession.id,
            boardState: newBoard,
            currentTurn: nextTurn,
            winner: newWinner,
            status: newStatus,
          }),
        });
        const refreshed = await fetch(`/api/game?id=${gameSession.id}`);
        if (refreshed.ok) {
          setGameSession(await refreshed.json() as GameSession);
        }
      } catch {
        // ignore
      }

      setOnlineSelectedCell(null);
      setOnlineCurrentQuestion(null);
      setOnlineMcq(null);
      setOnlineSelectedOption(null);
      setOnlineAnswerResult(null);
      setOnlineResolving(false);

      if (newStatus === 'finished') {
        stopPolling();
      } else if (nextTurn !== mySymbol) {
        startPolling(gameSession.room_code, (updated) => {
          setGameSession(updated);
          if (updated.status === 'finished') stopPolling();
        });
      }
    }, 1500);
  };

  // ── Copy share link ──
  const copyShareLink = async () => {
    if (!gameSession) return;
    const url = `${window.location.origin}/games/tic-tac-toe?join=${gameSession.room_code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // fallback
    }
  };

  // ─── Local game logic ──────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const qs = shuffle(getSubjectQuestions(subject));
    if (qs.length < 9) return;
    setQuestions(qs);
    setQuestionIndex(0);
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setWinner(null);
    setWinLine(null);
    setScores({ X: 0, O: 0 });
    setPhase('playing');
  }, [subject]);

  const selectCell = (i: number) => {
    if (board[i] || phase !== 'playing' || winner) return;
    const q = questions[questionIndex % questions.length];
    const newMcq = generateMCQ(q.answer, questions);
    setSelectedCell(i);
    setCurrentQuestion(q);
    setMcq(newMcq);
    setSelectedOption(null);
    setAnswerResult(null);
    setQuestionIndex(prev => prev + 1);
    setPhase('question');
  };

  const handleSelectOption = (i: number) => {
    if (!currentQuestion || !mcq || selectedOption !== null) return;
    setSelectedOption(i);

    const isCorrect = i === mcq.correctIndex;
    setAnswerResult(isCorrect ? 'correct' : 'wrong');

    // Award XP (fire-and-forget)
    fetch('/api/award-xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marksAwarded: isCorrect ? currentQuestion.marks : 0, questionType: 'short', attempted: true }),
    }).then(r => r.json()).then(data => {
      if ((data as { xpGained?: number }).xpGained ?? 0 > 0) {
        window.dispatchEvent(new Event('educate-xp-updated'));
      }
    }).catch(() => {});

    setTimeout(() => {
      if (isCorrect && selectedCell !== null) {
        const newBoard = [...board];
        newBoard[selectedCell] = currentPlayer;
        setBoard(newBoard);
        setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));

        const w = checkWinner(newBoard);
        if (w) {
          setWinner(w);
          setWinLine(WIN_LINES.find(([a, b, c]) => newBoard[a] === w && newBoard[b] === w && newBoard[c] === w) ?? null);
          setPhase('finished');
          return;
        }
        if (isDraw(newBoard)) {
          setWinner('draw');
          setPhase('finished');
          return;
        }
      }
      setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
      setSelectedOption(null);
      setAnswerResult(null);
      setMcq(null);
      setCurrentQuestion(null);
      setPhase('playing');
    }, 1500);
  };

  const playerColors = { X: '#6366f1', O: '#f43f5e' };

  // ─── MCQ button renderer ───────────────────────────────────────────────────

  const renderMCQButtons = (
    options: string[],
    correctIndex: number,
    pickedIndex: number | null,
    onSelect: (i: number) => void,
    disabled: boolean,
  ) => (
    <div className="mt-4">
      {(['A', 'B', 'C', 'D'] as const).map((label, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          disabled={pickedIndex !== null || disabled}
          className={`w-full text-left py-3 px-4 rounded-xl text-sm border-2 cursor-pointer transition-all mb-2
            ${pickedIndex === null
              ? 'border-neutral-700 bg-neutral-800 text-white hover:border-indigo-500 hover:bg-indigo-500/10'
              : pickedIndex === i && i === correctIndex
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                : pickedIndex === i
                  ? 'border-rose-500 bg-rose-500/15 text-rose-400'
                  : i === correctIndex && pickedIndex !== null
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-500'
            }`}
          style={{ fontWeight: 600 }}
        >
          <span className="text-neutral-500 mr-2 font-bold">{label}.</span>
          {options[i] ?? ''}
        </button>
      ))}
    </div>
  );

  // ─── DB Unavailable screen ─────────────────────────────────────────────────

  if (dbUnavailable) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
          <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Game Zone</Link>
          <div className="mt-10 bg-neutral-900 border border-amber-500/40 rounded-2xl p-8 text-center">
            <span className="text-4xl">&#128274;</span>
            <h2 className="text-xl font-bold text-white mt-4 mb-2">Database not connected</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Online multiplayer needs a database. Set <code className="text-amber-400 bg-neutral-800 px-1 py-0.5 rounded">DATABASE_URL</code> in your environment and redeploy.
            </p>
            <button
              onClick={() => { setDbUnavailable(false); setMode('pick'); }}
              className="mt-6 bg-neutral-700 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer hover:bg-neutral-600"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Page ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Game Zone</Link>

        <div className="text-center mt-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">&#10062; Noughts &amp; Crosses</h1>
          <p className="text-neutral-500 text-sm">Answer questions to claim squares!</p>
        </div>

        {/* ── Mode picker ──────────────────────────────────────────────── */}
        {mode === 'pick' && (
          <div className="space-y-3">
            <button
              onClick={() => setMode('local')}
              className="w-full bg-neutral-900 border border-neutral-800 hover:border-indigo-500/60 rounded-2xl p-5 text-left cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">&#128101;</span>
                <div>
                  <p className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">Local &mdash; Same Device</p>
                  <p className="text-neutral-500 text-sm mt-0.5">Pass and play with a friend on one screen</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setMode('online-create')}
              className="w-full bg-neutral-900 border border-neutral-800 hover:border-indigo-500/60 rounded-2xl p-5 text-left cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">&#127760;</span>
                <div>
                  <p className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">Online &mdash; Play with a Friend</p>
                  <p className="text-neutral-500 text-sm mt-0.5">Share a code and play from different devices</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ── Local setup ────────────────────────────────────────────── */}
        {mode === 'local' && phase === 'setup' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => setMode('pick')} className="text-neutral-500 hover:text-white cursor-pointer bg-transparent border-none text-sm p-0">&#8592;</button>
              <h3 className="text-lg font-bold text-white">Local Game Setup</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-xs text-indigo-400 font-semibold mb-1 block">Player X</label>
                <input
                  value={playerNames.X}
                  onChange={e => setPlayerNames(p => ({ ...p, X: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-rose-400 font-semibold mb-1 block">Player O</label>
                <input
                  value={playerNames.O}
                  onChange={e => setPlayerNames(p => ({ ...p, O: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <label className="text-xs text-neutral-400 font-semibold mb-2 block">Subject</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 max-h-[200px] overflow-y-auto">
              {AVAILABLE_SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className="text-xs py-2 px-3 rounded-lg border-2 bg-transparent cursor-pointer transition-all text-left truncate"
                  style={
                    subject === s
                      ? { borderColor: '#6366f1', backgroundColor: '#6366f122', color: '#6366f1' }
                      : { borderColor: '#2a2a2a', color: '#9ca3af' }
                  }
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white border-none rounded-xl py-3.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
            >
              Start Game
            </button>
          </div>
        )}

        {/* ── Online: Create game setup ─────────────────────────────── */}
        {mode === 'online-create' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => { setMode('pick'); setOnlineError(''); }} className="text-neutral-500 hover:text-white cursor-pointer bg-transparent border-none text-sm p-0">&#8592;</button>
              <h3 className="text-lg font-bold text-white">Create Online Game</h3>
            </div>

            <label className="text-xs text-neutral-400 font-semibold mb-1 block">Your name</label>
            <input
              value={onlineName}
              onChange={e => setOnlineName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 mb-4"
            />

            <label className="text-xs text-neutral-400 font-semibold mb-2 block">Subject</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5 max-h-[200px] overflow-y-auto">
              {AVAILABLE_SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => setOnlineSubject(s)}
                  className="text-xs py-2 px-3 rounded-lg border-2 bg-transparent cursor-pointer transition-all text-left truncate"
                  style={
                    onlineSubject === s
                      ? { borderColor: '#6366f1', backgroundColor: '#6366f122', color: '#6366f1' }
                      : { borderColor: '#2a2a2a', color: '#9ca3af' }
                  }
                >
                  {s}
                </button>
              ))}
            </div>

            {onlineError && <p className="text-red-400 text-xs mb-3">{onlineError}</p>}

            <button
              onClick={handleCreateGame}
              disabled={onlineLoading}
              className="w-full bg-indigo-500 text-white border-none rounded-xl py-3.5 font-bold text-sm cursor-pointer hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {onlineLoading ? 'Creating...' : 'Create Game'}
            </button>

            <div className="mt-4 pt-4 border-t border-neutral-800">
              <p className="text-xs text-neutral-500 mb-2 text-center">Already have a code?</p>
              <button
                onClick={() => { setMode('online-join'); setOnlineError(''); }}
                className="w-full bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-xl py-2.5 text-sm font-semibold cursor-pointer hover:bg-neutral-700 transition-colors"
              >
                Join a Game
              </button>
            </div>
          </div>
        )}

        {/* ── Online: Join game setup ───────────────────────────────── */}
        {mode === 'online-join' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => { setMode('online-create'); setOnlineError(''); }} className="text-neutral-500 hover:text-white cursor-pointer bg-transparent border-none text-sm p-0">&#8592;</button>
              <h3 className="text-lg font-bold text-white">Join Online Game</h3>
            </div>

            {joinCodeFromUrl && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-2.5 mb-4">
                <p className="text-indigo-400 text-sm font-medium">Joining game <span className="font-bold">{joinCodeFromUrl}</span></p>
              </div>
            )}

            <label className="text-xs text-neutral-400 font-semibold mb-1 block">Room code</label>
            <input
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABC123"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 mb-4 font-mono tracking-widest text-center text-lg uppercase"
              maxLength={6}
            />

            <label className="text-xs text-neutral-400 font-semibold mb-1 block">Your name</label>
            <input
              value={onlineName}
              onChange={e => setOnlineName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 mb-4"
            />

            {onlineError && <p className="text-red-400 text-xs mb-3">{onlineError}</p>}

            <button
              onClick={handleJoinGame}
              disabled={onlineLoading}
              className="w-full bg-indigo-500 text-white border-none rounded-xl py-3.5 font-bold text-sm cursor-pointer hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {onlineLoading ? 'Joining...' : 'Join Game'}
            </button>
          </div>
        )}

        {/* ── Online: Waiting for friend ────────────────────────────── */}
        {mode === 'online-waiting' && gameSession && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">&#8987;</div>
            <h3 className="text-xl font-bold text-white mb-1">Share this code with your friend</h3>
            <p className="text-neutral-500 text-sm mb-6">Subject: <span className="text-white font-medium">{gameSession.subject}</span></p>

            <div className="bg-neutral-800 rounded-2xl py-5 px-6 mb-4">
              <p className="text-5xl font-bold tracking-[0.3em] text-indigo-400 font-mono">{gameSession.room_code}</p>
            </div>

            <button
              onClick={copyShareLink}
              className="w-full mb-4 bg-indigo-500 text-white border-none rounded-xl py-3 text-sm font-semibold cursor-pointer hover:bg-indigo-400 transition-colors"
            >
              {copySuccess ? 'Link copied!' : 'Copy Share Link'}
            </button>

            <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm">
              <svg className="animate-spin h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Waiting for your friend to join...
            </div>
          </div>
        )}

        {/* ── Online: Game in progress ──────────────────────────────── */}
        {mode === 'online-game' && gameSession && (
          <>
            {gameSession.status !== 'finished' && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {gameSession.current_turn === mySymbol ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      <span className="text-sm font-semibold text-indigo-400">Your turn ({mySymbol})</span>
                    </>
                  ) : (
                    <>
                      <svg className="animate-spin h-3 w-3 text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-sm text-neutral-500">
                        Waiting for {mySymbol === 'X' ? (gameSession.player_o_name ?? 'Player O') : gameSession.player_x_name}...
                      </span>
                    </>
                  )}
                </div>
                <div className="flex gap-3 text-xs text-neutral-400">
                  <span style={{ color: '#6366f1' }}>{gameSession.player_x_name}: X</span>
                  <span style={{ color: '#f43f5e' }}>{gameSession.player_o_name ?? 'Player O'}: O</span>
                </div>
              </div>
            )}

            {(() => {
              const onlineBoard = gameSession.board_state as CellState[];
              const onlineWinner = gameSession.winner as CellState | 'draw' | null;
              const onlineWinLine = onlineWinner && onlineWinner !== 'draw'
                ? (WIN_LINES.find(([a, b, c]) => onlineBoard[a] === onlineWinner && onlineBoard[b] === onlineWinner && onlineBoard[c] === onlineWinner) ?? null)
                : null;
              const isMyTurn = gameSession.current_turn === mySymbol && gameSession.status === 'active' && !onlineCurrentQuestion;

              return (
                <div className="grid grid-cols-3 gap-2 mb-4 max-w-[320px] mx-auto">
                  {onlineBoard.map((cell, i) => {
                    const isWinCell = onlineWinLine?.includes(i);
                    const isSelected = onlineSelectedCell === i;
                    return (
                      <button
                        key={i}
                        onClick={() => handleOnlineCellClick(i)}
                        disabled={!isMyTurn || !!cell || !!onlineWinner}
                        className="aspect-square rounded-xl text-3xl sm:text-4xl font-bold flex items-center justify-center cursor-pointer border-2 transition-all disabled:cursor-default"
                        style={{
                          backgroundColor: isWinCell ? `${playerColors[cell as Player]}30` : isSelected ? '#ffffff10' : '#1a1a1a',
                          borderColor: isWinCell ? playerColors[cell as Player] : isSelected ? playerColors[gameSession.current_turn as Player] : '#2a2a2a',
                          color: cell ? playerColors[cell as Player] : '#333',
                        }}
                      >
                        {cell || (isMyTurn && !onlineWinner ? '\u00B7' : '')}
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {/* Online question popup */}
            {onlineCurrentQuestion && onlineMcq && (
              <div className="bg-neutral-900 border-2 border-neutral-700 rounded-2xl p-5 mb-4">
                <p className="text-xs text-neutral-500 mb-2">Choose the correct answer to claim the square:</p>
                <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                  {onlineCurrentQuestion.question}
                </p>
                {onlineAnswerResult !== null && (
                  <div className={`mt-3 text-center py-3 rounded-xl ${onlineAnswerResult === 'correct' ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                    <span className="text-2xl">{onlineAnswerResult === 'correct' ? '\u2705' : '\u274C'}</span>
                    <p className={`text-sm font-bold mt-1 ${onlineAnswerResult === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {onlineAnswerResult === 'correct' ? 'Correct! Square claimed!' : 'Wrong! Turn lost.'}
                    </p>
                  </div>
                )}
                {renderMCQButtons(onlineMcq.options, onlineMcq.correctIndex, onlineSelectedOption, handleOnlineSelectOption, onlineResolving)}
              </div>
            )}

            {/* Online finished */}
            {gameSession.status === 'finished' && (
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center mb-4">
                {gameSession.winner === 'draw' ? (
                  <>
                    <span className="text-4xl">&#129309;</span>
                    <h2 className="text-xl font-bold text-white mt-2">It&apos;s a Draw!</h2>
                  </>
                ) : gameSession.winner === mySymbol ? (
                  <>
                    <span className="text-4xl">&#127942;</span>
                    <h2 className="text-xl font-bold mt-2 text-indigo-400">You Win!</h2>
                  </>
                ) : (
                  <>
                    <span className="text-4xl">&#128577;</span>
                    <h2 className="text-xl font-bold text-white mt-2">
                      {gameSession.winner === 'X' ? gameSession.player_x_name : (gameSession.player_o_name ?? 'Player O')} Wins!
                    </h2>
                  </>
                )}
                <div className="flex gap-3 mt-4 justify-center">
                  <button
                    onClick={() => { stopPolling(); setMode('online-create'); setGameSession(null); setOnlineCurrentQuestion(null); setOnlineSelectedCell(null); setOnlineMcq(null); }}
                    className="bg-indigo-500 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer hover:bg-indigo-400"
                  >
                    New Game
                  </button>
                  <button
                    onClick={() => { stopPolling(); setMode('pick'); setGameSession(null); setOnlineCurrentQuestion(null); setOnlineSelectedCell(null); setOnlineMcq(null); }}
                    className="bg-neutral-700 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer hover:bg-neutral-600"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Local: Playing / Question / Finished ──────────────────── */}
        {mode === 'local' && phase !== 'setup' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: playerColors[currentPlayer] }} />
                <span className="text-sm font-semibold" style={{ color: playerColors[currentPlayer] }}>
                  {playerNames[currentPlayer]}&apos;s turn ({currentPlayer})
                </span>
              </div>
              <div className="flex gap-3 text-sm">
                <span style={{ color: playerColors.X }}>{playerNames.X}: {scores.X}</span>
                <span style={{ color: playerColors.O }}>{playerNames.O}: {scores.O}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 max-w-[320px] mx-auto">
              {board.map((cell, i) => {
                const isWinCell = winLine?.includes(i);
                const isSelected = selectedCell === i && phase === 'question';
                return (
                  <button
                    key={i}
                    onClick={() => selectCell(i)}
                    disabled={phase !== 'playing' || !!cell || !!winner}
                    className="aspect-square rounded-xl text-3xl sm:text-4xl font-bold flex items-center justify-center cursor-pointer border-2 transition-all disabled:cursor-default"
                    style={{
                      backgroundColor: isWinCell ? `${playerColors[cell as Player]}30` : isSelected ? '#ffffff10' : '#1a1a1a',
                      borderColor: isWinCell ? playerColors[cell as Player] : isSelected ? playerColors[currentPlayer] : '#2a2a2a',
                      color: cell ? playerColors[cell as Player] : '#333',
                    }}
                  >
                    {cell || (phase === 'playing' && !winner ? '\u00B7' : '')}
                  </button>
                );
              })}
            </div>

            {phase === 'question' && currentQuestion && mcq && (
              <div className="bg-neutral-900 border-2 border-neutral-700 rounded-2xl p-5 mb-4">
                <p className="text-xs text-neutral-500 mb-2">
                  {playerNames[currentPlayer]} &mdash; choose the correct answer to claim the square:
                </p>
                <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                  {currentQuestion.question}
                </p>
                {answerResult !== null && (
                  <div className={`mt-3 text-center py-3 rounded-xl ${answerResult === 'correct' ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                    <span className="text-2xl">{answerResult === 'correct' ? '\u2705' : '\u274C'}</span>
                    <p className={`text-sm font-bold mt-1 ${answerResult === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {answerResult === 'correct' ? 'Correct! Square claimed!' : 'Wrong! Turn lost.'}
                    </p>
                  </div>
                )}
                {renderMCQButtons(mcq.options, mcq.correctIndex, selectedOption, handleSelectOption, false)}
              </div>
            )}

            {phase === 'finished' && (
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center mb-4">
                {winner === 'draw' ? (
                  <>
                    <span className="text-4xl">&#129309;</span>
                    <h2 className="text-xl font-bold text-white mt-2">It&apos;s a Draw!</h2>
                  </>
                ) : (
                  <>
                    <span className="text-4xl">&#127942;</span>
                    <h2 className="text-xl font-bold mt-2" style={{ color: playerColors[winner as Player] }}>
                      {playerNames[winner as Player]} Wins!
                    </h2>
                  </>
                )}
                <div className="flex gap-3 mt-4 justify-center">
                  <button
                    onClick={startGame}
                    className="bg-indigo-500 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer hover:bg-indigo-400"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setPhase('setup')}
                    className="bg-neutral-700 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer hover:bg-neutral-600"
                  >
                    New Game
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page export wrapped in Suspense (required for useSearchParams) ────────────

export default function TicTacToePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading...</div>
      </div>
    }>
      <TicTacToeInner />
    </Suspense>
  );
}
