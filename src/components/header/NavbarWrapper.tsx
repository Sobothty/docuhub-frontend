'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import NavbarGuest from './NavbarGuest';
import NavbarUser from './NavbarUser';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

function NavbarSkeleton() {
  return (
    <nav className="fixed top-14 left-0 w-full z-40 border-b bg-background border-border py-2 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Skeleton className="h-10 w-32" /> {/* Logo */}
        <div className="hidden md:flex space-x-6">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="md:hidden h-8 w-8" /> {/* Mobile menu */}
      </div>
    </nav>
  );
}

export default function NavbarWrapper() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data } = useSession();
  
  // Prevent hydration mismatch by rendering nothing until mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const hiddenPaths = ['/login', '/register', '/dashboard', '/student', '/mentor'];
  const shouldHideNavbar = hiddenPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (shouldHideNavbar) return null;

  // Avoid SSR/CSR differences
  if (!mounted) return null;

  // Show skeleton while NextAuth is resolving
  if (status) return <NavbarSkeleton />;

  const showUser = data?.user.
  return showUser ? <NavbarUser /> : <NavbarGuest />;
}
