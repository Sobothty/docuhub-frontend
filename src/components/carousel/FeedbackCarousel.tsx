'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FeedbackCard, { Feedback } from '@/components/card/FeedbackCard';

interface FeedbackCardCarouselProps {
  feedbacks: Feedback[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
}

const FeedbackCardCarousel: React.FC<FeedbackCardCarouselProps> = ({
  feedbacks,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(2);

  useEffect(() => {
    const getCardsPerView = () => {
      if (window.innerWidth >= 1024) return 2;
      if (window.innerWidth >= 640) return 1;
      return 1;
    };
    setCardsPerView(getCardsPerView());
    const handleResize = () => setCardsPerView(getCardsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + cardsPerView >= feedbacks.length
        ? 0
        : prevIndex + cardsPerView
    );
  }, [cardsPerView, feedbacks.length]); // Add dependencies

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, feedbacks.length - cardsPerView)
        : prevIndex - cardsPerView
    );
  };

  // Go to specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isPaused && feedbacks.length > cardsPerView) {
      const interval = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [
    autoPlay,
    autoPlayInterval,
    isPaused,
    feedbacks.length,
    cardsPerView,
    nextSlide,
  ]);

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Touch support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const isSwipeLeft = distance > 50; // Swipe left threshold
      const isSwipeRight = distance < -50; // Swipe right threshold
      if (isSwipeLeft) nextSlide();
      if (isSwipeRight) prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (feedbacks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No feedbacks to display</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation controls */}
      {showControls && feedbacks.length > cardsPerView && (
        <div className="absolute -top-12 right-4 flex space-x-2 z-10 sm:right-6 lg:right-8">
          <button
            onClick={prevSlide}
            className="focus:outline-none"
            aria-label="Previous feedback"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              className="-scale-x-100 w-10 h-10 sm:w-11 sm:h-11 text-accent"
            >
              <path
                fill="currentColor"
                d="M11.8 13H15q.425 0 .713-.288T16 12t-.288-.712T15 11h-3.2l.9-.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275l-2.6 2.6q-.3.3-.3.7t.3.7l2.6 2.6q.275.275.7.275t.7-.275t.275-.7t-.275-.7zm.2 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="focus:outline-none"
            aria-label="Next feedback"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              className="w-10 h-10 sm:w-11 sm:h-11 text-accent"
            >
              <path
                fill="currentColor"
                d="M11.8 13H15q.425 0 .713-.288T16 12t-.288-.712T15 11h-3.2l.9-.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275l-2.6 2.6q-.3.3-.3.7t.3.7l2.6 2.6q.275.275.7.275t.7-.275t.275-.7t-.275-.7zm.2 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Carousel slides */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`,
          }}
        >
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className={`flex-shrink-0 px-2 sm:px-4 w-full sm:w-1/2 lg:w-1/2`}
              suppressHydrationWarning
            >
              <div className="flex justify-center" suppressHydrationWarning>
                <FeedbackCard feedback={feedback} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      {showIndicators && feedbacks.length > cardsPerView && (
        <div className="flex justify-center mt-4 sm:mt-6 space-x-2" suppressHydrationWarning>
          {Array.from({
            length: Math.ceil(feedbacks.length / cardsPerView),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * cardsPerView)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                currentIndex === index * cardsPerView
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to feedback ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackCardCarousel;
