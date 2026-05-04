'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { EXAM_BOARDS } from '@/data/exam-boards';

interface SelectedSubject {
  subject: string;
  board: string;
}

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematics': '📐',
  'English Language': '📝',
  'English Literature': '📚',
  'Biology': '🧬',
  'Chemistry': '⚗️',
  'Physics': '⚛️',
  'Combined Science': '🔬',
  'History': '🏛️',
  'Geography': '🌍',
  'French': '🇫🇷',
  'Spanish': '🇪🇸',
  'German': '🇩🇪',
  'Chinese': '🇨🇳',
  'Welsh': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Religious Studies': '🕌',
  'Computer Science': '💻',
  'Art & Design': '🎨',
  'Music': '🎵',
  'Drama': '🎭',
  'Physical Education': '⚽',
  'Sociology': '👥',
  'Psychology': '🧠',
  'Business Studies': '📈',
  'Economics': '💰',
  'Design & Technology': '🔧',
  'Food Preparation & Nutrition': '🍳',
  'Graphic Communication': '📐',
};

const BOARD_STYLES: Record<string, { active: string; text: string; border: string }> = {
  AQA:     { active: '#e9456028', text: '#e94560', border: '#e94560' },
  Edexcel: { active: '#00a3e028', text: '#00a3e0', border: '#00a3e0' },
  OCR:     { active: '#00b4d828', text: '#00b4d8', border: '#00b4d8' },
  WJEC:    { active: '#52b78828', text: '#52b788', border: '#52b788' },
};

// All unique subjects across every board, in a consistent order
const ALL_SUBJECTS = (() => {
  const seen = new Set<string>();
  Object.values(EXAM_BOARDS).forEach(b => b.subjects.forEach(s => seen.add(s)));
  return Array.from(seen);
})();

