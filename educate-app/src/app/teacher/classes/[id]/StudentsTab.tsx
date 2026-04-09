'use client';

import { useEffect, useState } from 'react';

interface Member {
  id: string;
  class_id: string;
  student_id: string;
  joined_at: string;
  display_name: string | null;
  xp: number | null;
  level: number | null;
}

interface StudentsTabProps {
  classId: string;
}

export function StudentsTab({ classId }: StudentsTabProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentInput, setStudentInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [addError, setAddError] = useState('');

  const fetchMembers = () => {
    setLoading(true);
    fetch(`/api/classes/${classId}/members`)
      .then(r => r.json())
      .then(d => setMembers(d.members || []))
      .catch(() => setError('Failed to load students.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, [classId]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = studentInput.trim();
    if (!val) return;
    setAdding(true);
    setAddError('');
    try {
      const res = await fetch(`/api/classes/${classId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: val }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || 'Failed to add student.');
        return;
      }
      setStudentInput('');
      fetchMembers();
    } catch {
      setAddError('Network error. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (studentId: string) => {
    setRemovingId(studentId);
    try {
      await fetch(`/api/classes/${classId}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      fetchMembers();
    } catch {
      // ignore
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add student */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-3">Add Student</h3>
        <form onSubmit={handleAddStudent} className="flex gap-3">
          <input
            type="text"
            value={studentInput}
            onChange={e => setStudentInput(e.target.value)}
            placeholder="Student user ID"
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            {adding ? 'Adding...' : 'Add'}
          </button>
        </form>
        {addError && (
          <p className="text-red-400 text-xs mt-2">{addError}</p>
        )}
      </div>

      {/* Students table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        {members.length === 0 ? (
          <div className="p-10 text-center text-neutral-500">No students enrolled yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left px-5 py-3 text-neutral-500 font-medium">Name / ID</th>
                  <th className="text-left px-5 py-3 text-neutral-500 font-medium">XP</th>
                  <th className="text-left px-5 py-3 text-neutral-500 font-medium">Level</th>
                  <th className="text-left px-5 py-3 text-neutral-500 font-medium">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {members.map((m, idx) => {
                  const isLast = idx === members.length - 1;
                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-neutral-800/40 transition-colors ${!isLast ? 'border-b border-neutral-800' : ''}`}
                    >
                      <td className="px-5 py-3">
                        <div className="text-white font-medium">
                          {m.display_name || 'Unknown'}
                        </div>
                        <div className="text-neutral-600 text-xs font-mono">{m.student_id.slice(0, 12)}...</div>
                      </td>
                      <td className="px-5 py-3 text-neutral-300">{m.xp ?? '—'}</td>
                      <td className="px-5 py-3 text-neutral-300">{m.level ?? '—'}</td>
                      <td className="px-5 py-3 text-neutral-500">
                        {new Date(m.joined_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleRemove(m.student_id)}
                          disabled={removingId === m.student_id}
                          className="text-xs text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          {removingId === m.student_id ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
