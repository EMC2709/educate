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
  'Mathematics': '\u{1F4D0}',
  'English Language': '\u{1F4DD}',
  'English Literature': '\u{1F4DA}',
  'Biology': '\u{1F9EC}',
  'Chemistry': '\u{2697}\uFE0F',
  'Physics': '\u{269B}\uFE0F',
  'Combined Science': '\u{1F52C}',
  'History': '\u{1F3DB}\uFE0F',
  'Geography': '\u{1F30D}',
  'French': '\u{1F1EB}\u{1F1F7}',
  'Spanish': '\u{1F1EA}\u{1F1F8}',
  'German': '\u{1F1E9}\u{1F1EA}',
  'Chinese': '\u{1F1E8}\u{1F1F3}',
  'Welsh': '\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}',
  'Religious Studies': '\u{1F54C}',
  'Computer Science': '\u{1F4BB}',
  'Art & Design': '\u{1F3A8}',
  'Music': '\u{1F3B5}',
  'Drama': '\u{1F3AD}',
  'Physical Education': '\u{26BD}',
  'Sociology': '\u{1F465}',
  'Psychology': '\u{1F9E0}',
  'Business Studies': '\u{1F4C8}',
  'Economics': '\u{1F4B0}',
  'Design & Technology': '\u{1F527}',
  'Food Preparation & Nutrition': '\u{1F373}',
  'Graphic Communication': '\u{1F4D0}',
};

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState(user?.firstName ?? '');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  const [selected, setSelected] = useState<SelectedSubject[]>([]);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // On mount: teachers go straight to their dashboard; students with existing setup go home.
  useEffect(() => {
    // Read ?edit=true from the URL without useSearchParams (avoids Suspense requirement)
    const isEditMode = new URLSearchParams(window.location.search).get('edit') === 'true';

    function hydrateFromStorage(skipHomeRedirect = false) {
      try {
        const rawSubs = localStorage.getItem('educate-user-subjects');
        const rawName = localStorage.getItem('educate-display-name');
        const rawUsername = localStorage.getItem('educate-username');
        if (rawName) setDisplayName(rawName);
        if (rawUsername) setUsername(rawUsername);
        if (rawSubs) {
          const subs: SelectedSubject[] = JSON.parse(rawSubs);
          if (Array.isArray(subs) && subs.length > 0) {
            if (!isEditMode && !skipHomeRedirect) {
              // Already set up — send straight to the app
              router.replace('/');
              return;
            }
            setSelected(subs);
            setSelectedBoard(subs[0].board);
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
        if (['teacher', 'school_admin', 'super_admin'].includes(role)) {
          router.replace('/teacher');
          return;
        }
        hydrateFromStorage();
      })
      .catch(() => hydrateFromStorage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const boardNames = Object.keys(EXAM_BOARDS);
  const currentBoard = EXAM_BOARDS[selectedBoard];

  function toggleSubject(subject: string) {
    const exists = selected.find(s => s.subject === subject && s.board === selectedBoard);
    if (exists) {
      setSelected(selected.filter(s => !(s.subject === subject && s.board === selectedBoard)));
    } else {
      setSelected([...selected, { subject, board: selectedBoard }]);
    }
  }

  function isSelected(subject: string) {
    return selected.some(s => s.subject === subject && s.board === selectedBoard);
  }

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

  async function finish() {
    if (selected.length === 0) return;
    setSaving(true);
    try {
      // Save to localStorage as reliable client-side cache
      localStorage.setItem('educate-user-subjects', JSON.stringify(selected));
      if (displayName.trim()) {
        localStorage.setItem('educate-display-name', displayName.trim());
      }
      if (username.trim()) {
        localStorage.setItem('educate-username', username.trim());
      }

      // Also try saving to Supabase (may fail if table doesn't exist yet)
      // Use username as the public display name for leaderboard/friends
      await fetch('/api/user-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: username.trim() || displayName.trim() || undefined, subjects: selected }),
      });

      router.push('/');
    } catch {
      // Even if API fails, localStorage is saved — redirect anyway
      router.push('/');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Step indicator (hidden in edit mode) */}
        {!isEditMode && (
          <div className="flex gap-2 mb-8 justify-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: step === i ? 40 : 20,
                  backgroundColor: step >= i ? '#6366f1' : '#333',
                }}
              />
            ))}
          </div>
        )}

        {/* Step 0: Name + Username */}
        {step === 0 && (
          <div className="text-center">
            <div className="text-5xl mb-4">{'\u{1F44B}'}</div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to Educate</h1>
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
                    onChange={e => {
                      setUsername(e.target.value);
                      setUsernameError(validateUsername(e.target.value));
                    }}
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

        {/* Step 1: Exam Board */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Choose Your Exam Board</h1>
            <p className="text-neutral-400 text-sm mb-8">Which exam board are your GCSEs with?</p>
            <div className="grid grid-cols-2 gap-3">
              {boardNames.map(name => {
                const board = EXAM_BOARDS[name];
                const active = selectedBoard === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedBoard(name)}
                    className="rounded-2xl p-5 text-left transition-all duration-200 border-2 cursor-pointer"
                    style={{
                      backgroundColor: active ? board.color : '#171717',
                      borderColor: active ? board.accent : '#2a2a2a',
                      boxShadow: active ? `0 8px 24px ${board.accent}33` : 'none',
                    }}
                  >
                    <div className="text-xl font-black text-white mb-1">{board.logo}</div>
                    <div className="text-xs" style={{ color: active ? board.lightAccent : '#6b7280' }}>{board.tagline}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-3 rounded-xl font-semibold border-2 border-neutral-700 bg-transparent text-neutral-400 cursor-pointer transition-colors hover:border-neutral-500"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedBoard}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-150 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: selectedBoard ? '#6366f1' : '#333' }}
              >
                Continue
              </button>
            </div>
            <p className="text-neutral-600 text-xs mt-4">You can add subjects from multiple boards — we&apos;ll ask again if needed.</p>
          </div>
        )}

        {/* Step 2: Subjects */}
        {step === 2 && currentBoard && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {isEditMode ? 'Edit Your Subjects' : 'Pick Your Subjects'}
              </h1>
              <p className="text-neutral-400 text-sm">
                {isEditMode
                  ? 'Add or remove subjects — your existing picks are pre-selected.'
                  : <>Select the subjects you&apos;re studying with <span className="font-semibold" style={{ color: currentBoard.accent }}>{selectedBoard}</span></>}
              </p>
            </div>

            {/* Board switcher for adding from multiple boards */}
            <div className="flex gap-2 mb-5 justify-center">
              {boardNames.map(name => {
                const board = EXAM_BOARDS[name];
                const active = selectedBoard === name;
                const count = selected.filter(s => s.board === name).length;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedBoard(name)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border-2 cursor-pointer"
                    style={{
                      borderColor: active ? board.accent : '#2a2a2a',
                      backgroundColor: active ? `${board.accent}22` : 'transparent',
                      color: active ? board.accent : '#6b7280',
                    }}
                  >
                    {name} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
              {currentBoard.subjects.map(subject => {
                const active = isSelected(subject);
                return (
                  <button
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-left transition-all duration-150 border-2 cursor-pointer"
                    style={{
                      borderColor: active ? currentBoard.accent : '#2a2a2a',
                      backgroundColor: active ? `${currentBoard.accent}18` : '#171717',
                    }}
                  >
                    <span className="text-lg shrink-0">{SUBJECT_ICONS[subject] ?? '\u{1F4D6}'}</span>
                    <span className="text-xs font-medium leading-tight" style={{ color: active ? '#fff' : '#a3a3a3' }}>
                      {subject}
                    </span>
                    {active && (
                      <span className="ml-auto text-sm" style={{ color: currentBoard.accent }}>{'\u2713'}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {selected.length > 0 && (
              <p className="text-center text-xs text-neutral-500 mt-3">
                {selected.length} subject{selected.length !== 1 ? 's' : ''} selected
              </p>
            )}

            <div className="flex gap-3 mt-5">
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
                {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Get Started'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
