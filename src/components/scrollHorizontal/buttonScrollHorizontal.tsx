'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const subjects = [
  { id: 'all', name: 'All' },
  { id: 'spring', name: 'Spring Framework' },
  { id: 'java', name: 'Java Programming' },
  { id: 'sql', name: 'SQL & Data Modeling with PostgreSQL' },
  { id: 'blockchain', name: 'Blockchain Development' },
  { id: 'linux', name: 'Linux Administration' },
  { id: 'android', name: 'Android Development' },
  { id: 'ios', name: 'iOS Development' },
  { id: 'flutter', name: 'Flutter Development' },
  { id: 'web', name: 'Web Development' },
  { id: 'nextjs', name: 'Next.js Development' },
  { id: 'docker', name: 'Docker & DevOps' },
  { id: 'dataanalytics', name: 'Data Analytics' },
  { id: 'c', name: 'C Programming' },
];

export default function ButtonScrollHorizontal() {
  const [activeSubject, setActiveSubject] = useState('all');
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    const container = document.getElementById('scroll-container');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
      setScrollPosition(Math.max(0, scrollPosition - 200));
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('scroll-container');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
      setScrollPosition(scrollPosition + 200);
    }
  };

  const handleSubjectClick = (subjectId: string) => {
    setActiveSubject(subjectId);
    console.log('Selected subject:', subjectId);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Left Scroll Button */}
      <button
        onClick={scrollLeft}
        disabled={scrollPosition === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 sm:w-8 h-6 sm:h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Right Scroll Button */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 sm:w-8 h-6 sm:h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Scrollable Container */}
      <div
        id="scroll-container"
        className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-8 py-2 sm:py-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => handleSubjectClick(subject.id)}
            className={`
              flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-buttons whitespace-nowrap
              transition-all duration-200 hover:scale-105
              ${
                activeSubject === subject.id
                  ? 'bg-[var(--accent)] border-2 border-[var(--accent)] shadow-lg'
                  : 'bg-transparent border-2 border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--dark-text)]'
              }
            `}
          >
            {subject.name}
          </button>
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
