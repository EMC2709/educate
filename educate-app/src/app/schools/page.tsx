import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import { AI_DAILY_LIMITS, FREE_PAPER_LIMIT } from '@/lib/plan-limits';
import { SchoolEnquiryForm } from '@/components/schools/SchoolEnquiryForm';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Educate for schools — ask about a licence',
  description:
    'An Educate licence gives every GCSE student at your school the full AI tutor and marking allowance and every stored past paper. Ask about a licence for your school, trust or local authority.',
};

const school = AI_DAILY_LIMITS.school;
const free = AI_DAILY_LIMITS.free;

const LICENCE = [
  {
    title: 'The full AI allowance for every student',
    body: `${school.tutor} AI tutor messages and ${school.answer_marking} AI-marked answers a day each, instead of ${free.tutor} and ${free.answer_marking} on a free account.`,
  },
  {
    title: 'Every past paper',
    body: `Real past papers, with the official mark scheme beside the answers where the board publishes one. Free accounts get ${FREE_PAPER_LIMIT} to try.`,
  },
  {
    title: 'Whole papers marked by AI',
    body: `Students can have a full paper marked against its mark scheme, ${school.paper_marking} a day each.`,
  },
  {
    title: 'Classes, assignments and progress',
    body: 'Students join your classes with a code. Set assignments, follow each student’s progress, and switch AI off for your school whenever you choose.',
  },
];

const STEPS = [
  'Send us a few details using the form.',
  'We reply by email to talk through what your school needs.',
  'Once it’s agreed, we switch your school’s licence on and invoice the school. Students get the full allowance straight away.',
];

export default function SchoolsPage() {
  return (
    <div className={`${archivo.className} pb-24`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div>
            <h1 className="m-0 landing-wide text-white font-extrabold leading-[1.05] tracking-[-0.01em] text-[2.25rem] sm:text-[2.75rem] lg:text-[3rem] max-w-[12em]">
              Educate for your school
            </h1>
            <p className="mt-6 mb-0 max-w-[34rem] text-lg leading-relaxed text-neutral-400">
              Schools, trusts and local authorities take an Educate licence. It gives every GCSE student the full
              AI tutor and marking allowance and every past paper, with your teachers in charge.
            </p>

            <ul className="list-none mt-10 mb-0 p-0 space-y-6">
              {LICENCE.map(item => (
                <li key={item.title} className="max-w-[34rem]">
                  <strong className="block text-white text-[1.0625rem] font-semibold">{item.title}</strong>
                  <span className="block mt-1 text-neutral-400 leading-relaxed">{item.body}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 mb-0 landing-wide text-white text-xl font-bold">How it works</h2>
            <ol className="mt-5 mb-0 p-0 list-none space-y-4 max-w-[34rem]">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="landing-wide shrink-0 w-7 h-7 rounded-full border border-neutral-700 text-sm font-bold text-neutral-300 flex items-center justify-center"
                  >
                    {i + 1}
                  </span>
                  <span className="text-neutral-400 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:sticky lg:top-8">
            <h2 className="m-0 mb-5 landing-wide text-white text-2xl font-bold">Ask about a licence</h2>
            <SchoolEnquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
