export interface Banner {
  id: string;
  name: string;
  emoji: string;
  price: number;
  gradient: string;
  textColor: string;
  desc: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  texture?: string;      // raw SVG string — encoded at runtime by getBannerBackground
  textureSize?: string;  // CSS background-size for the texture tile, e.g. "60px 60px"
}

// ── SVG texture patterns (semi-transparent, designed to layer over gradients) ──
const T: Record<string, string> = {

  // Wavy rising flame wisps + ember dots
  flame: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="60"><path d="M8,60 C6,42 14,32 10,16 C12,6 14,0 14,0" stroke="rgba(255,200,0,0.22)" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M22,60 C24,40 17,28 21,14 C22,4 20,0 20,0" stroke="rgba(255,150,0,0.18)" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M34,60 C32,46 38,35 35,20" stroke="rgba(255,220,0,0.16)" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="14" cy="28" r="2.2" fill="rgba(255,220,0,0.32)"/><circle cx="28" cy="18" r="1.6" fill="rgba(255,200,0,0.28)"/><circle cx="8" cy="10" r="1.1" fill="rgba(255,240,100,0.38)"/><circle cx="32" cy="42" r="1.4" fill="rgba(255,200,0,0.25)"/></svg>`,

  // Angular fracture network — ice crack lines radiating from nodes
  ice: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><line x1="30" y1="0" x2="20" y2="18" stroke="rgba(255,255,255,0.4)" stroke-width="0.9"/><line x1="20" y1="18" x2="37" y2="28" stroke="rgba(255,255,255,0.4)" stroke-width="0.9"/><line x1="37" y1="28" x2="24" y2="45" stroke="rgba(255,255,255,0.34)" stroke-width="0.9"/><line x1="24" y1="45" x2="30" y2="60" stroke="rgba(255,255,255,0.28)" stroke-width="0.9"/><line x1="37" y1="28" x2="57" y2="34" stroke="rgba(200,240,255,0.3)" stroke-width="0.7"/><line x1="0" y1="24" x2="20" y2="18" stroke="rgba(200,240,255,0.24)" stroke-width="0.7"/><line x1="57" y1="34" x2="60" y2="46" stroke="rgba(200,240,255,0.22)" stroke-width="0.7"/><line x1="20" y1="18" x2="10" y2="37" stroke="rgba(200,240,255,0.2)" stroke-width="0.6"/><line x1="24" y1="45" x2="8" y2="52" stroke="rgba(200,240,255,0.18)" stroke-width="0.6"/><circle cx="20" cy="18" r="2" fill="rgba(255,255,255,0.58)"/><circle cx="37" cy="28" r="1.6" fill="rgba(255,255,255,0.52)"/><circle cx="24" cy="45" r="1.3" fill="rgba(255,255,255,0.47)"/><circle cx="57" cy="34" r="1" fill="rgba(255,255,255,0.4)"/></svg>`,

  // PCB circuit-board traces + solder-joint dots
  neon: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><path d="M0,12 L14,12 L18,8 L32,8 L32,22 L50,22" stroke="rgba(160,230,60,0.4)" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M0,36 L8,36 L8,44 L22,44 L22,38 L50,38" stroke="rgba(30,210,220,0.38)" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M28,0 L28,8" stroke="rgba(160,230,60,0.32)" stroke-width="1.1"/><path d="M22,44 L22,50" stroke="rgba(30,210,220,0.32)" stroke-width="1.1"/><path d="M32,22 L32,36 L50,36" stroke="rgba(30,210,220,0.25)" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="12" r="2.4" fill="rgba(160,230,60,0.58)"/><circle cx="32" cy="8" r="2.4" fill="rgba(30,210,220,0.54)"/><circle cx="8" cy="44" r="2.4" fill="rgba(160,230,60,0.54)"/><circle cx="22" cy="38" r="2.4" fill="rgba(30,210,220,0.54)"/><circle cx="28" cy="0" r="1.6" fill="rgba(160,230,60,0.48)"/><circle cx="32" cy="36" r="1.6" fill="rgba(30,210,220,0.44)"/></svg>`,

  // Honeycomb hexagonal scales
  emerald: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="40"><path d="M17,2 L32,11 L32,29 L17,38 L2,29 L2,11 Z" stroke="rgba(100,255,150,0.32)" stroke-width="1" fill="rgba(100,255,150,0.05)"/><path d="M17,8 L26,13 L26,27 L17,32 L8,27 L8,13 Z" stroke="rgba(100,255,150,0.22)" stroke-width="0.8" fill="none"/><circle cx="17" cy="2"  r="1.5" fill="rgba(100,255,150,0.35)"/><circle cx="32" cy="11" r="1.5" fill="rgba(100,255,150,0.3)"/><circle cx="32" cy="29" r="1.5" fill="rgba(100,255,150,0.3)"/><circle cx="17" cy="38" r="1.5" fill="rgba(100,255,150,0.35)"/><circle cx="2"  cy="29" r="1.5" fill="rgba(100,255,150,0.3)"/><circle cx="2"  cy="11" r="1.5" fill="rgba(100,255,150,0.3)"/></svg>`,

  // Deep-space star field with crescent nebula cloud
  shadow: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><circle cx="12" cy="14" r="1.3" fill="rgba(255,255,255,0.48)"/><circle cx="46" cy="8"  r="1.9" fill="rgba(255,255,255,0.42)"/><circle cx="72" cy="19" r="1.1" fill="rgba(255,255,255,0.52)"/><circle cx="28" cy="52" r="1.5" fill="rgba(255,255,255,0.38)"/><circle cx="63" cy="57" r="1.3" fill="rgba(255,255,255,0.42)"/><circle cx="18" cy="72" r="1.1" fill="rgba(255,255,255,0.38)"/><circle cx="77" cy="73" r="1.6" fill="rgba(255,255,255,0.45)"/><circle cx="53" cy="38" r="0.8" fill="rgba(200,180,255,0.62)"/><circle cx="36" cy="28" r="0.7" fill="rgba(220,200,255,0.58)"/><circle cx="60" cy="25" r="0.6" fill="rgba(200,180,255,0.55)"/><path d="M56,26 Q76,16 76,36 Q76,58 56,52" stroke="rgba(200,180,255,0.14)" stroke-width="11" fill="none" stroke-linecap="round"/></svg>`,

  // Crystal facet cuts — diagonal cross with gem-vertex dots
  ruby: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><line x1="0"  y1="0"  x2="50" y2="50" stroke="rgba(255,255,255,0.12)" stroke-width="1"/><line x1="50" y1="0"  x2="0"  y2="50" stroke="rgba(255,255,255,0.12)" stroke-width="1"/><line x1="25" y1="0"  x2="0"  y2="25" stroke="rgba(255,180,180,0.22)" stroke-width="0.9"/><line x1="25" y1="0"  x2="50" y2="25" stroke="rgba(255,180,180,0.22)" stroke-width="0.9"/><line x1="0"  y1="25" x2="25" y2="50" stroke="rgba(255,180,180,0.22)" stroke-width="0.9"/><line x1="50" y1="25" x2="25" y2="50" stroke="rgba(255,180,180,0.22)" stroke-width="0.9"/><circle cx="25" cy="25" r="5"   fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="0.9"/><circle cx="25" cy="0"  r="2.5" fill="rgba(255,180,180,0.48)"/><circle cx="50" cy="25" r="2.5" fill="rgba(255,180,180,0.44)"/><circle cx="25" cy="50" r="2.5" fill="rgba(255,180,180,0.48)"/><circle cx="0"  cy="25" r="2.5" fill="rgba(255,180,180,0.44)"/><circle cx="25" cy="25" r="1.5" fill="rgba(255,220,220,0.5)"/></svg>`,

  // Solar spiral arms + corona rays + nebula ellipse + star field
  cosmic: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><ellipse cx="50" cy="50" rx="30" ry="10" fill="rgba(150,100,255,0.08)" transform="rotate(-35 50 50)"/><path d="M50,50 Q66,30 82,50 Q98,70 76,84 Q54,98 38,80 Q22,62 38,44 Q54,26 50,50" stroke="rgba(255,180,255,0.36)" stroke-width="1.6" fill="none"/><path d="M50,50 Q34,70 18,50 Q2,30 24,16 Q46,2 62,20 Q78,38 50,50" stroke="rgba(180,150,255,0.3)" stroke-width="1.3" fill="none"/><circle cx="50" cy="50" r="4" fill="rgba(255,220,255,0.42)"/><line x1="50" y1="50" x2="50" y2="14" stroke="rgba(255,200,255,0.26)" stroke-width="0.9"/><line x1="50" y1="50" x2="78" y2="26" stroke="rgba(255,200,255,0.2)"  stroke-width="0.9"/><line x1="50" y1="50" x2="86" y2="50" stroke="rgba(255,200,255,0.26)" stroke-width="0.9"/><line x1="50" y1="50" x2="22" y2="26" stroke="rgba(255,200,255,0.2)"  stroke-width="0.9"/><line x1="50" y1="50" x2="14" y2="50" stroke="rgba(255,200,255,0.26)" stroke-width="0.9"/><circle cx="8"  cy="8"  r="2.2" fill="rgba(255,255,255,0.68)"/><circle cx="92" cy="5"  r="1.5" fill="rgba(255,255,255,0.62)"/><circle cx="96" cy="86" r="2.2" fill="rgba(255,255,255,0.68)"/><circle cx="4"  cy="92" r="1.5" fill="rgba(255,255,255,0.58)"/><circle cx="54" cy="3"  r="1.1" fill="rgba(255,240,255,0.72)"/><circle cx="99" cy="52" r="1.1" fill="rgba(255,240,255,0.68)"/><circle cx="28" cy="78" r="1.1" fill="rgba(255,240,255,0.62)"/><circle cx="74" cy="14" r="0.8" fill="rgba(255,255,255,0.55)"/></svg>`,

  // Ornate fleur-de-lis filigree on a rotated diamond grid
  gold: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M30,0 L60,30 L30,60 L0,30 Z" stroke="rgba(255,220,100,0.26)" stroke-width="0.9" fill="none"/><path d="M30,18 Q37,24 30,30 Q23,24 30,18 Z" stroke="rgba(255,220,100,0.42)" stroke-width="0.7" fill="rgba(255,220,100,0.1)"/><path d="M30,30 Q37,36 30,42 Q23,36 30,30 Z" stroke="rgba(255,220,100,0.42)" stroke-width="0.7" fill="rgba(255,220,100,0.1)"/><path d="M18,30 Q24,37 30,30 Q24,23 18,30 Z" stroke="rgba(255,220,100,0.42)" stroke-width="0.7" fill="rgba(255,220,100,0.1)"/><path d="M42,30 Q36,23 30,30 Q36,37 42,30 Z" stroke="rgba(255,220,100,0.42)" stroke-width="0.7" fill="rgba(255,220,100,0.1)"/><circle cx="30" cy="30" r="3.5" fill="rgba(255,220,100,0.35)" stroke="rgba(255,220,100,0.5)" stroke-width="0.6"/><circle cx="0"  cy="0"  r="3"   fill="rgba(255,220,100,0.32)"/><circle cx="60" cy="0"  r="3"   fill="rgba(255,220,100,0.32)"/><circle cx="0"  cy="60" r="3"   fill="rgba(255,220,100,0.32)"/><circle cx="60" cy="60" r="3"   fill="rgba(255,220,100,0.32)"/><circle cx="30" cy="0"  r="1.8" fill="rgba(255,220,100,0.4)"/><circle cx="60" cy="30" r="1.8" fill="rgba(255,220,100,0.4)"/><circle cx="30" cy="60" r="1.8" fill="rgba(255,220,100,0.4)"/><circle cx="0"  cy="30" r="1.8" fill="rgba(255,220,100,0.4)"/></svg>`,
};

