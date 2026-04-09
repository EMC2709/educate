'use client';

import { useEffect, useState } from 'react';
import type { PastPaper } from './page';

interface PastPapersMeta {
  countries: string[] | null;
  exam_types: string[] | null;
  subjects: string[] | null;
}

interface PastPapersTabProps {
  onAssign: (paper: PastPaper) => void;
}

export function PastPapersTab({ onAssign }: PastPapersTabProps) {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [meta, setMeta] = useState<PastPapersMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('');
  const [examType, setExamType] = useState('');
  const [keyword, setKeyword] = useState('');

  const fetchPapers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (country) params.set('country', country);
    if (examType) params.set('examType', examType);
    fetch(`/api/past-papers?${params.toString()}`)
      .then(r => r.json())
      .then(d => {
        setPapers(d.papers || []);
        if (d.meta) setMeta(d.meta);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPapers();
  }, [country, examType]);

  const filtered = papers.filter(p => {
    if (!keyword) return true;
    const q = keyword.toLowerCase();
    return (
      (p.title || '').toLowerCase().includes(q) ||
      String(p.year || '').includes(q) ||
      (p.subject || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-wrap gap-3">
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
        >
          <option value="">All countries</option>
          {(meta?.countries || []).filter(Boolean).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={examType}
          onChange={e => setExamType(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
        >
          <option value="">All exam types</option>
          {(meta?.exam_types || []).filter(Boolean).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Search papers..."
          className="flex-1 min-w-[160px] bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 text-sm"
        />
      </div>

      {/* Papers list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
          No papers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(p => (
            <div
              key={p.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-3"
            >
              <div>
                <div className="text-white font-semibold text-sm">{p.title}</div>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {p.year && (
                    <span className="text-xs px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-lg">
                      {p.year}
                    </span>
                  )}
                  {p.paper_number && (
                    <span className="text-xs px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-lg">
                      Paper {p.paper_number}
                    </span>
                  )}
                  {p.exam_type && (
                    <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                      {p.exam_type}
                    </span>
                  )}
                  {p.total_questions != null && (
                    <span className="text-xs px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-lg">
                      {p.total_questions} questions
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onAssign(p)}
                className="mt-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Assign to Class
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
