'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'educate-cookie-consent';

export function CookieBanner() {
  // Start hidden — only mount UI after we've checked localStorage on the client
  // (otherwise SSR/CSR mismatch + flash of banner on every page load).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) setVisible(true);
    } catch {
      // localStorage blocked — show banner anyway
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, at: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: false, at: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[100] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 sm:p-5"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{'\u{1F36A}'}</span>
        <div>
          <h3 className="text-sm font-bold text-white m-0 mb-1">Cookies &amp; storage</h3>
          <p className="text-xs text-neutral-400 m-0 leading-relaxed">
            We use strictly-necessary cookies to keep you signed in, and your browser&rsquo;s local storage
            to save your study progress. We don&rsquo;t use advertising or tracking cookies.{' '}
            <Link href="/privacy" className="text-indigo-400 no-underline hover:underline">
              Read more
            </Link>
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={decline}
          className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl bg-transparent border border-neutral-700 text-neutral-300 cursor-pointer hover:bg-neutral-800 transition-colors"
        >
          Essential only
        </button>
        <button
          onClick={accept}
          className="flex-1 text-xs font-bold py-2 px-3 rounded-xl bg-indigo-500 border-0 text-white cursor-pointer hover:bg-indigo-400 transition-colors"
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
