"use client";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAssignmentByAdviserQuery } from "@/feature/adviserAssignment/AdviserAssignmentSlice";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define types
interface Student {
  uuid: string;
  fullName: string;
  imageUrl: string;
}

interface Paper {
  uuid: string;
  title: string;
}

interface Assignment {
  student: Student;
  paper: Paper;
  status: string;
  deadline: string;
}

interface StudentData {
  student: Student;
  papers: Paper[];
  statuses: string[];
  deadlines: string[];
}

export default function MentorOverviewPage() {
  const router = useRouter();

  const token = useSession();
  if (!token.data?.accessToken) {
    router.push("/login");
  }
  // ✅ Fetch adviser profile
  const { data: adviserProfile } = useGetUserProfileQuery();
  const { data, error, isLoading } = useGetAssignmentByAdviserQuery();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        Failed to load assignments
      </div>
    );

  // ✅ Extract assignment data
  const assignments = (data?.data?.content || []) as Assignment[];

  // ✅ Group by student to count their assigned papers
  const studentMap = new Map<string, StudentData>();

  assignments.forEach((assignment: Assignment) => {
    const studentUuid = assignment.student.uuid;
    if (!studentMap.has(studentUuid)) {
      studentMap.set(studentUuid, {
        student: assignment.student,
        papers: [],
        statuses: [],
        deadlines: [],
      });
    }

    const existing = studentMap.get(studentUuid)!;
    existing.papers.push(assignment.paper);
    existing.statuses.push(assignment.status);
    existing.deadlines.push(assignment.deadline);
  });

  const uniqueStudents = Array.from(studentMap.values());

  // ✅ Dashboard summary counts
  const totalAssignedStudents = uniqueStudents.length;
  const totalAssignedPapers = assignments.length;
  const approvedCount = assignments.filter(
    (a: Assignment) => a.status === "APPROVED"
  ).length;
  const pendingCount = assignments.filter(
    (a: Assignment) => a.status !== "APPROVED" && a.status !== "REJECTED"
  ).length;

  return (
    <DashboardLayout
      userRole="adviser"
      userName={adviserProfile?.user?.fullName || "Adviser"}
      userAvatar={adviserProfile?.user?.imageUrl || undefined}
    >
      <div className="space-y-6">
        {/* 🧭 Header Section */}
        <div>
          <h1 className="text-3xl font-bold">Mentor Overview</h1>
          <p className="text-muted-foreground">
            Overview of students assigned for your review
          </p>
        </div>

        {/* 📊 Overview Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssignedStudents}</div>
              <p className="text-xs text-muted-foreground">
                Students under your mentorship
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Assigned Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssignedPapers}</div>
              <p className="text-xs text-muted-foreground">
                Papers assigned to review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approved Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">
                Successfully reviewed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">
                Need your attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 👨‍🎓 Student Overview Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Assigned Students</h2>

          {uniqueStudents.length === 0 ? (
            <p className="text-gray-500">No assigned students yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueStudents.map(({ student, papers, statuses }) => {
                // Count statuses
                const approved = statuses.filter(
                  (s) => s === "APPROVED"
                ).length;
                const pending = statuses.filter(
                  (s) => s !== "APPROVED" && s !== "REJECTED"
                ).length;

                return (
                  <Card
                    key={student.uuid}
                    className="hover:shadow-lg transition"
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Image
                        src={student.imageUrl || "./placeholder.svg"}
                        alt={student.fullName}
                        width={50}
                        height={50}
                        className="rounded-full object-cover w-12 h-12"
                        unoptimized
                      />
                      <div>
                        <p className="font-semibold">{student.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {papers.length} assigned paper
                          {papers.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1">
                        <p>
                          ✅ <strong>Approved:</strong> {approved}
                        </p>
                        <p>
                          🕒 <strong>Pending:</strong> {pending}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
