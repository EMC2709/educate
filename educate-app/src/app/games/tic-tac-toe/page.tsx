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

/** Deterministic shuffle keyed to the game ID so both clients see the same order. */
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
  const [answer, setAnswer] = useState('');
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  const [winner, setWinner] = useState<CellState | 'draw' | null>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [checking, setChecking] = useState(false);
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

  // Online question tracking (seeded, shared between both players)
  const [onlineQuestions, setOnlineQuestions] = useState<Question[]>([]);
  const [onlineSelectedCell, setOnlineSelectedCell] = useState<number | null>(null);
  const [onlineCurrentQuestion, setOnlineCurrentQuestion] = useState<Question | null>(null);
  const [onlineAnswer, setOnlineAnswer] = useState('');
  const [onlineAnswerResult, setOnlineAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  const [onlineChecking, setOnlineChecking] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Init player ID on client
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
      // Set up questions seeded by game ID
      const qs = seededShuffle(getSubjectQuestions(onlineSubject), data.gameId as string);
      setOnlineQuestions(qs);
      setMySymbol('X');
      // Fetch full session
      const sessionRes = await fetch(`/api/game?id=${data.gameId}`);
      const session = await sessionRes.json() as GameSession;
      setGameSession(session);
      setMode('online-waiting');
      // Poll until friend joins
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
      // Poll for turn changes
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
    // Pick question = questions[filledCells % length]
    const filledCount = onlineBoard.filter(c => c !== '').length;
    const q = onlineQuestions[filledCount % onlineQuestions.length];
    setOnlineSelectedCell(i);
    setOnlineCurrentQuestion(q);
    setOnlineAnswer('');
    setOnlineAnswerResult(null);
  };

  // ── Online: submit answer ──
  const submitOnlineAnswer = async () => {
    if (!onlineCurrentQuestion || !onlineAnswer.trim() || onlineChecking || !gameSession) return;
    setOnlineChecking(true);

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: gameSession.subject,
          board: 'AQA',
          questionType: 'short',
          question: onlineCurrentQuestion.question,
          modelAnswer: onlineCurrentQuestion.answer,
          userAnswer: onlineAnswer,
          marks: onlineCurrentQuestion.marks,
        }),
      });

      let isCorrect = false;
      if (res.ok) {
        const data = await res.json();
        isCorrect = (data as { correct: boolean }).correct;
      } else {
        const keywords = onlineCurrentQuestion.answer.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const al = onlineAnswer.toLowerCase();
        const matches = keywords.filter(k => al.includes(k)).length;
        isCorrect = matches >= Math.max(1, Math.floor(keywords.length * 0.3));
      }

      setOnlineAnswerResult(isCorrect ? 'correct' : 'wrong');

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

        // PATCH server
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
          // Re-fetch to stay in sync
          const refreshed = await fetch(`/api/game?id=${gameSession.id}`);
          if (refreshed.ok) {
            setGameSession(await refreshed.json() as GameSession);
          }
        } catch {
          // ignore
        }

        setOnlineSelectedCell(null);
        setOnlineCurrentQuestion(null);
        setOnlineAnswerResult(null);
        setOnlineAnswer('');
        setOnlineChecking(false);

        if (newStatus === 'finished') stopPolling();
        else if (nextTurn !== mySymbol) {
          // Start polling for the other player's move
          startPolling(gameSession.room_code, (updated) => {
            setGameSession(updated);
            if (updated.status === 'finished') stopPolling();
          });
        }
      }, 1500);
    } catch {
      setOnlineAnswerResult('wrong');
      setTimeout(() => {
        setOnlineSelectedCell(null);
        setOnlineCurrentQuestion(null);
        setOnlineAnswerResult(null);
        setOnlineAnswer('');
        setOnlineChecking(false);
      }, 1500);
    }
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

  // ─── Local game logic (unchanged) ─────────────────────────────────────────

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
    setSelectedCell(i);
    setCurrentQuestion(questions[questionIndex % questions.length]);
    setQuestionIndex(prev => prev + 1);
    setAnswer('');
    setAnswerResult(null);
    setPhase('question');
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !answer.trim() || checking) return;
    setChecking(true);

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          board: 'AQA',
          questionType: 'short',
          question: currentQuestion.question,
          modelAnswer: currentQuestion.answer,
          userAnswer: answer,
          marks: currentQuestion.marks,
        }),
      });

      let isCorrect = false;
      if (res.ok) {
        const data = await res.json();
        isCorrect = (data as { correct: boolean }).correct;
      } else {
        const keywords = currentQuestion.answer.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const answerLower = answer.toLowerCase();
        const matches = keywords.filter(k => answerLower.includes(k)).length;
        isCorrect = matches >= Math.max(1, Math.floor(keywords.length * 0.3));
      }

      setAnswerResult(isCorrect ? 'correct' : 'wrong');

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
        setPhase('playing');
      }, 1500);
    } catch {
      setAnswerResult('wrong');
      setTimeout(() => {
        setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
        setPhase('playing');
      }, 1500);
    }

    setChecking(false);
  };

  const playerColors = { X: '#6366f1', O: '#f43f5e' };

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

  // ─── Shared page wrapper ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Game Zone</Link>

        <div className="text-center mt-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">&#10062; Noughts &amp; Crosses</h1>
          <p className="text-neutral-500 text-sm">Answer questions to claim squares!</p>
        </div>

        {/* ── Mode picker ────────────────────────────────────────────────── */}
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

        {/* ── Local setup ────────────────────────────────────────────────── */}
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

        {/* ── Online: Create game setup ───────────────────────────────────── */}
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

        {/* ── Online: Join game setup ─────────────────────────────────────── */}
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

        {/* ── Online: Waiting for friend ──────────────────────────────────── */}
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

        {/* ── Online: Game in progress ────────────────────────────────────── */}
        {mode === 'online-game' && gameSession && (
          <>
            {/* Status bar */}
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

            {/* Board */}
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
            {onlineCurrentQuestion && (
              <div className="bg-neutral-900 border-2 border-neutral-700 rounded-2xl p-5 mb-4">
                <p className="text-xs text-neutral-500 mb-2">Answer to claim the square:</p>
                <p className="text-sm sm:text-base text-white font-medium mb-4 leading-relaxed">
                  {onlineCurrentQuestion.question}
                </p>

                {onlineAnswerResult === null ? (
                  <>
                    <textarea
                      value={onlineAnswer}
                      onChange={e => setOnlineAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 resize-none min-h-[80px] mb-3"
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitOnlineAnswer(); } }}
                    />
                    <button
                      onClick={submitOnlineAnswer}
                      disabled={!onlineAnswer.trim() || onlineChecking}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-500 hover:bg-indigo-400 transition-colors"
                    >
                      {onlineChecking ? 'Checking...' : 'Submit Answer'}
                    </button>
                  </>
                ) : (
                  <div className={`text-center py-4 rounded-xl ${onlineAnswerResult === 'correct' ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                    <span className="text-3xl">{onlineAnswerResult === 'correct' ? '\u2705' : '\u274C'}</span>
                    <p className={`text-sm font-bold mt-2 ${onlineAnswerResult === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {onlineAnswerResult === 'correct' ? 'Correct! Square claimed!' : 'Wrong! Turn lost.'}
                    </p>
                    {onlineAnswerResult === 'wrong' && (
                      <p className="text-xs text-neutral-500 mt-1 px-4">Answer: {onlineCurrentQuestion.answer.slice(0, 120)}...</p>
                    )}
                  </div>
                )}
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
                    onClick={() => { stopPolling(); setMode('online-create'); setGameSession(null); setOnlineCurrentQuestion(null); setOnlineSelectedCell(null); }}
                    className="bg-indigo-500 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer hover:bg-indigo-400"
                  >
                    New Game
                  </button>
                  <button
                    onClick={() => { stopPolling(); setMode('pick'); setGameSession(null); setOnlineCurrentQuestion(null); setOnlineSelectedCell(null); }}
                    className="bg-neutral-700 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer hover:bg-neutral-600"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Local: Playing / Question / Finished ───────────────────────── */}
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

            {phase === 'question' && currentQuestion && (
              <div className="bg-neutral-900 border-2 border-neutral-700 rounded-2xl p-5 mb-4 animate-[fadeIn_0.2s]">
                <p className="text-xs text-neutral-500 mb-2">
                  {playerNames[currentPlayer]} &mdash; answer to claim square:
                </p>
                <p className="text-sm sm:text-base text-white font-medium mb-4 leading-relaxed">
                  {currentQuestion.question}
                </p>

                {answerResult === null ? (
                  <>
                    <textarea
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 resize-none min-h-[80px] mb-3"
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer(); } }}
                    />
                    <button
                      onClick={submitAnswer}
                      disabled={!answer.trim() || checking}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: playerColors[currentPlayer] }}
                    >
                      {checking ? 'Checking...' : 'Submit Answer'}
                    </button>
                  </>
                ) : (
                  <div className={`text-center py-4 rounded-xl ${answerResult === 'correct' ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                    <span className="text-3xl">{answerResult === 'correct' ? '\u2705' : '\u274C'}</span>
                    <p className={`text-sm font-bold mt-2 ${answerResult === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {answerResult === 'correct' ? 'Correct! Square claimed!' : 'Wrong! Turn lost.'}
                    </p>
                    {answerResult === 'wrong' && (
                      <p className="text-xs text-neutral-500 mt-1 px-4">Answer: {currentQuestion.answer.slice(0, 120)}...</p>
                    )}
                  </div>
                )}
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
