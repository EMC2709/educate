'use client';

import { use, useState, useMemo, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { PAST_PAPERS_INDEX, getYearPapers } from '@/data/past-papers-index';
import type { PaperEntry, YearPaper } from '@/data/past-papers-index';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { isPaperStored, paperLetterFromTitle, parseYearLabel } from '@/lib/past-paper-match';

export default function PastPapersPage({ params }: { params: Promise<{ board: string; subject: string }> }) {
  const { board: boardName, subject: rawSubject } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const board = EXAM_BOARDS[boardName];

  if (!board || !board.subjects.includes(subject)) notFound();

  const boardData = PAST_PAPERS_INDEX[subject]?.[boardName];
  const papers = boardData?.papers ?? [];
  const officialUrl = boardData?.officialUrl;

  // Combined Science: group by component (Biology, Chemistry, Physics)
  const isCombinedScience = subject === 'Combined Science';
  const components = isCombinedScience
    ? Array.from(new Set(papers.filter(p => p.component).map(p => p.component!)))
    : [];
  const [activeComponent, setActiveComponent] = useState<string>(components[0] ?? '');

  // Filter papers by component for Combined Science, show all otherwise
  const filteredPapers = isCombinedScience
    ? papers.filter(p => p.component === activeComponent)
    : papers;

  const paperNumbers = Array.from(new Set(filteredPapers.map(p => p.number))).sort() as (1 | 2 | 3)[];
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(paperNumbers[0] ?? 1);
  const [tier, setTier] = useState<'H' | 'F'>('H');

  const activePaper = filteredPapers.find(p => p.number === activeTab);

  const yearPapers = useMemo(() => {
    if (!activePaper) return [];
    return getYearPapers(activePaper, activePaper.tiered ? tier : undefined, officialUrl);
  }, [activePaper, tier, officialUrl]);

  const [selectedYear, setSelectedYear] = useState<string>('');
  const activeTier = activePaper?.tiered ? tier : null;
  // Language papers are coded by skill letter ("Paper 1: Listening" → L)
  const activePaperLetter = paperLetterFromTitle(activePaper?.title);

  // Which papers of this subject Educate actually stores (null = unknown, e.g. signed out)
  const [storedCodes, setStoredCodes] = useState<string[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    setStoredCodes(null);
    const q = new URLSearchParams({ available: '1', examType: `GCSE_${boardName}`, subject });
    fetch(`/api/past-papers?${q}`)
      .then(r => (r.ok ? r.json() : null))
      .then((d: { codes?: string[] } | null) => { if (!cancelled && Array.isArray(d?.codes)) setStoredCodes(d.codes); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [boardName, subject]);

  const isOnEducate = (yearLabel: string): boolean => {
    if (!storedCodes || !activePaper) return false;
    const parsed = parseYearLabel(yearLabel);
    if (!parsed) return false;
    return isPaperStored(storedCodes, {
      year: parsed.year,
      session: parsed.session,
      paperNumber: activePaper.number,
      tier: activeTier,
      component: activePaper.component ?? null,
      paperLetter: activePaperLetter,
    });
  };

  // Reset selected year when paper/tier/component changes
  const selectedYearPaper = useMemo(() => {
    if (yearPapers.length === 0) return null;
    const match = yearPapers.find(yp => yp.year === selectedYear);
    if (match) return match;
    return yearPapers[0];
  }, [yearPapers, selectedYear]);

  // With nothing chosen yet, start on the newest paper Educate has
  useEffect(() => {
    if (selectedYear || !storedCodes) return;
    const firstStored = yearPapers.find(yp => isOnEducate(yp.year));
    if (firstStored) setSelectedYear(firstStored.year);
    // isOnEducate only depends on values already listed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedCodes, yearPapers, selectedYear]);

  const currentYear = selectedYearPaper?.year ?? '';

  // DB paper lookup — resolve the exact paper (subject + sitting + paper number + tier + component)
  // so the practice page loads that paper, never another subject's paper from the same year.
  type DbPaper = { id: string; total_questions: number; marks: number | null };
  type DbMatch = { paper: DbPaper | null; match: 'exact' | 'metadata' | 'subject' | null };
  const [dbMatch, setDbMatch] = useState<DbMatch | null>(null);
  useEffect(() => {
    setDbMatch(null);
    if (!activePaper || !currentYear) return;
    const params = new URLSearchParams({
      resolve: '1',
      examType: `GCSE_${boardName}`,
      subject,
      yearLabel: currentYear,
      paperNumber: String(activePaper.number),
    });
    if (activeTier) params.set('tier', activeTier);
    if (activePaper.component) params.set('component', activePaper.component);
    if (activePaperLetter) params.set('paperLetter', activePaperLetter);
    let cancelled = false;
    fetch(`/api/past-papers?${params}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: DbMatch | null) => { if (!cancelled && data) setDbMatch(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [boardName, subject, activePaper, activeTier, activePaperLetter, currentYear]);

  const dbPaperForYear = dbMatch?.paper ?? null;
  // Is the paper the student picked on Educate? (unknown while signed out)
  const exactOnEducate = dbMatch?.match === 'exact' || dbMatch?.match === 'metadata'
    || (storedCodes !== null && isOnEducate(currentYear));
  const notOnEducate = storedCodes !== null && !exactOnEducate;

  function startPractice(paperId: string | null, match: DbMatch['match']) {
    try {
      sessionStorage.setItem('educate-paper-info', JSON.stringify({
        paperTitle: activePaper?.title ?? `Paper ${activeTab}`,
        year: currentYear,
        tier: activePaper?.tiered ? (tier === 'H' ? 'Higher' : 'Foundation') : '',
        duration: activePaper?.duration ?? '1 hour 45 minutes',
        totalMarks: activePaper?.marks ?? 0,
        component: activePaper?.component ?? null,
        paperNumber: `Paper ${activeTab}`,
        paperLetter: activePaperLetter,
        board: boardName,
        // Pass direct DB paper ID so the practice page doesn't have to guess
        paperId,
        paperMatch: match,
        // The board's own past-papers page, for when no mark scheme can be shown
        officialUrl: officialUrl ?? null,
      }));
    } catch {}
    window.location.href = `/${boardName}/${encodeURIComponent(subject)}/paper`;
  }

  const tabColors: Record<1 | 2 | 3, string> = {
    1: '#6366f1',
    2: '#10b981',
    3: '#f59e0b',
  };

  const componentColors: Record<string, string> = {
    'Biology': '#22c55e',
    'Chemistry': '#f59e0b',
    'Physics': '#6366f1',
  };

  const color = isCombinedScience
    ? (componentColors[activeComponent] ?? '#6366f1')
    : tabColors[activeTab];

  return (
    <div className="min-h-screen">
      <Navbar board={boardName} subject={subject} />
      <div className="flex min-h-[calc(100vh-56px)]">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <Link href={`/${boardName}/${encodeURIComponent(subject)}`}>
              <Button variant="ghost" className="mb-8">&#8592; Back</Button>
            </Link>

            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">Past Papers</h2>
              <p className="text-neutral-500 text-sm">{subject} · {boardName}</p>
            </div>

            {papers.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-4">
                <p className="text-neutral-400">No downloadable papers found for {subject} ({boardName}).</p>
                {officialUrl && (
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm underline block"
                  >
                    Visit {boardName} official resources &#8599;
                  </a>
                )}
                {/* Still allow practice mode even without downloadable papers */}
                <button
                  onClick={() => {
                    try { sessionStorage.setItem('educate-paper-info', JSON.stringify({ paperTitle: 'Past Paper Practice', year: '', tier: '', duration: '1 hour 45 minutes', totalMarks: 0 })); } catch {}
                    window.location.href = `/${boardName}/${encodeURIComponent(subject)}/paper`;
                  }}
                  className="w-full py-3 rounded-xl text-center font-semibold text-sm text-white border-none cursor-pointer transition-opacity"
                  style={{ backgroundColor: '#6366f1' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  &#9997; Practise Past Paper Questions on Educate
                </button>
              </div>
            ) : (
              <>
                {/* Component tabs (Combined Science only) */}
                {isCombinedScience && components.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {components.map(comp => (
                      <button
                        key={comp}
                        onClick={() => { setActiveComponent(comp); setActiveTab(1 as 1 | 2 | 3); setSelectedYear(''); }}
                        className="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-150 border-2"
                        style={
                          activeComponent === comp
                            ? { borderColor: componentColors[comp], backgroundColor: `${componentColors[comp]}22`, color: componentColors[comp] }
                            : { borderColor: '#2a2a2a', backgroundColor: 'transparent', color: '#6b7280' }
                        }
                      >
                        {comp === 'Biology' ? '\u{1F9EC}' : comp === 'Chemistry' ? '\u{2697}\uFE0F' : '\u{269B}\uFE0F'} {comp}
                      </button>
                    ))}
                  </div>
                )}

                {/* Paper tabs */}
                <div className="flex gap-2 mb-6">
                  {paperNumbers.map(n => (
                    <button
                      key={n}
                      onClick={() => { setActiveTab(n); setSelectedYear(''); }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border-2"
                      style={
                        activeTab === n
                          ? { borderColor: color, backgroundColor: `${color}22`, color }
                          : { borderColor: '#2a2a2a', backgroundColor: 'transparent', color: '#6b7280' }
                      }
                    >
                      Paper {n}
                    </button>
                  ))}
                </div>

                {/* Active paper card */}
                {activePaper && (
                  <div
                    className="bg-neutral-900 border-2 rounded-2xl p-6 sm:p-8 transition-all duration-200"
                    style={{ borderColor: `${color}44` }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{activePaper.title}</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">{activePaper.description}</p>
                      </div>
                      <div
                        className="shrink-0 text-3xl w-12 h-12 rounded-xl flex items-center justify-center font-bold"
                        style={{ backgroundColor: `${color}22`, color }}
                      >
                        {activePaper.number}
                      </div>
                    </div>

                    {(activePaper.duration || activePaper.marks) && (
                      <div className="flex gap-3 mb-6">
                        {activePaper.duration && (
                          <span className="text-xs px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300">
                            &#128336; {activePaper.duration}
                          </span>
                        )}
                        {activePaper.marks && (
                          <span className="text-xs px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300">
                            &#127919; {activePaper.marks} marks
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tier toggle (only for tiered subjects) */}
                    {activePaper.tiered && (
                      <div className="flex gap-2 mb-5">
                        {(['H', 'F'] as const).map(t => (
                          <button
                            key={t}
                            onClick={() => { setTier(t); setSelectedYear(''); }}
                            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 border-2"
                            style={
                              tier === t
                                ? {
                                    borderColor: t === 'H' ? '#ef4444' : '#3b82f6',
                                    backgroundColor: t === 'H' ? '#ef444420' : '#3b82f620',
                                    color: t === 'H' ? '#ef4444' : '#3b82f6',
                                  }
                                : { borderColor: '#2a2a2a', backgroundColor: 'transparent', color: '#6b7280' }
                            }
                          >
                            {t === 'H' ? 'Higher' : 'Foundation'}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Year selector */}
                    {yearPapers.length > 0 && (
                      <div className="mb-5">
                        <label className="text-neutral-400 text-xs font-semibold mb-2 block">Select Year</label>
                        <div className="flex flex-wrap gap-2">
                          {yearPapers.map(yp => {
                            const stored = isOnEducate(yp.year);
                            return (
                              <button
                                key={yp.year}
                                onClick={() => setSelectedYear(yp.year)}
                                aria-pressed={currentYear === yp.year}
                                aria-label={`${yp.year}${storedCodes ? (stored ? ', can be practised on Educate' : ', download only') : ''}`}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border-2 inline-flex items-center gap-1.5"
                                style={
                                  currentYear === yp.year
                                    ? { borderColor: color, backgroundColor: `${color}22`, color }
                                    : { borderColor: '#2a2a2a', backgroundColor: 'transparent', color: stored || !storedCodes ? '#a3a3a3' : '#6b7280' }
                                }
                              >
                                {stored && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />}
                                {yp.year}
                              </button>
                            );
                          })}
                        </div>
                        {storedCodes && (
                          <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" aria-hidden="true" />
                            {yearPapers.some(yp => isOnEducate(yp.year))
                              ? 'You can practise these papers on Educate. The others can be downloaded.'
                              : 'None of these papers are on Educate yet — you can still download them.'}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Download & Practice buttons */}
                    {selectedYearPaper && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Question Paper — proxied through app for PDF, direct link for board pages */}
                          <a
                            href={selectedYearPaper.qpUrl.endsWith('.PDF')
                              ? `/api/download-paper?url=${encodeURIComponent(selectedYearPaper.qpUrl)}`
                              : selectedYearPaper.qpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 rounded-xl text-center font-semibold text-sm transition-all duration-150 no-underline flex items-center justify-center gap-2 border-2"
                            style={{ borderColor: color, color, backgroundColor: `${color}18` }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${color}30`)}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${color}18`)}
                          >
                            {selectedYearPaper.qpUrl.endsWith('.PDF') ? '⬋ Download Paper' : `⬋ Find Paper on ${boardName}`}
                          </a>

                          {/* Mark Scheme — proxied through app for PDF, direct link for board pages */}
                          <a
                            href={selectedYearPaper.msUrl.endsWith('.PDF')
                              ? `/api/download-paper?url=${encodeURIComponent(selectedYearPaper.msUrl)}`
                              : selectedYearPaper.msUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 rounded-xl text-center font-semibold text-sm transition-all duration-150 no-underline flex items-center justify-center gap-2 border-2"
                            style={{ borderColor: '#a855f7', color: '#a855f7', backgroundColor: '#a855f718' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#a855f730')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#a855f718')}
                          >
                            {selectedYearPaper.msUrl.endsWith('.PDF') ? '⬋ Download Mark Scheme' : `⬋ Find Mark Scheme on ${boardName}`}
                          </a>
                        </div>

                        {notOnEducate ? (
                          // This paper is not stored: say so, and offer another paper of the same subject
                          <div className="rounded-xl border border-neutral-700 bg-neutral-800/60 px-4 py-3 text-center">
                            <p className="text-sm text-neutral-200 m-0">
                              The {currentYear} {activePaper.title.replace(/:.*$/, '')} isn&apos;t on Educate yet.
                              Use the buttons above to get it from {boardName}.
                            </p>
                            {dbMatch?.match === 'subject' && dbPaperForYear && (
                              <button
                                onClick={() => startPractice(dbPaperForYear.id, 'subject')}
                                className="mt-3 w-full py-2.5 rounded-lg text-sm font-semibold border-2 bg-transparent cursor-pointer transition-colors"
                                style={{ borderColor: color, color }}
                              >
                                Practise a different {subject} paper instead
                              </button>
                            )}
                          </div>
                        ) : (
                          <>
                            {/* What will load on Educate for this selection (from the database) */}
                            {dbPaperForYear && dbMatch?.match !== 'subject' && (
                              <p className="text-xs text-neutral-400 text-center">
                                On Educate: {dbPaperForYear.total_questions} questions
                                {dbPaperForYear.marks ? ` · ${dbPaperForYear.marks} marks` : ''}
                              </p>
                            )}

                            {/* Practise on Educate — full exam paper mode */}
                            <button
                              onClick={() => startPractice(dbPaperForYear?.id ?? null, dbMatch?.match ?? null)}
                              className="w-full py-3 rounded-xl text-center font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 border-none cursor-pointer"
                              style={{ backgroundColor: color, color: '#fff' }}
                              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                              &#9997; Practise on Educate
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Official board link */}
                {officialUrl && (
                  <p className="text-center text-xs text-neutral-600 mt-6">
                    All papers via{' '}
                    <a
                      href={officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-neutral-400 underline"
                    >
                      {boardName} official resources
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
