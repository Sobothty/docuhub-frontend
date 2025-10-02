"use client";

import { usePathname } from 'next/navigation';
import NavbarWrapper from '@/components/header/NavbarWrapper';
import StickyBanner from '@/components/header/StickyBanner';
import ContactFooter from '@/components/footer/ContactFooter';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Routes that should NOT show navbar, sticky banner, and footer
const ROUTES_WITHOUT_NAVBAR = {
  // Exact route matches
  exact: [
    '/login',
    '/register',
    '/profile',
    '/student-verification'
  ],
  // Route prefixes (anything starting with these will exclude navbar)
  prefixes: [
    // '/student/', // allow navbar on student pages
    '/mentor/',
    '/admin/',
    '/profile/'
  ],
  // Base routes (for backward compatibility)
  base: [
    // '/student', // allow navbar on student base route
    '/mentor',
    '/admin'
  ]
};

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current route should exclude navbar/footer
  const shouldHideNavbar = 
    // Check exact matches
    ROUTES_WITHOUT_NAVBAR.exact.includes(pathname) ||
    // Check prefix matches
    ROUTES_WITHOUT_NAVBAR.prefixes.some(prefix => pathname.startsWith(prefix)) ||
    // Check base routes
    ROUTES_WITHOUT_NAVBAR.base.some(route => pathname.startsWith(route));

  // Debug log (remove in production if needed)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ConditionalLayout] Path: ${pathname}, Hide navbar: ${shouldHideNavbar}`);
  }

  // Return layout without navbar for excluded routes
  if (shouldHideNavbar) {
    return <>{children}</>;
  }

  // Return full layout with navbar for normal routes
  return (
    <>
      <StickyBanner />
      <NavbarWrapper />
      <main className="mt-20">{children}</main>
      <ContactFooter />
    </>
  );
}
