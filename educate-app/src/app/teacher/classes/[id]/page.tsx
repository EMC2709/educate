'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StudentsTab } from './StudentsTab';
import { AssignmentsTab } from './AssignmentsTab';
import { PastPapersTab } from './PastPapersTab';

interface ClassDetail {
  id: string;
  name: string;
  subject: string;
  year_group: number | null;
  exam_type: string | null;
  teacher_id: string;
  org_id: string;
  created_at: string;
}

interface Assignment {
  id: string;
  class_id: string;
  title: string;
  subject: string | null;
  topic: string | null;
  exam_type: string | null;
  due_date: string | null;
  question_ids: unknown[];
  created_at: string;
}

interface PastPaper {
  id: string;
  title: string;
  year: number | null;
  paper_number: number | null;
  total_questions: number | null;
  country: string | null;
  exam_type: string | null;
  subject: string | null;
}

export type { ClassDetail, Assignment, PastPaper };

type Tab = 'students' | 'assignments' | 'past-papers';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params?.id as string;

  const [cls, setCls] = useState<ClassDetail | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('students');
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [prefillPaper, setPrefillPaper] = useState<PastPaper | null>(null);

  const fetchClassData = () => {
    if (!classId) return;
    Promise.all([
      fetch('/api/classes').then(r => r.json()),
      fetch('/api/assignments').then(r => r.json()),
    ])
      .then(([classesData, assignmentsData]) => {
        const found = (classesData.classes || []).find((c: ClassDetail) => c.id === classId);
        setCls(found || null);
        const filtered = (assignmentsData.assignments || []).filter(
          (a: Assignment) => a.class_id === classId
        );
        setAssignments(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const handleAssignPaper = (paper: PastPaper) => {
    setPrefillPaper(paper);
    setShowNewAssignment(true);
    setActiveTab('assignments');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-neutral-400">Class not found.</p>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Class header */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold text-white">{cls.name}</h1>
              <div className="flex flex-wrap gap-3 mt-2">
                <Chip label={cls.subject} />
                {cls.year_group && <Chip label={`Year ${cls.year_group}`} />}
                {cls.exam_type && <Chip label={cls.exam_type} accent />}
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2">
          {(['students', 'assignments', 'past-papers'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400'
                  : 'border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
              }`}
            >
              {tab === 'students' ? 'Students' : tab === 'assignments' ? 'Assignments' : 'Past Papers'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'students' && (
          <StudentsTab classId={classId} />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsTab
            classId={classId}
            assignments={assignments}
            onRefresh={fetchClassData}
            showNewForm={showNewAssignment}
            onToggleNewForm={() => {
              setShowNewAssignment(v => !v);
              if (showNewAssignment) setPrefillPaper(null);
            }}
            prefillPaper={prefillPaper}
            cls={cls}
          />
        )}

        {activeTab === 'past-papers' && (
          <PastPapersTab onAssign={handleAssignPaper} />
        )}
      </div>
    </main>
  );
}

function Chip({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span
      className={`text-xs px-3 py-1 rounded-lg font-medium ${
        accent
          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          : 'bg-neutral-800 text-neutral-400'
      }`}
    >
      {label}
    </span>
  );
}

