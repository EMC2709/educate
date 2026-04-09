'use client';

import Link from 'next/link';
import { NewAssignmentForm } from './NewAssignmentForm';
import type { ClassDetail, Assignment, PastPaper } from './page';

interface AssignmentsTabProps {
  classId: string;
  assignments: Assignment[];
  onRefresh: () => void;
  showNewForm: boolean;
  onToggleNewForm: () => void;
  prefillPaper: PastPaper | null;
  cls: ClassDetail;
}

export function AssignmentsTab({
  classId,
  assignments,
  onRefresh,
  showNewForm,
  onToggleNewForm,
  prefillPaper,
  cls,
}: AssignmentsTabProps) {
  function formatDueDate(dateStr: string | null): string {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function dueBadge(dateStr: string | null): { label: string; className: string } {
    if (!dateStr) return { label: 'No due date', className: 'text-neutral-500' };
    const due = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: 'Overdue', className: 'text-red-400' };
    if (diffDays <= 3) return { label: `Due in ${diffDays}d`, className: 'text-amber-400' };
    return { label: formatDueDate(dateStr), className: 'text-neutral-500' };
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={onToggleNewForm}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          {showNewForm ? 'Cancel' : '+ New Assignment'}
        </button>
      </div>

      {showNewForm && (
        <NewAssignmentForm
          classId={classId}
          cls={cls}
          prefillPaper={prefillPaper}
          onCreated={() => {
            onToggleNewForm();
            onRefresh();
          }}
          onCancel={onToggleNewForm}
        />
      )}

      {assignments.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
          No assignments yet. Create one above.
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          {assignments.map((a, idx) => {
            const badge = dueBadge(a.due_date);
            const isLast = idx === assignments.length - 1;
            return (
              <Link
                key={a.id}
                href={`/teacher/assignments/${a.id}`}
                className={`flex items-center justify-between px-5 py-4 hover:bg-neutral-800/50 transition-colors no-underline ${!isLast ? 'border-b border-neutral-800' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{a.title}</div>
                  <div className="text-neutral-500 text-xs mt-0.5">
                    {a.subject && `${a.subject}`}
                    {a.topic && ` · ${a.topic}`}
                    {a.exam_type && ` · ${a.exam_type}`}
                  </div>
                </div>
                <div className={`text-sm shrink-0 ml-4 ${badge.className}`}>
                  {badge.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
