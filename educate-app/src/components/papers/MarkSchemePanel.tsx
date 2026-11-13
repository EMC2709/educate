'use client';

import { useEffect, useState } from 'react';

export interface MarkSchemeInfo {
  status: 'idle' | 'loading' | 'ready' | 'none' | 'error';
  pageCount: number;
  officialUrl: string | null;
}

/** Look up the official mark scheme for a stored paper (signed-in users only). */
export function useMarkScheme(paperId: string | null, enabled: boolean): MarkSchemeInfo {
  const [info, setInfo] = useState<MarkSchemeInfo>({ status: 'idle', pageCount: 0, officialUrl: null });

  useEffect(() => {
    if (!paperId || !enabled) return;
    let cancelled = false;
    setInfo(prev => (prev.status === 'ready' ? prev : { status: 'loading', pageCount: 0, officialUrl: null }));
    fetch(`/api/mark-scheme?id=${encodeURIComponent(paperId)}`)
      .then(async r => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<{ available: boolean; pageCount: number | null; officialUrl: string | null }>;
      })
      .then(d => {
        if (cancelled) return;
        setInfo(d.available
          ? { status: 'ready', pageCount: d.pageCount ?? 0, officialUrl: d.officialUrl }
          : { status: 'none', pageCount: 0, officialUrl: null });
      })
      .catch(() => { if (!cancelled) setInfo({ status: 'error', pageCount: 0, officialUrl: null }); });
    return () => { cancelled = true; };
  }, [paperId, enabled]);

  return info;
}

interface PanelProps {
  paperId: string;
  pageCount: number;
  /** false on phones and browsers without a built-in PDF viewer: show page images instead */
  inlinePdf: boolean;
  open: boolean;
  onClose: () => void;
}

/** Right-hand drawer showing the official mark scheme beside the student's answers. */
export function MarkSchemePanel({ paperId, pageCount, inlinePdf, open, onClose }: PanelProps) {
  const id = encodeURIComponent(paperId);
  return (
    <>
      <aside
        className={`fixed top-0 right-0 h-dvh w-[92vw] md:w-[45vw] bg-neutral-900 border-l border-neutral-800 shadow-2xl transition-transform duration-300 z-[60] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Official mark scheme"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-950">
          <span className="text-xs text-neutral-200 font-semibold">📋 Official mark scheme</span>
          <div className="flex items-center gap-3">
            <a
              href={`/api/mark-scheme?id=${id}&format=pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-300 hover:text-white transition-colors"
            >
              ↗ Open
            </a>
            <button
              onClick={onClose}
              className="text-neutral-300 hover:text-white bg-transparent border-none cursor-pointer text-lg leading-none px-2"
              aria-label="Close mark scheme"
            >
              ×
            </button>
          </div>
        </div>

        {/* Only load once opened */}
        {open && (inlinePdf || pageCount === 0) && (
          <iframe
            src={`/api/mark-scheme?id=${id}&format=pdf#view=FitH`}
            className="w-full border-none"
            style={{ height: 'calc(100dvh - 40px)' }}
            title="Official mark scheme"
          />
        )}
        {open && !inlinePdf && pageCount > 0 && (
          <div className="overflow-y-auto bg-neutral-800 p-3 space-y-3" style={{ height: 'calc(100dvh - 40px)' }}>
            {Array.from({ length: pageCount }, (_, idx) => (
              <figure key={idx} className="bg-white rounded shadow overflow-hidden m-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/mark-scheme?id=${id}&page=${idx + 1}&w=900`}
                  alt={`Mark scheme page ${idx + 1}`}
                  loading="lazy"
                  className="w-full block"
                  style={{ minHeight: 200 }}
                />
                <figcaption className="text-xs text-neutral-600 text-center py-1 bg-neutral-100">
                  Page {idx + 1} of {pageCount}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </aside>

      {/* Phones: tap outside to close */}
      {open && <div onClick={onClose} className="md:hidden fixed inset-0 bg-black/60 z-[55]" aria-hidden="true" />}
    </>
  );
}
