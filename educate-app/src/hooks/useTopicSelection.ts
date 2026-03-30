'use client';

import { useState, useCallback, useMemo } from 'react';

export function useTopicSelection(topicMap: Record<string, string[]>) {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [selectedTopics, setSelectedTopics] = useState<Record<string, boolean>>({});
  const [selectedSubtopics, setSelectedSubtopics] = useState<Record<string, boolean>>({});

  const toggleExpand = useCallback((topic: string) => {
    setExpandedTopics(p => ({ ...p, [topic]: !p[topic] }));
  }, []);

  const toggleTopic = useCallback((topic: string) => {
    const subs = topicMap[topic] || [];
    setSelectedTopics(p => {
      const isSelected = p[topic];
      const next = { ...p, [topic]: !isSelected };
      setSelectedSubtopics(prev => {
        const subNext = { ...prev };
        subs.forEach(sub => { subNext[`${topic}||${sub}`] = !isSelected; });
        return subNext;
      });
      return next;
    });
  }, [topicMap]);

  const toggleSubtopic = useCallback((topic: string, sub: string) => {
    const key = `${topic}||${sub}`;
    setSelectedSubtopics(p => {
      const newState = !p[key];
      const next = { ...p, [key]: newState };
      const subs = topicMap[topic] || [];
      const allSelected = subs.every(s => s === sub ? newState : next[`${topic}||${s}`]);
      setSelectedTopics(prev => ({ ...prev, [topic]: allSelected }));
      return next;
    });
  }, [topicMap]);

  const selectAll = useCallback(() => {
    const topics: Record<string, boolean> = {};
    const subs: Record<string, boolean> = {};
    Object.entries(topicMap).forEach(([topic, subtopics]) => {
      topics[topic] = true;
      subtopics.forEach(sub => { subs[`${topic}||${sub}`] = true; });
    });
    setSelectedTopics(topics);
    setSelectedSubtopics(subs);
  }, [topicMap]);

  const clearAll = useCallback(() => {
    setSelectedTopics({});
    setSelectedSubtopics({});
  }, []);

  const selectionSummary = useMemo(() => {
    const selectedSubs = Object.entries(selectedSubtopics).filter(([, v]) => v).map(([k]) => k);
    const selectedTopicKeys = Object.entries(selectedTopics).filter(([, v]) => v).map(([k]) => k);
    return { selectedSubs, selectedTopicKeys, hasAny: selectedSubs.length > 0 || selectedTopicKeys.length > 0 };
  }, [selectedSubtopics, selectedTopics]);

  const buildFocusString = useCallback(() => {
    const parts: string[] = [];
    Object.entries(topicMap).forEach(([topic, subs]) => {
      const selectedSubs = subs.filter(sub => selectedSubtopics[`${topic}||${sub}`]);
      if (selectedSubs.length === subs.length && selectedTopics[topic]) {
        parts.push(topic);
      } else if (selectedSubs.length > 0) {
        parts.push(`${topic} (${selectedSubs.join(', ')})`);
      }
    });
    return parts.length > 0 ? parts.join('; ') : null;
  }, [topicMap, selectedSubtopics, selectedTopics]);

  return {
    expandedTopics,
    selectedTopics,
    selectedSubtopics,
    toggleExpand,
    toggleTopic,
    toggleSubtopic,
    selectAll,
    clearAll,
    selectionSummary,
    buildFocusString,
  };
}
