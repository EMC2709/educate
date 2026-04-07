'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface FocusModeContextType {
  focusActive: boolean;
  setFocusActive: (active: boolean) => void;
  focusSubject: string;
  setFocusSubject: (subject: string) => void;
}

const FocusModeContext = createContext<FocusModeContextType>({
  focusActive: false,
  setFocusActive: () => {},
  focusSubject: '',
  setFocusSubject: () => {},
});

export function useFocusMode() {
  return useContext(FocusModeContext);
}

const QUOTES = [
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it\u2019s done.",
  "Small daily improvements lead to stunning results.",
  "Don\u2019t wish for it. Work for it.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you\u2019re halfway there.",
  "Push yourself, because no one else will do it for you.",
  "Success is the sum of small efforts repeated daily.",
  "You don\u2019t have to be great to start, but you have to start to be great.",
  "Focus on progress, not perfection.",
  "Revision is the bridge between confusion and clarity.",
  "Every hour of study is an investment in your future.",
];

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [focusActive, setFocusActive] = useState(false);
  const [focusSubject, setFocusSubject] = useState('');
  const [quote, setQuote] = useState('');
  const [distractions, setDistractions] = useState(0);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, [focusActive]);

  // Block keyboard shortcuts that navigate away
  useEffect(() => {
    if (!focusActive) return;
    function handleKey(e: KeyboardEvent) {
      // Allow Escape to exit focus mode
      if (e.key === 'Escape') {
        setFocusActive(false);
        return;
      }
      // Block Cmd+K command palette in focus mode
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [focusActive]);

  return (
    <FocusModeContext.Provider value={{ focusActive, setFocusActive, focusSubject, setFocusSubject }}>
      {children}
      {focusActive && (
        <div className="fixed inset-0 z-[90] pointer-events-none">
          {/* Dark overlay on edges */}
          <div className="absolute inset-0 border-[3px] border-indigo-500/30 rounded-none pointer-events-none" />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 bg-neutral-950/95 backdrop-blur-sm border-b border-indigo-500/20 px-6 py-3 flex items-center justify-between pointer-events-auto z-[91]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-indigo-400 text-sm font-bold">Focus Mode</span>
              {focusSubject && (
                <span className="text-neutral-500 text-xs">{'\u00B7'} {focusSubject}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-neutral-600 text-xs italic max-w-md truncate hidden sm:block">
                {'\u201C'}{quote}{'\u201D'}
              </span>
              <button
                onClick={() => {
                  setDistractions(p => p + 1);
                }}
                className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-semibold px-2.5 py-1 rounded-lg cursor-pointer hover:bg-rose-500/20 transition-colors"
                title="Track when you get distracted"
              >
                {'\u{1F648}'} Distracted{distractions > 0 ? ` (${distractions})` : ''}
              </button>
              <button
                onClick={() => setFocusActive(false)}
                className="bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
              >
                Exit Focus
              </button>
            </div>
          </div>
        </div>
      )}
    </FocusModeContext.Provider>
  );
}
