'use client';

import { Suspense } from 'react';
import PendingStudentsManager from '@/components/admin/PendingStudentsManager';
import { Card, CardContent } from '@/components/ui/card';

function AdminStudentsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading student management...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminStudentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Management</h1>
          <p className="text-muted-foreground">
            Review and manage student verification requests from the admin dashboard.
          </p>
        </div>

        {/* Students Manager */}
        <Suspense fallback={<AdminStudentsLoading />}>
          <PendingStudentsManager />
        </Suspense>
      </div>
    </div>
  );
}