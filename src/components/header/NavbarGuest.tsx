'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import Image from 'next/image';

export default function NavbarGuest() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation('common');

  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentLang, setCurrentLang] = useState<'en' | 'kh'>('en');
  const [mobileOpen, setMobileOpen] = useState(false);

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
    } catch (err) {
      console.error('Failed to change language', err);
    }
  };

  if (!mounted) return null;


  const navLinks = [
    { path: '/', name: t('home', 'Home') },
    { path: '/browse', name: t('browse', 'Browse') },
    { path: '/about', name: t('about', 'About Us') },
    { path: '/contact', name: t('contact', 'Contact') },
  ];

  return (
      <nav className="fixed top-16 md:top-12 left-0 w-full z-40 border-b bg-background border-border shadow-md">
        <div className="max-w-7xl mx-auto px-2 md:px-4 flex justify-between items-center">
          <Link href="/" className="inline-block sm:w-auto w-24 ">
            <Image
                src="/logo/Docohub.png"
                alt="DocuHub Logo"
                width={120}
                height={40}
                className="transition-all hover:brightness-110"
                priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link, idx) => (
                <Link
                    key={idx}
                    href={link.path}
                    className={`transition ${
                      pathname === link.path
                        ? 'text-accent font-semibold'
                        : 'text-foreground hover:text-accent'
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

            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleLanguage}
            >
              <Image
                  src={currentLang === 'en' ? '/flag-UK.svg' : '/flag-Cam.svg'}
                  alt="flag"
                  width={35}
                  height={15}
                  className="rounded-[8px]"
              />
              <span className="text-foreground font-medium">
              {currentLang.toUpperCase()}
            </span>
            </div>

            <Button
                asChild
                variant="outline"
                className="font-semibold"
            >
              <Link href="/login?force=true">{t('login', 'Login')}</Link>
            </Button>

            <Button
                asChild
                className="bg-accent text-white hover:bg-accent/90 font-semibold"
            >
              <Link href="/register">{t('signup', 'Sign Up')}</Link>
            </Button>
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
        <div className={`md:hidden border-t border-border bg-background transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
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
                  <Button
                      asChild
                      variant="outline"
                      className="font-semibold"
                  >
                    <Link href="/login?force=true">{t('login', 'Login')}</Link>
                  </Button>
                  <Button
                      asChild
                      className="bg-accent text-white hover:bg-accent/90 font-semibold"
                  >
                    <Link href="/register">{t('signup', 'Sign Up')}</Link>
                  </Button>
                </div>
              </div>
        </div>
      </nav>
  );
}