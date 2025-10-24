import React from 'react';

function FeedbackCardPlaceholder({ isLast = false }: { isLast?: boolean }) {
  return (
    <div className="flex gap-4">
      {/* Avatar Section */}
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
        {!isLast && <div className="w-px h-16 bg-border mt-2" />}
      </div>

      {/* Content Section */}
      <div className="flex-1 pb-6">
        {/* Header with name, badge, and date */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Paper title */}
        <div className="mb-2 space-y-1">
          <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Feedback text */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <div className="h-8 w-40 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-8 w-40 bg-slate-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default FeedbackCardPlaceholder;