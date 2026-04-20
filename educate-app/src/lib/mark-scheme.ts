/**
 * Professional GCSE mark-scheme engine.
 *
 * Fully deterministic — does NOT require AI to score.
 *
 * Multi-strategy scoring:
 *   1. Exact/near-exact match against any accepted answer
 *   2. Numerical equivalence (handles decimals, fractions, scientific notation)
 *   3. Formula match (normalised operators, order-independent comparison)
 *   4. Marking-point coverage (splits model answer into sentence-level points)
 *   5. Key-phrase coverage with stemming + synonyms (fallback)
 *
 * All strategies run, the best-scoring result wins.
 */

// ═══════════════════════════════════════════════════════════════════════
// 1. SYMBOL & UNICODE NORMALISATION
// ═══════════════════════════════════════════════════════════════════════

/** Map unicode maths/science symbols to ASCII equivalents. */
const SYMBOL_MAP: Record<string, string> = {
  // Multiplication / division / subtraction
  '\u00d7': '*',    // ×
  '\u22c5': '*',    // ⋅
  '\u2022': '*',    // •
  '\u00b7': '*',    // ·
  '\u00f7': '/',    // ÷
  '\u2212': '-',    // −
  '\u2013': '-',    // –
  '\u2014': '-',    // —
  // Superscripts
  '\u2070': '^0', '\u00b9': '^1', '\u00b2': '^2', '\u00b3': '^3',
  '\u2074': '^4', '\u2075': '^5', '\u2076': '^6', '\u2077': '^7',
  '\u2078': '^8', '\u2079': '^9',
  '\u207a': '+',  '\u207b': '-',
  // Subscripts
  '\u2080': '0', '\u2081': '1', '\u2082': '2', '\u2083': '3',
  '\u2084': '4', '\u2085': '5', '\u2086': '6', '\u2087': '7',
  '\u2088': '8', '\u2089': '9',
  // Common fractions
  '\u00bd': '0.5',   '\u00bc': '0.25',  '\u00be': '0.75',
  '\u2153': '0.333', '\u2154': '0.667',
  '\u2155': '0.2',   '\u2156': '0.4',   '\u2157': '0.6', '\u2158': '0.8',
  '\u2159': '0.167', '\u215a': '0.833',
  // Comparison
  '\u2264': '<=',  '\u2265': '>=',  '\u2260': '!=',  '\u2248': '~',
  // Greek letters commonly used
  '\u03c0': 'pi',    '\u03b8': 'theta', '\u03bb': 'lambda',
  '\u03b1': 'alpha', '\u03b2': 'beta',  '\u03b3': 'gamma',
  '\u03b4': 'delta', '\u03bc': 'mu',    '\u03a9': 'ohm',
  '\u03c1': 'rho',   '\u03c3': 'sigma', '\u03c6': 'phi', '\u03c9': 'omega',
  // Misc
  '\u00b0': 'deg',   '\u221e': 'inf',
  '\u221a': 'sqrt',  '\u221b': 'cbrt',
  '\u00b1': '+-',
  // Curly quotes
  '\u2018': "'", '\u2019': "'", '\u201c': '"', '\u201d': '"',
  // Non-breaking space
  '\u00a0': ' ',
};

