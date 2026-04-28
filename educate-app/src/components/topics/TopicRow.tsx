'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { SUBTOPIC_BANK } from '@/data/subtopic-bank';

interface TopicRowProps {
  topic: string;
  subtopics: string[];
  subject: string;
  isExpanded: boolean;
  isSelected: boolean;
  selectedSubCount: number;
  accentColor: string;
  selectedSubtopics: Record<string, boolean>;
  onToggleTopic: () => void;
  onToggleExpand: () => void;
  onToggleSubtopic: (sub: string) => void;
}

export function TopicRow({
  topic, subtopics, subject, isExpanded, isSelected, selectedSubCount,
  accentColor, selectedSubtopics, onToggleTopic, onToggleExpand, onToggleSubtopic,
}: TopicRowProps) {
  const partial = selectedSubCount > 0 && selectedSubCount < subtopics.length;
  const hasBank = !!(SUBTOPIC_BANK?.[subject]?.[topic]);

  return (
    <div>
      {/* Topic header */}
      <div
        className={`flex items-center bg-neutral-900 overflow-hidden transition-all duration-150 border ${
          isExpanded ? 'rounded-t-xl' : 'rounded-xl'
        }`}
        style={{ borderColor: isSelected || partial ? `${accentColor}66` : 'var(--border-subtle)' }}
      >
        {/* Checkbox */}
        <div
          onClick={onToggleTopic}
          className="flex items-center justify-center w-12 h-12 cursor-pointer flex-shrink-0 border-r border-neutral-800"
        >
          <Checkbox checked={isSelected} partial={partial} color={accentColor} onChange={onToggleTopic} />
        </div>

        {/* Label */}
        <div onClick={onToggleTopic} className="flex-1 px-4 py-3 cursor-pointer flex items-center gap-2.5">
          <span className="font-semibold text-sm text-white">{topic}</span>
          {selectedSubCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-lg" style={{ color: accentColor, backgroundColor: `${accentColor}22` }}>
              {selectedSubCount}/{subtopics.length}
            </span>
          )}
          {hasBank && <span className="text-[9px] text-emerald-400">&#9889;</span>}
        </div>

        {/* Expand */}
        <button
          onClick={onToggleExpand}
          className={`bg-transparent border-none text-neutral-500 cursor-pointer px-4 py-3 text-sm flex-shrink-0 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        >
          &#8250;
        </button>
      </div>

      {/* Subtopics */}
      {isExpanded && (
        <div
          className="bg-neutral-950 border border-t-0 rounded-b-xl px-3 py-2 pl-12"
          style={{ borderColor: isSelected || partial ? `${accentColor}44` : 'var(--border-faint)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {subtopics.map(sub => {
              const key = `${topic}||${sub}`;
              const isSubSelected = selectedSubtopics[key];
              const subHasBank = !!(SUBTOPIC_BANK?.[subject]?.[topic]?.[sub]);

              return (
                <div
                  key={sub}
                  onClick={() => onToggleSubtopic(sub)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-100 border min-h-[40px] ${
                    isSubSelected
                      ? 'border-opacity-100'
                      : 'border-transparent hover:bg-neutral-800'
                  }`}
                  style={isSubSelected ? { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}55` } : undefined}
                >
                  <Checkbox checked={!!isSubSelected} color={accentColor} size="sm" onChange={() => onToggleSubtopic(sub)} />
                  <span className={`text-xs flex-1 leading-snug ${isSubSelected ? 'text-white' : 'text-neutral-400'}`}>{sub}</span>
                  {subHasBank && <span className="text-[8px] text-emerald-400 flex-shrink-0">&#9889;</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
