'use client';

import { useState } from 'react';

interface Equation {
  formula: string;
  words: string;
  units?: string;
}

interface Section {
  title: string;
  color: string;
  equations: Equation[];
}

const SECTIONS: Section[] = [
  {
    title: 'Forces & Motion',
    color: '#60a5fa',
    equations: [
      { formula: 'F = ma', words: 'Force = mass × acceleration', units: 'N' },
      { formula: 'W = mg', words: 'Weight = mass × g', units: 'N' },
      { formula: 'v = u + at', words: 'final vel = initial + acc × time', units: 'm/s' },
      { formula: 's = ½(u+v)t', words: 'displacement = average velocity × time', units: 'm' },
      { formula: 'v² = u² + 2as', words: 'vel² = init² + 2×acc×disp', units: 'm²/s²' },
      { formula: 's = ut + ½at²', words: 'disp = u×t + ½×acc×t²', units: 'm' },
      { formula: 'p = mv', words: 'momentum = mass × velocity', units: 'kg m/s' },
      { formula: 'F·t = Δ(mv)', words: 'impulse = change in momentum', units: 'N s' },
      { formula: 'F = ke', words: "Hooke's Law: force = spring const × extension", units: 'N' },
      { formula: 'M = F × d', words: 'moment = force × perpendicular distance', units: 'N m' },
    ],
  },
  {
    title: 'Energy',
    color: '#fbbf24',
    equations: [
      { formula: 'KE = ½mv²', words: 'kinetic energy = ½ × mass × velocity²', units: 'J' },
      { formula: 'GPE = mgh', words: 'grav. PE = mass × g × height', units: 'J' },
      { formula: 'W = Fd', words: 'work done = force × distance', units: 'J' },
      { formula: 'P = E/t', words: 'power = energy ÷ time', units: 'W' },
      { formula: 'P = Fv', words: 'power = force × velocity', units: 'W' },
      { formula: 'Eff = Eᵤ/Eₜ', words: 'efficiency = useful output ÷ total input', units: '(×100%)' },
      { formula: 'Q = mcΔT', words: 'heat = mass × SHC × temp change', units: 'J' },
    ],
  },
  {
    title: 'Waves',
    color: '#a78bfa',
    equations: [
      { formula: 'v = fλ', words: 'wave speed = frequency × wavelength', units: 'm/s' },
      { formula: 'f = 1/T', words: 'frequency = 1 ÷ period', units: 'Hz' },
      { formula: 'n = sin i / sin r', words: "Snell's Law: refractive index", units: '' },
      { formula: 'n = c/v', words: 'refractive index = c ÷ wave speed', units: '' },
    ],
  },
  {
    title: 'Electricity',
    color: '#34d399',
    equations: [
      { formula: 'V = IR', words: "Ohm's Law: voltage = current × resistance", units: 'V' },
      { formula: 'P = IV', words: 'power = current × voltage', units: 'W' },
      { formula: 'P = I²R', words: 'power = current² × resistance', units: 'W' },
      { formula: 'P = V²/R', words: 'power = voltage² ÷ resistance', units: 'W' },
      { formula: 'E = QV', words: 'energy = charge × voltage', units: 'J' },
      { formula: 'Q = It', words: 'charge = current × time', units: 'C' },
      { formula: 'E = Pt', words: 'energy = power × time', units: 'J' },
      { formula: 'Rₛ = R₁+R₂+…', words: 'series resistance: add values', units: 'Ω' },
      { formula: '1/Rₚ = 1/R₁+…', words: 'parallel resistance: add reciprocals', units: 'Ω' },
      { formula: 'Vₚ/Vₛ = Nₚ/Nₛ', words: 'transformer turns ratio', units: '' },
    ],
  },
  {
    title: 'Pressure & Fluids',
    color: '#f97316',
    equations: [
      { formula: 'P = F/A', words: 'pressure = force ÷ area', units: 'Pa' },
      { formula: 'P = ρgh', words: 'fluid pressure = density × g × depth', units: 'Pa' },
      { formula: 'ρ = m/V', words: 'density = mass ÷ volume', units: 'kg/m³' },
    ],
  },
  {
    title: 'Nuclear & Space',
    color: '#f43f5e',
    equations: [
      { formula: 'E = mc²', words: 'mass–energy equivalence', units: 'J' },
    ],
  },
];

