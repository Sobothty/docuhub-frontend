// WorksCard.tsx (with suppressHydrationWarning added)
'use client';

import React, { FC } from 'react';

interface WorksCardProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'hover';
  index?: number; // to show card number
}

const WorksCard: FC<WorksCardProps> = ({
  title = 'PU Card 1',
  description = 'Description 1',
  variant = 'default',
  index = 1,
}) => {
  return (
    <div
      className={`
        w-[300px] h-[240px] rounded-[8px] overflow-hidden border
        flex flex-col justify-between items-center
        pt-[12px] pr-[50px] pb-[12px] pl-[50px]
        mt-[18px] ml-[9px]
        bg-card text-card-foreground
        border-[var(--color-border)]
        transition-all duration-300 ease-in-out
        ${variant === 'hover' ? 'hover:scale-105 hover:shadow-lg' : ''}
      `}
      suppressHydrationWarning={true}
    >
      {/* Number indicator */}
      <div
        className={`
          flex items-center justify-center w-18 h-18 rounded-lg my-[25px]
          bg-accent text-[var(--text-white)]
          text-hero-subtitle
          transition-transform duration-300
          ${variant === 'hover' ? 'group-hover:scale-110' : ''}
        `}
        suppressHydrationWarning={true}
      >
        {index}
      </div>

      {/* Content */}
      <div className="text-center" suppressHydrationWarning={true}>
        <h3 className="text-subheadings text-[var(--color-foreground)] mb-2">
          {title}
        </h3>
        <p className="text-body-text text-[var(--color-foreground)]/80">
          {description}
        </p>
      </div>
    </div>
  );
};

export default WorksCard;
