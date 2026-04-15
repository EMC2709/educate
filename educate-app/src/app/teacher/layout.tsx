import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserRole } from '@/lib/roles';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';

const ALLOWED_ROLES = ['teacher', 'school_admin', 'super_admin'];

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  const role = await getUserRole(userId);
  if (!ALLOWED_ROLES.includes(role)) redirect('/');

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
