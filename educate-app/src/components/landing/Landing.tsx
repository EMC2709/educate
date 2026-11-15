import Link from 'next/link';
import { Archivo, Kalam } from 'next/font/google';
import { EXAM_BOARDS } from '@/data/exam-boards';
import { AI_DAILY_LIMITS, FREE_PAPER_LIMIT } from '@/lib/plan-limits';
import { MCQ_BANK } from '@/data/mcq-bank';
import { SampleQuestion } from './SampleQuestion';
import { SignedInRefresh } from './SignedInRefresh';

// Archivo's width axis gives headings the wide, heavy look of an exam-paper
// cover. Kalam is only for the examiner's handwriting on the sample question.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], display: 'swap' });
const kalam = Kalam({ subsets: ['latin'], weight: '700', variable: '--font-kalam', display: 'swap' });

// Counted from the data so the copy can't drift from what's actually built in.
const SUBJECT_COUNT = new Set(Object.values(EXAM_BOARDS).flatMap(b => b.subjects)).size;

const SAMPLE =
  MCQ_BANK['Chemistry']?.find(q => q.question.startsWith('What is the relative formula mass (Mr) of CO₂')) ??
  MCQ_BANK['Chemistry'][0];

const PRIMARY_CTA =
  'inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-base font-semibold text-[#fff] no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300';
const SECONDARY_CTA =
  'inline-flex items-center justify-center rounded-xl border border-neutral-700 hover:border-neutral-500 px-6 py-3 text-base font-semibold text-white no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300';

const WITHOUT_ACCOUNT = [
  {
    title: 'More than 1,500 practice questions',
    body: 'They’re built into Educate, so a quiz starts the moment you pick a topic.',
  },
  {
    title: `All four exam boards, ${SUBJECT_COUNT} subjects`,
    body: 'From Maths, English and the sciences to languages, humanities and creative subjects.',
  },
  {
    title: 'Answers checked as you go',
    body: 'See straight away what you got right and what to look at again.',
  },
  {
    title: 'Plan your revision',
    body: 'A revision timetable, a countdown to your exams and a study timer.',
  },
];

const WITH_ACCOUNT = [
  {
    title: 'An AI tutor',
    body: 'Ask it to explain a topic or talk you through a question, in any of your subjects.',
  },
  {
    title: 'AI marking for written answers',
    body: 'Write a longer answer and have it marked, not just checked for one right word.',
  },
  {
    title: 'Past papers with the official mark scheme',
    body: 'Work through real past papers, with AQA’s mark scheme beside your answers where one is published.',
  },
  {
    title: 'Your own flashcards',
    body: 'Make decks for each subject, or use decks other students have shared.',
  },
  {
    title: 'XP, streaks and games',
    body: 'Earn XP and achievements, keep a daily streak going and play revision games with friends.',
  },
  {
    title: 'Your progress in one place',
    body: 'See how you’re doing in each of your subjects over time.',
  },
];

function FeatureList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="list-none m-0 p-0 space-y-6">
      {items.map(item => (
        <li key={item.title} className="max-w-[36rem]">
          <strong className="block text-white text-[1.0625rem] font-semibold">{item.title}</strong>
          <span className="block mt-1 text-neutral-400 leading-relaxed">{item.body}</span>
        </li>
      ))}
    </ul>
  );
}

