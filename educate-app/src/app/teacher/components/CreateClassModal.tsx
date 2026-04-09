'use client';

import { useState } from 'react';

const SUBJECTS = [
  'Mathematics', 'English Language', 'English Literature',
  'Biology', 'Chemistry', 'Physics', 'Combined Science',
  'History', 'Geography', 'French', 'Spanish', 'German',
  'Religious Studies', 'Computer Science', 'Art & Design',
  'Music', 'Drama', 'Physical Education', 'Sociology',
  'Psychology', 'Business Studies', 'Economics',
  'Design & Technology', 'Food Preparation & Nutrition',
];

const YEAR_GROUPS = [7, 8, 9, 10, 11, 12, 13];
const EXAM_TYPES = ['GCSE', 'A-Level', 'AdvHigher', 'National 5', 'Higher'];

interface CreateClassModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateClassModal({ onClose, onCreated }: CreateClassModalProps) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [yearGroup, setYearGroup] = useState<number | ''>('');
  const [examType, setExamType] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject) {
      setError('Class name and subject are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          subject,
          year_group: yearGroup !== '' ? yearGroup : null,
          exam_type: examType || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create class.');
        return;
      }
      onCreated();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-white font-bold text-lg">Create Class</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors text-xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Class Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. 10B Mathematics"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Subject *</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer"
            >
              <option value="">Select subject...</option>
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-sm mb-1.5">Year Group</label>
              <select
                value={yearGroup}
                onChange={e => setYearGroup(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer"
              >
                <option value="">Any</option>
                {YEAR_GROUPS.map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 text-sm mb-1.5">Exam Type</label>
              <select
                value={examType}
                onChange={e => setExamType(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer"
              >
                <option value="">None</option>
                {EXAM_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {saving ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
