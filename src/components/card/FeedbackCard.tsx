'use client';

import React from 'react';
import Image from 'next/image';

export interface Feedback {
  id: string;
  userName: string;
  userTitle?: string;
  content: string;
  date?: string;
  rating?: number;
  userImage?: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
  className?: string;
  showBorder?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  className = '',
  showBorder = true,
}) => {
  // Render star ratings if provided
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-accent' : 'text-gray-300 dark:text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`card ${showBorder ? 'border' : ''} ${className}`}
      style={{
        width: '650px',
        height: '259px',
        marginTop: '20px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
      suppressHydrationWarning
    >
      <div className="flex items-center justify-between" suppressHydrationWarning>
        {/* Profile section */}
        <div className="flex items-center" suppressHydrationWarning>
          {feedback.userImage ? (
            <div className="relative size-12 md:size-16 rounded-full overflow-hidden mr-4" suppressHydrationWarning>
              <Image
                src={feedback.userImage}
                alt={feedback.userName}
                fill
                className="object-cover transition-transform duration-300 ease-in-out scale-150 hover:scale-170"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center mr-4" suppressHydrationWarning>
              <span className="text-secondary dark:text-accent font-medium">
                {feedback.userName.charAt(0)}
              </span>
            </div>
          )}
          <div suppressHydrationWarning>
            <p className="text-subheadings text-[var(--color-foreground)]">
              {feedback.userName}
            </p>
            {feedback.userTitle && (
              <p className="text-small-text text-gray-500 dark:text-gray-400">
                {feedback.userTitle}
              </p>
            )}
          </div>
        </div>

        {/* Flipped icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="46"
          viewBox="0 0 16 16"
          className="-scale-x-100 text-accent dark:text-accent"
        >
          <path
            fill="currentColor"
            d="M6.848 2.47a1 1 0 0 1-.318 1.378A7.3 7.3 0 0 0 3.75 7.01A3 3 0 1 1 1 10v-.027a4 4 0 0 1 .01-.232c.009-.15.027-.36.062-.618c.07-.513.207-1.22.484-2.014c.552-1.59 1.67-3.555 3.914-4.957a1 1 0 0 1 1.378.318m7 0a1 1 0 0 1-.318 1.378a7.3 7.3 0 0 0-2.78 3.162A3 3 0 1 1 8 10v-.027a4 4 0 0 1 .01-.232c.009-.15.027-.36.062-.618c.07-.513.207-1.22.484-2.014c.552-1.59 1.67-3.555 3.914-4.957a1 1 0 0 1 1.378.318"
          />
        </svg>
      </div>

      {/* Rating and date row */}
      {(feedback.rating !== undefined || feedback.date) && (
        <div className="flex justify-between items-center" suppressHydrationWarning>
          {feedback.rating !== undefined && (
            <div className="flex items-center mt-1" suppressHydrationWarning>
              {renderRating(feedback.rating)}
            </div>
          )}
          {feedback.date && (
            <span className="text-small-text text-gray-500 dark:text-gray-400">
              {feedback.date}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <p className="text-body-text text-[var(--color-foreground)] flex-grow">
        &ldquo;{feedback.content}&rdquo;
      </p>
    </div>
  );
};

export default FeedbackCard;