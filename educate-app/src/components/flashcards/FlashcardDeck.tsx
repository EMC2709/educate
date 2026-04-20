'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Flashcard, ExamBoard } from '@/types';
import { FlashcardCard } from './FlashcardCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { useChat } from '@/context/ChatContext';
import { initCard, gradeCard, confidenceToGrade, getDueCards } from '@/lib/spaced-repetition';
import { useToast } from '@/components/ui/Toast';
import { recordActivity } from '@/lib/streak';
import { unlockAchievement } from '@/lib/achievements';

interface FlashcardDeckProps {
  cards: Flashcard[];
  board: ExamBoard;
  onBack: () => void;
  onNewDeck: () => void;
  subject?: string;
}

export function FlashcardDeck({ cards, board, onBack, onNewDeck, subject }: FlashcardDeckProps) {
  const [orderedCards, setOrderedCards] = useState<Flashcard[]>(cards);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [dueCount, setDueCount] = useState(0);
  const [swipeHint, setSwipeHint] = useState<'left' | 'right' | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const { setChatOpen, setChatInput } = useChat();
  const { showToast } = useToast();

  const card = orderedCards[idx];

  // Initialize SR cards and sort due cards first
  useEffect(() => {
    if (subject) {
      cards.forEach(c => {
        initCard(`${subject}:${c.term}`, c.term, c.definition);
      });
      // Sort: due cards first, then new/upcoming
      const dueIds = new Set(getDueCards(subject).map(c => c.term));
      const due = cards.filter(c => dueIds.has(c.term));
      const rest = cards.filter(c => !dueIds.has(c.term));
      setOrderedCards([...due, ...rest]);
      setDueCount(due.length);
    } else {
      setOrderedCards(cards);
    }
  }, [cards, subject]);

  const markWithSR = useCallback((confidence: 'again' | 'hard' | 'good' | 'easy') => {
    const isKnown = confidence === 'good' || confidence === 'easy';
    if (isKnown) setKnown(p => [...p, idx]);
    else setUnknown(p => [...p, idx]);

    // Grade in SR system
    if (subject && card) {
      const grade = confidenceToGrade(confidence);
      gradeCard(`${subject}:${card.term}`, grade);
    }

    setFlipped(false);
    setTimeout(() => {
      if (idx < orderedCards.length - 1) setIdx(p => p + 1);
      else setDone(true);
    }, 200);
  }, [idx, orderedCards.length, subject, card]);

  const mark = useCallback((isKnown: boolean) => {
    markWithSR(isKnown ? 'good' : 'again');
  }, [markWithSR]);

  // Touch swipe: left = Again, right = Easy, up/down = flip
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    // Require a meaningful swipe (>50px) that's more horizontal than vertical
    if (absDx > 50 && absDx > absDy * 1.2) {
      if (dx < 0) {
        setSwipeHint('left');
        setTimeout(() => setSwipeHint(null), 400);
        markWithSR('again');
      } else {
        setSwipeHint('right');
        setTimeout(() => setSwipeHint(null), 400);
        markWithSR('easy');
      }
    } else if (absDy > 50 && absDy > absDx) {
      // Vertical swipe = flip
      setFlipped(p => !p);
    }
  }, [markWithSR]);

  if (done) {
    // Record activity and achievement
    recordActivity();
    const a = unlockAchievement('flashcard-deck');
    if (a) {
      showToast({ icon: a.icon, title: 'Achievement Unlocked!', description: a.title, type: 'achievement', duration: 5000 });
    }

    return (
      <div className="text-center py-10 sm:py-16 max-w-md mx-auto px-4">
        <div className="text-5xl mb-4">&#127881;</div>
        <h2 className="font-bold text-2xl mb-2">Deck Complete!</h2>
        <p className="text-neutral-400 mb-8">You knew {known.length} of {orderedCards.length} cards</p>
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
          {dueCount > 0 && (
            <span className="bg-amber-500/15 text-amber-400 text-xs px-2.5 py-0.5 rounded-lg">&#128337; {dueCount} due</span>
          )}
          <span className="bg-emerald-500/15 text-emerald-400 text-xs px-2.5 py-0.5 rounded-lg">&#10003; {known.length}</span>
          <span className="bg-rose-500/15 text-rose-400 text-xs px-2.5 py-0.5 rounded-lg">&#10007; {unknown.length}</span>
          <span className="text-neutral-500 text-sm">{idx + 1}/{orderedCards.length}</span>
        </div>
      </div>

      <div className="mb-6">
        <ProgressBar value={(idx / orderedCards.length) * 100} />
      </div>

      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {swipeHint === 'left' && (
          <div className="absolute inset-0 flex items-center justify-start pl-4 z-10 pointer-events-none rounded-2xl bg-rose-500/20">
            <span className="text-rose-400 font-bold text-lg">← Again</span>
          </div>
        )}
        {swipeHint === 'right' && (
          <div className="absolute inset-0 flex items-center justify-end pr-4 z-10 pointer-events-none rounded-2xl bg-blue-500/20">
            <span className="text-blue-400 font-bold text-lg">Easy →</span>
          </div>
        )}
        <FlashcardCard
          card={card}
          flipped={flipped}
          onFlip={() => setFlipped(p => !p)}
          boardColor={board.color}
          boardAccent={board.accent}
          boardLightAccent={board.lightAccent}
        />
      </div>

      <p className="text-center text-neutral-500 text-[11px] mb-3">
        Tap to flip · Swipe left = Again · Swipe right = Easy
      </p>
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => markWithSR('again')}
          className="bg-rose-500/10 border border-rose-500/40 rounded-xl py-3 text-rose-400 font-bold text-xs cursor-pointer hover:bg-rose-500/20 transition-colors"
        >
          Again
        </button>
        <button
          onClick={() => markWithSR('hard')}
          className="bg-orange-500/10 border border-orange-500/40 rounded-xl py-3 text-orange-400 font-bold text-xs cursor-pointer hover:bg-orange-500/20 transition-colors"
        >
          Hard
        </button>
        <button
          onClick={() => markWithSR('good')}
          className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl py-3 text-emerald-400 font-bold text-xs cursor-pointer hover:bg-emerald-500/20 transition-colors"
        >
          Good
        </button>
        <button
          onClick={() => markWithSR('easy')}
          className="bg-blue-500/10 border border-blue-500/40 rounded-xl py-3 text-blue-400 font-bold text-xs cursor-pointer hover:bg-blue-500/20 transition-colors"
        >
          Easy
        </button>
      </div>
      <div className="flex justify-center mt-2">
        <button
          onClick={() => { setChatOpen(true); setChatInput(`Can you explain "${card?.term}" in more detail for GCSE level?`); }}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-neutral-400 cursor-pointer text-sm hover:bg-neutral-700 transition-colors"
        >
          {'\u{1F4AC}'} Ask AI Tutor
        </button>
      </div>
    </div>
  );
}
