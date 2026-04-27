'use client';

import { useState, useMemo } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'elements' | 'physics' | 'maths' | 'biology' | 'chemistry';

interface Element  { n: number; sym: string; name: string; mass: string; type: string }
interface EqItem   { eq: string; desc: string }
interface EqGroup  { topic: string; items: EqItem[] }
interface RefItem  { term: string; value: string }
interface RefGroup { topic: string; items: RefItem[] }

// ── Static data ───────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'elements',  label: 'Elements',  icon: '⚛️' },
  { id: 'physics',   label: 'Physics',   icon: '⚡' },
  { id: 'maths',     label: 'Maths',     icon: '📐' },
  { id: 'biology',   label: 'Biology',   icon: '🧬' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪' },
];

const TYPE_COLOR: Record<string, string> = {
  am: '#ef4444', ae: '#f97316', tm: '#eab308',
  pm: '#3b82f6', mt: '#14b8a6', nm: '#22c55e',
  ha: '#a855f7', ng: '#6b7280',
};
const TYPE_NAME: Record<string, string> = {
  am: 'Alkali Metal',       ae: 'Alkaline Earth',
  tm: 'Transition Metal',   pm: 'Post-transition Metal',
  mt: 'Metalloid',          nm: 'Nonmetal',
  ha: 'Halogen',            ng: 'Noble Gas',
};

const ELEMENTS: Element[] = [
  {n:1,  sym:'H',  name:'Hydrogen',   mass:'1',    type:'nm'},
  {n:2,  sym:'He', name:'Helium',     mass:'4',    type:'ng'},
  {n:3,  sym:'Li', name:'Lithium',    mass:'7',    type:'am'},
  {n:4,  sym:'Be', name:'Beryllium',  mass:'9',    type:'ae'},
  {n:5,  sym:'B',  name:'Boron',      mass:'11',   type:'mt'},
  {n:6,  sym:'C',  name:'Carbon',     mass:'12',   type:'nm'},
  {n:7,  sym:'N',  name:'Nitrogen',   mass:'14',   type:'nm'},
  {n:8,  sym:'O',  name:'Oxygen',     mass:'16',   type:'nm'},
  {n:9,  sym:'F',  name:'Fluorine',   mass:'19',   type:'ha'},
  {n:10, sym:'Ne', name:'Neon',       mass:'20',   type:'ng'},
  {n:11, sym:'Na', name:'Sodium',     mass:'23',   type:'am'},
  {n:12, sym:'Mg', name:'Magnesium',  mass:'24',   type:'ae'},
  {n:13, sym:'Al', name:'Aluminium',  mass:'27',   type:'pm'},
  {n:14, sym:'Si', name:'Silicon',    mass:'28',   type:'mt'},
  {n:15, sym:'P',  name:'Phosphorus', mass:'31',   type:'nm'},
  {n:16, sym:'S',  name:'Sulfur',     mass:'32',   type:'nm'},
  {n:17, sym:'Cl', name:'Chlorine',   mass:'35.5', type:'ha'},
  {n:18, sym:'Ar', name:'Argon',      mass:'40',   type:'ng'},
  {n:19, sym:'K',  name:'Potassium',  mass:'39',   type:'am'},
  {n:20, sym:'Ca', name:'Calcium',    mass:'40',   type:'ae'},
  {n:22, sym:'Ti', name:'Titanium',   mass:'48',   type:'tm'},
  {n:24, sym:'Cr', name:'Chromium',   mass:'52',   type:'tm'},
  {n:25, sym:'Mn', name:'Manganese',  mass:'55',   type:'tm'},
  {n:26, sym:'Fe', name:'Iron',       mass:'56',   type:'tm'},
  {n:27, sym:'Co', name:'Cobalt',     mass:'59',   type:'tm'},
  {n:28, sym:'Ni', name:'Nickel',     mass:'59',   type:'tm'},
  {n:29, sym:'Cu', name:'Copper',     mass:'64',   type:'tm'},
  {n:30, sym:'Zn', name:'Zinc',       mass:'65',   type:'tm'},
  {n:35, sym:'Br', name:'Bromine',    mass:'80',   type:'ha'},
  {n:36, sym:'Kr', name:'Krypton',    mass:'84',   type:'ng'},
  {n:47, sym:'Ag', name:'Silver',     mass:'108',  type:'tm'},
  {n:53, sym:'I',  name:'Iodine',     mass:'127',  type:'ha'},
  {n:56, sym:'Ba', name:'Barium',     mass:'137',  type:'ae'},
  {n:79, sym:'Au', name:'Gold',       mass:'197',  type:'tm'},
  {n:80, sym:'Hg', name:'Mercury',    mass:'201',  type:'tm'},
  {n:82, sym:'Pb', name:'Lead',       mass:'207',  type:'pm'},
];

