'use client';

import { use, useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { PAST_PAPERS_INDEX, getYearPapers } from '@/data/past-papers-index';
import type { PaperEntry, YearPaper } from '@/data/past-papers-index';
import { Navbar } from '@/components/layout/Navbar';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { Button } from '@/components/ui/Button';

export default function PastPapersPage({ params }: { params: Promise<{ board: string; subject: string }> }) {
  const { board: boardName, subject: rawSubject } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const board = EXAM_BOARDS[boardName];

  if (!board || !board.subjects.includes(subject)) notFound();

  const boardData = PAST_PAPERS_INDEX[subject]?.[boardName];
  const papers = boardData?.papers ?? [];
  const officialUrl = boardData?.officialUrl;

  const paperNumbers = Array.from(new Set(papers.map(p => p.number))).sort() as (1 | 2 | 3)[];
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(paperNumbers[0] ?? 1);
  const [tier, setTier] = useState<'H' | 'F'>('H');

  const activePaper = papers.find(p => p.number === activeTab);

  const yearPapers = useMemo(() => {
    if (!activePaper) return [];
    return getYearPapers(activePaper, activePaper.tiered ? tier : undefined);
  }, [activePaper, tier]);

  const [selectedYear, setSelectedYear] = useState<string>('');

  // Reset selected year when paper/tier changes
  const selectedYearPaper = useMemo(() => {
    if (yearPapers.length === 0) return null;
    const match = yearPapers.find(yp => yp.year === selectedYear);
    if (match) return match;
    // Default to most recent
    return yearPapers[0];
  }, [yearPapers, selectedYear]);

  const currentYear = selectedYearPaper?.year ?? '';

  const tabColors: Record<1 | 2 | 3, string> = {
    1: '#6366f1',
    2: '#10b981',
    3: '#f59e0b',
  };

  const color = tabColors[activeTab];

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
                  &#9997; Practice Past Paper Questions on Educate
                </button>
              </div>
            ) : (
              <>
                {/* Paper tabs */}
                <div className="flex gap-2 mb-6">
                  {paperNumbers.map(n => (
                    <button
                      key={n}
                      onClick={() => { setActiveTab(n); setSelectedYear(''); }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border-2"
                      style={
                        activeTab === n
                          ? { borderColor: tabColors[n], backgroundColor: `${tabColors[n]}22`, color: tabColors[n] }
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
                          {yearPapers.map(yp => (
                            <button
                              key={yp.year}
                              onClick={() => setSelectedYear(yp.year)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border-2"
                              style={
                                currentYear === yp.year
                                  ? { borderColor: color, backgroundColor: `${color}22`, color }
                                  : { borderColor: '#2a2a2a', backgroundColor: 'transparent', color: '#6b7280' }
                              }
                            >
                              {yp.year}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Download & Practice buttons */}
                    {selectedYearPaper && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Download Question Paper — opens official board resources */}
                          <a
                            href={officialUrl ?? selectedYearPaper.qpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 rounded-xl text-center font-semibold text-sm transition-all duration-150 no-underline flex items-center justify-center gap-2 border-2"
                            style={{ borderColor: color, color, backgroundColor: `${color}18` }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${color}30`)}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${color}18`)}
                          >
                            &#11123; Download Paper
                          </a>

                          {/* Download Mark Scheme — opens official board resources */}
                          <a
                            href={officialUrl ?? selectedYearPaper.msUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 rounded-xl text-center font-semibold text-sm transition-all duration-150 no-underline flex items-center justify-center gap-2 border-2"
                            style={{ borderColor: '#a855f7', color: '#a855f7', backgroundColor: '#a855f718' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#a855f730')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#a855f718')}
                          >
                            &#11123; Download Mark Scheme
                          </a>
                        </div>

                        {/* Practice on Educate — full exam paper mode */}
                        <button
                          onClick={() => {
                            try {
                              sessionStorage.setItem('educate-paper-info', JSON.stringify({
                                paperTitle: activePaper?.title ?? `Paper ${activeTab}`,
                                year: currentYear,
                                tier: activePaper?.tiered ? (tier === 'H' ? 'Higher' : 'Foundation') : '',
                                duration: activePaper?.duration ?? '1 hour 45 minutes',
                                totalMarks: activePaper?.marks ?? 0,
                              }));
                            } catch {}
                            window.location.href = `/${boardName}/${encodeURIComponent(subject)}/paper`;
                          }}
                          className="w-full py-3 rounded-xl text-center font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 border-none cursor-pointer"
                          style={{ backgroundColor: color, color: '#fff' }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                          &#9997; Practice on Educate
                        </button>
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
        <ChatPanel subject={subject} board={boardName} />
      </div>
    </div>
  );
}