export function Landing() {
  return (
    <div className={`${archivo.className} ${kalam.variable} pb-24`}>
      <SignedInRefresh />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="grid lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-14 items-center pt-10 sm:pt-16 lg:pt-20 pb-16 lg:pb-24">
          <div>
            <h1 className="m-0 landing-wide text-white font-extrabold leading-[1.04] tracking-[-0.01em] text-[2.25rem] sm:text-[3rem] lg:text-[3.25rem] xl:text-[3.75rem] max-w-[13em]">
              GCSE revision for AQA, Edexcel, OCR and WJEC
            </h1>
            <p className="mt-6 mb-0 max-w-[34rem] text-lg leading-relaxed text-neutral-400">
              Practise exam-style questions in {SUBJECT_COUNT} subjects straight away, with no account and nothing
              to install. Sign in to try the AI tutor, AI marking and real past papers. Your school’s Educate licence unlocks all of them.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/boards" className={PRIMARY_CTA}>
                Start revising, no account needed
              </Link>
              <Link href="/login" className={SECONDARY_CTA}>
                Sign in
              </Link>
            </div>
          </div>

          <SampleQuestion
            subject="Chemistry"
            question={SAMPLE.question}
            options={SAMPLE.options}
            answer={SAMPLE.answer}
            explanation={SAMPLE.explanation}
          />
        </section>

        {/* ── Exam boards ──────────────────────────────────────────────── */}
        <section aria-labelledby="boards-heading" className="border-t border-neutral-800 py-14 sm:py-16">
          <h2 id="boards-heading" className="m-0 landing-wide text-white text-2xl sm:text-[2rem] font-bold leading-tight">
            Pick your exam board
          </h2>
          <p className="mt-3 mb-0 max-w-[36rem] text-neutral-400 leading-relaxed">
            Choose the board your school entered you for. If you’re not sure, ask your teacher.
          </p>
          <ul className="list-none m-0 mt-8 p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(EXAM_BOARDS).map(([name, board]) => (
              <li key={name}>
                <Link
                  href={`/${name}`}
                  className="flex h-full flex-col justify-between gap-3 sm:gap-6 rounded-xl p-5 no-underline border-l-4 transition-[filter] hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                  style={{ backgroundColor: board.color, borderLeftColor: board.accent }}
                >
                  <span>
                    <span className="block landing-wide text-2xl font-black text-[#fff]">{board.logo}</span>
                    <span className="block mt-1 text-sm text-[#f3f4f6]">{board.tagline}</span>
                  </span>
                  <span className="text-sm text-[#e5e7eb]">{board.subjects.length} subjects</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── What you get ─────────────────────────────────────────────── */}
        <section className="border-t border-neutral-800 py-14 sm:py-16 grid md:grid-cols-2 gap-x-16 gap-y-14">
          <div>
            <h2 className="m-0 mb-8 landing-wide text-white text-2xl sm:text-[2rem] font-bold leading-tight">
              No account needed
            </h2>
            <FeatureList items={WITHOUT_ACCOUNT} />
          </div>
          <div className="md:border-l md:border-neutral-800 md:pl-16">
            <h2 className="m-0 mb-8 landing-wide text-white text-2xl sm:text-[2rem] font-bold leading-tight">
              When you sign in
            </h2>
            <FeatureList items={WITH_ACCOUNT} />
            <p className="mt-8 mb-0 text-sm text-neutral-400 leading-relaxed max-w-[34rem]">
              A free account gets {AI_DAILY_LIMITS.free.tutor} AI tutor messages and {AI_DAILY_LIMITS.free.answer_marking} AI-marked
              answers a day, and {FREE_PAPER_LIMIT} past papers to try. Students whose school has an Educate licence
              get {AI_DAILY_LIMITS.school.tutor} tutor messages and {AI_DAILY_LIMITS.school.answer_marking} marked answers a day,
              every past paper, and AI marking of whole papers.
            </p>
          </div>
        </section>

        {/* ── Teachers and parents ─────────────────────────────────────── */}
        <section className="border-t border-neutral-800 py-14 sm:py-16 grid md:grid-cols-2 gap-x-16 gap-y-12">
          <div className="max-w-[36rem]">
            <h2 className="m-0 landing-wide text-white text-xl sm:text-2xl font-bold">For teachers</h2>
            <p className="mt-3 mb-0 text-neutral-400 leading-relaxed">
              Set up your school, create classes that students join with a code, set assignments and follow each
              student’s progress. You can also switch AI features off for your school’s students.
            </p>
            <p className="mt-3 mb-0 text-sm text-neutral-400 leading-relaxed">
              Schools, trusts and local authorities take an Educate licence, which gives every student the full AI
              allowance and every past paper. Teacher accounts and licences are switched on by an Educate
              administrator.
            </p>
          </div>
          <div className="max-w-[36rem] md:pl-16">
            <h2 className="m-0 landing-wide text-white text-xl sm:text-2xl font-bold">For parents</h2>
            <p className="mt-3 mb-0 text-neutral-400 leading-relaxed">
              Your child can make a private link from their progress page. It lets you see how their revision is
              going, read-only, without needing an account of your own.
            </p>
          </div>
        </section>

        {/* ── Closing call to action ───────────────────────────────────── */}
        <section className="border-t border-neutral-800 pt-14 sm:pt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="m-0 landing-wide text-white text-2xl sm:text-[2rem] font-bold leading-tight max-w-[32rem]">
            Pick a subject and try your first question
          </h2>
          <Link href="/boards" className={`${PRIMARY_CTA} self-start md:self-auto`}>
            Start revising, no account needed
          </Link>
        </section>

        <footer className="mt-16 pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-x-6 text-sm text-neutral-400">
          <span>Educate</span>
          <Link href="/privacy" className="inline-flex items-center text-neutral-400 hover:text-white no-underline">
            Privacy
          </Link>
          <Link href="/terms" className="inline-flex items-center text-neutral-400 hover:text-white no-underline">
            Terms
          </Link>
        </footer>
      </div>
    </div>
  );
}
