'use client';
import { usePathname } from 'next/navigation';
import { Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StickyBanner() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const hiddenPaths = [
    '/login',
    '/register',
    '/dashboard',
    '/student',
    '/adviser',
  ];
  const shouldHide = hiddenPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (shouldHide) return null;

  // Prevent hydration mismatch by only rendering on client
  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-primary text-foreground py-2 sm:py-3 px-2">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-y-2 justify-between items-center">
        {/* Left Section - Contact Information */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Email */}
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-accent" />
            <a
              href="mailto:docuhub@gmail.com"
              className="text-xs text-gray-100 sm:text-sm hover:text-accent transition-colors"
            >
              docuhub@gmail.com
            </a>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-accent" />
            <a
              href="tel:+85512312123"
              className="text-xs text-gray-100 sm:text-sm hover:text-accent transition-colors"
            >
              +855-123-12123
            </a>
          </div>
        </div>

        {/* Right Section - Social Media */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden text-gray-100 sm:inline text-sm font-medium">
            Follow Us:
          </span>

          {/* Social Media Icons */}
          <div className="flex gap-2 sm:gap-3">
            {/* Facebook */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
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

            {/* Instagram */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
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

            {/* GitHub */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
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

            {/* YouTube */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
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
      </div>
    </div>
  );
}