const PHYSICS: EqGroup[] = [
  { topic: 'Forces & Motion', items: [
    { eq: 'F = ma',              desc: 'Force (N) = mass (kg) × acceleration (m/s²)' },
    { eq: 'v = u + at',          desc: 'SUVAT — final velocity from acceleration & time' },
    { eq: 'v² = u² + 2as',      desc: 'SUVAT — velocity from displacement' },
    { eq: 's = ut + ½at²',      desc: 'SUVAT — displacement from time' },
    { eq: 'p = mv',              desc: 'Momentum (kg·m/s) = mass × velocity' },
    { eq: 'F = Δp / Δt',        desc: 'Force = rate of change of momentum' },
    { eq: 'W = mg',              desc: 'Weight (N) = mass × gravitational field strength' },
  ]},
  { topic: 'Energy & Power', items: [
    { eq: 'KE = ½mv²',               desc: 'Kinetic energy (J)' },
    { eq: 'GPE = mgh',                desc: 'Gravitational potential energy (J)' },
    { eq: 'W = Fs',                   desc: 'Work done (J) = force × displacement' },
    { eq: 'P = W / t',               desc: 'Power (W) = work done / time' },
    { eq: 'E = Pt',                   desc: 'Energy (J) = power × time' },
    { eq: 'eff = useful / total',     desc: 'Efficiency — multiply by 100 for %' },
    { eq: 'E = mcΔT',                desc: 'Specific heat capacity equation' },
  ]},
  { topic: 'Waves', items: [
    { eq: 'v = fλ',              desc: 'Wave speed (m/s) = frequency (Hz) × wavelength (m)' },
    { eq: 'f = 1 / T',           desc: 'Frequency (Hz) = 1 / period (s)' },
    { eq: 'n = sin i / sin r',   desc: "Snell's law — refractive index" },
    { eq: 'sin c = 1 / n',       desc: 'Critical angle for total internal reflection' },
  ]},
  { topic: 'Electricity', items: [
    { eq: 'V = IR',          desc: "Ohm's law" },
    { eq: 'P = IV',          desc: 'Power = current × voltage' },
    { eq: 'P = I²R',         desc: 'Power = current² × resistance' },
    { eq: 'P = V² / R',      desc: 'Power = voltage² / resistance' },
    { eq: 'Q = It',          desc: 'Charge (C) = current (A) × time (s)' },
    { eq: 'E = QV',          desc: 'Energy (J) = charge × voltage' },
    { eq: 'V = ε − Ir',      desc: 'Terminal voltage — EMF minus internal resistance drop' },
  ]},
  { topic: 'Nuclear & Space', items: [
    { eq: 'E = mc²',                   desc: 'Mass-energy equivalence' },
    { eq: 'α decay: A−4, Z−2',        desc: 'Alpha emission — loses 4 mass, 2 proton number' },
    { eq: 'β⁻ decay: A same, Z+1',   desc: 'Beta-minus — proton number increases by 1' },
  ]},
];

