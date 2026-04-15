'use client';

import { use, useMemo } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { SUBJECT_TOPICS_MAP } from '@/data/subject-topics';
import { Q_TYPES } from '@/data/question-types';
import { Navbar } from '@/components/layout/Navbar';
import { TopicRow } from '@/components/topics/TopicRow';
import { Button } from '@/components/ui/Button';
import { useTopicSelection } from '@/hooks/useTopicSelection';
import type { QuestionType } from '@/types';

export default function TopicsPage({
  params,
  searchParams,
}: {
  params: Promise<{ board: string; subject: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { board: boardName, subject: rawSubject } = use(params);
  const { type: qType } = use(searchParams);
  const subject = decodeURIComponent(rawSubject);
  const board = EXAM_BOARDS[boardName];
  const questionType = (qType || 'short') as QuestionType;
  const qTypeCfg = Q_TYPES.find(t => t.type === questionType);
  const router = useRouter();

  const topicMap = useMemo(() => SUBJECT_TOPICS_MAP[subject] || {}, [subject]);

  const {
    expandedTopics, selectedTopics, selectedSubtopics,
    toggleExpand, toggleTopic, toggleSubtopic,
    selectAll, clearAll, selectionSummary,
  } = useTopicSelection(topicMap);

  if (!board || !board.subjects.includes(subject) || !qTypeCfg) notFound();

  const { hasAny, selectedSubs } = selectionSummary;
  const selectionCount = selectedSubs.length;

  const handleStart = () => {
    // Store selections in sessionStorage for the quiz page
    sessionStorage.setItem('educate-selected-subtopics', JSON.stringify(selectedSubtopics));
    sessionStorage.setItem('educate-selected-topics', JSON.stringify(selectedTopics));
    router.push(`/${boardName}/${encodeURIComponent(subject)}/quiz?type=${questionType}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar board={boardName} subject={subject} />
      <div className="flex min-h-[calc(100vh-56px)]">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <Link href={`/${boardName}/${encodeURIComponent(subject)}`}>
              <Button variant="ghost" className="mb-6">&#8592; Back</Button>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-7">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-xl">{qTypeCfg.icon}</span>
                  <h2 className="m-0 text-xl sm:text-2xl font-bold">{subject} &mdash; {qTypeCfg.label}</h2>
                </div>
                <p className="text-neutral-500 text-sm m-0">
                  Select topics and subtopics to focus your practice.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="secondary" onClick={selectAll} className="!text-xs !py-1.5 !px-3.5">Select All</Button>
                <Button variant="secondary" onClick={clearAll} className="!text-xs !py-1.5 !px-3.5">Clear</Button>
              </div>
            </div>

            {/* Topic list */}
            <div className="flex flex-col gap-2 mb-6">
              {Object.entries(topicMap).map(([topic, subtopics]) => {
                const selectedSubCount = subtopics.filter(sub => selectedSubtopics[`${topic}||${sub}`]).length;
                return (
                  <TopicRow
                    key={topic}
                    topic={topic}
                    subtopics={subtopics}
                    subject={subject}
                    isExpanded={!!expandedTopics[topic]}
                    isSelected={!!selectedTopics[topic]}
                    selectedSubCount={selectedSubCount}
                    accentColor={qTypeCfg.color}
                    selectedSubtopics={selectedSubtopics}
                    onToggleTopic={() => toggleTopic(topic)}
                    onToggleExpand={() => toggleExpand(topic)}
                    onToggleSubtopic={(sub) => toggleSubtopic(topic, sub)}
                  />
                );
              })}
            </div>

            {/* Start button */}
            <div className="sticky bottom-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0fcc] to-transparent pt-6 pb-2">
              {!hasAny && (
                <p className="text-center text-neutral-500 text-sm mb-3">
                  Select at least one topic or subtopic to begin
                </p>
              )}
              <button
                onClick={handleStart}
                disabled={!hasAny}
                className="w-full border-none rounded-2xl py-4 text-white font-bold text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ backgroundColor: hasAny ? qTypeCfg.color : '#222' }}
              >
                {hasAny
                  ? `Start ${qTypeCfg.label} — ${selectionCount} subtopic${selectionCount !== 1 ? 's' : ''} selected`
                  : 'Select topics to begin'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