// Which boards offer a given subject
function boardsForSubject(subject: string): string[] {
  return Object.entries(EXAM_BOARDS)
    .filter(([, b]) => b.subjects.includes(subject))
    .map(([name]) => name);
}

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [step, setStep]               = useState(0);
  const [displayName, setDisplayName] = useState(user?.firstName ?? '');
  const [username, setUsername]       = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [level, setLevel]             = useState<'GCSE' | 'A-Level' | ''>('');
  const [selected, setSelected]       = useState<SelectedSubject[]>([]);
  const [search, setSearch]           = useState('');
  const [saving, setSaving]           = useState(false);
  const [isEditMode, setIsEditMode]   = useState(false);

  // On mount: redirect teachers; skip ahead if already set up
  useEffect(() => {
    const editMode = new URLSearchParams(window.location.search).get('edit') === 'true';

    function hydrateFromStorage() {
      try {
        const rawSubs  = localStorage.getItem('educate-user-subjects');
        const rawName  = localStorage.getItem('educate-display-name');
        const rawUser  = localStorage.getItem('educate-username');
        const rawLevel = localStorage.getItem('educate-level') as 'GCSE' | 'A-Level' | null;
        if (rawName)  setDisplayName(rawName);
        if (rawUser)  setUsername(rawUser);
        if (rawLevel) setLevel(rawLevel);
        if (rawSubs) {
          const subs: SelectedSubject[] = JSON.parse(rawSubs);
          if (Array.isArray(subs) && subs.length > 0) {
            if (!editMode) { router.replace('/'); return; }
            setSelected(subs);
            setIsEditMode(true);
            setStep(2);
          }
        }
      } catch {}
    }

    fetch('/api/profile')
      .then(r => r.json())
      .then((d: { role?: string }) => {
        const role = d.role ?? 'student';
        // Only auto-redirect teachers/admins when NOT in edit mode
        if (!editMode && ['teacher', 'school_admin', 'super_admin'].includes(role)) {
          router.replace('/teacher');
          return;
        }
        hydrateFromStorage();
      })
      .catch(() => hydrateFromStorage());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── helpers ───────────────────────────────────────────────────────────────

  function validateUsername(val: string) {
    if (!val.trim()) return 'Username is required';
    if (val.trim().length < 3) return 'At least 3 characters';
    if (val.trim().length > 20) return 'Max 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(val.trim())) return 'Letters, numbers, and _ only';
    return '';
  }

  function canProceedStep0() {
    return displayName.trim().length > 0 && !validateUsername(username);
  }

  function isSubjectBoardSelected(subject: string, board: string) {
    return selected.some(s => s.subject === subject && s.board === board);
  }

  function toggleSubjectBoard(subject: string, board: string) {
    if (isSubjectBoardSelected(subject, board)) {
      setSelected(selected.filter(s => !(s.subject === subject && s.board === board)));
    } else {
      setSelected([...selected, { subject, board }]);
    }
  }

  async function finish() {
    if (selected.length === 0) return;
    setSaving(true);
    try {
      localStorage.setItem('educate-user-subjects', JSON.stringify(selected));
      if (displayName.trim()) localStorage.setItem('educate-display-name', displayName.trim());
      if (username.trim())    localStorage.setItem('educate-username', username.trim());
      if (level)              localStorage.setItem('educate-level', level);

      await fetch('/api/user-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: username.trim() || displayName.trim() || undefined,
          subjects: selected,
        }),
      });

      router.push('/');
    } catch {
      router.push('/');
    }
  }

  // ── filtered subject list ─────────────────────────────────────────────────

  const filteredSubjects = search.trim()
    ? ALL_SUBJECTS.filter(s => s.toLowerCase().includes(search.toLowerCase()))
    : ALL_SUBJECTS;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-xl">

        {/* Step dots */}
        {!isEditMode && (
          <div className="flex gap-2 mb-8 justify-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: step === i ? 40 : 20,
                  backgroundColor: step >= i ? '#6366f1' : '#2a2a2a',
                }}
              />
            ))}
          </div>
        )}

        {/* ── Step 0: Name + Username ───────────────────────────────────── */}
        {step === 0 && (
          <div className="text-center">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Welcome to Educate</h1>
            <p className="text-neutral-400 text-sm mb-8">Let&apos;s get you set up.</p>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1.5 ml-1">Your name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex"
                  maxLength={30}
                  className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1.5 ml-1">
                  Username <span className="text-neutral-600 font-normal">(shown on leaderboard &amp; friend requests)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm select-none">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setUsernameError(validateUsername(e.target.value)); }}
                    onBlur={() => setUsernameError(validateUsername(username))}
                    placeholder="coolstudent99"
                    maxLength={20}
                    className="w-full bg-neutral-900 border-2 rounded-xl pl-8 pr-4 py-3 text-white text-sm focus:outline-none transition-colors"
                    style={{ borderColor: usernameError ? '#ef4444' : username && !usernameError ? '#22c55e' : '#404040' }}
                    onKeyDown={e => { if (e.key === 'Enter' && canProceedStep0()) setStep(1); }}
                  />
                </div>
                {usernameError && username && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{usernameError}</p>
                )}
                {!usernameError && username.trim().length >= 3 && (
                  <p className="text-green-400 text-xs mt-1 ml-1">Looks good!</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!canProceedStep0()}
              className="mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all duration-150 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: canProceedStep0() ? '#6366f1' : '#333' }}
            >
              Continue
            </button>
          </div>
        )}

        {/* ── Step 1: Level picker ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">What are you studying?</h1>
            <p className="text-neutral-400 text-sm mb-8">Choose your qualification level.</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* GCSE card */}
              <button
                onClick={() => setLevel('GCSE')}
                className="relative rounded-2xl p-6 text-left border-2 cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: level === 'GCSE' ? '#6366f120' : '#111111',
                  borderColor: level === 'GCSE' ? '#6366f1' : '#2a2a2a',
                  boxShadow: level === 'GCSE' ? '0 8px 32px #6366f130' : 'none',
                }}
              >
                <div className="text-3xl mb-3">📚</div>
                <div className="text-lg font-extrabold text-white">GCSE</div>
                <div className="text-xs text-neutral-500 mt-1">Ages 14–16 · Year 10 &amp; 11</div>
                {level === 'GCSE' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}
              </button>

              {/* A-Level card */}
              <button
                onClick={() => setLevel('A-Level')}
                className="relative rounded-2xl p-6 text-left border-2 cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: level === 'A-Level' ? '#f59e0b20' : '#111111',
                  borderColor: level === 'A-Level' ? '#f59e0b' : '#2a2a2a',
                  boxShadow: level === 'A-Level' ? '0 8px 32px #f59e0b20' : 'none',
                }}
              >
                {/* Beta badge */}
                <span className="absolute top-3 right-3 px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wide bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                  Beta
                </span>
                <div className="text-3xl mb-3">🎓</div>
                <div className="text-lg font-extrabold text-white">A-Level</div>
                <div className="text-xs text-neutral-500 mt-1">Ages 16–18 · Year 12 &amp; 13</div>
                {level === 'A-Level' && (
                  <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}
              </button>
            </div>

            {level === 'A-Level' && (
              <p className="text-amber-500/80 text-xs mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                A-Level content is currently in beta — more subjects and topics are being added.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-3 rounded-xl font-semibold border-2 border-neutral-700 bg-transparent text-neutral-400 cursor-pointer transition-colors hover:border-neutral-500"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!level}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-150 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: level ? '#6366f1' : '#333' }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Subject + Board list ──────────────────────────────── */}
        {step === 2 && (
          <div>
            <div className="text-center mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-white">
                {isEditMode ? 'Edit Your Subjects' : 'Pick Your Subjects'}
              </h1>
              <p className="text-neutral-500 text-sm">
                Select your board next to each subject you study.
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search subjects…"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>

            {/* Board legend */}
            <div className="flex gap-2 flex-wrap mb-3">
              {Object.entries(BOARD_STYLES).map(([name, s]) => (
                <span key={name} className="text-[10px] font-bold px-2 py-0.5 rounded-md border" style={{ color: s.text, borderColor: s.border, backgroundColor: s.active }}>
                  {name}
                </span>
              ))}
            </div>

            {/* Subject rows */}
            <div className="space-y-1.5 max-h-[52vh] overflow-y-auto pr-1">
              {filteredSubjects.map(subject => {
                const boards = boardsForSubject(subject);
                const anySelected = boards.some(b => isSubjectBoardSelected(subject, b));
                return (
                  <div
                    key={subject}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                    style={{ backgroundColor: anySelected ? '#6366f10a' : '#111111' }}
                  >
                    {/* Icon + name */}
                    <span className="text-base shrink-0">{SUBJECT_ICONS[subject] ?? '📖'}</span>
                    <span
                      className="text-sm font-medium flex-1 leading-tight"
                      style={{ color: anySelected ? '#e5e7eb' : '#737373' }}
                    >
                      {subject}
                    </span>

                    {/* Board chips */}
                    <div className="flex gap-1.5 shrink-0">
                      {boards.map(board => {
                        const s = BOARD_STYLES[board];
                        const active = isSubjectBoardSelected(subject, board);
                        return (
                          <button
                            key={board}
                            onClick={() => toggleSubjectBoard(subject, board)}
                            className="text-[10px] font-bold px-2 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
                            style={active
                              ? { backgroundColor: s.active, color: s.text, borderColor: s.border }
                              : { backgroundColor: 'transparent', color: '#444', borderColor: '#2a2a2a' }
                            }
                          >
                            {board}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredSubjects.length === 0 && (
                <p className="text-neutral-600 text-sm text-center py-8">No subjects match &quot;{search}&quot;</p>
              )}
            </div>

            {/* Counter */}
            <p className="text-center text-xs mt-3" style={{ color: selected.length > 0 ? '#a3a3a3' : '#525252' }}>
              {selected.length === 0
                ? 'Tap a board next to each subject you study'
                : `${selected.length} subject${selected.length !== 1 ? 's' : ''} selected`}
            </p>

            {/* Nav */}
            <div className="flex gap-3 mt-4">
              {isEditMode ? (
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 py-3 rounded-xl font-semibold border-2 border-neutral-700 bg-transparent text-neutral-400 cursor-pointer transition-colors hover:border-neutral-500"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl font-semibold border-2 border-neutral-700 bg-transparent text-neutral-400 cursor-pointer transition-colors hover:border-neutral-500"
                >
                  Back
                </button>
              )}
              <button
                onClick={finish}
                disabled={selected.length === 0 || saving}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-150 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: selected.length > 0 ? '#6366f1' : '#333' }}
              >
                {saving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Get Started →'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
