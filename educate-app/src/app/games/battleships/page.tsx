'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { QUESTION_BANK } from '@/data/question-bank';
import { shuffle } from '@/lib/shuffle';
import type { Question } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'playing' | 'question' | 'finished';
type CellState = 'empty' | 'ship' | 'hit' | 'miss';

interface PendingAttack {
  cell: number;
  question: Question;
  mcq: MCQData;
}

interface MCQData {
  options: string[];
  correctIndex: number;
}

interface ShipInfo {
  name: string;
  size: number;
  cells: number[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SHIP_DEFS = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 },
];

const ROW_LABELS = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i));
const COL_LABELS = Array.from({ length: 10 }, (_, i) => String(i + 1));

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function getShortQuestions(subject: string): Question[] {
  const bank = QUESTION_BANK[subject];
  if (!bank) return [];
  return Array.isArray(bank.short) ? [...bank.short] : [];
}

const AVAILABLE_SUBJECTS = Object.keys(QUESTION_BANK).filter(
  s => getShortQuestions(s).length >= 5
);

function randomPlaceShips(sizes: number[]): number[][] {
  const occupied = Array(100).fill(false);
  const ships: number[][] = [];
  for (const size of sizes) {
    let placed = false;
    while (!placed) {
      const horiz = Math.random() > 0.5;
      const row = Math.floor(Math.random() * (horiz ? 10 : 11 - size));
      const col = Math.floor(Math.random() * (horiz ? 11 - size : 10));
      const cells = Array.from({ length: size }, (_, i) =>
        horiz ? row * 10 + col + i : (row + i) * 10 + col
      );
      if (cells.every(c => !occupied[c])) {
        cells.forEach(c => (occupied[c] = true));
        ships.push(cells);
        placed = true;
      }
    }
  }
  return ships;
}

