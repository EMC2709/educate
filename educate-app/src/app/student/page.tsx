'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AssignmentCard, type Assignment, type AssignmentProgress } from './_components/AssignmentCard';
import { SubjectPracticeButtons } from './_components/SubjectPracticeButton';
import { RecentActivity } from './_components/RecentActivity';
import { ClassLeaderboard } from './_components/ClassLeaderboard';

interface Profile {
  userId: string;
  displayName: string;
  xp: number;
  level: number;
  role: string;
  org_id: string | null;
  year_group: number | null;
}

interface AssignmentWithClass extends Assignment {
  class_name: string;
}

interface QuizResult {
  id: string;
  subject: string | null;
  topic: string | null;
  score: number | null;
  total: number | null;
  created_at: string;
}

interface SubjectEntry {
  subject: string;
  board: string;
}

function countDueThisWeek(assignments: AssignmentWithClass[]): number {
  const now = new Date();
  const inOneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return assignments.filter(a => {
    if (!a.due_date) return false;
    const d = new Date(a.due_date);
    return d >= now && d <= inOneWeek;
  }).length;
}

function JoinClassModal({ onClose, onJoined }: { onClose: () => void; onJoined: (name: string) => void }) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) { setError('Code must be 6 characters.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/classes/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json() as { ok?: boolean; class?: { name: string }; error?: string };
      if (!res.ok) { setError(data.error ?? 'Invalid code.'); setSubmitting(false); return; }
      onJoined(data.class?.name ?? 'your class');
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Join a Class</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors cursor-pointer text-xl leading-none">&times;</button>
        </div>
        <p className="text-neutral-400 text-sm mb-5">Enter the 6-character code your teacher shared with you.</p>
        {error && (
          <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="e.g. ABC123"
            maxLength={6}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-2xl font-mono tracking-[0.3em] text-center focus:outline-none focus:border-indigo-500 placeholder-neutral-600"
            autoFocus
          />
          <button
            type="submit"
            disabled={submitting || code.trim().length !== 6}
            className="w-full px-5 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {submitting ? 'Joining…' : 'Join Class'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StudentHub() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assignments, setAssignments] = useState<AssignmentWithClass[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, AssignmentProgress | null>>({});
  const [recentResults, setRecentResults] = useState<QuizResult[]>([]);
  const [subjects, setSubjects] = useState<SubjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Load subjects from localStorage
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (cached) setSubjects(JSON.parse(cached));
    } catch {
      // ignore
    }

    const fetchAll = async () => {
      try {
        const [profileRes, assignmentsRes, historyRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/assignments'),
          fetch('/api/quiz-history'),
        ]);

        const [profileData, assignmentsData, historyData] = await Promise.all([
          profileRes.json(),
          assignmentsRes.json(),
          historyRes.json(),
        ]);

        setProfile(profileData);

        const rawAssignments: AssignmentWithClass[] = (assignmentsData.assignments ?? []).map(
          (a: Assignment & { class_name?: string }) => ({
            ...a,
            class_name: a.class_name ?? '',
          })
        );
        setAssignments(rawAssignments);

        // Fetch progress for each assignment in parallel
        const progressEntries = await Promise.all(
          rawAssignments.map(async a => {
            try {
              const res = await fetch(`/api/assignments/${a.id}/progress`);
              if (!res.ok) return { id: a.id, progress: null };
              const data = await res.json();
              return { id: a.id, progress: data as AssignmentProgress };
            } catch {
              return { id: a.id, progress: null };
            }
          })
        );

        const map: Record<string, AssignmentProgress | null> = {};
        progressEntries.forEach(e => {
          map[e.id] = e.progress;
        });
        setProgressMap(map);

        const results: QuizResult[] = (historyData.results ?? []).slice(0, 3);
        setRecentResults(results);
      } catch {
        setError('Failed to load dashboard. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const dueThisWeek = countDueThisWeek(assignments);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-rose-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-indigo-500/5 border border-indigo-500/30 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-neutral-400 text-sm mb-1">Welcome back</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Hey {profile?.displayName?.split(' ')[0] ?? 'there'}
              </h1>
              {joinSuccess ? (
                <p className="text-emerald-400 text-sm mt-1 font-semibold">✓ Joined {joinSuccess}!</p>
              ) : dueThisWeek > 0 ? (
                <p className="text-neutral-300 text-sm mt-1">
                  You have{' '}
                  <span className="text-amber-400 font-semibold">
                    {dueThisWeek} assignment{dueThisWeek !== 1 ? 's' : ''}
                  </span>{' '}
                  due this week.
                </p>
              ) : (
                <p className="text-neutral-400 text-sm mt-1">
                  No assignments due this week — great time for free practice!
                </p>
              )}
            </div>
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-sm font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
            >
              + Join a class
            </button>
          </div>
        </div>

        {/* My Assignments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">My Assignments</h2>
            <span className="text-sm text-neutral-500">{assignments.length} total</span>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-neutral-400 font-medium mb-1">No assignments yet</p>
              <p className="text-neutral-600 text-sm">
                Try free practice below while you wait for your teacher to assign work.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map(a => (
                <AssignmentCard
                  key={a.id}
                  assignment={a}
                  progress={progressMap[a.id] ?? null}
                />
              ))}
            </div>
          )}
        </section>

        {/* Free Practice */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Free Practice</h2>
            <Link
              href="/student/practice"
              className="text-sm text-indigo-400 hover:text-indigo-300 no-underline transition-colors"
            >
              Browse all →
            </Link>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <p className="text-neutral-400 text-sm mb-4">
              Pick a subject to start a practice session with questions from the bank.
            </p>
            <SubjectPracticeButtons subjects={subjects} />
          </div>
        </section>

        {/* Leaderboard + Recent Activity side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ClassLeaderboard currentUserId={profile?.userId ?? null} />
          <section>
            <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
            <RecentActivity results={recentResults} />
          </section>
        </div>
      </div>

      {showJoinModal && (
        <JoinClassModal
          onClose={() => setShowJoinModal(false)}
          onJoined={(name) => {
            setShowJoinModal(false);
            setJoinSuccess(name);
            setTimeout(() => setJoinSuccess(null), 5000);
            // Reload assignments (student is now in a class)
            window.location.reload();
          }}
        />
      )}
    </main>
  );
}
