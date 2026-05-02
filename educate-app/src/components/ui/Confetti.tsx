'use client';

/**
 * Pure-CSS confetti burst — renders 14 coloured particles that fall and
 * fade out over ~1.3 s. Mount it inside a `position: relative` container.
 * Nothing is rendered when `active` is false so there is no DOM overhead.
 */

const PARTICLES: { color: string; x: number; size: number; delay: number }[] = [
  { color: '#6366f1', x:  8, size: 8, delay: 0.00 },
  { color: '#10b981', x: 18, size: 6, delay: 0.06 },
  { color: '#f59e0b', x: 30, size: 7, delay: 0.11 },
  { color: '#ec4899', x: 42, size: 9, delay: 0.02 },
  { color: '#06b6d4', x: 55, size: 6, delay: 0.08 },
  { color: '#a78bfa', x: 67, size: 8, delay: 0.14 },
  { color: '#f59e0b', x: 78, size: 7, delay: 0.04 },
  { color: '#10b981', x: 88, size: 6, delay: 0.17 },
  { color: '#ec4899', x: 24, size: 5, delay: 0.09 },
  { color: '#6366f1', x: 48, size: 6, delay: 0.13 },
  { color: '#06b6d4', x: 62, size: 8, delay: 0.05 },
  { color: '#a78bfa', x: 36, size: 5, delay: 0.16 },
  { color: '#f59e0b', x: 73, size: 7, delay: 0.01 },
  { color: '#10b981', x: 93, size: 6, delay: 0.10 },
];

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  if (!active) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl"
      aria-hidden="true"
    >
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute top-1"
          style={{
            left: `${p.x}%`,
            width:  p.size,
            height: p.size,
            borderRadius: i % 3 === 0 ? '50%' : '2px',
            backgroundColor: p.color,
            animation: `confetti-fall 1.3s ${p.delay}s ease-out forwards`,
          }}
        />
      ))}
    </div>
  );
}
