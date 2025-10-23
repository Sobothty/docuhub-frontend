'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HorizontalCard from '@/components/card/HorizontalCard';

interface ResearchPaper {
  id: string; // changed from number to string
  title: string;
  authors: string[];
  authorImage?: string;
  journal: string;
  year: string;
  citations: string;
  abstract: string;
  tags: string[];
  image: string;
  isBookmarked?: boolean;
}

interface HorizontalCardCarouselProps {
  papers: ResearchPaper[];
  onViewPaper?: (paperId: number) => void;
  onDownloadPDF?: (paperId: number) => void;
  onToggleBookmark?: (paperId: number) => void;
}

export default function HorizontalCardCarousel({
  papers,
  onViewPaper,
  onDownloadPDF,
  onToggleBookmark,
}: HorizontalCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarkedPapers, setBookmarkedPapers] = useState<Set<string>>(
    new Set()
  );
  const [cardsToShow, setCardsToShow] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 1024) setCardsToShow(1);
      else setCardsToShow(2);
    };
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  const totalSlides = Math.ceil(papers.length / cardsToShow);

  const nextSlide = useCallback(
    () => setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1)),
    [totalSlides]
  );
  const prevSlide = useCallback(
    () => setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1)),
    [totalSlides]
  );

  const handleToggleBookmark = (paperId: string) => {
    setBookmarkedPapers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(paperId)) newSet.delete(paperId);
      else newSet.add(paperId);
      return newSet;
    });
    onToggleBookmark?.(Number(paperId));
  };

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 6000);
    return () => clearInterval(interval);
  }, [currentIndex, totalSlides, nextSlide]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 mt-10 md:mt-16">
      <div className="relative overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-in-out gap-4 md:gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
            alignItems: 'stretch',
          }}
        >
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="flex-shrink-0 h-full"
              style={{ width: `${100 / cardsToShow}%` }}
            >
              <HorizontalCard
                {...paper}
                isBookmarked={bookmarkedPapers.has(paper.id)}
                onViewPaper={() => onViewPaper?.(Number(paper.id))}
                onDownloadPDF={() => onDownloadPDF?.(Number(paper.id))}
                onToggleBookmark={() => handleToggleBookmark(paper.id)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-secondary'
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}