function normaliseSymbols(s: string): string {
  let out = s;
  for (const key of Object.keys(SYMBOL_MAP)) {
    if (out.includes(key)) {
      out = out.split(key).join(SYMBOL_MAP[key]);
    }
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════════════
// 2. GCSE SYNONYM DICTIONARY
// ═══════════════════════════════════════════════════════════════════════

/** Groups of interchangeable terms. First item is the canonical form. */
const SYNONYM_GROUPS: string[][] = [
  // Chemistry — compounds & formulas
  ['water', 'h2o'],
  ['carbon dioxide', 'co2'],
  ['oxygen', 'o2', 'dioxygen'],
  ['nitrogen', 'n2'],
  ['hydrogen', 'h2'],
  ['methane', 'ch4'],
  ['ammonia', 'nh3'],
  ['sodium chloride', 'nacl'],
  ['hydrochloric acid', 'hcl'],
  ['sulfuric acid', 'sulphuric acid', 'h2so4'],
  ['nitric acid', 'hno3'],
  ['sodium hydroxide', 'naoh'],
  ['calcium carbonate', 'caco3'],
  ['glucose', 'c6h12o6', 'sugar'],
  // Biology
  ['adenosine triphosphate', 'atp'],
  ['deoxyribonucleic acid', 'dna'],
  ['ribonucleic acid', 'rna'],
  ['messenger rna', 'mrna'],
  ['follicle stimulating hormone', 'fsh'],
  ['luteinising hormone', 'luteinizing hormone', 'lh'],
  ['antidiuretic hormone', 'anti-diuretic hormone', 'adh'],
  // Physics — quantities
  ['kinetic energy', 'ke'],
  ['gravitational potential energy', 'gpe', 'potential energy'],
  ['electromotive force', 'emf'],
  ['specific heat capacity', 'shc'],
  // Physics — units
  ['ohm', 'ohms'],
  ['volt', 'volts'],
  ['ampere', 'amp', 'amps', 'amperes'],
  ['watt', 'watts'],
  ['joule', 'joules'],
  ['hertz', 'hz'],
  ['newton', 'newtons'],
  ['pascal', 'pascals'],
  ['kilogram', 'kilograms', 'kilo', 'kilos'],
  ['metre', 'meter', 'metres', 'meters'],
  ['kilometre', 'kilometer', 'km'],
  ['millimetre', 'millimeter', 'mm'],
  ['centimetre', 'centimeter', 'cm'],
  ['second', 'seconds'],
  ['celsius', 'centigrade'],
  // Maths
  ['gradient', 'slope'],
  ['y-intercept', 'intercept'],
  ['equation', 'formula'],
  ['solution', 'root'],
  ['coefficient', 'constant'],
  ['hypotenuse', 'hyp'],
  ['perpendicular', 'perp', 'at right angles'],
  ['parallel', 'par'],
  ['simplify', 'simplified'],
  ['factorise', 'factorize', 'factor'],
  ['multiply', 'times', 'product of'],
  ['divide', 'divided by'],
  ['subtract', 'minus', 'take away'],
  ['add', 'plus', 'sum of'],
  // General academic
  ['because', 'since', 'as'],
  ['therefore', 'thus', 'hence', 'so'],
  ['however', 'although', 'whilst', 'while'],
  ['increases', 'rises', 'grows', 'goes up'],
  ['decreases', 'falls', 'drops', 'goes down', 'reduces'],
  ['absorb', 'absorbed', 'absorbs', 'absorption'],
  ['release', 'released', 'releases', 'releasing', 'emit', 'emits', 'emitted'],
  ['produce', 'produced', 'produces', 'create', 'creates', 'created'],
  // Plurals / forms
  ['mitochondria', 'mitochondrion', 'mitochondrial'],
  ['nucleus', 'nuclei', 'nuclear'],
  ['chromosome', 'chromosomes', 'chromosomal'],
  ['gene', 'genes', 'genetic'],
  ['allele', 'alleles'],
  ['enzyme', 'enzymes', 'enzymatic'],
  ['hormone', 'hormones', 'hormonal'],
  ['organ', 'organs'],
  ['cell', 'cells', 'cellular'],
  ['organism', 'organisms'],
  ['photosynthesis', 'photosynthetic', 'photosynthesise', 'photosynthesize'],
  ['respiration', 'respire', 'respiring', 'respires'],
];

/** Build lookup: any variant → canonical form. */
function buildSynonymIndex(): Map<string, string> {
  const map = new Map<string, string>();
  for (const group of SYNONYM_GROUPS) {
    const canonical = group[0];
    for (const variant of group) {
      map.set(variant.toLowerCase(), canonical);
    }
  }
  return map;
}
const SYNONYM_INDEX = buildSynonymIndex();

/** Look up the canonical form of a word. */
function canonicalise(word: string): string {
  return SYNONYM_INDEX.get(word) ?? word;
}

// ═══════════════════════════════════════════════════════════════════════
// 3. NORMALISATION PIPELINE
// ═══════════════════════════════════════════════════════════════════════

const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'as', 'from',
  'and', 'or', 'but', 'if', 'then', 'that', 'this', 'these', 'those',
  'it', 'its', 'they', 'them', 'their', 'which', 'who', 'what',
  'has', 'have', 'had', 'do', 'does', 'did', 'can', 'will', 'would',
  'should', 'could', 'may', 'might', 'must', 'shall', 'we', 'us', 'our',
  'you', 'your', 'i', 'me', 'my', 'he', 'she', 'him', 'her',
  'also', 'not', 'no', 'any', 'all', 'some', 'more', 'most', 'each',
  'such', 'so', 'than', 'very', 'just', 'only', 'one',
  'e', 'g', 'eg', 'ie', 'etc', 'example', 'examples',
  'how', 'why', 'when', 'where', 'there', 'here',
]);

