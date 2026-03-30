'use client';

import { useState, useCallback } from 'react';
import type { Flashcard, ExamBoard } from '@/types';
import { FlashcardCard } from './FlashcardCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { useChat } from '@/context/ChatContext';

interface FlashcardDeckProps {
  cards: Flashcard[];
  board: ExamBoard;
  onBack: () => void;
  onNewDeck: () => void;
}

export function FlashcardDeck({ cards, board, onBack, onNewDeck }: FlashcardDeckProps) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const { setChatOpen, setChatInput } = useChat();

  const card = cards[idx];

  const mark = useCallback((isKnown: boolean) => {
    if (isKnown) setKnown(p => [...p, idx]);
    else setUnknown(p => [...p, idx]);
    setFlipped(false);
    setTimeout(() => {
      if (idx < cards.length - 1) setIdx(p => p + 1);
      else setDone(true);
    }, 200);
  }, [idx, cards.length]);

  if (done) {
    return (
      <div className="text-center py-10 sm:py-16 max-w-md mx-auto px-4">
        <div className="text-5xl mb-4">&#127881;</div>
        <h2 className="font-bold text-2xl mb-2">Deck Complete!</h2>
        <p className="text-neutral-400 mb-8">You knew {known.length} of {cards.length} cards</p>
        <div className="flex gap-4 justify-center mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500 rounded-xl px-6 sm:px-7 py-4">
            <p className="text-emerald-400 font-bold text-2xl m-0">{known.length}</p>
            <p className="text-emerald-400 text-xs m-0">Knew it &#10003;</p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500 rounded-xl px-6 sm:px-7 py-4">
            <p className="text-rose-400 font-bold text-2xl m-0">{unknown.length}</p>
            <p className="text-rose-400 text-xs m-0">Need practice &#10007;</p>
          </div>
        </div>
        <div className="flex gap-2.5 justify-center">
          <Button onClick={onNewDeck} accentColor={board.accent}>New Deck</Button>
          <Button variant="secondary" onClick={onBack}>Change Topics</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-5">
        <Button variant="ghost" onClick={onBack}>&#8592; Change Topics</Button>
        <div className="flex gap-2 items-center">
          <span className="bg-emerald-500/15 text-emerald-400 text-xs px-2.5 py-0.5 rounded-lg">&#10003; {known.length}</span>
          <span className="bg-rose-500/15 text-rose-400 text-xs px-2.5 py-0.5 rounded-lg">&#10007; {unknown.length}</span>
          <span className="text-neutral-500 text-sm">{idx + 1}/{cards.length}</span>
        </div>
      </div>

      <div className="mb-6">
        <ProgressBar value={(idx / cards.length) * 100} />
      </div>

      <FlashcardCard
        card={card}
        flipped={flipped}
        onFlip={() => setFlipped(p => !p)}
        boardColor={board.color}
        boardAccent={board.accent}
        boardLightAccent={board.lightAccent}
      />

      <p className="text-center text-neutral-500 text-sm mb-3">Did you know it?</p>
      <div className="flex gap-3">
        <button
          onClick={() => mark(false)}
          className="flex-1 bg-rose-500/10 border border-rose-500 rounded-xl py-3.5 text-rose-400 font-bold text-sm sm:text-base cursor-pointer hover:bg-rose-500/20 transition-colors"
        >
          &#10007; Not yet
        </button>
        <button
          onClick={() => { setChatOpen(true); setChatInput(`Can you explain "${card?.term}" in more detail for GCSE level?`); }}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-neutral-400 cursor-pointer text-base hover:bg-neutral-700 transition-colors"
        >
          &#128172;
        </button>
        <button
          onClick={() => mark(true)}
          className="flex-1 bg-emerald-500/10 border border-emerald-500 rounded-xl py-3.5 text-emerald-400 font-bold text-sm sm:text-base cursor-pointer hover:bg-emerald-500/20 transition-colors"
        >
          &#10003; Got it
        </button>
      </div>
    </div>
  );
}
