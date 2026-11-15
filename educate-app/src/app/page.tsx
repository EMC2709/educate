import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { HomeDashboard } from '@/components/home/HomeDashboard';
import { Landing } from '@/components/landing/Landing';

export const metadata: Metadata = {
  title: 'Educate — GCSE revision for AQA, Edexcel, OCR and WJEC',
  description:
    'Practise GCSE questions for AQA, Edexcel, OCR and WJEC with no account needed. Sign in for an AI tutor, AI answer marking and past papers.',
};

/**
 * `/` decides on the server, so signed-out visitors get a fully rendered
 * landing page (fast, crawlable) instead of a "Loading…" shell.
 * Signed-in users keep the existing client-side role routing in HomeDashboard.
 * The guest exam-board picker lives at `/boards`.
 */
export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) return <Landing />;
  return <HomeDashboard />;
}
