"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import StudentVerificationForm from "@/components/student/StudentVerificationForm";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
export default function ProfileVerificationPage() {
 const { data: profileData } = useGetUserProfileQuery();

  return (
    <DashboardLayout
     userRole="public"
     userName={profileData?.user.userName || "User"}
     userAvatar={profileData?.user.imageUrl || ""}
     >
      <div className="space-y-6">
        <StudentVerificationForm />
      </div>
    </DashboardLayout>
  );
}
