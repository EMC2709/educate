'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// /teacher/classes has no index — redirect to teacher dashboard which shows all classes
export default function TeacherClassesIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/teacher');
  }, [router]);
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
