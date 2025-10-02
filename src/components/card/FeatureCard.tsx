'use client';

import { FC, ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="relative flex flex-col bg-card text-card-foreground rounded-lg transition-all duration-300 group">
      <div className="p-6">
        {/* Icon */}
        <div className="w-14 h-14 mb-4 text-accent group-hover:opacity-0 group-hover:-translate-y-10 transition-all duration-300">
          {icon}
        </div>

        {/* Title */}
        <h5 className="mb-2 text-subheadings font-semibold leading-snug tracking-normal text-[var(--color-foreground)] group-hover:translate-y-[-60px] group-hover:text-accent transition-transform duration-300">
          {title}
        </h5>

        {/* Description */}
        <p className="text-descriptions font-light leading-relaxed text-[var(--color-foreground)] group-hover:translate-y-[-40px] transition-transform duration-300 ml-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