export const BANNER_CATALOG: Banner[] = [
  { id: 'flame',   name: 'Flame',      emoji: '🔥', price: 100, gradient: 'linear-gradient(135deg,#ef4444,#f97316)', textColor: '#fff', desc: 'Blaze of glory',      rarity: 'common',    texture: T.flame,   textureSize: '40px 60px' },
  { id: 'ice',     name: 'Ice',        emoji: '❄️',  price: 100, gradient: 'linear-gradient(135deg,#38bdf8,#818cf8)', textColor: '#fff', desc: 'Cool under pressure', rarity: 'common',    texture: T.ice,     textureSize: '60px 60px' },
  { id: 'neon',    name: 'Neon',       emoji: '⚡',  price: 200, gradient: 'linear-gradient(135deg,#a3e635,#22d3ee)', textColor: '#000', desc: 'Electric energy',     rarity: 'rare',      texture: T.neon,    textureSize: '50px 50px' },
  { id: 'emerald', name: 'Emerald',    emoji: '💚',  price: 200, gradient: 'linear-gradient(135deg,#4ade80,#059669)', textColor: '#fff', desc: 'Natural power',       rarity: 'rare',      texture: T.emerald, textureSize: '34px 40px' },
  { id: 'shadow',  name: 'Shadow',     emoji: '🌙',  price: 300, gradient: 'linear-gradient(135deg,#312e81,#6366f1)', textColor: '#fff', desc: 'Dark scholar',        rarity: 'epic',      texture: T.shadow,  textureSize: '80px 80px' },
  { id: 'ruby',    name: 'Ruby',       emoji: '💎',  price: 300, gradient: 'linear-gradient(135deg,#f43f5e,#be123c)', textColor: '#fff', desc: 'Rare & precious',     rarity: 'epic',      texture: T.ruby,    textureSize: '50px 50px' },
  { id: 'cosmic',  name: 'Cosmic',     emoji: '🌌',  price: 500, gradient: 'linear-gradient(135deg,#6366f1,#ec4899)', textColor: '#fff', desc: 'From the cosmos',     rarity: 'legendary', texture: T.cosmic,  textureSize: '100px 100px' },
  { id: 'gold',    name: 'Royal Gold', emoji: '👑',  price: 500, gradient: 'linear-gradient(135deg,#f59e0b,#b45309)', textColor: '#fff', desc: 'Fit for royalty',     rarity: 'legendary', texture: T.gold,    textureSize: '60px 60px' },
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

/**
 * Returns a CSS `background` value that layers:
 *   dark overlay  →  texture (if any)  →  banner gradient
 *
 * Slightly reduces overlay opacity when a texture is present so the
 * pattern shows through more clearly.
 */
export function getBannerBackground(banner: Banner, overlayOpacity?: number): string {
  const op = overlayOpacity ?? (banner.texture ? 0.70 : 0.76);
  const overlay = `linear-gradient(rgba(8,8,12,${op}),rgba(8,8,12,${op}))`;
  if (!banner.texture) return `${overlay},${banner.gradient}`;
  const enc = encodeURIComponent(banner.texture);
  return `${overlay},url("data:image/svg+xml,${enc}"),${banner.gradient}`;
}

/**
 * Companion `backgroundSize` for getBannerBackground.
 * Returns undefined when no texture (no override needed).
 */
export function getBannerBackgroundSize(banner: Banner): string | undefined {
  if (!banner.texture) return undefined;
  // 3 layers: overlay (full), texture (tiled), gradient (full)
  return `100% 100%,${banner.textureSize ?? '60px 60px'},100% 100%`;
}
