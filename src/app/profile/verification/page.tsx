"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import StudentVerificationForm from "@/components/student/StudentVerificationForm";

export default function ProfileVerificationPage() {
  return (
    <DashboardLayout userRole="public">
      <div className="space-y-6">
        <StudentVerificationForm />
      </div>
    </DashboardLayout>
  );
}
