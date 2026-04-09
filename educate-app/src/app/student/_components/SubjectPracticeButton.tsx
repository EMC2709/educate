'use client';

import { useRouter } from 'next/navigation';

interface SubjectEntry {
  subject: string;
  board: string;
}

const SUBJECT_ICONS: Record<string, string> = {
  Mathematics: '📐',
  'English Language': '📝',
  'English Literature': '📚',
  Biology: '🧬',
  Chemistry: '⚗️',
  Physics: '⚛️',
  'Combined Science': '🔬',
  History: '🏛️',
  Geography: '🌍',
  French: '🇫🇷',
  Spanish: '🇪🇸',
  German: '🇩🇪',
  'Computer Science': '💻',
  'Art & Design': '🎨',
  Music: '🎵',
  Drama: '🎭',
  'Physical Education': '⚽',
  Sociology: '👥',
  Psychology: '🧠',
  'Business Studies': '📈',
  Economics: '💰',
  'Design & Technology': '🔧',
};

interface Props {
  subjects: SubjectEntry[];
  examType?: string;
}

export function SubjectPracticeButtons({ subjects, examType }: Props) {
  const router = useRouter();

  if (subjects.length === 0) {
    return (
      <p className="text-neutral-500 text-sm">
        No subjects saved.{' '}
        <a href="/onboarding" className="text-indigo-400 hover:text-indigo-300 no-underline">
          Add your subjects
        </a>{' '}
        to enable quick practice.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {subjects.map(({ subject, board }) => {
        const resolvedExamType = examType ?? (board === 'GCSE' ? 'GCSE' : board === 'A-Level' ? 'A-Level' : 'GCSE');
        const href = `/student/practice?subject=${encodeURIComponent(subject)}&examType=${encodeURIComponent(resolvedExamType)}`;
        return (
          <button
            key={`${board}-${subject}`}
            onClick={() => router.push(href)}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-indigo-500/50 text-neutral-200 text-sm font-medium rounded-xl transition-all cursor-pointer"
          >
            <span className="text-base">{SUBJECT_ICONS[subject] ?? '📖'}</span>
            <span>{subject}</span>
            <span className="text-xs text-neutral-500 ml-1">{board}</span>
          </button>
        );
      })}
    </div>
  );
}
