'use client';

const SUBJECTS = [
  'Mathematics', 'English Language', 'English Literature', 'Biology', 'Chemistry',
  'Physics', 'Combined Science', 'History', 'Geography', 'French', 'Spanish', 'German',
  'Computer Science', 'Art & Design', 'Music', 'Drama', 'Physical Education',
  'Sociology', 'Psychology', 'Business Studies', 'Economics', 'Design & Technology',
];

const EXAM_TYPES = ['GCSE', 'A-Level', 'IGCSE', 'National 5', 'Higher'];

export interface PracticeFilters {
  subject: string;
  examType: string;
  topic: string;
  limit: number;
}

interface Props {
  filters: PracticeFilters;
  onChange: (filters: PracticeFilters) => void;
  onSearch: () => void;
  loading: boolean;
}

export function PracticeFilterBar({ filters, onChange, onSearch, loading }: Props) {
  const set = <K extends keyof PracticeFilters>(key: K, value: PracticeFilters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Subject
          </label>
          <select
            value={filters.subject}
            onChange={e => set('subject', e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">All subjects</option>
            {SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Exam type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Exam type
          </label>
          <select
            value={filters.examType}
            onChange={e => set('examType', e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">All types</option>
            {EXAM_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Topic (optional)
          </label>
          <input
            type="text"
            value={filters.topic}
            onChange={e => set('topic', e.target.value)}
            placeholder="e.g. Trigonometry"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
            onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
          />
        </div>

        {/* Limit */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Questions: {filters.limit}
          </label>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={filters.limit}
            onChange={e => set('limit', Number(e.target.value))}
            className="w-full h-2 accent-indigo-500 mt-3"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSearch}
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer border-0 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            'Find questions'
          )}
        </button>
      </div>
    </div>
  );
}
