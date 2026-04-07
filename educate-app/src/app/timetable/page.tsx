'use client';

import { useState, useEffect, useMemo } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { ChatPanel } from '@/components/layout/ChatPanel';

// ── Subject colour palette ──────────────────────────────────────────────────
const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': '#a78bfa',
  'English Language': '#f472b6',
  'English Literature': '#f472b6',
  'Biology': '#4ade80',
  'Chemistry': '#fb923c',
  'Physics': '#60a5fa',
  'Combined Science': '#38bdf8',
  'History': '#fbbf24',
  'Geography': '#a3e635',
  'French': '#f87171',
  'Spanish': '#f87171',
  'German': '#fbbf24',
  'Chinese': '#fb923c',
  'Welsh': '#4ade80',
  'Religious Studies': '#c084fc',
  'Computer Science': '#38bdf8',
  'Art & Design': '#f472b6',
  'Music': '#c084fc',
  'Drama': '#fb923c',
  'Physical Education': '#4ade80',
  'Sociology': '#60a5fa',
  'Psychology': '#a78bfa',
  'Business Studies': '#2dd4bf',
  'Economics': '#fbbf24',
  'Design & Technology': '#fb923c',
  'Food Preparation & Nutrition': '#fbbf24',
  'Graphic Communication': '#38bdf8',
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Slot {
  subject: string;
  time: string;
}

interface TimetableData {
  startDate: string;
  weeks: number;
  slotsPerDay: number;
  slotTimes: string[];
  schedule: Record<string, Slot[]>; // key: "week-day" e.g. "0-Monday"
  subjects: string[];
}

function getDefaultTimetable(): TimetableData {
  const cached = typeof window !== 'undefined' ? localStorage.getItem('educate-timetable') : null;
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }

  // Load user's subjects from localStorage
  let userSubjects: string[] = [];
  if (typeof window !== 'undefined') {
    try {
      const s = JSON.parse(localStorage.getItem('educate-user-subjects') || '[]');
      userSubjects = s.map((x: { subject: string }) => x.subject);
    } catch {}
  }

  const today = new Date();
  const startDate = today.toISOString().split('T')[0];

  return {
    startDate,
    weeks: 2,
    slotsPerDay: 2,
    slotTimes: ['10:00 – 12:00', '14:00 – 16:00'],
    schedule: {},
    subjects: userSubjects.length > 0 ? userSubjects : ['Mathematics', 'English Language', 'Biology'],
  };
}

