'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { QUESTION_BANK } from '@/data/question-bank';
import { shuffle } from '@/lib/shuffle';
import type { Question } from '@/types';

type Player = 'X' | 'O';
type CellState = '' | 'X' | 'O';
type GamePhase = 'setup' | 'playing' | 'question' | 'finished';

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
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
  // Bank is { short: Question[], mid: Question[], long: Question[], flashcard: Flashcard[] }
  if (Array.isArray(bank.short)) all.push(...bank.short);
  if (Array.isArray(bank.mid)) all.push(...bank.mid);
  return all;
}

// Available subjects that have question banks
const AVAILABLE_SUBJECTS = Object.keys(QUESTION_BANK).filter(s => {
  const qs = getSubjectQuestions(s);
  return qs.length >= 9;
});

export default function TicTacToePage() {
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
        isCorrect = data.correct;
      } else {
        // If API fails (not signed in, etc), do basic keyword match
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
        // Switch turns regardless of correct/wrong
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">&#8592; Game Zone</Link>

        <div className="text-center mt-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{'\u{274E}'} Noughts & Crosses</h1>
          <p className="text-neutral-500 text-sm">Answer questions to claim squares!</p>
        </div>

        {/* Setup Phase */}
        {phase === 'setup' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5">Game Setup</h3>

            {/* Player Names */}
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

            {/* Subject */}
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

        {/* Playing / Question / Finished */}
        {phase !== 'setup' && (
          <>
            {/* Turn Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: playerColors[currentPlayer] }} />
                <span className="text-sm font-semibold" style={{ color: playerColors[currentPlayer] }}>
                  {playerNames[currentPlayer]}'s turn ({currentPlayer})
                </span>
              </div>
              <div className="flex gap-3 text-sm">
                <span style={{ color: playerColors.X }}>{playerNames.X}: {scores.X}</span>
                <span style={{ color: playerColors.O }}>{playerNames.O}: {scores.O}</span>
              </div>
            </div>

            {/* Board */}
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

            {/* Question Modal */}
            {phase === 'question' && currentQuestion && (
              <div className="bg-neutral-900 border-2 border-neutral-700 rounded-2xl p-5 mb-4 animate-[fadeIn_0.2s]">
                <p className="text-xs text-neutral-500 mb-2">
                  {playerNames[currentPlayer]} — answer to claim square:
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
                    <span className="text-3xl">{answerResult === 'correct' ? '\u{2705}' : '\u{274C}'}</span>
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

            {/* Winner */}
            {phase === 'finished' && (
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center mb-4">
                {winner === 'draw' ? (
                  <>
                    <span className="text-4xl">{'\u{1F91D}'}</span>
                    <h2 className="text-xl font-bold text-white mt-2">It's a Draw!</h2>
                  </>
                ) : (
                  <>
                    <span className="text-4xl">{'\u{1F3C6}'}</span>
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
