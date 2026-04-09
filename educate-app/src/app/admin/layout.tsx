'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then((d: { role?: string }) => {
        if (d.role !== 'super_admin') {
          router.replace('/');
        } else {
          setChecking(false);
        }
      })
      .catch(() => router.replace('/'));
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
