import Link from 'next/link';
import { AI_DAILY_LIMITS, FREE_PAPER_LIMIT } from '@/lib/plan-limits';
import { licenceStatus, formatLicenceDate } from '@/lib/licence-status';

const school = AI_DAILY_LIMITS.school;
const free = AI_DAILY_LIMITS.free;

const FREE_ALLOWANCE =
  `${free.tutor} AI tutor messages and ${free.answer_marking} AI-marked answers a day, and ${FREE_PAPER_LIMIT} past papers to try`;
const SCHOOL_ALLOWANCE =
  `${school.tutor} AI tutor messages and ${school.answer_marking} AI-marked answers a day each, and every past paper`;

const TONE = {
  active: 'bg-emerald-500/5 border-emerald-500/20',
  ending: 'bg-amber-500/5 border-amber-500/30',
  ended: 'bg-neutral-900 border-neutral-800',
  none: 'bg-neutral-900 border-neutral-800',
} as const;

function endsIn(days: number): string {
  if (days === 0) return 'ends today';
  if (days === 1) return 'ends tomorrow';
  return `ends in ${days} days`;
}

/** The school's licence, as the teacher dashboard shows it. Only a super_admin changes it, on /admin. */
export function LicenceStatusCard({ schoolName, licenceEndsOn }: { schoolName: string; licenceEndsOn: string | null }) {
  const { state, daysLeft } = licenceStatus(licenceEndsOn);
  const date = licenceEndsOn ? formatLicenceDate(licenceEndsOn) : '';
  const school = schoolName || 'your school';

  let title: string;
  let detail: string;
  let action: string | null = null;

  switch (state) {
    case 'active':
      title = `School licence active until ${date}`;
      detail = `Every student and teacher at ${school} gets ${SCHOOL_ALLOWANCE}.`;
      break;
    case 'ending':
      title = `School licence ${endsIn(daysLeft ?? 0)}`;
      detail = `It runs until ${date}. After that, accounts carry on as free accounts (${FREE_ALLOWANCE}), and nothing is deleted.`;
      action = 'Renew your licence';
      break;
    case 'ended':
      title = `School licence ended on ${date}`;
      detail = `Students at ${school} are on free accounts: ${FREE_ALLOWANCE}. Their work and your classes are all still here.`;
      action = 'Renew your licence';
      break;
    default:
      title = 'No school licence';
      detail = `Students at ${school} are on free accounts: ${FREE_ALLOWANCE}. A licence gives them ${SCHOOL_ALLOWANCE}.`;
      action = 'Ask about a licence';
  }

  return (
    <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${TONE[state]}`}>
      <div>
        <p className="text-sm font-semibold text-white m-0">{title}</p>
        <p className="text-xs text-neutral-400 m-0 mt-0.5 leading-relaxed max-w-[60ch]">{detail}</p>
      </div>
      {action && (
        <Link
          href="/schools"
          className="shrink-0 self-start sm:self-center rounded-xl border border-neutral-600 hover:border-neutral-400 px-4 py-2 text-sm font-semibold text-white no-underline transition-colors"
        >
          {action}
        </Link>
      )}
    </div>
  );
}