function generateMCQ(correct: string, pool: Question[]): MCQData {
  const correctClean = correct.split('\n')[0].replace(/^\d+[\.\)]\s*/, '').trim().slice(0, 80);
  const wrongs: string[] = [];
  const seen = new Set([correctClean.toLowerCase()]);
  for (const q of pool) {
    const candidates = [...(q.acceptedAnswers ?? []), q.answer.split('\n')[0].trim()];
    for (const c of candidates) {
      const clean = c.trim().slice(0, 80);
      if (clean.length > 3 && clean.length < 80 && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        wrongs.push(clean);
        if (wrongs.length >= 15) break;
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

function buildShipInfo(shipCells: number[][]): ShipInfo[] {
  return shipCells.map((cells, i) => ({
    name: SHIP_DEFS[i]?.name ?? `Ship ${i + 1}`,
    size: cells.length,
    cells,
  }));
}

function isShipSunk(ship: ShipInfo, attacked: Set<number>): boolean {
  return ship.cells.every(c => attacked.has(c));
}

function awardXP(isCorrect: boolean) {
  fetch('/api/award-xp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marksAwarded: isCorrect ? 1 : 0, questionType: 'short', attempted: true }),
  })
    .then(r => r.json())
    .then((d: { xpGained?: number }) => {
      if ((d.xpGained ?? 0) > 0) window.dispatchEvent(new Event('educate-xp-updated'));
    })
    .catch(() => {});
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface GridProps {
  grid: CellState[];
  ships: ShipInfo[];
  attacked: Set<number>;
  isEnemy: boolean;
  phase: Phase;
  onCellClick?: (i: number) => void;
}

function BattleGrid({ grid, ships, attacked, isEnemy, phase, onCellClick }: GridProps) {
  return (
    <div className="overflow-x-auto">
      <div style={{ display: 'inline-block' }}>
        {/* Column header row */}
        <div style={{ display: 'flex', marginBottom: 2, paddingLeft: 20 }}>
          {COL_LABELS.map(l => (
            <div
              key={l}
              style={{ width: 28, textAlign: 'center', fontSize: 9, color: '#52525b', flexShrink: 0 }}
            >
              {l}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {ROW_LABELS.map((rowLabel, row) => (
          <div key={row} style={{ display: 'flex', marginBottom: 2, alignItems: 'center' }}>
            {/* Row label */}
            <div style={{ width: 18, fontSize: 9, color: '#52525b', flexShrink: 0 }}>{rowLabel}</div>

            {/* Cells */}
            {COL_LABELS.map((_, col) => {
              const i = row * 10 + col;
              const state = grid[i];
              const hasShip = !isEnemy && ships.some(s => s.cells.includes(i));
              const isHit = state === 'hit';
              const isMiss = state === 'miss';
              const isAttacked = attacked.has(i);
              const canClick = isEnemy && !isAttacked && phase === 'playing' && !!onCellClick;

              let bg = '#1a1a1a';
              let border = '#2a2a2a';
              let emoji = '';

              if (isHit) {
                bg = 'rgba(239,68,68,0.25)';
                border = '#ef4444';
                emoji = '🔥';
              } else if (isMiss) {
                bg = 'rgba(99,102,241,0.08)';
                border = '#3f3f46';
                emoji = '💦';
              } else if (hasShip) {
                bg = 'rgba(99,102,241,0.2)';
                border = 'rgba(99,102,241,0.5)';
              }

              return (
                <button
                  key={col}
                  onClick={() => canClick && onCellClick(i)}
                  title={`${rowLabel}${col + 1}`}
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 3,
                    cursor: canClick ? 'crosshair' : 'default',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginRight: 2,
                    padding: 0,
                    transition: 'background 0.15s',
                  }}
                >
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

function ShipStatus({ ships, attacked, label }: { ships: ShipInfo[]; attacked: Set<number>; label: string }) {
  return (
    <div className="mt-3">
      <p className="text-xs text-neutral-500 font-semibold mb-1.5 uppercase tracking-wide">{label}</p>
      <div className="space-y-1">
        {ships.map(ship => {
          const sunk = isShipSunk(ship, attacked);
          const hits = ship.cells.filter(c => attacked.has(c)).length;
          return (
            <div key={ship.name} className="flex items-center justify-between">
              <span className={`text-xs ${sunk ? 'line-through text-neutral-600' : 'text-neutral-300'}`}>
                {sunk ? '✓' : '▸'} {ship.name}
              </span>
              <span className="text-xs text-neutral-500">
                {sunk ? 'Sunk' : `${hits}/${ship.size}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BattleshipsPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [subject, setSubject] = useState(AVAILABLE_SUBJECTS[0] ?? 'Biology');

  const [playerGrid, setPlayerGrid] = useState<CellState[]>(Array(100).fill('empty'));
  const [enemyGrid, setEnemyGrid] = useState<CellState[]>(Array(100).fill('empty'));

  const [playerShips, setPlayerShips] = useState<ShipInfo[]>([]);
  const [enemyShips, setEnemyShips] = useState<ShipInfo[]>([]);

  // Track which cells each side has attacked (for the opposite grid)
  const [playerShotsFired, setPlayerShotsFired] = useState<Set<number>>(new Set());
  const [aiShotsFired, setAiShotsFired] = useState<Set<number>>(new Set());

  const [pending, setPending] = useState<PendingAttack | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  const [lastMessage, setLastMessage] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);

  // ── Setup ──────────────────────────────────────────────────────────────────

  const handleAutoPlace = useCallback(() => {
    const shipCells = randomPlaceShips(SHIP_DEFS.map(s => s.size));
    const grid: CellState[] = Array(100).fill('empty');
    shipCells.forEach(cells => cells.forEach(c => (grid[c] = 'ship')));
    setPlayerGrid(grid);
    setPlayerShips(buildShipInfo(shipCells));
  }, []);

  const handleStartGame = useCallback(() => {
    if (playerShips.length === 0) return;
    const aiShipCells = randomPlaceShips(SHIP_DEFS.map(s => s.size));
    setEnemyShips(buildShipInfo(aiShipCells));
    setEnemyGrid(Array(100).fill('empty'));
    setPlayerShotsFired(new Set());
    setAiShotsFired(new Set());
    const qs = shuffle(getShortQuestions(subject));
    setQuestions(qs);
    setQuestionIndex(0);
    setPending(null);
    setSelectedOption(null);
    setAnswerResult(null);
    setLastMessage('Your turn — click a cell on Enemy Waters to attack!');
    setWinner(null);
    setPhase('playing');
  }, [playerShips, subject]);

  // ── Attack cell clicked ────────────────────────────────────────────────────

  const handleEnemyClick = useCallback(
    (cell: number) => {
      if (phase !== 'playing' || playerShotsFired.has(cell) || winner) return;
      const q = questions[questionIndex % questions.length];
      const mcq = generateMCQ(q.answer, questions);
      setPending({ cell, question: q, mcq });
      setSelectedOption(null);
      setAnswerResult(null);
      setQuestionIndex(qi => qi + 1);
      setPhase('question');
    },
    [phase, playerShotsFired, winner, questions, questionIndex]
  );

  // ── Submit MCQ ─────────────────────────────────────────────────────────────

  const handleSubmitMCQ = useCallback(() => {
    if (!pending || selectedOption === null || answerResult !== null) return;
    const isCorrect = selectedOption === pending.mcq.correctIndex;
    setAnswerResult(isCorrect ? 'correct' : 'wrong');
    awardXP(isCorrect);

    setTimeout(() => {
      // --- Player attack resolution ---
      const newPlayerShots = new Set(playerShotsFired);
      newPlayerShots.add(pending.cell);
      setPlayerShotsFired(newPlayerShots);

      const newEnemyGrid = [...enemyGrid];
      let playerMsg = '';
      let gameOver = false;

      // Player fires regardless; hit only if correct
      const playerHit = isCorrect && enemyShips.some(s => s.cells.includes(pending.cell));
      newEnemyGrid[pending.cell] = playerHit ? 'hit' : 'miss';
      setEnemyGrid(newEnemyGrid);

      if (playerHit) {
        const allEnemySunk = enemyShips.every(ship =>
          ship.cells.every(c => newPlayerShots.has(c))
        );
        if (allEnemySunk) {
          setWinner('player');
          setPhase('finished');
          setPending(null);
          setSelectedOption(null);
          setAnswerResult(null);
          return;
        }
        const sunkShip = enemyShips.find(s =>
          s.cells.every(c => newPlayerShots.has(c))
        );
        playerMsg = sunkShip
          ? `Direct hit — you sunk the enemy ${sunkShip.name}!`
          : 'Direct hit!';
      } else if (isCorrect) {
        playerMsg = 'Correct — but that cell was empty. Miss!';
      } else {
        playerMsg = 'Wrong answer — your shot went wide!';
      }

      // --- AI attack ---
      const newAiShots = new Set(aiShotsFired);
      let aiCell: number;
      do { aiCell = Math.floor(Math.random() * 100); } while (newAiShots.has(aiCell));
      newAiShots.add(aiCell);
      setAiShotsFired(newAiShots);

      const newPlayerGrid = [...playerGrid];
      const aiHit = playerShips.some(s => s.cells.includes(aiCell));
      newPlayerGrid[aiCell] = aiHit ? 'hit' : 'miss';
      setPlayerGrid(newPlayerGrid);

      if (aiHit) {
        const allPlayerSunk = playerShips.every(ship =>
          ship.cells.every(c => newAiShots.has(c))
        );
        if (allPlayerSunk) {
          gameOver = true;
          setWinner('ai');
          setPhase('finished');
        }
      }

      const aiMsg = aiHit ? 'AI returned fire — your ship was hit!' : 'AI fired — missed!';

      if (!gameOver) {
        setLastMessage(`${playerMsg} | ${aiMsg}`);
        setPhase('playing');
      }

      setPending(null);
      setSelectedOption(null);
      setAnswerResult(null);
    }, 1200);
  }, [
    pending, selectedOption, answerResult,
    playerShotsFired, enemyGrid, enemyShips,
    aiShotsFired, playerGrid, playerShips,
  ]);

  // ── Restart ────────────────────────────────────────────────────────────────

  const handleRestart = () => {
    setPhase('setup');
    setPlayerGrid(Array(100).fill('empty'));
    setEnemyGrid(Array(100).fill('empty'));
    setPlayerShips([]);
    setEnemyShips([]);
    setPlayerShotsFired(new Set());
    setAiShotsFired(new Set());
    setPending(null);
    setSelectedOption(null);
    setAnswerResult(null);
    setLastMessage('');
    setWinner(null);
    setQuestions([]);
    setQuestionIndex(0);
  };

  // ─── Setup phase ───────────────────────────────────────────────────────────

  if (phase === 'setup') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
        <Navbar />
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">
            &#8592; Game Zone
          </Link>

          <div className="text-center mt-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Battleships</h1>
            <p className="text-neutral-500 text-sm">
              Answer MCQ questions to fire! Sink all 5 enemy ships to win.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
            {/* Subject */}
            <div>
              <label className="text-xs text-neutral-400 font-semibold mb-2 block uppercase tracking-wide">
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              >
                {AVAILABLE_SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Fleet placement */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wide">
                  Your Fleet
                </label>
                <button
                  onClick={handleAutoPlace}
                  className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 rounded-lg px-3 py-1 cursor-pointer hover:bg-indigo-500/30 transition-colors"
                >
                  Auto-Place Ships
                </button>
              </div>

              <div className="flex justify-center">
                <BattleGrid
                  grid={playerGrid}
                  ships={playerShips}
                  attacked={new Set()}
                  isEnemy={false}
                  phase="setup"
                />
              </div>

              {playerShips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {playerShips.map(s => (
                    <span
                      key={s.name}
                      className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5"
                    >
                      {s.name} ({s.size})
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartGame}
                disabled={playerShips.length === 0}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white border-none rounded-xl py-3.5 font-bold text-sm cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                {playerShips.length === 0 ? 'Place Ships First' : '🤖 Solo vs AI'}
              </button>
              <Link
                href="/games/battleships/online"
                className="flex-1 rounded-xl py-3.5 font-bold text-sm text-white text-center no-underline cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
              >
                🚢 Play Online
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Finished phase ────────────────────────────────────────────────────────

  if (phase === 'finished') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
        <Navbar />
        <div className="max-w-lg mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center w-full">
            {winner === 'player' ? (
              <>
                <div className="text-6xl mb-3">&#127942;</div>
                <h2 className="text-2xl font-bold text-emerald-400 mb-1">Victory!</h2>
                <p className="text-neutral-400 text-sm">You sunk all enemy ships!</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-3">&#128128;</div>
                <h2 className="text-2xl font-bold text-rose-400 mb-1">Defeat!</h2>
                <p className="text-neutral-400 text-sm">The AI sunk your entire fleet.</p>
              </>
            )}
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={handleRestart}
                className="bg-indigo-500 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer hover:bg-indigo-400 transition-colors"
              >
                Play Again
              </button>
              <Link
                href="/games"
                className="bg-neutral-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold no-underline hover:bg-neutral-600 transition-colors inline-flex items-center"
              >
                Game Zone
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Playing / question phase ──────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/games" className="text-neutral-500 text-sm hover:text-neutral-300 no-underline">
            &#8592; Game Zone
          </Link>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                phase === 'playing' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-xs text-neutral-400">
              {phase === 'playing' ? 'Your turn — attack!' : 'Answer to fire'}
            </span>
          </div>
          <button
            onClick={handleRestart}
            className="text-xs text-neutral-500 hover:text-neutral-300 bg-transparent border-none cursor-pointer"
          >
            Restart
          </button>
        </div>

        {/* Status bar */}
        {lastMessage && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 mb-4 text-center">
            <p className="text-xs text-neutral-400">{lastMessage}</p>
          </div>
        )}

        {/* Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {/* Player grid */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              Your Fleet
            </h3>
            <div className="flex justify-center">
              <BattleGrid
                grid={playerGrid}
                ships={playerShips}
                attacked={aiShotsFired}
                isEnemy={false}
                phase={phase}
              />
            </div>
            <ShipStatus ships={playerShips} attacked={aiShotsFired} label="Your ships" />
          </div>

          {/* Enemy grid */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              Enemy Waters
              {phase === 'playing' && (
                <span className="text-xs text-emerald-400 font-normal ml-auto animate-pulse">
                  Click to attack
                </span>
              )}
            </h3>
            <div className="flex justify-center">
              <BattleGrid
                grid={enemyGrid}
                ships={[]}
                attacked={playerShotsFired}
                isEnemy
                phase={phase}
                onCellClick={handleEnemyClick}
              />
            </div>
            <ShipStatus ships={enemyShips} attacked={playerShotsFired} label="Enemy ships" />
          </div>
        </div>

        {/* MCQ panel */}
        {phase === 'question' && pending && (
          <div className="bg-neutral-900 border-2 border-indigo-500/40 rounded-2xl p-5 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5 font-semibold">
                {subject}
              </span>
              <span className="text-xs text-neutral-500">Answer correctly to fire on target!</span>
            </div>

            <p className="text-sm sm:text-base text-white font-medium mb-4 leading-relaxed">
              {pending.question.question}
            </p>

            {answerResult === null ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {pending.mcq.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      className="text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer"
                      style={{
                        backgroundColor: selectedOption === idx ? 'rgba(99,102,241,0.2)' : '#1a1a1a',
                        borderColor: selectedOption === idx ? '#6366f1' : '#2a2a2a',
                        color: selectedOption === idx ? '#a5b4fc' : '#d4d4d8',
                      }}
                    >
                      <span className="font-bold mr-2 text-neutral-500">
                        {['A', 'B', 'C', 'D'][idx]}.
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmitMCQ}
                  disabled={selectedOption === null}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-500 hover:bg-indigo-400 transition-colors"
                >
                  Fire!
                </button>
              </>
            ) : (
              <div
                className={`text-center py-5 rounded-xl ${
                  answerResult === 'correct' ? 'bg-emerald-500/15' : 'bg-rose-500/15'
                }`}
              >
                <span className="text-3xl">{answerResult === 'correct' ? '🎯' : '💨'}</span>
                <p
                  className={`text-sm font-bold mt-2 ${
                    answerResult === 'correct' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {answerResult === 'correct' ? 'Correct — shot fired!' : 'Wrong — shot wasted!'}
                </p>
                {answerResult === 'wrong' && (
                  <p className="text-xs text-neutral-500 mt-1 px-4">
                    Answer: {pending.question.answer.split('\n')[0].slice(0, 120)}
                  </p>
                )}
                <p className="text-xs text-neutral-600 mt-2">Resolving turn...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
