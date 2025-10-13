"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User } from "lucide-react";
import Image from "next/image";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetAssignmentByAdviserQuery } from "@/feature/adviserAssignment/AdviserAssignmentSlice";

export default function MentorStudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Fetch adviser profile (for header info)
  const { data: adviserProfile } = useGetUserProfileQuery();

  // Fetch all assignments for this adviser
  const { data: assignmentData, isLoading } = useGetAssignmentByAdviserQuery();

  if (isLoading) {
    return <div className="p-6">Loading student profile...</div>;
  }

  // Extract the student info by ID
  const student = assignmentData?.data?.content
    ?.map((a: any) => a.student)
    ?.find((s: any) => s.uuid === id);

  if (!student) {
    return (
      <DashboardLayout
        userRole="adviser"
        userName={adviserProfile?.user.fullName || "Adviser Name"}
        userAvatar={adviserProfile?.user.imageUrl || undefined}
      >
        <div className="p-6">Student not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userRole="adviser"
      userName={adviserProfile?.user.fullName || "Adviser Name"}
      userAvatar={adviserProfile?.user.imageUrl || undefined}
    >
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/adviser/students")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Assigned Students
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>
              Basic information for student #{id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.imageUrl ? (
              <Image
                src={student.imageUrl}
                alt={student.fullName}
                width={100}
                height={100}
                className="rounded-full border"
                unoptimized
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-500" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <User className="h-4 w-4" /> <span>Name:</span>
              <span className="font-medium">{student.fullName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> <span>Email:</span>
              <span className="font-medium">
                {student.email || "No email provided"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
