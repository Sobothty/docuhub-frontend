import React from 'react';

function PaperCardPlaceholder() {
  return (
    <div className="w-full bg-card overflow-hidden rounded-lg flex flex-col md:flex-row shadow-md h-full">
      {/* Left Section - Image Placeholder */}
      <div className="relative w-full md:w-1/3 h-56 md:h-auto flex-shrink-0 bg-slate-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200"></div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col flex-1">
        {/* Title Placeholder */}
        <div className="mb-3 space-y-2">
          <div className="h-5 md:h-6 bg-slate-200 rounded-lg w-4/5 animate-pulse"></div>
          <div className="h-5 md:h-6 bg-slate-200 rounded-lg w-3/5 animate-pulse"></div>
        </div>

        {/* Metadata Placeholder */}
        <div className="flex gap-4 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
        </div>

        {/* Abstract Placeholder */}
        <div className="mb-4 flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-4/5 animate-pulse"></div>
        </div>

        {/* Tags Placeholder */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-7 w-20 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-7 w-24 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-7 w-16 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-7 w-28 bg-slate-200 rounded-full animate-pulse"></div>
        </div>

        {/* Action Buttons Placeholder */}
        <div className="flex flex-wrap gap-3 mt-auto">
          <div className="h-9 w-24 bg-slate-200 rounded-md animate-pulse"></div>
          <div className="h-9 w-20 bg-slate-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default PaperCardPlaceholder;