const CONSTANTS = [
  { symbol: 'g', value: '9.8 N/kg', label: 'gravitational field strength (Earth)' },
  { symbol: 'c', value: '3×10⁸ m/s', label: 'speed of light' },
  { symbol: 'e', value: '1.6×10⁻¹⁹ C', label: 'charge of electron' },
];

export function PhysicsEquationSheet() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <div
        className={`hidden lg:flex flex-col shrink-0 border-r border-neutral-800 bg-neutral-950 overflow-y-auto transition-all duration-200 ${open ? 'w-64 xl:w-72' : 'w-10'}`}
        style={{ maxHeight: 'calc(100vh - 56px)', position: 'sticky', top: 56 }}
      >
        {/* Toggle button */}
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center justify-center h-10 w-full border-b border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors shrink-0 cursor-pointer"
          title={open ? 'Collapse equation sheet' : 'Expand equation sheet'}
        >
          {open ? (
            <span className="text-xs font-semibold flex items-center gap-1.5 px-3">
              <span>⚗️</span> Equation Sheet <span className="ml-auto">‹</span>
            </span>
          ) : (
            <span className="text-sm">⚗️</span>
          )}
        </button>

        {open && (
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {SECTIONS.map(section => (
              <div key={section.title}>
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-1.5 px-1"
                  style={{ color: section.color }}
                >
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.equations.map(eq => (
                    <div
                      key={eq.formula}
                      className="rounded-lg px-2.5 py-1.5 border"
                      style={{ borderColor: `${section.color}30`, backgroundColor: `${section.color}08` }}
                    >
                      <p
                        className="text-sm font-mono font-bold m-0 leading-tight"
                        style={{ color: section.color }}
                      >
                        {eq.formula}
                      </p>
                      <p className="text-[10px] text-neutral-500 m-0 leading-snug mt-0.5">{eq.words}</p>
                      {eq.units && (
                        <p className="text-[9px] text-neutral-600 m-0 mt-0.5">unit: {eq.units}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Constants */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 px-1 text-neutral-400">
                Constants
              </p>
              <div className="space-y-1">
                {CONSTANTS.map(c => (
                  <div
                    key={c.symbol}
                    className="rounded-lg px-2.5 py-1.5 border border-neutral-800 bg-neutral-900"
                  >
                    <p className="text-sm font-mono font-bold text-neutral-300 m-0">
                      {c.symbol} = {c.value}
                    </p>
                    <p className="text-[10px] text-neutral-600 m-0">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile: floating button + drawer ── */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-24 left-4 z-50 w-12 h-12 rounded-full bg-blue-600 text-white text-lg shadow-lg flex items-center justify-center cursor-pointer border-0"
          title="Equation sheet"
        >
          ⚗️
        </button>

        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <div
              className="fixed left-0 top-0 h-full w-72 z-50 bg-neutral-950 border-r border-neutral-800 overflow-y-auto"
              style={{ paddingTop: '56px' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                <span className="text-sm font-bold text-white">⚗️ Equation Sheet</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-neutral-400 hover:text-white cursor-pointer border-0 bg-transparent text-lg"
                >
                  ✕
                </button>
              </div>
              <div className="p-3 space-y-4">
                {SECTIONS.map(section => (
                  <div key={section.title}>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest mb-1.5 px-1"
                      style={{ color: section.color }}
                    >
                      {section.title}
                    </p>
                    <div className="space-y-1">
                      {section.equations.map(eq => (
                        <div
                          key={eq.formula}
                          className="rounded-lg px-2.5 py-1.5 border"
                          style={{ borderColor: `${section.color}30`, backgroundColor: `${section.color}08` }}
                        >
                          <p
                            className="text-sm font-mono font-bold m-0 leading-tight"
                            style={{ color: section.color }}
                          >
                            {eq.formula}
                          </p>
                          <p className="text-[10px] text-neutral-500 m-0 leading-snug mt-0.5">{eq.words}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {CONSTANTS.map(c => (
                  <div key={c.symbol} className="rounded-lg px-2.5 py-1.5 border border-neutral-800 bg-neutral-900">
                    <p className="text-sm font-mono font-bold text-neutral-300 m-0">{c.symbol} = {c.value}</p>
                    <p className="text-[10px] text-neutral-600 m-0">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
