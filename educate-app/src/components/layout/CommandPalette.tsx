'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface CommandItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  category: string;
}

const PAGE_ITEMS: CommandItem[] = [
  { id: 'home', label: 'Home', icon: '\u{1F3E0}', href: '/', category: 'Pages' },
  { id: 'timetable', label: 'Revision Timetable', icon: '\u{1F4C5}', href: '/timetable', category: 'Pages' },
  { id: 'exams', label: 'Exam Countdown', icon: '\u{23F3}', href: '/exams', category: 'Pages' },
  { id: 'timer', label: 'Study Timer', icon: '\u{23F0}', href: '/timer', category: 'Pages' },
  { id: 'notes', label: 'Revision Notes', icon: '\u{1F4DD}', href: '/notes', category: 'Pages' },
  { id: 'mastery', label: 'Topic Mastery', icon: '\u{1F5FA}\uFE0F', href: '/mastery', category: 'Pages' },
  { id: 'progress', label: 'Progress & Stats', icon: '\u{1F4CA}', href: '/progress', category: 'Pages' },
  { id: 'achievements', label: 'Achievements', icon: '\u{1F3C6}', href: '/achievements', category: 'Pages' },
  { id: 'games', label: 'Game Zone', icon: '\u{1F3AE}', href: '/games', category: 'Pages' },
  { id: 'boards', label: 'Exam Boards', icon: '\u{1F4CB}', href: '/boards', category: 'Pages' },
  { id: 'export', label: 'Share & Export', icon: '\u{1F4E4}', href: '/export', category: 'Pages' },
  { id: 'onboarding', label: 'Edit My Subjects', icon: '\u{270F}\uFE0F', href: '/onboarding?edit=true', category: 'Actions' },
];

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematics': '\u{1F4D0}', 'English Language': '\u{1F4DD}', 'English Literature': '\u{1F4DA}',
  'Biology': '\u{1F9EC}', 'Chemistry': '\u{2697}\uFE0F', 'Physics': '\u{269B}\uFE0F',
  'Combined Science': '\u{1F52C}', 'History': '\u{1F3DB}\uFE0F', 'Geography': '\u{1F30D}',
  'French': '\u{1F1EB}\u{1F1F7}', 'Spanish': '\u{1F1EA}\u{1F1F8}', 'German': '\u{1F1E9}\u{1F1EA}',
  'Computer Science': '\u{1F4BB}', 'Psychology': '\u{1F9E0}', 'Business Studies': '\u{1F4C8}',
  'Religious Studies': '\u{1F54C}', 'Sociology': '\u{1F465}', 'Economics': '\u{1F4B0}',
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load user subjects from localStorage
  const subjectItems = useMemo<CommandItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (!cached) return [];
      const subjects: { subject: string; board: string }[] = JSON.parse(cached);
      const items: CommandItem[] = [];
      subjects.forEach(({ subject, board }) => {
        items.push({
          id: `subject-${board}-${subject}`,
          label: subject,
          icon: SUBJECT_ICONS[subject] ?? '\u{1F4D6}',
          href: `/${board}/${encodeURIComponent(subject)}`,
          category: 'My Subjects',
        });
        items.push({
          id: `quiz-${board}-${subject}`,
          label: `Quiz: ${subject}`,
          icon: '\u{1F9E9}',
          href: `/${board}/${encodeURIComponent(subject)}/quiz`,
          category: 'Start Quiz',
        });
      });
      return items;
    } catch { return []; }
  }, [open]); // recalculate when palette opens

  const allItems = useMemo(() => [...subjectItems, ...PAGE_ITEMS], [subjectItems]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(item => item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
  }, [query, allItems]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filtered]);

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selection when results change
  useEffect(() => { setSelectedIndex(0); }, [filtered]);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      navigate(filtered[selectedIndex].href);
    }
  }

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Palette */}
      <div className="relative w-full max-w-lg mx-4 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800">
          <span className="text-neutral-500 text-sm">{'\u{1F50D}'}</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search subjects, quizzes, pages..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-neutral-600"
          />
          <kbd className="text-[10px] text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">No results found</div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 px-3 py-1.5">
                  {category}
                </div>
                {items.map(item => {
                  const idx = flatIndex++;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.href)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left border-none cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-500/15 text-indigo-400'
                          : 'bg-transparent text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <span className="text-base w-6 text-center">{item.icon}</span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {isSelected && (
                        <kbd className="text-[10px] text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">{'\u21B5'}</kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 px-4 py-2 flex items-center gap-4 text-[10px] text-neutral-600">
          <span>{'\u2191\u2193'} navigate</span>
          <span>{'\u21B5'} open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
