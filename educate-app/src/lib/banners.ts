export interface Banner {
  id: string;
  name: string;
  emoji: string;
  price: number;
  gradient: string;
  textColor: string;
  desc: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const BANNER_CATALOG: Banner[] = [
  { id: 'flame',   name: 'Flame',      emoji: '🔥', price: 100, gradient: 'linear-gradient(135deg,#ef4444,#f97316)', textColor: '#fff', desc: 'Blaze of glory',      rarity: 'common'    },
  { id: 'ice',     name: 'Ice',        emoji: '❄️',  price: 100, gradient: 'linear-gradient(135deg,#38bdf8,#818cf8)', textColor: '#fff', desc: 'Cool under pressure', rarity: 'common'    },
  { id: 'neon',    name: 'Neon',       emoji: '⚡',  price: 200, gradient: 'linear-gradient(135deg,#a3e635,#22d3ee)', textColor: '#000', desc: 'Electric energy',     rarity: 'rare'      },
  { id: 'emerald', name: 'Emerald',    emoji: '💚',  price: 200, gradient: 'linear-gradient(135deg,#4ade80,#059669)', textColor: '#fff', desc: 'Natural power',       rarity: 'rare'      },
  { id: 'shadow',  name: 'Shadow',     emoji: '🌙',  price: 300, gradient: 'linear-gradient(135deg,#312e81,#6366f1)', textColor: '#fff', desc: 'Dark scholar',        rarity: 'epic'      },
  { id: 'ruby',    name: 'Ruby',       emoji: '💎',  price: 300, gradient: 'linear-gradient(135deg,#f43f5e,#be123c)', textColor: '#fff', desc: 'Rare & precious',     rarity: 'epic'      },
  { id: 'cosmic',  name: 'Cosmic',     emoji: '🌌',  price: 500, gradient: 'linear-gradient(135deg,#6366f1,#ec4899)', textColor: '#fff', desc: 'From the cosmos',     rarity: 'legendary' },
  { id: 'gold',    name: 'Royal Gold', emoji: '👑',  price: 500, gradient: 'linear-gradient(135deg,#f59e0b,#b45309)', textColor: '#fff', desc: 'Fit for royalty',     rarity: 'legendary' },
];

export const RARITY_COLORS: Record<Banner['rarity'], string> = {
  common:    '#9ca3af',
  rare:      '#60a5fa',
  epic:      '#c084fc',
  legendary: '#fbbf24',
};

export function getBanner(id: string | null | undefined): Banner | null {
  if (!id) return null;
  return BANNER_CATALOG.find(b => b.id === id) ?? null;
}
