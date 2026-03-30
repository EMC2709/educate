'use client';

import type { Flashcard } from '@/types';

interface FlashcardCardProps {
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
  boardColor: string;
  boardAccent: string;
  boardLightAccent: string;
}

export function FlashcardCard({ card, flipped, onFlip, boardColor, boardAccent, boardLightAccent }: FlashcardCardProps) {
  return (
    <div
      onClick={onFlip}
      className="cursor-pointer select-none mb-5"
      style={{ perspective: '1400px' }}
    >
      <div
        className="relative w-full h-56 sm:h-72 transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-6 sm:p-9 flex flex-col items-center justify-center text-center border-2"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: '#1a1a1a',
            borderColor: `${boardAccent}44`,
          }}
        >
          <div className="text-[10px] tracking-widest text-neutral-600 uppercase mb-4">Tap to reveal answer</div>
          <p className="text-lg sm:text-xl font-semibold leading-relaxed m-0 text-white">{card.term}</p>
          <div className="absolute bottom-3.5 right-4 text-base text-neutral-700">&#10227;</div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-6 sm:p-9 flex flex-col items-center justify-center text-center border-2"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(145deg, ${boardColor}dd, #1e1e1e)`,
            borderColor: `${boardAccent}88`,
          }}
        >
          <div className="text-[10px] tracking-widest uppercase mb-3.5 opacity-80" style={{ color: boardLightAccent }}>
            Answer
          </div>
          <p className="text-sm sm:text-[15px] leading-relaxed m-0 text-white">{card.definition}</p>
          {card.example && (
            <p className="text-xs mt-3 italic opacity-85" style={{ color: boardLightAccent }}>
              e.g. {card.example}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
