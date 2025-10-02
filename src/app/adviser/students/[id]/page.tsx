'use client';

import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, User } from 'lucide-react';

export default function MentorStudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  return (
    <DashboardLayout userRole="mentor">
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/mentor/students')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Assigned Students
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>
              Basic information for student #{id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" /> Name: Placeholder
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email: placeholder@student.edu
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
