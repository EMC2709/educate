'use client';

import { useState } from 'react';

interface MathSymbolPadProps {
  onInsert: (symbol: string) => void;
}

interface SymbolGroup {
  label: string;
  symbols: Array<{ display: string; insert: string; title: string }>;
}

const SYMBOL_GROUPS: SymbolGroup[] = [
  {
    label: 'Powers & Roots',
    symbols: [
      { display: 'x²', insert: '²', title: 'squared' },
      { display: 'x³', insert: '³', title: 'cubed' },
      { display: 'x⁴', insert: '⁴', title: 'to the power 4' },
      { display: 'xⁿ', insert: '^', title: 'power (use ^)' },
      { display: '√', insert: '√', title: 'square root' },
      { display: '∛', insert: '∛', title: 'cube root' },
      { display: '⁻¹', insert: '⁻¹', title: 'inverse / reciprocal' },
      { display: '½', insert: '½', title: 'one half' },
      { display: '¼', insert: '¼', title: 'one quarter' },
      { display: '¾', insert: '¾', title: 'three quarters' },
    ],
  },
  {
    label: 'Operators',
    symbols: [
      { display: '×', insert: '×', title: 'multiply' },
      { display: '÷', insert: '÷', title: 'divide' },
      { display: '±', insert: '±', title: 'plus or minus' },
      { display: '·', insert: '·', title: 'dot product / multiply' },
      { display: '=', insert: ' = ', title: 'equals' },
      { display: '≠', insert: '≠', title: 'not equal to' },
      { display: '≈', insert: '≈', title: 'approximately equal' },
    ],
  },
  {
    label: 'Inequalities',
    symbols: [
      { display: '<', insert: ' < ', title: 'less than' },
      { display: '>', insert: ' > ', title: 'greater than' },
      { display: '≤', insert: '≤', title: 'less than or equal to' },
      { display: '≥', insert: '≥', title: 'greater than or equal to' },
    ],
  },
  {
    label: 'Greek & Special',
    symbols: [
      { display: 'π', insert: 'π', title: 'pi (≈ 3.14159)' },
      { display: 'θ', insert: 'θ', title: 'theta (angle)' },
      { display: 'α', insert: 'α', title: 'alpha' },
      { display: 'β', insert: 'β', title: 'beta' },
      { display: 'λ', insert: 'λ', title: 'lambda (wavelength)' },
      { display: '∞', insert: '∞', title: 'infinity' },
      { display: '°', insert: '°', title: 'degrees' },
      { display: '%', insert: '%', title: 'percent' },
    ],
  },
  {
    label: 'Subscripts',
    symbols: [
      { display: 'x₁', insert: '₁', title: 'subscript 1' },
      { display: 'x₂', insert: '₂', title: 'subscript 2' },
      { display: 'xₙ', insert: 'ₙ', title: 'subscript n' },
    ],
  },
];

export function MathSymbolPad({ onInsert }: MathSymbolPadProps) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <div className="relative inline-block">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-9 px-3 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700 text-sm font-mono cursor-pointer transition-colors flex items-center gap-1.5"
        title="Insert maths symbol"
      >
        <span className="text-base">Ω</span>
        <span className="text-xs hidden sm:inline">Symbols</span>
        <span className="text-xs text-neutral-500">{open ? '▲' : '▼'}</span>
      </button>

      {/* Popup panel */}
      {open && (
        <>
          {/* Click-away backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full mb-2 left-0 z-50 w-80 sm:w-96 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800">
              <span className="text-xs font-bold text-white">Maths Symbols</span>
              <button
                onClick={() => setOpen(false)}
                className="text-neutral-500 hover:text-white cursor-pointer border-0 bg-transparent"
              >
                ✕
              </button>
            </div>

            {/* Group tabs */}
            <div className="flex gap-1 p-2 border-b border-neutral-800 overflow-x-auto">
              {SYMBOL_GROUPS.map((group, i) => (
                <button
                  key={group.label}
                  onClick={() => setActiveGroup(i)}
                  className="shrink-0 text-[10px] px-2.5 py-1 rounded-lg cursor-pointer border-0 transition-colors font-semibold"
                  style={{
                    backgroundColor: activeGroup === i ? '#6366f1' : 'var(--surface-raised)',
                    color: activeGroup === i ? '#fff' : 'var(--text-inactive)',
                  }}
                >
                  {group.label}
                </button>
              ))}
            </div>

            {/* Symbol grid */}
            <div className="p-3 grid grid-cols-5 sm:grid-cols-6 gap-1.5">
              {SYMBOL_GROUPS[activeGroup].symbols.map(sym => (
                <button
                  key={sym.insert}
                  onClick={() => { onInsert(sym.insert); }}
                  title={sym.title}
                  className="h-12 rounded-xl bg-neutral-800 hover:bg-indigo-600 border border-neutral-700 hover:border-indigo-500 text-white font-mono text-base cursor-pointer transition-colors flex flex-col items-center justify-center gap-0.5"
                >
                  <span className="text-lg leading-none">{sym.display}</span>
                </button>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-neutral-800">
              <p className="text-[10px] text-neutral-600 m-0">
                Tap a symbol to insert it at your cursor position.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
