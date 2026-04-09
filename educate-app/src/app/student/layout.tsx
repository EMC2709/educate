'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => {
        if (r.status === 401) {
          router.replace('/onboarding');
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (data) setChecking(false);
      })
      .catch(() => {
        router.replace('/onboarding');
      });
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen bg-[#0f0f0f] items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />
        {children}
      </div>
    </div>
  );
}
