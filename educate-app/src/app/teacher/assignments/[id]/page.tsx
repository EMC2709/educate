'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Assignment {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  subject: string | null;
  topic: string | null;
  exam_type: string | null;
  due_date: string | null;
  created_at: string;
}

interface ProgressRow {
  id: string;
  assignment_id: string;
  student_id: string;
  questions_done: number;
  questions_total: number;
  score: number;
  completed: boolean;
  completed_at: string | null;
  started_at: string;
  display_name: string | null;
}

interface ClassItem {
  id: string;
  name: string;
  subject: string | null;
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const assignmentId = params?.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [cls, setCls] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!assignmentId) return;

    Promise.all([
      fetch('/api/assignments').then(r => r.json()),
      fetch(`/api/assignments/${assignmentId}/progress`).then(r => r.json()),
      fetch('/api/classes').then(r => r.json()),
    ])
      .then(([assignmentsData, progressData, classesData]) => {
        const found = (assignmentsData.assignments || []).find(
          (a: Assignment) => a.id === assignmentId
        );
        setAssignment(found || null);
        setProgress(Array.isArray(progressData.progress) ? progressData.progress : []);
        if (found) {
          const foundCls = (classesData.classes || []).find(
            (c: ClassItem) => c.id === found.class_id
          );
          setCls(foundCls || null);
        }
      })
      .catch(() => setError('Failed to load assignment.'))
      .finally(() => setLoading(false));
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-red-400">{error || 'Assignment not found.'}</p>
        <Link href="/teacher" className="text-indigo-400 hover:text-indigo-300 text-sm">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const completed = progress.filter(p => p.completed).length;
  const total = progress.length;
  const avgScore =
    total > 0
      ? Math.round(progress.reduce((sum, p) => sum + p.score, 0) / total)
      : 0;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatDateTime(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/teacher" className="hover:text-neutral-300 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          {cls && (
            <>
              <Link
                href={`/teacher/classes/${cls.id}`}
                className="hover:text-neutral-300 transition-colors"
              >
                {cls.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-neutral-300">{assignment.title}</span>
        </div>

        {/* Assignment header */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold text-white">{assignment.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {cls && (
                  <span className="text-xs px-3 py-1 bg-neutral-800 text-neutral-400 rounded-lg">
                    {cls.name}
                  </span>
                )}
                {assignment.subject && (
                  <span className="text-xs px-3 py-1 bg-neutral-800 text-neutral-400 rounded-lg">
                    {assignment.subject}
                  </span>
                )}
                {assignment.topic && (
                  <span className="text-xs px-3 py-1 bg-neutral-800 text-neutral-400 rounded-lg">
                    {assignment.topic}
                  </span>
                )}
                {assignment.exam_type && (
                  <span className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                    {assignment.exam_type}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-neutral-500 text-xs">Due</div>
              <div className="text-white font-semibold">{formatDate(assignment.due_date)}</div>
            </div>
          </div>
        </div>

        {/* Progress overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <OverviewCard label="Students Started" value={`${total}`} sub="of class" />
          <OverviewCard label="Completed" value={`${completed}/${total}`} sub={`${completionPct}%`} />
          <OverviewCard label="Average Score" value={`${avgScore}%`} sub="across all students" />
        </div>

        {/* Completion bar */}
        {total > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">Overall Completion</span>
              <span className="text-white font-semibold text-sm">{completionPct}%</span>
            </div>
            <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Student progress table */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Student Progress</h2>
          {progress.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
              No students have started this assignment yet.
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left px-5 py-3 text-neutral-500 font-medium">Student</th>
                      <th className="text-left px-5 py-3 text-neutral-500 font-medium">Progress</th>
                      <th className="text-left px-5 py-3 text-neutral-500 font-medium">Score</th>
                      <th className="text-left px-5 py-3 text-neutral-500 font-medium">Done</th>
                      <th className="text-left px-5 py-3 text-neutral-500 font-medium">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progress.map((p, idx) => {
                      const isLast = idx === progress.length - 1;
                      const pct =
                        p.questions_total > 0
                          ? Math.round((p.questions_done / p.questions_total) * 100)
                          : 0;
                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-neutral-800/40 transition-colors ${!isLast ? 'border-b border-neutral-800' : ''}`}
                        >
                          <td className="px-5 py-3">
                            <div className="text-white font-medium">
                              {p.display_name || 'Unknown'}
                            </div>
                            <div className="text-neutral-600 text-xs font-mono">
                              {p.student_id.slice(0, 10)}...
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden w-24">
                                <div
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-neutral-400 text-xs whitespace-nowrap">
                                {p.questions_done}/{p.questions_total}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`font-semibold ${
                                p.score >= 70
                                  ? 'text-emerald-400'
                                  : p.score >= 40
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                              }`}
                            >
                              {p.score}%
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            {p.completed ? (
                              <span className="text-emerald-400 font-semibold">✓</span>
                            ) : (
                              <span className="text-neutral-600">✗</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-neutral-500">
                            {formatDateTime(p.completed_at || p.started_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function OverviewCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="text-neutral-400 text-sm mb-1">{label}</div>
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="text-neutral-500 text-xs mt-1">{sub}</div>
    </div>
  );
}