function getDateForWeekDay(startDate: string, weekIndex: number, dayName: string): Date {
  const start = new Date(startDate);
  const dayMap: Record<string, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 0 };
  const targetDay = dayMap[dayName];
  const startDay = start.getDay();
  let diff = targetDay - startDay;
  if (diff < 0) diff += 7;
  const date = new Date(start);
  date.setDate(start.getDate() + diff + weekIndex * 7);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function TimetablePage() {
  const [data, setData] = useState<TimetableData>(getDefaultTimetable);
  const [editing, setEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('educate-timetable', JSON.stringify(data));
  }, [data]);

  function setSlot(weekDay: string, slotIndex: number, subject: string) {
    setData(prev => {
      const key = weekDay;
      const slots = [...(prev.schedule[key] || prev.slotTimes.map(t => ({ subject: '', time: t })))];
      slots[slotIndex] = { ...slots[slotIndex], subject };
      return { ...prev, schedule: { ...prev.schedule, [key]: slots } };
    });
  }

  function autoFill() {
    if (data.subjects.length === 0) return;
    const newSchedule: Record<string, Slot[]> = {};
    let subjectIdx = 0;
    for (let w = 0; w < data.weeks; w++) {
      for (const day of DAYS) {
        const key = `${w}-${day}`;
        const slots = data.slotTimes.map(time => {
          const subject = data.subjects[subjectIdx % data.subjects.length];
          subjectIdx++;
          return { subject, time };
        });
        newSchedule[key] = slots;
      }
    }
    setData(prev => ({ ...prev, schedule: newSchedule }));
  }

  function clearAll() {
    setData(prev => ({ ...prev, schedule: {} }));
  }

  // Summary counts
  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(data.schedule).forEach(slots => {
      slots.forEach(s => {
        if (s.subject) counts[s.subject] = (counts[s.subject] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [data.schedule]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Revision <span className="text-amber-400">Timetable</span>
              </h1>
              <p className="text-neutral-500 mt-1 text-sm">
                Customise your revision schedule
              </p>
            </div>

            {/* Settings bar */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-6">
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="text-neutral-400 text-xs font-semibold block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={data.startDate}
                    onChange={e => setData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs font-semibold block mb-1">Weeks</label>
                  <select
                    value={data.weeks}
                    onChange={e => setData(prev => ({ ...prev, weeks: Number(e.target.value) }))}
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} week{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 text-xs font-semibold block mb-1">Sessions/Day</label>
                  <select
                    value={data.slotsPerDay}
                    onChange={e => {
                      const n = Number(e.target.value);
                      const defaults = ['10:00 – 12:00', '14:00 – 16:00', '18:00 – 20:00'];
                      setData(prev => ({ ...prev, slotsPerDay: n, slotTimes: defaults.slice(0, n) }));
                    }}
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={autoFill}
                    className="bg-amber-500 text-black font-semibold text-xs px-4 py-2 rounded-lg border-none cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    Auto-fill
                  </button>
                  <button
                    onClick={clearAll}
                    className="bg-neutral-800 text-neutral-300 font-semibold text-xs px-4 py-2 rounded-lg border border-neutral-700 cursor-pointer hover:bg-neutral-700 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setEditing(!editing)}
                    className={`${editing ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-300 border border-neutral-700'} font-semibold text-xs px-4 py-2 rounded-lg border-none cursor-pointer hover:opacity-85 transition-all`}
                  >
                    {editing ? 'Done' : 'Edit Subjects'}
                  </button>
                </div>
              </div>

              {/* Edit subjects panel */}
              {editing && (
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {data.subjects.map(s => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        style={{
                          backgroundColor: `${SUBJECT_COLORS[s] || '#6366f1'}20`,
                          color: SUBJECT_COLORS[s] || '#6366f1',
                          border: `1px solid ${SUBJECT_COLORS[s] || '#6366f1'}40`,
                        }}
                        onClick={() => setData(prev => ({ ...prev, subjects: prev.subjects.filter(x => x !== s) }))}
                      >
                        {s}
                        <span className="ml-1 opacity-60">{'\u00D7'}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      list="all-subjects"
                      value={editSubject}
                      onChange={e => setEditSubject(e.target.value)}
                      placeholder="Add a subject..."
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && editSubject.trim() && !data.subjects.includes(editSubject.trim())) {
                          setData(prev => ({ ...prev, subjects: [...prev.subjects, editSubject.trim()] }));
                          setEditSubject('');
                        }
                      }}
                    />
                    <datalist id="all-subjects">
                      {Object.keys(SUBJECT_COLORS).filter(s => !data.subjects.includes(s)).map(s => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                    <button
                      onClick={() => {
                        if (editSubject.trim() && !data.subjects.includes(editSubject.trim())) {
                          setData(prev => ({ ...prev, subjects: [...prev.subjects, editSubject.trim()] }));
                          setEditSubject('');
                        }
                      }}
                      className="bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg border-none cursor-pointer hover:bg-indigo-400 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {data.subjects.map(s => (
                <div key={s} className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SUBJECT_COLORS[s] || '#6366f1' }} />
                  {s}
                </div>
              ))}
            </div>

            {/* Week blocks */}
            {Array.from({ length: data.weeks }, (_, weekIdx) => {
              const weekStart = getDateForWeekDay(data.startDate, weekIdx, 'Monday');
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 6);
              return (
                <div key={weekIdx} className="mb-10">
                  <div className="text-amber-400 font-bold text-lg mb-4 pb-2 border-b border-neutral-800">
                    Week {weekIdx + 1} — {formatDate(weekStart)} to {formatDate(weekEnd)}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                    {DAYS.map(day => {
                      const key = `${weekIdx}-${day}`;
                      const date = getDateForWeekDay(data.startDate, weekIdx, day);
                      const slots = data.schedule[key] || data.slotTimes.map(t => ({ subject: '', time: t }));
                      return (
                        <div key={key} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-transform">
                          <div className="bg-neutral-800/60 border-b border-neutral-800 px-3 py-2.5">
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{day}</div>
                            <div className="text-lg font-bold text-white">{formatDate(date)}</div>
                          </div>
                          <div className="p-3 flex flex-col gap-2.5">
                            {slots.map((slot, si) => (
                              <div key={si}>
                                <div className="text-[9px] font-semibold uppercase tracking-widest text-neutral-600 mb-1">
                                  Slot {si + 1} {'\u00B7'} {data.slotTimes[si] || ''}
                                </div>
                                <select
                                  value={slot.subject}
                                  onChange={e => setSlot(key, si, e.target.value)}
                                  className="w-full rounded-lg px-2.5 py-2 text-xs font-semibold border cursor-pointer focus:outline-none"
                                  style={
                                    slot.subject
                                      ? {
                                          backgroundColor: `${SUBJECT_COLORS[slot.subject] || '#6366f1'}18`,
                                          color: SUBJECT_COLORS[slot.subject] || '#6366f1',
                                          borderColor: `${SUBJECT_COLORS[slot.subject] || '#6366f1'}40`,
                                        }
                                      : {
                                          backgroundColor: '#1d2029',
                                          color: '#6b7280',
                                          borderColor: '#2a2d3a',
                                        }
                                  }
                                >
                                  <option value="">— empty —</option>
                                  {data.subjects.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                                {si < slots.length - 1 && <div className="h-px bg-neutral-800 mt-2.5" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Summary */}
            {summary.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
                <h3 className="text-white font-bold text-base mb-4">Session Count by Subject</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {summary.map(([subject, count]) => (
                    <div key={subject} className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700">
                      <span className="text-xs font-medium text-white">{subject}</span>
                      <span className="text-xs font-bold text-neutral-400">{count} {'\u00D7'} session</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Print button */}
            <div className="text-center">
              <button
                onClick={() => window.print()}
                className="bg-amber-400 text-neutral-900 font-bold text-sm px-8 py-3 rounded-xl border-none cursor-pointer hover:opacity-85 transition-opacity uppercase tracking-wider"
              >
                Print Timetable
              </button>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
