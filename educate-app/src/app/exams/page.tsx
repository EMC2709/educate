'use client';

import { useState, useEffect } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { getExamDates, addExamDate, removeExamDate, getDaysUntil, type ExamDate } from '@/lib/exam-dates';

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematics': '\u{1F4D0}', 'English Language': '\u{1F4DD}', 'English Literature': '\u{1F4DA}',
  'Biology': '\u{1F9EC}', 'Chemistry': '\u{2697}\uFE0F', 'Physics': '\u{269B}\uFE0F',
  'Combined Science': '\u{1F52C}', 'History': '\u{1F3DB}\uFE0F', 'Geography': '\u{1F30D}',
  'French': '\u{1F1EB}\u{1F1F7}', 'Spanish': '\u{1F1EA}\u{1F1F8}', 'German': '\u{1F1E9}\u{1F1EA}',
  'Computer Science': '\u{1F4BB}', 'Business Studies': '\u{1F4C8}', 'Psychology': '\u{1F9E0}',
  'Religious Studies': '\u{1F54C}', 'Sociology': '\u{1F465}', 'Economics': '\u{1F4B0}',
  'Food Preparation & Nutrition': '\u{1F373}',
};

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamDate[]>([]);
  const [subjects, setSubjects] = useState<{ subject: string; board: string }[]>([]);
  const [adding, setAdding] = useState(false);

  // Form
  const [formSubject, setFormSubject] = useState('');
  const [formBoard, setFormBoard] = useState('');
  const [formPaper, setFormPaper] = useState('Paper 1');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('09:00');

  useEffect(() => {
    setExams(getExamDates());
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (cached) {
        const subs = JSON.parse(cached);
        setSubjects(subs);
        if (subs.length > 0) {
          setFormSubject(subs[0].subject);
          setFormBoard(subs[0].board);
        }
      }
    } catch {}
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = exams.filter(e => e.date >= today);
  const past = exams.filter(e => e.date < today);

  // Next exam countdown
  const nextExam = upcoming.length > 0 ? upcoming[0] : null;
  const daysUntilNext = nextExam ? getDaysUntil(nextExam.date) : null;

  function handleAdd() {
    if (!formSubject || !formDate) return;
    addExamDate({
      subject: formSubject,
      board: formBoard,
      paper: formPaper,
      date: formDate,
      time: formTime,
    });
    setExams(getExamDates());
    setAdding(false);
    setFormPaper('Paper 1');
    setFormDate('');
  }

  function handleRemove(id: string) {
    removeExamDate(id);
    setExams(getExamDates());
  }

  // Group upcoming exams by month
  const byMonth: Record<string, ExamDate[]> = {};
  upcoming.forEach(e => {
    const month = new Date(e.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(e);
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {'\u{1F4C5}'} Exam Countdown
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">Track your exam dates and stay on top</p>
          </div>

          {/* Hero countdown */}
          {nextExam && daysUntilNext != null ? (
            <div className="bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-purple-500/15 border border-rose-500/25 rounded-2xl p-6 mb-6 text-center">
              <p className="text-neutral-400 text-sm m-0 mb-1">Next exam</p>
              <p className="text-4xl sm:text-5xl font-extrabold text-white m-0 mb-2">
                {daysUntilNext === 0 ? 'TODAY' : daysUntilNext === 1 ? '1 day' : `${daysUntilNext} days`}
              </p>
              <p className="text-neutral-300 text-sm m-0">
                {SUBJECT_ICONS[nextExam.subject] ?? '\u{1F4D6}'} {nextExam.subject} — {nextExam.paper}
              </p>
              <p className="text-neutral-500 text-xs m-0 mt-1">
                {new Date(nextExam.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                {nextExam.time ? ` at ${nextExam.time}` : ''}
              </p>
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-6 text-center">
              <span className="text-4xl mb-3 block">{'\u{1F4C5}'}</span>
              <p className="text-neutral-400 m-0 mb-1">No exams set yet</p>
              <p className="text-neutral-600 text-sm m-0">Add your exam dates to start the countdown</p>
            </div>
          )}

          {/* Add exam button */}
          {!adding ? (
            <button
              onClick={() => setAdding(true)}
              className="w-full bg-neutral-900 border-2 border-dashed border-neutral-700 rounded-2xl p-4 text-sm font-semibold text-neutral-400 cursor-pointer hover:border-indigo-500/50 hover:text-indigo-400 transition-all mb-6"
            >
              + Add Exam Date
            </button>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-bold text-white mb-4">Add Exam</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 block mb-1">Subject</label>
                  <select
                    value={formSubject}
                    onChange={e => {
                      setFormSubject(e.target.value);
                      const match = subjects.find(s => s.subject === e.target.value);
                      if (match) setFormBoard(match.board);
                    }}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  >
                    {subjects.map(s => (
                      <option key={s.subject} value={s.subject}>{s.subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 block mb-1">Paper</label>
                  <select
                    value={formPaper}
                    onChange={e => setFormPaper(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  >
                    {['Paper 1', 'Paper 2', 'Paper 3', 'Listening', 'Speaking', 'Practical', 'Coursework'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 block mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    min={today}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 block mb-1">Time (optional)</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!formDate}
                  className="bg-indigo-500 text-white text-sm font-bold px-5 py-2 rounded-lg border-none cursor-pointer hover:bg-indigo-400 transition-colors disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className="bg-neutral-800 text-neutral-400 text-sm font-semibold px-5 py-2 rounded-lg border-none cursor-pointer hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Upcoming exams by month */}
          {Object.entries(byMonth).map(([month, monthExams]) => (
            <div key={month} className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 px-1">{month}</h3>
              <div className="flex flex-col gap-2">
                {monthExams.map(exam => {
                  const days = getDaysUntil(exam.date);
                  const dateObj = new Date(exam.date + 'T00:00:00');
                  const urgencyColor = days <= 7 ? 'text-rose-400' : days <= 30 ? 'text-amber-400' : 'text-emerald-400';
                  const urgencyBg = days <= 7 ? 'bg-rose-500/10 border-rose-500/25' : days <= 30 ? 'bg-amber-500/10 border-amber-500/25' : 'bg-neutral-900 border-neutral-800';

                  return (
                    <div key={exam.id} className={`border rounded-xl p-4 flex items-center gap-4 ${urgencyBg}`}>
                      <div className="text-center shrink-0 w-12">
                        <p className="text-lg font-bold text-white m-0">{dateObj.getDate()}</p>
                        <p className="text-[10px] text-neutral-500 m-0 uppercase">{dateObj.toLocaleDateString('en-GB', { weekday: 'short' })}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white m-0 flex items-center gap-2">
                          <span>{SUBJECT_ICONS[exam.subject] ?? '\u{1F4D6}'}</span>
                          {exam.subject} — {exam.paper}
                        </p>
                        <p className="text-xs text-neutral-500 m-0 mt-0.5">
                          {exam.board}{exam.time ? ` \u00B7 ${exam.time}` : ''}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold m-0 ${urgencyColor}`}>
                          {days === 0 ? 'TODAY' : days === 1 ? '1 day' : `${days} days`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(exam.id)}
                        className="text-neutral-600 hover:text-rose-400 bg-transparent border-none cursor-pointer text-sm shrink-0 transition-colors"
                      >
                        {'\u2715'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Past exams */}
          {past.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-3 px-1">Completed</h3>
              <div className="flex flex-col gap-1">
                {past.map(exam => (
                  <div key={exam.id} className="bg-neutral-950 border border-neutral-800/50 rounded-lg p-3 flex items-center gap-3 opacity-50">
                    <span className="text-sm">{SUBJECT_ICONS[exam.subject] ?? '\u{1F4D6}'}</span>
                    <span className="text-xs text-neutral-500 flex-1">{exam.subject} — {exam.paper}</span>
                    <span className="text-[10px] text-neutral-600">
                      {new Date(exam.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                    <button onClick={() => handleRemove(exam.id)} className="text-neutral-700 hover:text-rose-400 bg-transparent border-none cursor-pointer text-xs">{'\u2715'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
