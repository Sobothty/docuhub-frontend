// WorksCard.tsx (with suppressHydrationWarning added)
"use client";

import React, { FC } from "react";

interface WorksCardProps {
  title?: string;
  description?: string;
  variant?: "default" | "hover";
  index?: number; // to show card number
}

const WorksCard: FC<WorksCardProps> = ({
  title = "PU Card 1",
  description = "Description 1",
  variant = "default",
  index = 1,
}) => {
  return (
    <div className="works-card flex flex-col justify-between items-center">
      {/* Accent Bar */}
      <div className="works-card-accent"></div>

      {/* Number indicator */}
      <div className="works-card-number text-hero-subtitle">{index}</div>

      {/* Content */}
      <div className="text-center pb-3">
        <h3 className="text-subheadings text-foreground font-bold mb-2">
          {title}
        </h3>
        <p className="text-body-text text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default WorksCard;
