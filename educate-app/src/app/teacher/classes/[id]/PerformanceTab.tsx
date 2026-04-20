'use client';

import { useEffect, useState } from 'react';

interface Member { student_id: string; display_name: string | null; email: string | null }
interface TopicStats { [topic: string]: { [studentId: string]: { correct: number; total: number } } }
interface SubjectStats { [subject: string]: { correct: number; total: number; sessions: number } }

interface PerformanceData {
  members: Member[];
  topicStats: TopicStats;
  subjectStats: SubjectStats;
}

function pct(correct: number, total: number) {
  return total > 0 ? Math.round((correct / total) * 100) : null;
}

function HeatCell({ correct, total }: { correct?: number; total?: number }) {
  if (!total || !correct === undefined) {
    return <div className="w-8 h-8 rounded-md bg-neutral-800/60" title="No data" />;
  }
  const p = pct(correct!, total!);
  if (p === null) return <div className="w-8 h-8 rounded-md bg-neutral-800/60" title="No data" />;

  let bg: string;
  let textColor: string;
  if (p >= 80) { bg = '#166534'; textColor = '#4ade80'; }
  else if (p >= 60) { bg = '#1c4632'; textColor = '#86efac'; }
  else if (p >= 40) { bg = '#78350f'; textColor = '#fbbf24'; }
  else { bg = '#7f1d1d'; textColor = '#fca5a5'; }

  return (
    <div
      className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold cursor-default"
      style={{ backgroundColor: bg, color: textColor }}
      title={`${p}% (${correct}/${total})`}
    >
      {p}%
    </div>
  );
}

export function PerformanceTab({ classId }: { classId: string }) {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/classes/${classId}/performance`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); return; }
        setData(d as PerformanceData);
      })
      .catch(() => setError('Failed to load performance data'))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400 text-sm">{error}</div>
    );
  }

  if (!data || data.members.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-400">
        <p className="text-lg mb-1">No students yet</p>
        <p className="text-sm text-neutral-600">Students must join this class and complete quizzes for performance data to appear.</p>
      </div>
    );
  }

  const topics = Object.keys(data.topicStats).sort();
  const subjects = Object.entries(data.subjectStats).sort((a, b) => b[1].sessions - a[1].sessions);

  // Per-topic class averages (aggregate across all students)
  const topicAverages = topics.map(topic => {
    let totalCorrect = 0;
    let totalQ = 0;
    Object.values(data.topicStats[topic]).forEach(s => {
      totalCorrect += s.correct;
      totalQ += s.total;
    });
    return { topic, correct: totalCorrect, total: totalQ, pct: pct(totalCorrect, totalQ) };
  }).sort((a, b) => (a.pct ?? 101) - (b.pct ?? 101)); // weakest first

  const weakTopics = topicAverages.filter(t => (t.pct ?? 100) < 60).slice(0, 5);

  return (
    <div className="space-y-6">

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="Students" value={data.members.length} color="#818cf8" />
        <StatMini
          label="Avg Accuracy"
          value={(() => {
            const totC = Object.values(data.subjectStats).reduce((s, v) => s + v.correct, 0);
            const totT = Object.values(data.subjectStats).reduce((s, v) => s + v.total, 0);
            return totT > 0 ? `${Math.round((totC / totT) * 100)}%` : '—';
          })()}
          color="#34d399"
        />
        <StatMini label="Topics Tracked" value={topics.length} color="#f59e0b" />
        <StatMini label="Weak Topics" value={weakTopics.length} color="#f87171" />
      </div>

      {/* Weak topic alerts */}
      {weakTopics.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5">
          <h3 className="text-rose-400 font-bold text-sm mb-3">⚠️ Weak Topics — Class average below 60%</h3>
          <div className="flex flex-col gap-2">
            {weakTopics.map(t => (
              <div key={t.topic} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white truncate block">{t.topic}</span>
                </div>
                <div className="w-28 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${t.pct ?? 0}%`, backgroundColor: '#f87171' }}
                  />
                </div>
                <span className="text-xs font-bold text-rose-400 w-8 text-right">{t.pct ?? 0}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject-level accuracy */}
      {subjects.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm mb-4">Subject Accuracy</h3>
          <div className="flex flex-col gap-3">
            {subjects.map(([subj, s]) => {
              const p = pct(s.correct, s.total) ?? 0;
              const color = p >= 80 ? '#4ade80' : p >= 60 ? '#fbbf24' : '#f87171';
              return (
                <div key={subj} className="flex items-center gap-3">
                  <span className="text-sm text-white flex-1 min-w-0 truncate">{subj}</span>
                  <span className="text-xs text-neutral-500">{s.sessions} quiz{s.sessions !== 1 ? 'zes' : ''}</span>
                  <div className="w-24 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-right" style={{ color }}>{p}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-topic heatmap */}
      {topics.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 overflow-x-auto">
          <h3 className="text-white font-bold text-sm mb-1">Topic × Student Heatmap</h3>
          <p className="text-neutral-500 text-xs mb-4">Each cell shows that student's accuracy on that topic</p>

          <div className="min-w-max">
            {/* Header row — student names */}
            <div className="flex items-center gap-2 mb-2 pl-40">
              {data.members.map(m => (
                <div
                  key={m.student_id}
                  className="w-8 text-center text-[9px] text-neutral-500 truncate"
                  title={m.display_name || m.email || m.student_id}
                >
                  {(m.display_name || m.email || '?').split(' ')[0].slice(0, 5)}
                </div>
              ))}
              <div className="w-12 text-[9px] text-neutral-500 text-right ml-1">Class</div>
            </div>

            {/* Topic rows */}
            {topicAverages.map(({ topic, correct: tC, total: tT, pct: tPct }) => (
              <div key={topic} className="flex items-center gap-2 mb-1">
                <div
                  className="w-40 text-xs text-neutral-300 truncate shrink-0 pr-2"
                  title={topic}
                >
                  {topic}
                </div>
                {data.members.map(m => {
                  const s = data.topicStats[topic]?.[m.student_id];
                  return (
                    <HeatCell
                      key={m.student_id}
                      correct={s?.correct}
                      total={s?.total}
                    />
                  );
                })}
                {/* Class average */}
                <div className="ml-1 w-12 text-center">
                  <div
                    className="h-8 rounded-md flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: tPct === null ? '#171717' : tPct >= 80 ? '#14532d' : tPct >= 60 ? '#713f12' : '#450a0a',
                      color: tPct === null ? '#525252' : tPct >= 80 ? '#4ade80' : tPct >= 60 ? '#fbbf24' : '#f87171',
                    }}
                  >
                    {tPct !== null ? `${tPct}%` : '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 text-[10px] text-neutral-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#166534] inline-block" />80%+ Good</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#78350f] inline-block" />40-79% Needs work</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#7f1d1d] inline-block" />&lt;40% Struggling</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-neutral-800 inline-block" />No data</span>
          </div>
        </div>
      )}

      {topics.length === 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400 text-sm">
          No topic-level data yet — students need to complete quizzes for performance data to appear.
        </div>
      )}
    </div>
  );
}

function StatMini({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-neutral-500 text-xs mt-0.5">{label}</div>
    </div>
  );
}