const MATHS: EqGroup[] = [
  { topic: 'Algebra', items: [
    { eq: 'x = (−b ± √(b²−4ac)) / 2a', desc: 'Quadratic formula for ax² + bx + c = 0' },
    { eq: 'y = mx + c',                  desc: 'Straight line (m = gradient, c = y-intercept)' },
    { eq: 'm = (y₂−y₁) / (x₂−x₁)',    desc: 'Gradient between two points' },
    { eq: 'aᵐ × aⁿ = aᵐ⁺ⁿ',            desc: 'Index law — multiplication' },
    { eq: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ',            desc: 'Index law — division' },
    { eq: '(aᵐ)ⁿ = aᵐⁿ',               desc: 'Index law — power of a power' },
  ]},
  { topic: 'Geometry', items: [
    { eq: 'A = πr²',            desc: 'Area of a circle' },
    { eq: 'C = 2πr',            desc: 'Circumference of a circle' },
    { eq: 'A = ½bh',            desc: 'Area of a triangle' },
    { eq: 'A = ½(a+b)h',       desc: 'Area of a trapezium' },
    { eq: 'V = πr²h',           desc: 'Volume of a cylinder' },
    { eq: 'V = ⅓πr²h',         desc: 'Volume of a cone' },
    { eq: 'V = ⁴⁄₃πr³',        desc: 'Volume of a sphere' },
    { eq: 'SA = 4πr²',          desc: 'Surface area of a sphere' },
  ]},
  { topic: 'Trigonometry', items: [
    { eq: 'sin θ = opp / hyp',    desc: 'SOH' },
    { eq: 'cos θ = adj / hyp',    desc: 'CAH' },
    { eq: 'tan θ = opp / adj',    desc: 'TOA' },
    { eq: 'a² = b² + c²',         desc: "Pythagoras' theorem (right-angled triangles)" },
    { eq: 'a/sin A = b/sin B',     desc: 'Sine rule (any triangle)' },
    { eq: 'a² = b²+c²−2bc cos A', desc: 'Cosine rule (any triangle)' },
    { eq: 'Area = ½ab sin C',     desc: 'Area using two sides and included angle' },
  ]},
  { topic: 'Statistics & Probability', items: [
    { eq: 'mean = Σx / n',                       desc: 'Arithmetic mean' },
    { eq: 'P(A) = favourable / total',            desc: 'Basic probability' },
    { eq: "P(A') = 1 − P(A)",                    desc: 'Complement rule' },
    { eq: 'P(A and B) = P(A) × P(B)',            desc: 'Independent events' },
    { eq: 'P(A or B) = P(A)+P(B)−P(A∩B)',       desc: 'Addition rule' },
    { eq: 'IQR = Q3 − Q1',                       desc: 'Interquartile range' },
  ]},
];

const BIOLOGY: RefGroup[] = [
  { topic: 'Cell Biology', items: [
    { term: 'Diffusion',         value: 'Passive — high → low concentration, no energy needed' },
    { term: 'Osmosis',           value: 'Water through semi-permeable membrane, low → high solute' },
    { term: 'Active transport',  value: 'Against gradient, requires ATP, uses carrier proteins' },
    { term: 'Mitosis',           value: '2 genetically identical diploid daughter cells (growth, repair)' },
    { term: 'Meiosis',           value: '4 genetically unique haploid cells (gametes)' },
  ]},
  { topic: 'Genetics', items: [
    { term: 'Base pairs',        value: 'A–T and C–G (complementary)' },
    { term: 'Codon',             value: '3 bases on mRNA → codes for 1 amino acid' },
    { term: 'Gene',              value: 'Section of DNA that codes for a protein' },
    { term: 'Dominant allele',   value: 'Expressed in heterozygous and homozygous (capital letter)' },
    { term: 'Recessive allele',  value: 'Only expressed when homozygous (lower-case letter)' },
    { term: 'Phenotype',         value: 'Observable characteristics (e.g. eye colour)' },
    { term: 'Genotype',          value: 'Allele combination (e.g. Aa, BB, rr)' },
  ]},
  { topic: 'Respiration', items: [
    { term: 'Aerobic',              value: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O  (+38 ATP)' },
    { term: 'Anaerobic (animals)',  value: 'Glucose → Lactic acid  (+2 ATP)' },
    { term: 'Anaerobic (yeast)',    value: 'Glucose → Ethanol + CO₂  (+2 ATP)' },
  ]},
  { topic: 'Photosynthesis', items: [
    { term: 'Equation',            value: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
    { term: 'Light-dependent',     value: 'Thylakoid membrane — splits water, produces ATP & NADPH' },
    { term: 'Light-independent',   value: 'Stroma — Calvin cycle fixes CO₂ into glucose' },
    { term: 'Limiting factors',    value: 'Light intensity, CO₂ concentration, temperature' },
  ]},
];

const CHEMISTRY: RefGroup[] = [
  { topic: 'Reactivity Series', items: [
    { term: 'Most → least reactive', value: 'K > Na > Li > Ca > Mg > Al > C > Zn > Fe > Ni > Sn > Pb > H > Cu > Ag > Au > Pt' },
    { term: 'Above H',               value: 'React with dilute acids → salt + hydrogen gas' },
    { term: 'Displacement',          value: 'More reactive metal displaces less reactive from its salt' },
  ]},
  { topic: 'Common Ions', items: [
    { term: 'Hydroxide',  value: 'OH⁻' },
    { term: 'Carbonate',  value: 'CO₃²⁻' },
    { term: 'Sulfate',    value: 'SO₄²⁻' },
    { term: 'Nitrate',    value: 'NO₃⁻' },
    { term: 'Phosphate',  value: 'PO₄³⁻' },
    { term: 'Ammonium',   value: 'NH₄⁺' },
    { term: 'Oxide',      value: 'O²⁻' },
  ]},
  { topic: 'Acids, Bases & Salts', items: [
    { term: 'pH < 7',           value: 'Acidic' },
    { term: 'pH = 7',           value: 'Neutral' },
    { term: 'pH > 7',           value: 'Alkaline' },
    { term: 'Acid + metal',     value: 'Salt + hydrogen gas' },
    { term: 'Acid + base',      value: 'Salt + water (neutralisation)' },
    { term: 'Acid + carbonate', value: 'Salt + water + carbon dioxide' },
  ]},
  { topic: 'Organic Chemistry', items: [
    { term: 'Alkanes (CₙH₂ₙ₊₂)',     value: 'Methane, Ethane, Propane, Butane…' },
    { term: 'Alkenes (CₙH₂ₙ)',        value: 'Ethene, Propene…  (C=C double bond, unsaturated)' },
    { term: 'Alcohols (−OH)',          value: 'Methanol, Ethanol, Propanol…' },
    { term: 'Carboxylic acids (−COOH)', value: 'Methanoic acid, Ethanoic acid…' },
    { term: 'Complete combustion',     value: 'Hydrocarbon + O₂ → CO₂ + H₂O' },
    { term: 'Incomplete combustion',   value: 'Also produces CO and soot (carbon particles)' },
    { term: 'Fermentation',            value: 'Glucose → Ethanol + CO₂  (yeast, ~30 °C, anaerobic)' },
    { term: 'Esterification',          value: 'Alcohol + carboxylic acid ⇌ ester + water' },
  ]},
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ElementCard({ el }: { el: Element }) {
  const c = TYPE_COLOR[el.type];
  return (
    <div
      className="rounded-lg p-1.5 cursor-default select-none"
      style={{ backgroundColor: c + '18', borderLeft: `2px solid ${c}70` }}
      title={`${el.name} · ${TYPE_NAME[el.type]}`}
    >
      <div className="text-[9px] text-neutral-500 leading-none">{el.n}</div>
      <div className="text-white font-bold text-sm leading-tight">{el.sym}</div>
      <div className="text-neutral-400 text-[8px] leading-none truncate">{el.name}</div>
      <div className="text-neutral-500 text-[8px] leading-none">{el.mass}</div>
    </div>
  );
}

function EqSection({ groups }: { groups: EqGroup[] }) {
  return (
    <div className="flex flex-col gap-4">
      {groups.map(g => (
        <div key={g.topic} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <h3 className="text-white font-semibold text-sm mb-3">{g.topic}</h3>
          <div className="flex flex-col gap-2">
            {g.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 flex-wrap">
                <code className="bg-neutral-800 text-indigo-300 text-xs px-2.5 py-1.5 rounded-lg font-mono whitespace-nowrap shrink-0">
                  {item.eq}
                </code>
                {item.desc && <span className="text-neutral-400 text-xs mt-1.5">{item.desc}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RefSection({ groups }: { groups: RefGroup[] }) {
  return (
    <div className="flex flex-col gap-4">
      {groups.map(g => (
        <div key={g.topic} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <h3 className="text-white font-semibold text-sm mb-3">{g.topic}</h3>
          <div className="flex flex-col">
            {g.items.map((item, i) => (
              <div key={i} className="flex gap-3 py-1.5 border-b border-neutral-800/50 last:border-0">
                <span className="text-neutral-400 text-xs font-medium shrink-0 w-44">{item.term}</span>
                <span className="text-white text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReferencePage() {
  const [tab,    setTab]    = useState<Tab>('elements');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => search
      ? ELEMENTS.filter(e =>
          e.sym.toLowerCase().startsWith(search.toLowerCase()) ||
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          String(e.n) === search
        )
      : ELEMENTS,
    [search],
  );

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Reference Tools</h1>
            <p className="text-neutral-500 text-sm mt-0.5">
              Quick-reference data for your GCSE revision
            </p>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSearch(''); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border-none cursor-pointer shrink-0 ${
                  tab === t.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ── Elements tab ─────────────────────────────────────────────── */}
          {tab === 'elements' && (
            <>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by symbol, name or atomic number…"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-neutral-500 outline-none focus:border-indigo-500 mb-4"
              />
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
                {Object.entries(TYPE_NAME).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: TYPE_COLOR[key] + '40', outline: `1px solid ${TYPE_COLOR[key]}70` }}
                    />
                    {label}
                  </div>
                ))}
              </div>
              {/* Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12 gap-1.5">
                {filtered.map(el => <ElementCard key={el.n} el={el} />)}
              </div>
              {filtered.length === 0 && (
                <p className="text-neutral-500 text-sm text-center py-10">No elements matched.</p>
              )}
            </>
          )}

          {tab === 'physics'   && <EqSection  groups={PHYSICS}   />}
          {tab === 'maths'     && <EqSection  groups={MATHS}     />}
          {tab === 'biology'   && <RefSection groups={BIOLOGY}   />}
          {tab === 'chemistry' && <RefSection groups={CHEMISTRY} />}

        </div>
      </main>

      <MobileNav />
    </div>
  );
}
