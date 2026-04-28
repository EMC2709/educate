'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/Checkbox';
import { SUBTOPIC_BANK } from '@/data/subtopic-bank';
import { Q_TYPES } from '@/data/question-types';
import type { QuestionType } from '@/types';

// ── Strand definitions ────────────────────────────────────────────────────────
// Topic/subtopic keys must match SUBJECT_TOPICS_MAP['Combined Science'] exactly.

const STRANDS = [
  {
    id: 'biology',
    name: 'Biology',
    emoji: '🔬',
    color: '#4ade80',
    topics: {
      'Cell Biology':           ['Cell Structure & Microscopy', 'Diffusion & Osmosis', 'Cell Division & Stem Cells'],
      'Organisation & Systems': ['Digestive System', 'Cardiovascular System', 'Respiratory System'],
      'Infection & Response':   ['Pathogens & Immunity', 'Vaccines & Drugs'],
      'Homeostasis':            ['Nervous System', 'Blood Glucose', 'Temperature Regulation'],
      'Ecology':                ['Food Chains & Ecosystems', 'Carbon & Nitrogen Cycles', 'Human Impact'],
    } as Record<string, string[]>,
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    emoji: '⚗️',
    color: '#60a5fa',
    topics: {
      'Atomic Structure':  ['Subatomic Particles', 'Electronic Configuration', 'Isotopes'],
      'Bonding & Structure': ['Ionic & Covalent Bonding', 'Properties of Substances'],
      'Chemical Changes':  ['Acids & Bases', 'Electrolysis', 'Reactivity Series'],
    } as Record<string, string[]>,
  },
  {
    id: 'physics',
    name: 'Physics',
    emoji: '⚛️',
    color: '#c084fc',
    topics: {
      'Energy':        ['Energy Stores', 'Specific Heat Capacity', 'Efficiency'],
      'Forces & Motion': ["Newton's Laws", 'Stopping Distance', 'Momentum'],
      'Waves':         ['Wave Equation', 'Electromagnetic Spectrum', 'Refraction'],
      'Electricity':   ["Ohm's Law", 'Series & Parallel', 'Electrical Power'],
    } as Record<string, string[]>,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  name: string;
  emoji: string;
  color: string;
  topics: Record<string, string[]>;
}>;

type Strand = (typeof STRANDS)[number];

// Flat topic→subtopics map built from STRANDS
const ALL_TOPICS: Record<string, string[]> = Object.fromEntries(
  STRANDS.flatMap(s => Object.entries(s.topics)),
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface CombinedScienceHubProps {
  board: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CombinedScienceHub({ board }: CombinedScienceHubProps) {
  const router = useRouter();

  const [selectedTopics,    setSelectedTopics]    = useState<Record<string, boolean>>({});
  const [selectedSubtopics, setSelectedSubtopics] = useState<Record<string, boolean>>({});
  const [expandedTopics,    setExpandedTopics]    = useState<Record<string, boolean>>({});
  const [questionType,      setQuestionType]      = useState<QuestionType>('short');

  // ── Toggle helpers ──────────────────────────────────────────────────────────

  const toggleExpand = useCallback((topic: string) => {
    setExpandedTopics(p => ({ ...p, [topic]: !p[topic] }));
  }, []);

  const toggleSubtopic = useCallback((topic: string, sub: string) => {
    setSelectedSubtopics(p => {
      const next = { ...p, [`${topic}||${sub}`]: !p[`${topic}||${sub}`] };
      const subs = ALL_TOPICS[topic] ?? [];
      setSelectedTopics(prev => ({ ...prev, [topic]: subs.every(s => !!next[`${topic}||${s}`]) }));
      return next;
    });
  }, []);

  const toggleTopic = useCallback((topic: string) => {
    const subs = ALL_TOPICS[topic] ?? [];
    setSelectedTopics(p => {
      const wasSelected = !!p[topic];
      setSelectedSubtopics(prev => {
        const next = { ...prev };
        subs.forEach(sub => { next[`${topic}||${sub}`] = !wasSelected; });
        return next;
      });
      return { ...p, [topic]: !wasSelected };
    });
  }, []);

  const setStrand = useCallback((strand: Strand, select: boolean) => {
    setSelectedTopics(p => {
      const next = { ...p };
      Object.keys(strand.topics).forEach(t => { next[t] = select; });
      return next;
    });
    setSelectedSubtopics(p => {
      const next = { ...p };
      Object.entries(strand.topics).forEach(([t, subs]) => {
        subs.forEach(sub => { next[`${t}||${sub}`] = select; });
      });
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const topics: Record<string, boolean>    = {};
    const subs:   Record<string, boolean>    = {};
    STRANDS.forEach(strand => {
      Object.entries(strand.topics).forEach(([topic, subtopics]) => {
        topics[topic] = true;
        subtopics.forEach(sub => { subs[`${topic}||${sub}`] = true; });
      });
    });
    setSelectedTopics(topics);
    setSelectedSubtopics(subs);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedTopics({});
    setSelectedSubtopics({});
  }, []);

  // ── Derived state ───────────────────────────────────────────────────────────

  const totalSelected = useMemo(
    () => Object.values(selectedSubtopics).filter(Boolean).length,
    [selectedSubtopics],
  );

  const hasAny     = totalSelected > 0;
  const qTypeCfg   = Q_TYPES.find(t => t.type === questionType)!;

  // ── Start quiz ──────────────────────────────────────────────────────────────

  const handleStart = () => {
    sessionStorage.setItem('educate-selected-subtopics', JSON.stringify(selectedSubtopics));
    sessionStorage.setItem('educate-selected-topics',    JSON.stringify(selectedTopics));
    router.push(`/${board}/${encodeURIComponent('Combined Science')}/quiz?type=${questionType}`);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ── Hub header ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-b border-neutral-800 flex items-center gap-4">
        <Link href={`/${board}`} className="text-neutral-500 hover:text-white transition-colors text-sm no-underline flex-shrink-0">
          ← Back
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-white m-0 truncate">
            Combined Science
          </h2>
          <p className="text-neutral-500 text-[11px] m-0">Select topics from Biology, Chemistry &amp; Physics</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={selectAll}
            className="text-[11px] px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-[11px] px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ── Three panels ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 items-start">

          {STRANDS.map(strand => {
            const strandTopics   = Object.keys(strand.topics);
            const strandSubTotal = strandTopics.reduce((n, t) => n + (strand.topics[t]?.length ?? 0), 0);
            const strandSelCount = Object.entries(selectedSubtopics).filter(
              ([k, v]) => v && strandTopics.some(t => k.startsWith(`${t}||`)),
            ).length;
            const strandAll     = strandSelCount === strandSubTotal;
            const strandPartial = strandSelCount > 0 && !strandAll;

            return (
              <div
                key={strand.id}
                className="bg-neutral-900 rounded-2xl border overflow-hidden"
                style={{ borderColor: `${strand.color}44` }}
              >
                {/* Panel header */}
                <div
                  className="px-4 py-3 flex items-center gap-3 border-b"
                  style={{ borderColor: `${strand.color}33`, backgroundColor: `${strand.color}0e` }}
                >
                  <Checkbox
                    checked={strandAll}
                    partial={strandPartial}
                    color={strand.color}
                    onChange={() => setStrand(strand, !strandAll)}
                  />
                  <span className="text-xl leading-none">{strand.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="m-0 font-bold text-sm text-white">{strand.name}</p>
                    <p className="m-0 text-[10px]" style={{ color: `${strand.color}cc` }}>
                      {strandSelCount}/{strandSubTotal} subtopics
                    </p>
                  </div>
                  <button
                    onClick={() => setStrand(strand, !strandAll)}
                    className="text-[10px] px-2.5 py-1 rounded-lg border cursor-pointer transition-colors flex-shrink-0"
                    style={strandAll
                      ? { color: '#0f0f0f', backgroundColor: strand.color, borderColor: strand.color }
                      : { color: strand.color, backgroundColor: 'transparent', borderColor: `${strand.color}55` }
                    }
                  >
                    {strandAll ? 'Deselect all' : 'Select all'}
                  </button>
                </div>

                {/* Topic rows */}
                <div className="p-2 flex flex-col gap-1">
                  {Object.entries(strand.topics).map(([topic, subs]) => {
                    const selCount       = subs.filter(s => !!selectedSubtopics[`${topic}||${s}`]).length;
                    const isTopicSel     = !!selectedTopics[topic];
                    const isPartial      = selCount > 0 && selCount < subs.length;
                    const isExpanded     = !!expandedTopics[topic];
                    const hasBank        = !!(SUBTOPIC_BANK?.['Combined Science']?.[topic]);
                    const borderHighlight = (isTopicSel || isPartial) ? `${strand.color}55` : 'var(--border-subtle)';

                    return (
                      <div key={topic}>
                        {/* Topic header row */}
                        <div
                          className={`flex items-center bg-neutral-900 border transition-all ${isExpanded ? 'rounded-t-xl' : 'rounded-xl'}`}
                          style={{ borderColor: borderHighlight }}
                        >
                          <div
                            onClick={() => toggleTopic(topic)}
                            className="flex items-center justify-center w-10 h-10 cursor-pointer flex-shrink-0 border-r border-neutral-800"
                          >
                            <Checkbox
                              checked={isTopicSel}
                              partial={isPartial}
                              color={strand.color}
                              onChange={() => toggleTopic(topic)}
                            />
                          </div>
                          <div
                            onClick={() => toggleTopic(topic)}
                            className="flex-1 px-3 py-2.5 cursor-pointer flex items-center gap-2 min-w-0"
                          >
                            <span className="font-medium text-xs text-white leading-snug truncate">{topic}</span>
                            {selCount > 0 && (
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-md flex-shrink-0"
                                style={{ color: strand.color, backgroundColor: `${strand.color}22` }}
                              >
                                {selCount}/{subs.length}
                              </span>
                            )}
                            {hasBank && <span className="text-[8px] text-emerald-400 flex-shrink-0">⚡</span>}
                          </div>
                          <button
                            onClick={() => toggleExpand(topic)}
                            className={`bg-transparent border-none text-neutral-500 cursor-pointer px-3 py-2 text-sm flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                          >
                            ›
                          </button>
                        </div>

                        {/* Subtopics (expanded) */}
                        {isExpanded && (
                          <div
                            className="border border-t-0 rounded-b-xl px-2 py-2 bg-neutral-950"
                            style={{ borderColor: (isTopicSel || isPartial) ? `${strand.color}33` : 'var(--border-faint)' }}
                          >
                            {subs.map(sub => {
                              const key       = `${topic}||${sub}`;
                              const isSubSel  = !!selectedSubtopics[key];
                              const subHasBank = !!(SUBTOPIC_BANK?.['Combined Science']?.[topic]?.[sub]);
                              return (
                                <div
                                  key={sub}
                                  onClick={() => toggleSubtopic(topic, sub)}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all border mb-1 last:mb-0 ${
                                    isSubSel ? '' : 'border-transparent hover:bg-neutral-800'
                                  }`}
                                  style={isSubSel ? { backgroundColor: `${strand.color}15`, borderColor: `${strand.color}44` } : undefined}
                                >
                                  <Checkbox
                                    checked={isSubSel}
                                    color={strand.color}
                                    size="sm"
                                    onChange={() => toggleSubtopic(topic, sub)}
                                  />
                                  <span className={`text-[11px] flex-1 leading-snug ${isSubSel ? 'text-white' : 'text-neutral-400'}`}>
                                    {sub}
                                  </span>
                                  {subHasBank && <span className="text-[8px] text-emerald-400 flex-shrink-0">⚡</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-neutral-800 px-4 sm:px-6 py-4 bg-[#0a0a0a]">

        {/* Question type pills */}
        <div className="flex gap-2 flex-wrap mb-3">
          {Q_TYPES.filter(t => t.type !== 'past-paper').map(t => {
            const active = questionType === t.type;
            return (
              <button
                key={t.type}
                onClick={() => setQuestionType(t.type)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-all"
                style={active
                  ? { backgroundColor: t.color, borderColor: t.color, color: '#0f0f0f', fontWeight: 700 }
                  : { backgroundColor: 'transparent', borderColor: 'var(--border-inactive)', color: 'var(--text-inactive)' }
                }
              >
                {t.icon} {t.label}
              </button>
            );
          })}
        </div>

        {/* Count + Start button */}
        <div className="flex items-center gap-3">
          {hasAny && (
            <span
              className="text-xs px-2.5 py-1 rounded-lg flex-shrink-0 font-medium"
              style={{ color: qTypeCfg.color, backgroundColor: `${qTypeCfg.color}22` }}
            >
              {totalSelected} subtopic{totalSelected !== 1 ? 's' : ''} selected
            </span>
          )}
          <button
            onClick={handleStart}
            disabled={!hasAny}
            className="flex-1 border-none rounded-xl py-3 text-sm font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{
              backgroundColor: hasAny ? qTypeCfg.color : 'var(--surface-disabled)',
              color:           hasAny ? '#0f0f0f'       : 'var(--text-disabled)',
            }}
          >
            {hasAny ? `Start ${qTypeCfg.label}` : 'Select topics to begin'}
          </button>
        </div>
      </div>

    </div>
  );
}
