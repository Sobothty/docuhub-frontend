import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

function ProposalCardPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            {/* Title */}
            <div className="h-6 sm:h-7 bg-slate-200 rounded w-3/4 animate-pulse" />
            {/* Subject */}
            <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
          </div>
          {/* Status Badge */}
          <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="h-4 bg-slate-200 rounded w-28 animate-pulse" />
          </div>
        </div>

        {/* Feedback Section (Optional) */}
        <div className="mt-4 p-3 bg-muted rounded-lg space-y-2">
          <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
          <div className="space-y-2 mt-1">
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-4/5 animate-pulse" />
          </div>
          <div className="h-3 bg-slate-200 rounded w-32 animate-pulse mt-2" />
        </div>

        {/* Status Alert/Button */}
        <div className="mt-4">
          <div className="h-10 bg-slate-200 rounded-lg w-48 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default ProposalCardPlaceholder;