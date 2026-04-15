'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { BANNER_CATALOG, RARITY_COLORS, getBanner, type Banner } from '@/lib/banners';

interface MarketState {
  coins: number;
  activeBannerId: string | null;
  owned: string[];
  loading: boolean;
  actionLoading: string | null;
}

const RARITY_ORDER: Banner['rarity'][] = ['common', 'rare', 'epic', 'legendary'];
const RARITY_LABELS: Record<Banner['rarity'], string> = {
  common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary',
};

function BannerPill({ banner }: { banner: Banner }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: banner.gradient, color: banner.textColor }}
    >
      {banner.emoji} {banner.name}
    </span>
  );
}

export default function MarketplacePage() {
  const [state, setState] = useState<MarketState>({
    coins: 0, activeBannerId: null, owned: [], loading: true, actionLoading: null,
  });
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(() => {
    fetch('/api/marketplace')
      .then(r => r.json())
      .then(d => setState(s => ({ ...s, coins: d.coins ?? 0, activeBannerId: d.activeBannerId ?? null, owned: d.owned ?? [], loading: false })))
      .catch(() => setState(s => ({ ...s, loading: false })));
  }, []);

  useEffect(() => { load(); }, [load]);

  const purchase = async (bannerId: string) => {
    setState(s => ({ ...s, actionLoading: bannerId }));
    const res = await fetch('/api/marketplace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bannerId }),
    });
    const data = await res.json();
    if (res.ok) {
      setState(s => ({ ...s, coins: data.newCoins, owned: [...s.owned, bannerId], actionLoading: null }));
      showToast('Banner purchased!', true);
    } else {
      setState(s => ({ ...s, actionLoading: null }));
      showToast(data.error ?? 'Purchase failed', false);
    }
  };

  const equip = async (bannerId: string | null) => {
    setState(s => ({ ...s, actionLoading: bannerId ?? 'unequip' }));
    const res = await fetch('/api/marketplace/equip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bannerId }),
    });
    if (res.ok) {
      setState(s => ({ ...s, activeBannerId: bannerId, actionLoading: null }));
      showToast(bannerId ? 'Banner equipped!' : 'Banner removed', true);
    } else {
      setState(s => ({ ...s, actionLoading: null }));
      showToast('Action failed', false);
    }
  };

  const activeBanner = getBanner(state.activeBannerId);

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a0a' }}>
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href="/profile" className="text-neutral-400 hover:text-white text-sm no-underline">← Profile</Link>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white m-0">🛒 Banner Marketplace</h1>
              <p className="text-neutral-400 text-sm mt-1 m-0">Earn coins from quizzes. Flex your banner on the leaderboard.</p>
            </div>
            {/* Coin balance */}
            <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl px-5 py-3 flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <div>
                <p className="text-xl font-extrabold text-amber-400 m-0 leading-none">{state.coins.toLocaleString()}</p>
                <p className="text-[10px] text-neutral-500 m-0">Coins</p>
              </div>
            </div>
          </div>

          {/* Leaderboard preview */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-3 m-0">Preview on Leaderboard</p>
            <div className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3">
              <span className="text-amber-400 font-bold text-sm w-6 text-center">#1</span>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {activeBanner ? activeBanner.emoji : 'YO'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">You</span>
                  {activeBanner && <BannerPill banner={activeBanner} />}
                </div>
                <p className="text-xs text-neutral-500 m-0">Scholar · Lv.5</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-amber-400 m-0">1,240</p>
                <p className="text-[10px] text-neutral-500 m-0">XP</p>
              </div>
            </div>
            {!activeBanner && (
              <p className="text-xs text-neutral-600 text-center mt-2 m-0">Equip a banner to see it here</p>
            )}
            {activeBanner && (
              <button
                onClick={() => equip(null)}
                className="w-full mt-3 py-2 text-xs font-semibold text-neutral-400 border border-neutral-700 rounded-xl bg-transparent cursor-pointer hover:border-neutral-500 transition-colors"
              >
                Remove banner
              </button>
            )}
          </div>

          {/* Banner catalog by rarity */}
          {state.loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            RARITY_ORDER.map(rarity => {
              const banners = BANNER_CATALOG.filter(b => b.rarity === rarity);
              return (
                <div key={rarity}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: RARITY_COLORS[rarity] }}>
                      {RARITY_LABELS[rarity]}
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${RARITY_COLORS[rarity]}30` }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {banners.map(banner => {
                      const isOwned = state.owned.includes(banner.id);
                      const isEquipped = state.activeBannerId === banner.id;
                      const canAfford = state.coins >= banner.price;
                      const isLoading = state.actionLoading === banner.id;
                      return (
                        <div
                          key={banner.id}
                          className="rounded-2xl border overflow-hidden"
                          style={{
                            borderColor: isEquipped ? RARITY_COLORS[rarity] : '#2a2a2a',
                            boxShadow: isEquipped ? `0 0 20px ${RARITY_COLORS[rarity]}30` : undefined,
                          }}
                        >
                          {/* Banner gradient preview */}
                          <div className="h-20 flex items-center justify-center relative" style={{ background: banner.gradient }}>
                            <span className="text-4xl drop-shadow-lg">{banner.emoji}</span>
                            {isEquipped && (
                              <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-widest bg-black/40 text-white px-2 py-0.5 rounded-full">
                                Equipped
                              </span>
                            )}
                          </div>
                          <div className="p-4 bg-neutral-900">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <p className="text-sm font-bold text-white m-0">{banner.name}</p>
                                <p className="text-[11px] text-neutral-500 m-0">{banner.desc}</p>
                              </div>
                              <span className="text-[10px] font-black uppercase" style={{ color: RARITY_COLORS[rarity] }}>
                                {rarity}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              {!isOwned ? (
                                <button
                                  onClick={() => purchase(banner.id)}
                                  disabled={!canAfford || !!isLoading}
                                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white cursor-pointer border-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                  style={{ background: canAfford ? banner.gradient : '#333' }}
                                >
                                  {isLoading ? '...' : `🪙 ${banner.price}`}
                                </button>
                              ) : isEquipped ? (
                                <div className="flex-1 text-center text-xs font-bold py-2 rounded-xl" style={{ backgroundColor: `${RARITY_COLORS[rarity]}20`, color: RARITY_COLORS[rarity] }}>
                                  ✓ Equipped
                                </div>
                              ) : (
                                <button
                                  onClick={() => equip(banner.id)}
                                  disabled={!!isLoading}
                                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white cursor-pointer border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-40"
                                >
                                  {isLoading ? '...' : 'Equip'}
                                </button>
                              )}
                            </div>
                            {!isOwned && !canAfford && (
                              <p className="text-[10px] text-rose-400 text-center mt-1.5 m-0">Need {(banner.price - state.coins).toLocaleString()} more 🪙</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          {/* How to earn coins */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 m-0">💡 How to earn coins</h3>
            <ul className="space-y-2 m-0 p-0 list-none">
              {[
                ['Complete a quiz', '+15 🪙'],
                ['Score 80%+', '+10 bonus 🪙'],
                ['Daily streak bonus', '+5 🪙'],
              ].map(([action, reward]) => (
                <li key={action} className="flex justify-between text-sm">
                  <span className="text-neutral-400">{action}</span>
                  <span className="font-semibold text-amber-400">{reward}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl z-50 transition-all"
          style={{ backgroundColor: toast.ok ? '#166534' : '#7f1d1d', color: '#fff', border: `1px solid ${toast.ok ? '#4ade80' : '#f87171'}` }}
        >
          {toast.ok ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      <MobileNav />
    </div>
  );
}
