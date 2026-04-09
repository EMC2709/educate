'use client';

import { useEffect, useState, useCallback } from 'react';

interface Course {
  id: string;
  name: string;
  section: string;
  enrollmentCode: string;
  studentCount: number;
}

interface ClassItem {
  id: string;
  name: string;
  subject: string;
}

interface SyncResult {
  synced: number;
  pending: number;
  total: number;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

interface ClassroomSyncPanelProps {
  classes: ClassItem[];
}

export function ClassroomSyncPanel({ classes }: ClassroomSyncPanelProps) {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncingCourseId, setSyncingCourseId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/classroom/courses');
      const data = await res.json() as { connected?: boolean; courses?: Course[]; error?: string };
      if (res.ok && data.connected) {
        setConnected(true);
        setCourses(data.courses ?? []);
      } else if (data.connected === false) {
        setConnected(false);
      } else {
        setConnected(false);
      }
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check URL for connection status after OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const classroomParam = params.get('classroom');
    if (classroomParam === 'connected') {
      showToast('Google Classroom connected successfully.', 'success');
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('classroom');
      window.history.replaceState({}, '', url.toString());
    } else if (classroomParam === 'error') {
      showToast('Failed to connect Google Classroom. Please try again.', 'error');
      const url = new URL(window.location.href);
      url.searchParams.delete('classroom');
      window.history.replaceState({}, '', url.toString());
    } else if (classroomParam === 'denied') {
      showToast('Google Classroom access was denied.', 'error');
      const url = new URL(window.location.href);
      url.searchParams.delete('classroom');
      window.history.replaceState({}, '', url.toString());
    }

    fetchCourses();
  }, [fetchCourses]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch('/api/classroom/auth');
      const data = await res.json() as { authUrl?: string; error?: string };
      if (res.ok && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        showToast(data.error ?? 'Failed to start authorisation.', 'error');
        setConnecting(false);
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
      setConnecting(false);
    }
  };

  const handleSync = async (courseId: string) => {
    const classId = selectedClass[courseId];
    if (!classId) {
      showToast('Please select an Educate class to sync into.', 'error');
      return;
    }

    setSyncingCourseId(courseId);
    try {
      const res = await fetch('/api/classroom/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, courseId }),
      });
      const data = await res.json() as SyncResult & { error?: string };
      if (res.ok) {
        const msg =
          data.pending > 0
            ? `Synced ${data.synced} student${data.synced !== 1 ? 's' : ''}. ${data.pending} pending invite${data.pending !== 1 ? 's' : ''} (not yet on Educate).`
            : `Synced ${data.synced} student${data.synced !== 1 ? 's' : ''} successfully.`;
        showToast(msg, 'success');
      } else {
        showToast(data.error ?? 'Sync failed. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setSyncingCourseId(null);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Google Classroom Sync</h2>
          {connected && (
            <p className="text-neutral-500 text-sm mt-0.5">Import student rosters from your Google Classroom courses.</p>
          )}
        </div>
        {connected && !loading && (
          <button
            onClick={fetchCourses}
            className="text-neutral-500 hover:text-white text-sm transition-colors cursor-pointer"
          >
            Refresh
          </button>
        )}
      </div>

      {toast && (
        <div
          className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !connected ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zM12 9v3m0 3h.008" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Connect Google Classroom</p>
            <p className="text-neutral-400 text-sm max-w-sm">
              Authorise once to import student rosters from your Google Classroom courses directly into Educate.
            </p>
          </div>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
          >
            {connecting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                Redirecting...
              </>
            ) : (
              'Connect Google Classroom'
            )}
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400 text-sm">
          No active Google Classroom courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white font-semibold text-sm leading-snug">{course.name}</h3>
                  {course.enrollmentCode && (
                    <span className="text-xs px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-lg shrink-0 font-mono">
                      {course.enrollmentCode}
                    </span>
                  )}
                </div>
                {course.section && (
                  <p className="text-neutral-500 text-sm mt-0.5">{course.section}</p>
                )}
                <p className="text-neutral-500 text-xs mt-2">
                  {course.studentCount} student{course.studentCount !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <select
                  value={selectedClass[course.id] ?? ''}
                  onChange={e =>
                    setSelectedClass(prev => ({ ...prev, [course.id]: e.target.value }))
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="">Sync into class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} — {cls.subject}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleSync(course.id)}
                  disabled={syncingCourseId === course.id || !selectedClass[course.id]}
                  className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {syncingCourseId === course.id ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                      Syncing...
                    </>
                  ) : (
                    'Sync Roster'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
