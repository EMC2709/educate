'use client';

interface SkeletonProps {
  className?: string;
}

/** Generic shimmer block — compose into higher-level skeletons. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} aria-hidden="true" />;
}

/** Skeleton for a single flashcard deck card. */
export function DeckCardSkeleton() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-5 w-5 rounded-full shrink-0" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
    </div>
  );
}

/** Grid of deck card skeletons for the My Flashcards loading state. */
export function DeckListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <DeckCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for a quiz question card. */
export function QuestionSkeleton() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-4 space-y-3">
      <Skeleton className="h-3 w-24 mb-1" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-5/6" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  );
}
