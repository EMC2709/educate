'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AssignmentCard, type Assignment, type AssignmentProgress } from '../_components/AssignmentCard';

interface ClassItem {
  id: string;
  name: string;
  subject: string;
  year_group: number | null;
  exam_type: string | null;
  teacher_id: string;
  created_at: string;
}

interface AssignmentWithProgress extends Assignment {
  class_name: string;
  progress: AssignmentProgress | null;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#3b82f6',
  Biology: '#10b981',
  Chemistry: '#06b6d4',
  Physics: '#0ea5e9',
  'Combined Science': '#14b8a6',
  'English Language': '#a855f7',
  'English Literature': '#8b5cf6',
  History: '#f59e0b',
  Geography: '#84cc16',
  'Computer Science': '#6366f1',
};

function subjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] ?? '#6366f1';
}

export default function MyClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [classRes, assignRes, progressRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/assignments'),
        fetch('/api/assignments/unread'),
      ]);
      const classData = await classRes.json() as { classes?: ClassItem[] };
      const assignData = await assignRes.json() as { assignments?: Assignment[] };
      const progressData = await progressRes.json() as { progress?: Record<string, AssignmentProgress> };

      const cls = classData.classes ?? [];
      const asgn = assignData.assignments ?? [];
      const prog = progressData.progress ?? {};

      setClasses(cls);

      const classMap = Object.fromEntries(cls.map(c => [c.id, c.name]));
      setAssignments(
        asgn.map(a => ({
          ...a,
          class_name: classMap[a.class_id] ?? '',
          progress: prog[a.id] ?? null,
        }))
      );
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');
    setJoining(true);
    try {
      const res = await fetch('/api/classes/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: joinCode.trim().toUpperCase() }),
      });
      const data = await res.json() as { ok?: boolean; class?: { name: string }; error?: string };
      if (!res.ok) {
        setJoinError(data.error ?? 'Failed to join class.');
      } else {
        setJoinSuccess(`Joined "${data.class?.name}" successfully!`);
        setJoinCode('');
        await load();
      }
    } catch {
      setJoinError('Network error — please try again.');
    } finally {
      setJoining(false);
    }
  }

  const assignmentsForClass = (classId: string) =>
    assignments.filter(a => a.class_id === classId);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-neutral-500 hover:text-neutral-300 transition-colors text-sm no-underline">
            ← Home
          </Link>
          <span className="text-neutral-700">/</span>
          <h1 className="text-xl font-bold text-white m-0">My Classes</h1>
        </div>

        {/* Join a class */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-neutral-300 mb-3">Join a Class</h2>
          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="flex-1 px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono tracking-widest uppercase"
            />
            <button
              type="submit"
              disabled={joining || joinCode.length !== 6}
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
            >
              {joining ? 'Joining…' : 'Join'}
            </button>
          </form>
          {joinError && <p className="text-rose-400 text-xs mt-2">{joinError}</p>}
          {joinSuccess && <p className="text-emerald-400 text-xs mt-2">{joinSuccess}</p>}
        </section>

        {/* Classes list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏫</p>
            <p className="text-neutral-400 text-sm">You haven&apos;t joined any classes yet.</p>
            <p className="text-neutral-600 text-xs mt-1">Ask your teacher for a join code.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map(cls => {
              const color = subjectColor(cls.subject);
              const clsAssignments = assignmentsForClass(cls.id);
              const isExpanded = expandedClass === cls.id;
              const pendingCount = clsAssignments.filter(a => !a.progress?.completed).length;

              return (
                <div key={cls.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                  {/* Class header */}
                  <button
                    onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                    className="w-full text-left p-5 flex items-center gap-4 hover:bg-neutral-800/50 transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white"
                      style={{ backgroundColor: `${color}33`, border: `1px solid ${color}44` }}
                    >
                      <span style={{ color }}>{cls.subject.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-white font-semibold text-sm leading-tight truncate">{cls.name}</p>
                      <p className="text-neutral-500 text-xs mt-0.5 truncate">
                        {cls.subject}{cls.year_group ? ` · Year ${cls.year_group}` : ''}{cls.exam_type ? ` · ${cls.exam_type}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {pendingCount > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-medium">
                          {pendingCount} task{pendingCount !== 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="text-neutral-600 text-xs">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {/* Assignments */}
                  {isExpanded && (
                    <div className="border-t border-neutral-800 p-4">
                      {clsAssignments.length === 0 ? (
                        <p className="text-neutral-600 text-xs text-center py-4">No assignments yet.</p>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {clsAssignments.map(a => (
                            <AssignmentCard key={a.id} assignment={a} progress={a.progress} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
