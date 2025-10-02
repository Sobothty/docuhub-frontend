'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Heart, User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetUserProfileQuery, useGetCurrentUserQuery } from '@/feature/apiSlice/userAuthApi';
import { CurrentUser, UserProfileResponse, UserResponse } from '@/types/userAuthType';

export default function NavbarUser() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [, forceUpdate] = useState(0); // used to re-render
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'kh'>('en');
  const isAuthenticated = status === 'authenticated';
  const { data: currentUser, isLoading: isLoadingCurrent, error: errorCurrent } = useGetCurrentUserQuery(undefined, { skip: !isAuthenticated });
  const { data: profile, isLoading: isLoadingProfile, error: errorProfile } = useGetUserProfileQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    setMounted(true);

    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedDarkMode ? savedDarkMode === 'true' : prefersDark;
    setIsDarkMode(initialDarkMode);
    document.documentElement.classList.toggle('dark', initialDarkMode);

    if (i18n?.language) setCurrentLang(i18n.language as 'en' | 'kh');
  }, [i18n]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const toggleLanguage = async () => {
    if (!mounted || !i18n?.changeLanguage) return;
    const newLang = currentLang === 'en' ? 'kh' : 'en';
    try {
      await i18n.changeLanguage(newLang);
      setCurrentLang(newLang);
      // Force re-render to avoid hydration issues after language switch
      forceUpdate((n) => n + 1);
    } catch (err) {
      console.error('Failed to change language', err);
    }
  };

  const navLinks = [
    { path: '/', name: t('home') },
    { path: '/browse', name: t('browse') },
    { path: '/about', name: t('about') },
    { path: '/contact', name: t('contact') },
  ];

  // Type guard to detect UserProfileResponse
  const isUserProfileResponse = (u: unknown): u is UserProfileResponse => {
    return !!u && typeof u === 'object' && 'user' in (u as Record<string, unknown>);
  };

  // Normalize image URL; if it's a bare filename, prepend CDN base
  const getImageSrc = (imageUrl?: string | null): string | undefined => {
    if (!imageUrl) return undefined;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE || 'https://s3.docuhub.me/docuhub';
    return `${cdnBase}/${imageUrl.replace(/^\/+/, '')}`;
  };

  // Prefer full profile payload for display, fallback to currentId (id-only)
  const user: CurrentUser | UserProfileResponse | undefined = profile ?? currentUser;
  // Extract display user details if profile shape is available
  const displayUser: UserResponse | undefined =
    user && isUserProfileResponse(user) ? user.user : undefined;
  const isStudent = !!(displayUser?.isStudent);
  const isAdviser = !!(displayUser?.isAdvisor);
  const isLoading = isLoadingCurrent || isLoadingProfile;
  const error = errorCurrent || errorProfile;
  console.log('NavbarUser profile:', { user, displayUser, isStudent, isAdviser, error, isLoading });

  const getInitials = (name?: string | null, slug?: string | null) => {
    const base = (name || slug || 'User').trim();
    const parts = base.split(' ');
    const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : base.slice(0, 2);
    return initials.toUpperCase();
  };

  const roleBadge = () => {
    if (isAdviser) return <Badge variant="secondary">Mentor</Badge>;
    if (isStudent) return <Badge variant="outline">Student</Badge>;
    return <Badge variant="default">User</Badge>;
  };

  const handleProfileClick = () => {
    if (displayUser?.isAdmin) return router.push('/admin');
    if (displayUser?.isAdvisor) return router.push('/mentor');
    if (displayUser?.isStudent) return router.push('/student');
    return router.push('/profile');
  };

  if (!mounted) return null;

  return (
    <nav className="fixed top-14 left-0 w-full z-40 border-b border-border py-2 shadow-md backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="inline-block">
          <Image
            src="/logo/Docohub.png"
            alt="DocuHub Logo"
            width={120}
            height={40}
            className="transition-all hover:brightness-110"
            priority
          />
        </Link>
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.path}
              className={`relative text-foreground hover:text-accent transition-all duration-200 hover:scale-105 ${
                pathname === link.path
                  ? 'text-accent font-semibold after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-accent after:w-full'
                  : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* Desktop actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-muted transition"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-secondary" />
            ) : (
              <Moon className="h-5 w-5 text-secondary" />
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition">
            <Bell className="h-5 w-5 text-secondary" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition">
            <Heart className="h-5 w-5 text-secondary" />
          </button>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleLanguage}
          >
            <Image
              src={currentLang === 'en' ? '/flag-UK.svg' : '/flag-Cam.svg'}
              alt="flag"
              width={45}
              height={25}
              className="rounded-[8px]"
            />
            <span className="text-foreground font-medium">
              {currentLang.toUpperCase()}
            </span>
          </div>
          {/* Desktop user dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 px-2 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={getImageSrc(displayUser?.imageUrl)}
                    alt={displayUser?.userName || 'User'}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                  <AvatarFallback>{getInitials(displayUser?.fullName, displayUser?.slug)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium leading-4">{displayUser?.userName || 'User'}</span>
                  <div className="text-[10px] mt-0.5">{roleBadge()}</div>
                </div>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getImageSrc(displayUser?.imageUrl)}
                      alt={displayUser?.userName || 'User'}
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = 'none';
                      }}
                    />
                    <AvatarFallback>{getInitials(displayUser?.fullName, displayUser?.slug)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{displayUser?.fullName || 'User'}</span>
                      {roleBadge()}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{displayUser?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                <UserIcon className="h-4 w-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/discussions" className="cursor-pointer">
                  <Bell className="h-4 w-4 mr-2" /> Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/downloads" className="cursor-pointer">
                  <Heart className="h-4 w-4 mr-2" /> Saved Papers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4 mr-2" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg border border-border text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground" />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t border-border bg-background overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.path}
              className={`transition ${
                pathname === link.path
                  ? 'text-accent font-semibold'
                  : 'text-foreground hover:text-accent'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-muted transition"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-secondary" />
              ) : (
                <Moon className="h-5 w-5 text-secondary" />
              )}
            </button>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleLanguage}
            >
              <Image
                src={currentLang === 'en' ? '/flag-UK.svg' : '/flag-Cam.svg'}
                alt="flag"
                width={32}
                height={20}
                className="rounded-[6px]"
              />
              <span className="text-foreground font-medium">
                {currentLang.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-3">
              <button className="p-2 rounded-full hover:bg-muted transition">
                <Bell className="h-5 w-5 text-secondary" />
              </button>
              <button className="p-2 rounded-full hover:bg-muted transition">
                <Heart className="h-5 w-5 text-secondary" />
              </button>
            </div>
          </div>
          {/* Mobile user info */}
          <div className="flex items-center gap-3 pt-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={getImageSrc(displayUser?.imageUrl)}
                alt={displayUser?.userName || 'User'}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
              <AvatarFallback>{getInitials(displayUser?.fullName, displayUser?.slug)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{displayUser?.fullName || 'User'}</span>
              <div className="text-xs">{roleBadge()}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}