'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { SUBJECT_TOPICS_MAP } from '@/data/subject-topics';

const STORAGE_KEY = 'educate-spec-checklist';
const SUBJECTS_KEY = 'educate-user-subjects';

function getChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setChecked(key: string, val: boolean): void {
  const data = getChecked();
  if (val) {
    data[key] = true;
  } else {
    delete data[key];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getSubjectProgress(subject: string, checked: Record<string, boolean>): { done: number; total: number } {
  const groups = SUBJECT_TOPICS_MAP[subject];
  if (!groups) return { done: 0, total: 0 };
  let done = 0;
  let total = 0;
  for (const [group, subtopics] of Object.entries(groups)) {
    for (const subtopic of subtopics) {
      total++;
      if (checked[`${subject}:${group}:${subtopic}`]) done++;
    }
  }
  return { done, total };
}

function progressColor(pct: number): string {
  if (pct === 0) return '#ef4444';
  if (pct < 50) return '#f59e0b';
  if (pct < 90) return '#3b82f6';
  return '#22c55e';
}

function progressTextColor(pct: number): string {
  if (pct === 0) return 'text-red-400';
  if (pct < 50) return 'text-amber-400';
  if (pct < 90) return 'text-blue-400';
  return 'text-green-400';
}

export default function ChecklistPage() {
  const [checked, setCheckedState] = useState<Record<string, boolean>>({});
  const [activeSubject, setActiveSubject] = useState<string>('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [sortIncomplete, setSortIncomplete] = useState(true);

  // Load user subjects
  const userSubjects = useMemo(() => {
    if (typeof window === 'undefined') return Object.keys(SUBJECT_TOPICS_MAP);
    try {
      const raw = localStorage.getItem(SUBJECTS_KEY);
      if (raw) {
        const parsed: { subject: string }[] = JSON.parse(raw);
        const names = parsed.map(x => x.subject).filter(s => SUBJECT_TOPICS_MAP[s]);
        if (names.length > 0) return names;
      }
    } catch {}
    return Object.keys(SUBJECT_TOPICS_MAP);
  }, []);

  useEffect(() => {
    setCheckedState(getChecked());
    if (userSubjects.length > 0) setActiveSubject(userSubjects[0]);
  }, [userSubjects]);

  const toggle = useCallback((key: string) => {
    setCheckedState(prev => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
        setChecked(key, false);
      } else {
        next[key] = true;
        setChecked(key, true);
      }
      return next;
    });
  }, []);

  const checkAllGroup = useCallback((subject: string, group: string, subtopics: string[]) => {
    setCheckedState(prev => {
      const next = { ...prev };
      const allChecked = subtopics.every(st => next[`${subject}:${group}:${st}`]);
      for (const st of subtopics) {
        const key = `${subject}:${group}:${st}`;
        if (allChecked) {
          delete next[key];
          setChecked(key, false);
        } else {
          next[key] = true;
          setChecked(key, true);
        }
      }
      return next;
    });
  }, []);

  const toggleCollapse = (key: string) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Overall progress
  const overall = useMemo(() => {
    let done = 0;
    let total = 0;
    for (const subject of userSubjects) {
      const p = getSubjectProgress(subject, checked);
      done += p.done;
      total += p.total;
    }
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [checked, userSubjects]);

  const activeGroups = useMemo(() => {
    const groups = SUBJECT_TOPICS_MAP[activeSubject];
    if (!groups) return [];
    const entries = Object.entries(groups);
    if (!sortIncomplete) return entries;
    return [...entries].sort(([ga, sta], [gb, stb]) => {
      const doneA = sta.filter(s => checked[`${activeSubject}:${ga}:${s}`]).length;
      const doneB = stb.filter(s => checked[`${activeSubject}:${gb}:${s}`]).length;
      const pctA = sta.length > 0 ? doneA / sta.length : 1;
      const pctB = stb.length > 0 ? doneB / stb.length : 1;
      return pctA - pctB;
    });
  }, [activeSubject, checked, sortIncomplete]);

  const subjectProgress = useMemo(() => {
    const m: Record<string, { done: number; total: number; pct: number }> = {};
    for (const s of userSubjects) {
      const p = getSubjectProgress(s, checked);
      m[s] = { ...p, pct: p.total > 0 ? Math.round((p.done / p.total) * 100) : 0 };
    }
    return m;
  }, [checked, userSubjects]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Spec <span className="text-emerald-400">Checklist</span>
              </h1>
              <p className="text-neutral-500 mt-1 text-sm">
                Tick off every topic as you cover it
              </p>
            </div>

            {/* Overall Progress */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-semibold text-sm m-0">
                  You've covered <span className={progressTextColor(overall.pct)}>{overall.pct}%</span> of your GCSE specifications
                </p>
                <span className="text-neutral-500 text-xs">{overall.done} / {overall.total} subtopics</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${overall.pct}%`, backgroundColor: progressColor(overall.pct) }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-3 text-[10px] font-medium">
                  <span className="text-red-400">0% = Not started</span>
                  <span className="text-amber-400">1-49% = In progress</span>
                  <span className="text-blue-400">50-89% = Good</span>
                  <span className="text-green-400">90%+ = Mastered</span>
                </div>
                <button
                  onClick={() => setSortIncomplete(p => !p)}
                  className="text-[10px] font-semibold text-neutral-400 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1 cursor-pointer hover:bg-neutral-700 transition-colors"
                >
                  {sortIncomplete ? 'Sorted: incomplete first' : 'Sorted: original order'}
                </button>
              </div>
            </div>

            {/* Subject Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {userSubjects.map(subject => {
                const p = subjectProgress[subject] || { pct: 0 };
                const isActive = subject === activeSubject;
                const color = progressColor(p.pct);
                return (
                  <button
                    key={subject}
                    onClick={() => setActiveSubject(subject)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isActive
                        ? 'text-white border-neutral-600 bg-neutral-800'
                        : 'text-neutral-400 border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <span className="truncate max-w-[120px]">{subject}</span>
                    <span
                      className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ color, backgroundColor: `${color}22` }}
                    >
                      {p.pct}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active subject progress bar */}
            {activeSubject && subjectProgress[activeSubject] && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white font-bold text-base">{activeSubject}</span>
                  <span className={`text-sm font-bold ${progressTextColor(subjectProgress[activeSubject].pct)}`}>
                    {subjectProgress[activeSubject].done} / {subjectProgress[activeSubject].total} ({subjectProgress[activeSubject].pct}%)
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${subjectProgress[activeSubject].pct}%`,
                      backgroundColor: progressColor(subjectProgress[activeSubject].pct),
                    }}
                  />
                </div>
              </div>
            )}

            {/* Topic Groups */}
            <div className="flex flex-col gap-3">
              {activeGroups.map(([group, subtopics]) => {
                const groupKey = `${activeSubject}:${group}`;
                const isCollapsed = collapsed[groupKey];
                const doneCount = subtopics.filter(st => checked[`${activeSubject}:${group}:${st}`]).length;
                const allDone = doneCount === subtopics.length;
                const groupPct = subtopics.length > 0 ? Math.round((doneCount / subtopics.length) * 100) : 0;
                const color = progressColor(groupPct);

                return (
                  <div
                    key={group}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
                  >
                    {/* Group header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-neutral-800/40">
                      <button
                        onClick={() => toggleCollapse(groupKey)}
                        className="flex-1 flex items-center gap-3 text-left bg-transparent border-none cursor-pointer p-0"
                      >
                        <span className="text-[10px] text-neutral-500 transition-transform duration-200" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                          ▼
                        </span>
                        <span className="text-sm font-bold text-white flex-1">{group}</span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0"
                          style={{ color, backgroundColor: `${color}22` }}
                        >
                          {doneCount}/{subtopics.length}
                        </span>
                      </button>
                      <button
                        onClick={() => checkAllGroup(activeSubject, group, subtopics)}
                        className="text-[10px] font-semibold px-3 py-1.5 rounded-lg border cursor-pointer transition-all shrink-0"
                        style={
                          allDone
                            ? { color: '#22c55e', borderColor: '#22c55e40', backgroundColor: '#22c55e15' }
                            : { color: '#94a3b8', borderColor: '#334155', backgroundColor: 'transparent' }
                        }
                      >
                        {allDone ? 'Uncheck All' : 'Check All'}
                      </button>
                    </div>

                    {/* Subtopics */}
                    {!isCollapsed && (
                      <div className="p-3 flex flex-col gap-1">
                        {subtopics.map(subtopic => {
                          const key = `${activeSubject}:${group}:${subtopic}`;
                          const isChecked = !!checked[key];
                          return (
                            <label
                              key={subtopic}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-neutral-800/60 group"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggle(key)}
                                className="w-4 h-4 rounded accent-emerald-500 shrink-0 cursor-pointer"
                              />
                              <span
                                className={`text-sm transition-all ${
                                  isChecked
                                    ? 'text-neutral-500 line-through'
                                    : 'text-neutral-200 group-hover:text-white'
                                }`}
                              >
                                {subtopic}
                              </span>
                              {isChecked && (
                                <span className="ml-auto text-emerald-500 text-xs font-bold shrink-0">Done</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