/** Primary normaliser — keeps maths operators so formulas survive. */
function normalise(s: string): string {
  return normaliseSymbols(s)
    .toLowerCase()
    .replace(/[^\w\s^+\-*/=<>.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Aggressive — strip everything except alphanumerics and maths operators. */
function flatNorm(s: string): string {
  return normaliseSymbols(s)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9+\-*/^=<>.]/g, '');
}

/** Crude suffix stripper for loose matching. Handles comparatives/superlatives. */
function stem(w: string): string {
  if (w.length <= 4) return w;
  return w
    // Comparative/superlative first (higher→high, greater→great, etc.)
    .replace(/ier$/, 'y')     // happier → happy
    .replace(/iest$/, 'y')    // happiest → happy
    .replace(/er$/, '')       // higher → high, lower → low, greater → great
    .replace(/est$/, '')      // highest → high, lowest → low
    // Then standard suffixes
    .replace(/(ies|ied|ing|ly|es|ed|s)$/, '')
    .replace(/(ation|ments?|ness|ity|ties|ous|ive|al)$/, '');
}

// ═══════════════════════════════════════════════════════════════════════
// 4. NUMBER EXTRACTION & COMPARISON
// ═══════════════════════════════════════════════════════════════════════

/** Extract all numeric values from a string. Handles:
 *    - plain ints/decimals (25, 3.14)
 *    - scientific notation (4.57e-4, 4.57 × 10^-4 → 4.57e-4 after normalisation)
 *    - negatives
 */
function extractNumbers(s: string): number[] {
  // After symbol normalisation, × 10 ^ -4 becomes *10^-4
  const normalised = normaliseSymbols(s);
  const out: number[] = [];

  // Match scientific notation written as "N * 10^M" or "N x 10^M"
  const sciRegex = /(-?\d+(?:\.\d+)?)\s*[*x]\s*10\s*\^\s*(-?\d+)/gi;
  let m: RegExpExecArray | null;
  const consumed: Array<[number, number]> = [];
  while ((m = sciRegex.exec(normalised)) !== null) {
    const mantissa = parseFloat(m[1]);
    const exp = parseInt(m[2], 10);
    if (!isNaN(mantissa) && !isNaN(exp)) {
      out.push(mantissa * Math.pow(10, exp));
      consumed.push([m.index, m.index + m[0].length]);
    }
  }

  // Remove consumed spans before plain-number scan
  let cleaned = normalised;
  for (let i = consumed.length - 1; i >= 0; i--) {
    cleaned = cleaned.slice(0, consumed[i][0]) + ' '.repeat(consumed[i][1] - consumed[i][0]) + cleaned.slice(consumed[i][1]);
  }

  // Match remaining numbers (including e-notation: 4.57e-4)
  const numRegex = /-?\d+(?:\.\d+)?(?:[eE]-?\d+)?/g;
  while ((m = numRegex.exec(cleaned)) !== null) {
    const n = parseFloat(m[0]);
    if (!isNaN(n) && isFinite(n)) out.push(n);
  }

  return out;
}

/** Compare two numbers with relative tolerance (1% by default). */
function numbersMatch(a: number, b: number, tol = 0.01): boolean {
  if (a === b) return true;
  const diff = Math.abs(a - b);
  if (a === 0 || b === 0) return diff < tol;
  const rel = diff / Math.max(Math.abs(a), Math.abs(b));
  return rel <= tol;
}

// ═══════════════════════════════════════════════════════════════════════
// 5. TOKENISATION & KEY-PHRASE EXTRACTION
// ═══════════════════════════════════════════════════════════════════════

/** Build a set of tokens (canonical + stemmed) for the student's answer. */
function tokeniseForMatching(text: string): Set<string> {
  const words = normalise(text).split(' ').filter(Boolean);
  const tokens = new Set<string>();
  for (const w of words) {
    const canon = canonicalise(w);
    tokens.add(canon);
    tokens.add(stem(canon));
    tokens.add(w);        // original form too
    tokens.add(stem(w));
  }
  return tokens;
}

/** Check if a term (single word or "word word" phrase) is covered by user tokens. */
function isTermCovered(term: string, userTokens: Set<string>, userNormFull: string): boolean {
  const words = term.split(' ');
  for (const w of words) {
    const canon = canonicalise(w);
    const matched =
      userTokens.has(w) ||
      userTokens.has(stem(w)) ||
      userTokens.has(canon) ||
      userTokens.has(stem(canon)) ||
      userNormFull.includes(w) ||
      userNormFull.includes(canon);
    if (!matched) return false;
  }
  return true;
}

/** Extract weighted key terms from a model answer. */
export function extractKeyTerms(modelAnswer: string): string[] {
  const words = normalise(modelAnswer).split(' ').filter(Boolean);
  const terms = new Set<string>();

  // Single content words (canonicalised & stemmed)
  for (const w of words) {
    const canon = canonicalise(w);
    if (canon.length >= 3 && !STOPWORDS.has(canon)) {
      terms.add(canon);
    }
  }

  // Two-word phrases (both content words)
  for (let i = 0; i < words.length - 1; i++) {
    const a = canonicalise(words[i]);
    const b = canonicalise(words[i + 1]);
    if (a.length >= 3 && b.length >= 3 && !STOPWORDS.has(a) && !STOPWORDS.has(b)) {
      terms.add(`${a} ${b}`);
    }
  }

  return Array.from(terms);
}

// ═══════════════════════════════════════════════════════════════════════
// 6. MARKING-POINT EXTRACTION
// ═══════════════════════════════════════════════════════════════════════

/** Split a model answer into logical marking points (sentences/clauses). */
function extractMarkingPoints(modelAnswer: string): string[] {
  return modelAnswer
    .replace(/\([a-z]\)|\([ivx]+\)|\d\.\s/gi, ' ') // strip numbering: (a) (b) (i) 1.
    .split(/[.!?;]\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length >= 8);
}

// ═══════════════════════════════════════════════════════════════════════
// 7. RESULT TYPE
// ═══════════════════════════════════════════════════════════════════════

export interface ScoreResult {
  marksAwarded: number;
  maxMarks: number;
  coverage: number;
  matchedTerms: string[];
  missedTerms: string[];
  correct: boolean;
  strategy?: string;
}

function emptyResult(maxMarks: number): ScoreResult {
  return { marksAwarded: 0, maxMarks, coverage: 0, matchedTerms: [], missedTerms: [], correct: false };
}

// ═══════════════════════════════════════════════════════════════════════
// 8. SCORING STRATEGIES
// ═══════════════════════════════════════════════════════════════════════

/** Strategy 1: Exact / substring match against any accepted answer.
 *  Awards FULL MARKS if the student clearly contains (or equals) an accepted answer.
 */
function exactMatchStrategy(
  userAnswer: string,
  candidates: string[],
  maxMarks: number,
): ScoreResult | null {
  const u = flatNorm(userAnswer);
  if (!u) return null;

  for (const candidate of candidates) {
    if (!candidate) continue;
    const c = flatNorm(candidate);
    if (!c) continue;

    // Short candidate (e.g. "48", "f=ma", "xequals4"): substring match either direction
    if (c.length <= 20) {
      if (u === c || u.includes(c) || (c.length >= 3 && c.includes(u) && u.length >= c.length * 0.6)) {
        return {
          marksAwarded: maxMarks,
          maxMarks,
          coverage: 1,
          matchedTerms: [candidate],
          missedTerms: [],
          correct: true,
          strategy: 'exact',
        };
      }
    } else {
      // Longer candidate: user must contain most of it, or equal it,
      // OR share very high token overlap (Jaccard >= 0.75 on content words).
      const uTokens = new Set(u.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(t => t.length >= 3));
      const cTokens = new Set(c.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(t => t.length >= 3));
      const intersection = [...uTokens].filter(t => cTokens.has(t)).length;
      const union = new Set([...uTokens, ...cTokens]).size;
      const jaccard = union > 0 ? intersection / union : 0;

      if (u === c || (u.includes(c) && u.length <= c.length * 1.5) || jaccard >= 0.75) {
        return {
          marksAwarded: maxMarks,
          maxMarks,
          coverage: 1,
          matchedTerms: [candidate.slice(0, 60)],
          missedTerms: [],
          correct: true,
          strategy: 'exact',
        };
      }
    }
  }
  return null;
}

/** Strategy 2: Numerical equivalence.
 *  If all numbers in a candidate answer appear (within tolerance) in the user answer,
 *  that's a strong signal of correctness.
 */
function numericalStrategy(
  userAnswer: string,
  candidates: string[],
  maxMarks: number,
): ScoreResult | null {
  const userNums = extractNumbers(userAnswer);
  if (userNums.length === 0) return null;

  let bestCoverage = 0;
  let bestMatched: string[] = [];
  let bestMissed: string[] = [];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const candNums = extractNumbers(candidate);
    if (candNums.length === 0) continue;

    // For "answer = 48" questions we only care about the FINAL number,
    // which tends to be the last one in the model answer.
    // Take the last number as the "primary" answer.
    const primary = candNums[candNums.length - 1];
    const primaryHit = userNums.some(un => numbersMatch(un, primary));

    const matched: string[] = [];
    const missed: string[] = [];
    for (const cn of candNums) {
      if (userNums.some(un => numbersMatch(un, cn))) {
        matched.push(String(cn));
      } else {
        missed.push(String(cn));
      }
    }

    // Coverage: weight the primary answer more heavily
    const base = matched.length / candNums.length;
    const coverage = primaryHit ? Math.max(base, 0.9) : base;

    if (coverage > bestCoverage) {
      bestCoverage = coverage;
      bestMatched = matched;
      bestMissed = missed;
    }
  }

  if (bestCoverage < 0.5) return null;

  const marks = Math.round(bestCoverage * maxMarks);
  return {
    marksAwarded: Math.min(maxMarks, marks),
    maxMarks,
    coverage: bestCoverage,
    matchedTerms: bestMatched,
    missedTerms: bestMissed,
    correct: bestCoverage >= 0.8,
    strategy: 'numerical',
  };
}

