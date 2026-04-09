'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CreateClassModal } from './components/CreateClassModal';

interface Profile {
  userId: string;
  displayName: string;
  role: string;
  org_id: string | null;
}

interface ClassItem {
  id: string;
  name: string;
  subject: string;
  year_group: number | null;
  exam_type: string | null;
  teacher_id: string;
  created_at: string;
}

interface Assignment {
  id: string;
  class_id: string;
  title: string;
  subject: string | null;
  due_date: string | null;
  created_at: string;
}

interface ClassStats {
  studentCount: number;
  assignmentCount: number;
}

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classStats, setClassStats] = useState<Record<string, ClassStats>>({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/classes').then(r => r.json()),
      fetch('/api/assignments').then(r => r.json()),
    ])
      .then(([profileData, classesData, assignmentsData]) => {
        setProfile(profileData);
        const classList: ClassItem[] = classesData.classes || [];
        setClasses(classList);
        setAssignments(assignmentsData.assignments || []);

        // Fetch member counts for each class
        Promise.all(
          classList.map(c =>
            fetch(`/api/classes/${c.id}/members`)
              .then(r => r.json())
              .then(d => ({
                id: c.id,
                studentCount: (d.members || []).length,
                assignmentCount: (assignmentsData.assignments || []).filter(
                  (a: Assignment) => a.class_id === c.id
                ).length,
              }))
              .catch(() => ({ id: c.id, studentCount: 0, assignmentCount: 0 }))
          )
        ).then(stats => {
          const map: Record<string, ClassStats> = {};
          stats.forEach(s => {
            map[s.id] = { studentCount: s.studentCount, assignmentCount: s.assignmentCount };
          });
          setClassStats(map);
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStudents = Object.values(classStats).reduce((sum, s) => sum + s.studentCount, 0);
  const activeAssignments = assignments.filter(a => !a.due_date || new Date(a.due_date) >= new Date()).length;
  const recentAssignments = assignments.slice(0, 8);

  function formatDueDate(dateStr: string | null): string {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6">
          <p className="text-neutral-400 text-sm mb-1">Welcome back</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {profile?.displayName || 'Teacher'}
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Here is an overview of your classes and assignments.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Classes" value={classes.length} color="indigo" />
          <StatCard label="Total Students" value={totalStudents} color="violet" />
          <StatCard label="Active Assignments" value={activeAssignments} color="sky" />
          <StatCard label="Total Assignments" value={assignments.length} color="emerald" />
        </div>

        {/* My Classes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">My Classes</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              + Create Class
            </button>
          </div>

          {classes.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
              <p className="text-neutral-400 mb-4">You have not created any classes yet.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Create your first class
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map(cls => {
                const stats = classStats[cls.id] ?? { studentCount: 0, assignmentCount: 0 };
                return (
                  <Link
                    key={cls.id}
                    href={`/teacher/classes/${cls.id}`}
                    className="bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col gap-3 transition-all no-underline group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-indigo-400 transition-colors">
                          {cls.name}
                        </h3>
                        <p className="text-neutral-400 text-sm mt-0.5">{cls.subject}</p>
                      </div>
                      {cls.exam_type && (
                        <span className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded-lg shrink-0">
                          {cls.exam_type}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm">
                      {cls.year_group && (
                        <span className="text-neutral-500">Year {cls.year_group}</span>
                      )}
                    </div>
                    <div className="flex gap-4 pt-2 border-t border-neutral-800">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">{stats.studentCount}</div>
                        <div className="text-neutral-500 text-xs">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">{stats.assignmentCount}</div>
                        <div className="text-neutral-500 text-xs">Assignments</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Assignments */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Recent Assignments</h2>
          {recentAssignments.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400">
              No assignments created yet.
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              {recentAssignments.map((a, idx) => {
                const cls = classes.find(c => c.id === a.class_id);
                const isLast = idx === recentAssignments.length - 1;
                return (
                  <Link
                    key={a.id}
                    href={`/teacher/assignments/${a.id}`}
                    className={`flex items-center justify-between px-5 py-4 hover:bg-neutral-800/50 transition-colors no-underline ${!isLast ? 'border-b border-neutral-800' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{a.title}</div>
                      <div className="text-neutral-500 text-sm mt-0.5">
                        {cls ? cls.name : 'Unknown class'}
                        {a.subject && ` · ${a.subject}`}
                      </div>
                    </div>
                    <div className="text-neutral-500 text-sm shrink-0 ml-4">
                      {formatDueDate(a.due_date)}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'indigo' | 'violet' | 'sky' | 'emerald';
}) {
  const colorMap = {
    indigo: 'text-indigo-400',
    violet: 'text-violet-400',
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
  };
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className={`text-3xl font-extrabold ${colorMap[color]}`}>{value}</div>
      <div className="text-neutral-400 text-sm mt-1">{label}</div>
    </div>
  );
}
