'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Sidebar } from './sidebar';
import {
  SidebarProvider,
  useSidebar,
} from '@/components/contexts/sidebar-context';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'adviser' | 'student' | 'public';
  userName?: string;
  userAvatar?: string;
}

function DashboardLayoutContent({
  children,
  userRole,
  userName,
  userAvatar,
}: DashboardLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const typedSession = (session as unknown as Session | null);
  const user = typedSession?.user;
  const isLoading = status === 'loading';
  const { isOpen } = useSidebar();

  // Avoid SSR/CSR mismatch by waiting until client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        userRole={userRole}
        userName={userName || 'User'} // Fallback to session user name
        userAvatar={userAvatar || '/placeholder.svg'} // Remove user.avatar reference
      />

      {/* Main content */}
      <div className={isOpen ? 'md:pl-64' : 'md:pl-16'}>
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({
  children,
  userRole,
  userName,
  userAvatar,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
      >
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

export default DashboardLayout;
