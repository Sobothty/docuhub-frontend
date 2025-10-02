'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
// import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';

interface ContactFooterProps {
  social?: string;
  istadLogo?: string;
  line?: string;
}

const ContactFooter: FC<ContactFooterProps> = () => {
  const pathname = usePathname();
  const { t } = useTranslation('common'); // Matches your JSON file

  const hiddenPaths = [
    '/login',
    '/register',
    '/dashboard',
    '/student',
    '/mentor',
  ];
  const shouldHide = hiddenPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (shouldHide) return null;

  return (
    <footer className="w-full mt-20 bg-primary text-foreground/70">
      {/* CTA Section */}
      <div className="relative -top-30 w-[95%] max-w-6xl bg-accent rounded-xl py-12 px-6 text-center shadow-lg mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {t('cta_title')}
        </h2>
        <p className="mt-4 text-white opacity-90 max-w-2xl mx-auto text-sm md:text-base">
          {t('cta_desc')}
        </p>
        <Link
          href="#"
          className="inline-block mt-8 bg-secondary hover:bg-[var(--secondary-hover)] text-white px-6 py-3 rounded-lg font-semibold transition-all text-sm md:text-base"
        >
          {t('cta_button')}
        </Link>
      </div>

      {/* Footer Main Section */}
      <div className="max-w-6xl mx-auto pt-5 pb-12 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
        {/* Transparent Section */}
        <div>
          <h3 className="text-gray-100 font-semibold text-lg">
            {t('transparent')}
          </h3>
          <p className="mt-3 text-gray-100 text-sm opacity-80">{t('cta_desc')}</p>
          <div className="flex gap-3 mt-4">
            {/* Keep your original icons as they are */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
                </svg>
              </a>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                </svg>
              </a>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Platform */}
        <div>
          <h3 className="text-gray-100 font-semibold text-lg mb-3">
            {t('platform')}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-gray-100 hover:text-white">
                {t('home')}
              </Link>
            </li>
            <li>
              <Link href="/browse" className="text-gray-100 hover:text-white">
                {t('browse')}
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-100 hover:text-white">
                {t('about_us')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-gray-100 font-semibold text-lg mb-3">{t('help')}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact" className="text-gray-100 hover:text-white">
                {t('contact_us')}
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="text-gray-100 hover:text-white">
                {t('feedback')}
              </Link>
            </li>
            <li>
              <Link href="/help" className="text-gray-100 hover:text-white">
                {t('help_center')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-gray-100 font-semibold text-lg mb-3">
            {t('legal')}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="text-gray-100 hover:text-white">
                {t('privacy')}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-gray-100 hover:text-white">
                {t('terms')}
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="text-gray-100 hover:text-white">
                {t('accessibility')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Sponsors */}
        <div>
          <h3 className="text-gray-100 font-semibold text-lg mb-3">
            {t('sponsors')}
          </h3>
          <Image
            src="/logo/istad-logo.png"
            alt="ISTAD Logo"
            width={220}
            height={120}
            className="object-contain"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 py-4 text-center text-xs md:text-sm text-gray-500 relative z-10">
        <p>{t('copyright')}</p>
      </div>
    </footer>
  );
};

export default ContactFooter;