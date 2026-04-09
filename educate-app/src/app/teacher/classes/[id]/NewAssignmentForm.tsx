'use client';

import { useState, useEffect } from 'react';
import type { ClassDetail, PastPaper } from './page';

const SUBJECTS = [
  'Mathematics', 'English Language', 'English Literature',
  'Biology', 'Chemistry', 'Physics', 'Combined Science',
  'History', 'Geography', 'French', 'Spanish', 'German',
  'Religious Studies', 'Computer Science', 'Art & Design',
  'Music', 'Drama', 'Physical Education', 'Sociology',
  'Psychology', 'Business Studies', 'Economics',
  'Design & Technology', 'Food Preparation & Nutrition',
];

interface NewAssignmentFormProps {
  classId: string;
  cls: ClassDetail;
  prefillPaper: PastPaper | null;
  onCreated: () => void;
  onCancel: () => void;
}

export function NewAssignmentForm({
  classId,
  cls,
  prefillPaper,
  onCreated,
  onCancel,
}: NewAssignmentFormProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(cls.subject || '');
  const [topic, setTopic] = useState('');
  const [examType, setExamType] = useState(cls.exam_type || '');
  const [dueDate, setDueDate] = useState('');
  const [questionSource, setQuestionSource] = useState<'random' | 'paper'>('random');
  const [selectedPaper, setSelectedPaper] = useState<PastPaper | null>(prefillPaper);
  const [paperSearch, setPaperSearch] = useState('');
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefillPaper) {
      setSelectedPaper(prefillPaper);
      setQuestionSource('paper');
      if (prefillPaper.title) setTitle(`${prefillPaper.title} Assignment`);
      if (prefillPaper.subject) setSubject(prefillPaper.subject);
      if (prefillPaper.exam_type) setExamType(prefillPaper.exam_type);
    }
  }, [prefillPaper]);

  useEffect(() => {
    if (questionSource !== 'paper') return;
    setLoadingPapers(true);
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (examType) params.set('examType', examType);
    fetch(`/api/past-papers?${params.toString()}`)
      .then(r => r.json())
      .then(d => setPapers(d.papers || []))
      .catch(() => {})
      .finally(() => setLoadingPapers(false));
  }, [questionSource, subject, examType]);

  const filteredPapers = papers.filter(p => {
    if (!paperSearch) return true;
    const q = paperSearch.toLowerCase();
    return (
      (p.title || '').toLowerCase().includes(q) ||
      String(p.year || '').includes(q)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          title: title.trim(),
          subject: subject || null,
          topic: topic.trim() || null,
          examType: examType || null,
          dueDate: dueDate || null,
          paperId: questionSource === 'paper' && selectedPaper ? selectedPaper.id : null,
          questionIds: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create assignment.');
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
    <div className="bg-neutral-900 border border-indigo-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-base">New Assignment</h3>
        <button
          onClick={onCancel}
          className="text-neutral-500 hover:text-white transition-colors text-xl cursor-pointer leading-none"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-neutral-400 text-sm mb-1.5">Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Algebra Practice"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Subject</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer"
            >
              <option value="">Select...</option>
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Topic (optional)</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Quadratic equations"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Exam Type</label>
            <select
              value={examType}
              onChange={e => setExamType(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer"
            >
              <option value="">None</option>
              {['GCSE', 'A-Level', 'AdvHigher', 'National 5', 'Higher'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Question source */}
        <div>
          <label className="block text-neutral-400 text-sm mb-2">Question Source</label>
          <div className="flex gap-3">
            {(['random', 'paper'] as const).map(src => (
              <button
                key={src}
                type="button"
                onClick={() => setQuestionSource(src)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  questionSource === src
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400'
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-600'
                }`}
              >
                {src === 'random' ? 'Random from bank' : 'Specific paper'}
              </button>
            ))}
          </div>
        </div>

        {/* Paper search */}
        {questionSource === 'paper' && (
          <div className="space-y-3">
            <input
              type="text"
              value={paperSearch}
              onChange={e => setPaperSearch(e.target.value)}
              placeholder="Search papers by title or year..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
            {loadingPapers ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="max-h-52 overflow-y-auto space-y-2">
                {filteredPapers.length === 0 ? (
                  <p className="text-neutral-500 text-sm text-center py-4">No papers found.</p>
                ) : (
                  filteredPapers.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPaper(p)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                        selectedPaper?.id === p.id
                          ? 'border-indigo-500 bg-indigo-500/15'
                          : 'border-neutral-800 hover:border-neutral-700 bg-neutral-800/50'
                      }`}
                    >
                      <div className="text-white font-medium">{p.title}</div>
                      <div className="text-neutral-500 text-xs mt-0.5">
                        {p.year && `${p.year} · `}
                        {p.paper_number && `Paper ${p.paper_number} · `}
                        {p.total_questions && `${p.total_questions} questions`}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
            {selectedPaper && (
              <div className="px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 text-sm">
                Selected: <span className="font-semibold">{selectedPaper.title}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {saving ? 'Creating...' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}
