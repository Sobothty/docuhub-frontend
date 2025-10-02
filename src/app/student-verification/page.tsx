'use client';

import { Suspense } from 'react';
import StudentVerificationForm from '@/components/student/StudentVerificationForm';
import { Card, CardContent } from '@/components/ui/card';

function StudentVerificationLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading verification form...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function StudentVerificationPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Student Verification</h1>
          <p className="text-muted-foreground">
            Get verified as a student to unlock exclusive features and benefits on our platform.
          </p>
        </div>

        {/* Verification Form */}
        <Suspense fallback={<StudentVerificationLoading />}>
          <StudentVerificationForm />
        </Suspense>

        {/* Benefits Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Student Benefits</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-primary rounded-full"></span>
                  Access to exclusive student resources
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-primary rounded-full"></span>
                  Priority support and assistance
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-primary rounded-full"></span>
                  Student-only research papers and materials
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-primary rounded-full"></span>
                  Educational discounts and offers
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}