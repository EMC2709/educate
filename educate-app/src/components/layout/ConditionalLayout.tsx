'use client';

import { usePathname } from 'next/navigation';
import { TopNav } from './TopNav';

/** Routes that already have their own sticky Navbar — skip the global TopNav there. */
const BOARD_RE = /^\/(aqa|edexcel|ocr|wjec)(\/|$)/i;

/**
 * Wraps the app's page content.
 * On exam-board quiz-flow pages the TopNav is hidden (those pages render
 * their own sticky Navbar). On every other page:
 *  • renders the fixed TopNav bar
 *  • adds pt-14 so content isn't hidden under it
 */
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBoardPage = BOARD_RE.test(pathname);

  return (
    <>
      {!isBoardPage && <TopNav />}
      <div className={isBoardPage ? '' : 'pt-14'}>
        {children}
      </div>
    </>
  );
}
