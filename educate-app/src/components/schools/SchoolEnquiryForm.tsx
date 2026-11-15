'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ENQUIRY_ROLES, ENQUIRY_LIMITS } from '@/lib/school-enquiry';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; name: string; email: string }
  | { kind: 'error'; message: string };

const FIELD =
  'w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-base text-white placeholder-neutral-500 ' +
  'focus:outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/30 transition-colors';
const LABEL = 'block text-sm font-medium text-neutral-200 mb-1.5';

export function SchoolEnquiryForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (k: string) => String(form.get(k) ?? '').trim();
    const studentsRaw = text('studentCount');
    const body = {
      name: text('name'),
      role: text('role'),
      organisation: text('organisation'),
      email: text('email'),
      studentCount: studentsRaw ? Number(studentsRaw) : null,
      message: text('message') || undefined,
      website: text('website') || undefined,
    };

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/school-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setStatus({ kind: 'error', message: data?.error ?? 'Your enquiry could not be sent. Please try again.' });
        return;
      }
      setStatus({ kind: 'sent', name: body.name, email: body.email });
    } catch {
      setStatus({ kind: 'error', message: 'Your enquiry could not be sent. Check your connection and try again.' });
    }
  }

  if (status.kind === 'sent') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8">
        <h3 className="m-0 text-xl font-bold text-white">Enquiry sent</h3>
        <p className="mt-3 mb-0 text-neutral-300 leading-relaxed">
          Thanks, {status.name.split(' ')[0]}. We&apos;ll reply to <strong className="text-white">{status.email}</strong>.
        </p>
        <p className="mt-3 mb-0 text-sm text-neutral-400 leading-relaxed">
          In the meantime, your students can start revising straight away with no account.
        </p>
        <Link
          href="/boards"
          className="mt-5 inline-flex rounded-xl border border-neutral-600 hover:border-neutral-400 px-4 py-2 text-sm font-semibold text-white no-underline transition-colors"
        >
          Try Educate as a student
        </Link>
      </div>
    );
  }

  const sending = status.kind === 'sending';

  return (
    <form onSubmit={handleSubmit} className="relative rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="enq-name" className={LABEL}>Your name</label>
          <input id="enq-name" name="name" type="text" required maxLength={ENQUIRY_LIMITS.name} autoComplete="name" className={FIELD} />
        </div>
        <div>
          <label htmlFor="enq-role" className={LABEL}>Your role</label>
          <select id="enq-role" name="role" required defaultValue="" className={FIELD}>
            <option value="" disabled>Choose one</option>
            {ENQUIRY_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="enq-org" className={LABEL}>School, trust or local authority</label>
        <input id="enq-org" name="organisation" type="text" required maxLength={ENQUIRY_LIMITS.organisation} autoComplete="organization" className={FIELD} />
      </div>

      <div className="grid sm:grid-cols-[1.6fr_1fr] gap-5">
        <div>
          <label htmlFor="enq-email" className={LABEL}>Work email</label>
          <input id="enq-email" name="email" type="email" required maxLength={ENQUIRY_LIMITS.email} autoComplete="email" className={FIELD} />
        </div>
        <div>
          <label htmlFor="enq-students" className={LABEL}>
            GCSE students <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input id="enq-students" name="studentCount" type="number" inputMode="numeric" min={1} max={ENQUIRY_LIMITS.maxStudents} className={FIELD} />
        </div>
      </div>

      <div>
        <label htmlFor="enq-message" className={LABEL}>
          Anything we should know? <span className="font-normal text-neutral-500">(optional)</span>
        </label>
        <textarea
          id="enq-message"
          name="message"
          rows={4}
          maxLength={ENQUIRY_LIMITS.message}
          placeholder="For example, which subjects and exam boards you teach, or when you'd like to start."
          className={`${FIELD} resize-y`}
        />
      </div>

      {/* Hidden from people; bots that fill in every field fill this in too */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="enq-website">Website</label>
        <input id="enq-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === 'error' && (
        <p role="alert" className="m-0 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {status.message}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-wait px-6 py-3 text-base font-semibold text-[#fff] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
        >
          {sending ? 'Sending…' : 'Send enquiry'}
        </button>
        <p className="m-0 text-xs text-neutral-500 leading-relaxed">
          We use these details only to reply about a licence. See our{' '}
          <Link href="/privacy" className="text-neutral-400 underline">privacy policy</Link>.
        </p>
      </div>
    </form>
  );
}
