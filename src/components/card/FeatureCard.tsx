"use client";

import { FC, ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="feature-card">
      {/* Icon Wrapper */}
      <div className="feature-card-icon-wrapper">
        <div className="feature-card-icon">{icon}</div>
      </div>

      {/* Title */}
      <h3 className="feature-card-title">{title}</h3>

      {/* Description */}
      <p className="feature-card-description">{description}</p>
    </div>
  );
};

export default FeatureCard;