/** Strategy 3: Marking-point coverage.
 *  Splits the model answer into sentence-level points. A point is "awarded" if
 *  the student's answer covers at least half of its key content words.
 *  Best for 3+ mark questions.
 */
function markingPointsStrategy(
  userAnswer: string,
  modelAnswer: string,
  maxMarks: number,
): ScoreResult {
  const points = extractMarkingPoints(modelAnswer);
  if (points.length < 1) {
    return emptyResult(maxMarks);
  }

  const userTokens = tokeniseForMatching(userAnswer);
  const userNorm = normalise(userAnswer);

  const matched: string[] = [];
  const missed: string[] = [];

  for (const point of points) {
    const terms = extractKeyTerms(point);
    if (terms.length === 0) continue;

    let hits = 0;
    for (const t of terms) {
      if (isTermCovered(t, userTokens, userNorm)) hits++;
    }
    const frac = hits / terms.length;

    if (frac >= 0.4) {
      matched.push(point.slice(0, 70) + (point.length > 70 ? '…' : ''));
    } else {
      missed.push(point.slice(0, 70) + (point.length > 70 ? '…' : ''));
    }
  }

  const total = matched.length + missed.length;
  if (total === 0) return emptyResult(maxMarks);

  const coverage = matched.length / total;

  // Length sanity check: answer that's way too short shouldn't get top marks.
  const userWordCount = userAnswer.split(/\s+/).filter(Boolean).length;
  const expected = Math.max(4, Math.min(maxMarks * 5, 40));
  const lengthFactor = Math.min(1, userWordCount / expected);

  const raw = coverage * lengthFactor * maxMarks;
  const marks = Math.max(0, Math.min(maxMarks, Math.round(raw)));

  return {
    marksAwarded: marks,
    maxMarks,
    coverage,
    matchedTerms: matched,
    missedTerms: missed,
    correct: marks >= Math.max(1, Math.ceil(maxMarks * 0.5)),
    strategy: 'marking-points',
  };
}

