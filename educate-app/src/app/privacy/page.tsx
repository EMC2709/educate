import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy · Educate',
  description: 'How Educate collects, uses and protects your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/" className="text-sm text-indigo-400 no-underline hover:underline">
          {'\u2190'} Back to home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-6 mb-2">Privacy Policy</h1>
        <p className="text-xs text-neutral-500 mb-8">Last updated: 6 April 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Who we are</h2>
            <p className="m-0">
              Educate (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a study app designed to help GCSE students
              revise. This page explains what personal information we collect, why we collect it,
              and what your rights are. We comply with UK GDPR and the Data Protection Act 2018.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. What we collect</h2>
            <ul className="list-disc pl-5 space-y-1 m-0">
              <li><strong>Account details</strong> (name, email) — handled by our auth provider, Clerk.</li>
              <li><strong>Study data</strong> — your selected subjects, exam board, quiz answers, scores, flashcard reviews, notes, exam dates, streaks and XP.</li>
              <li><strong>AI chat history</strong> — questions you send to the AI tutor and the responses generated.</li>
              <li><strong>Technical data</strong> — basic browser/device info via standard server logs (no advertising cookies, no fingerprinting).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. How we use your data</h2>
            <ul className="list-disc pl-5 space-y-1 m-0">
              <li>To provide the revision app and personalise your experience.</li>
              <li>To save your progress so you can continue across sessions and devices.</li>
              <li>To improve the app — we may look at aggregated, non-identifying usage stats.</li>
              <li>We do <strong>not</strong> sell your data, share it with advertisers, or use it for marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Who we share data with</h2>
            <p className="m-0 mb-2">We use the following processors, all of whom act on our instructions:</p>
            <ul className="list-disc pl-5 space-y-1 m-0">
              <li><strong>Clerk</strong> — authentication.</li>
              <li><strong>Supabase</strong> — encrypted database storage (EU region).</li>
              <li><strong>Anthropic (Claude API)</strong> — generates AI tutor responses. Anthropic does not train on your inputs by default.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Users under 13</h2>
            <p className="m-0">
              If you are under 13, please ask a parent or guardian to set up your account and agree
              to this policy on your behalf. We follow the UK Information Commissioner&rsquo;s Age
              Appropriate Design Code.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. How long we keep data</h2>
            <p className="m-0">
              We keep your data for as long as your account is active. If you delete your account,
              we erase your study data within 30 days. Server logs are retained for 14 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">7. Your rights</h2>
            <p className="m-0 mb-2">Under UK GDPR you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 m-0">
              <li>Access a copy of your personal data</li>
              <li>Correct anything inaccurate</li>
              <li>Erase your data (&ldquo;right to be forgotten&rdquo;)</li>
              <li>Object to processing or restrict it</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with the ICO (<a className="text-indigo-400" href="https://ico.org.uk">ico.org.uk</a>)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">8. Cookies</h2>
            <p className="m-0">
              We only use strictly-necessary cookies (for sign-in sessions) and store your preferences in
              your browser&rsquo;s local storage. We do not use advertising or analytics tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">9. Contact us</h2>
            <p className="m-0">
              For any privacy questions or to exercise your rights, email
              <a className="text-indigo-400 ml-1" href="mailto:privacy@educate.app">privacy@educate.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">10. Changes to this policy</h2>
            <p className="m-0">
              If we make material changes, we&rsquo;ll show a notice in the app and update the
              &ldquo;last updated&rdquo; date above.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-800 flex gap-4 text-xs text-neutral-500">
          <Link href="/terms" className="text-indigo-400 no-underline hover:underline">Terms of Service</Link>
          <Link href="/" className="text-indigo-400 no-underline hover:underline">Home</Link>
        </div>
      </div>
    </div>
  );
}
