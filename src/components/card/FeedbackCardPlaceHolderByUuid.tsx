import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function FeedbackDetailsPlaceholder() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Button variant="ghost" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Feedback
          </Button>
          <div className="h-8 w-64 bg-slate-200 rounded-lg mt-2 animate-pulse" />
          <div className="flex items-center gap-4 mt-1">
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PDF Viewer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Annotated Document</CardTitle>
              <CardDescription>
                View your document with mentor annotations and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[8.5/11] bg-slate-200 rounded-lg animate-pulse flex items-center justify-center">
                <div className="text-slate-400">Loading PDF...</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Panel */}
        <div className="space-y-6">
          {/* Mentor Feedback Card */}
          <Card>
            <CardHeader>
              <CardTitle>Mentor Feedback</CardTitle>
              <CardDescription>
                Detailed feedback from your mentor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar and Name */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
              </div>

              {/* Feedback Text */}
              <div>
                <div className="h-5 w-20 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Document Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Document Title */}
              <div className="space-y-2">
                <div className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
              </div>

              {/* Mentor */}
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              </div>

              {/* Review Date */}
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <div className="h-3 w-12 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FeedbackDetailsPlaceholder;