/** Strategy 4: Weighted key-phrase coverage (fallback). */
function keyPhraseStrategy(
  userAnswer: string,
  modelAnswer: string,
  maxMarks: number,
): ScoreResult {
  const keyTerms = extractKeyTerms(modelAnswer);
  if (keyTerms.length === 0) return emptyResult(maxMarks);

  const userTokens = tokeniseForMatching(userAnswer);
  const userNorm = normalise(userAnswer);

  const matched: string[] = [];
  const missed: string[] = [];

  for (const term of keyTerms) {
    if (isTermCovered(term, userTokens, userNorm)) matched.push(term);
    else missed.push(term);
  }

  // Two-word phrases weighted more heavily (more specific).
  const weight = (t: string) => (t.includes(' ') ? 1.8 : 1);
  const total = keyTerms.reduce((s, t) => s + weight(t), 0);
  const hit = matched.reduce((s, t) => s + weight(t), 0);
  const coverage = total > 0 ? hit / total : 0;

  // Soft length factor — don't heavily penalise short correct answers.
  const userWords = userAnswer.split(/\s+/).filter(Boolean).length;
  const modelWords = modelAnswer.split(/\s+/).filter(Boolean).length;
  const minExpected = Math.max(2, Math.min(modelWords * 0.15, maxMarks * 3));
  const lengthFactor = Math.min(1, userWords / minExpected);

  const raw = coverage * lengthFactor * maxMarks;
  const marks = Math.max(0, Math.min(maxMarks, Math.round(raw)));

  return {
    marksAwarded: marks,
    maxMarks,
    coverage,
    matchedTerms: matched,
    missedTerms: missed,
    correct: marks >= Math.max(1, Math.ceil(maxMarks * 0.5)),
    strategy: 'key-phrase',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// 9. MAIN SCORING API
// ═══════════════════════════════════════════════════════════════════════

/**
 * Score a student's answer against a model answer (with optional accepted variants).
 * Runs all strategies and returns the highest-scoring result.
 */
export function scoreAnswer(
  userAnswer: string,
  modelAnswer: string,
  maxMarks: number,
  acceptedAnswers?: string[],
): ScoreResult {
  if (maxMarks <= 0 || !userAnswer || !userAnswer.trim()) {
    return emptyResult(Math.max(0, maxMarks));
  }

  const candidates = [modelAnswer, ...(acceptedAnswers ?? [])].filter(c => typeof c === 'string' && c.length > 0);
  if (candidates.length === 0) return emptyResult(maxMarks);

  const results: ScoreResult[] = [];

  // Strategy 1: exact match — if it wins, return immediately (full marks)
  const exact = exactMatchStrategy(userAnswer, candidates, maxMarks);
  if (exact) return exact;

  // Strategy 2: numerical
  const numerical = numericalStrategy(userAnswer, candidates, maxMarks);
  if (numerical) results.push(numerical);

  // Strategies 3 & 4: run against every candidate (model + accepted answers), keep the best
  for (const candidate of candidates) {
    results.push(markingPointsStrategy(userAnswer, candidate, maxMarks));
    results.push(keyPhraseStrategy(userAnswer, candidate, maxMarks));
  }

  // Extra pass: key-phrase strategy using the COMBINED text of all candidates.
  // This helps when the model answer is verbose but acceptedAnswers use simpler terms.
  if (candidates.length > 1) {
    const combined = candidates.join('. ');
    results.push(keyPhraseStrategy(userAnswer, combined, maxMarks));
  }

  if (results.length === 0) return emptyResult(maxMarks);

  // Pick the best — highest marks, tiebreak by coverage
  results.sort((a, b) => {
    if (b.marksAwarded !== a.marksAwarded) return b.marksAwarded - a.marksAwarded;
    return b.coverage - a.coverage;
  });
  return results[0];
}

// ═══════════════════════════════════════════════════════════════════════
// 10. FEEDBACK GENERATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Build a deterministic feedback message from a scoring result.
 * No AI required — safe to use as the primary feedback source.
 */
export function buildFallbackFeedback(score: ScoreResult): string {
  const { marksAwarded, maxMarks, matchedTerms, missedTerms } = score;

  // Perfect score
  if (marksAwarded === maxMarks) {
    return 'Full marks — your answer covers all the required points. Well done.';
  }

  // Zero marks
  if (marksAwarded === 0) {
    if (missedTerms.length > 0) {
      const topMissed = missedTerms.slice(0, 4).map(t => `**${t}**`).join(', ');
      return `Your answer didn't cover the key points. To gain marks, include: ${topMissed}. Review the model answer below.`;
    }
    return 'Your answer did not match the mark scheme. Review the model answer below and try again.';
  }

  // Partial credit
  const topMissed = missedTerms.slice(0, 3).map(t => `**${t}**`).join(', ');
  const topMatched = matchedTerms.slice(0, 3).map(t => `**${t}**`).join(', ');

  if (topMatched && topMissed) {
    return `Partial marks (${marksAwarded}/${maxMarks}). You covered: ${topMatched}. To get full marks, also include: ${topMissed}.`;
  }
  if (topMissed) {
    return `Partial marks (${marksAwarded}/${maxMarks}). Missing key points: ${topMissed}. See the model answer for full detail.`;
  }
  if (topMatched) {
    return `Partial marks (${marksAwarded}/${maxMarks}). You covered some key points (${topMatched}) but need more depth or additional content.`;
  }
  return `Partial marks (${marksAwarded}/${maxMarks}). Compare your answer against the model to see what to add.`;
}

/**
 * Build an AI feedback prompt. Kept for compatibility with the check route —
 * used only when ANTHROPIC_API_KEY is set, otherwise the deterministic feedback
 * from `buildFallbackFeedback` is used.
 */
export function buildFeedbackPrompt(opts: {
  subject: string;
  question: string;
  userAnswer: string;
  modelAnswer: string;
  marksAwarded: number;
  maxMarks: number;
  matchedTerms: string[];
  missedTerms: string[];
}): string {
  const { subject, question, userAnswer, modelAnswer, marksAwarded, maxMarks, missedTerms } = opts;
  const gaps = missedTerms.slice(0, 5).join(', ') || 'none — well covered';
  return `You are a GCSE ${subject} examiner giving quick feedback. The student scored ${marksAwarded}/${maxMarks}.

Question: ${question}
Student answer: ${userAnswer}
Mark scheme: ${modelAnswer}
Key points the student missed: ${gaps}

Write 2-3 sentences of specific feedback: what they got right (quote the student's own words if possible) and what they need to add to get full marks. Use **bold** for key terms. Do not include marks. Plain text only — no headings, no JSON.`;
}
