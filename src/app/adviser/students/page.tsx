"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, MessageSquare, Eye } from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetAssignmentByAdviserQuery } from "@/feature/adviserAssignment/AdviserAssignmentSlice";
import Image from "next/image";

export default function MentorStudentsPage() {
  const router = useRouter();

  // ✅ Adviser info
  const { data: adviserProfile } = useGetUserProfileQuery();

  // ✅ Fetch adviser’s assigned students
  const { data, error, isLoading } = useGetAssignmentByAdviserQuery();

  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        Failed to load student assignments.
      </div>
    );

  const assignments = data?.data?.content || [];

  // ✅ Group by student
  const studentMap = new Map();
  assignments.forEach((assignment: any) => {
    const student = assignment.student;
    if (!studentMap.has(student.uuid)) {
      studentMap.set(student.uuid, {
        ...student,
        papers: [],
      });
    }
    const studentObj = studentMap.get(student.uuid);
    studentObj.papers.push({
      ...assignment.paper,
      status: assignment.status,
      deadline: assignment.deadline,
    });
  });

  const students = Array.from(studentMap.values());

  const openProfile = (uuid: string) => {
    router.push(`/adviser/students/${uuid}`);
  };

  const openMessage = (uuid: string) => {
    setSelectedStudentId(uuid);
    setIsMessageOpen(true);
  };

  const sendMessage = () => {
    if (!selectedStudentId) return;
    // Here you can send message via API call later
    setIsMessageOpen(false);
    setMessageText("");
  };

  return (
    <DashboardLayout
      userRole="adviser"
      userName={adviserProfile?.user?.fullName || "Adviser"}
      userAvatar={adviserProfile?.user?.imageUrl || "/placeholder.svg"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Assigned Students
          </h1>
          <p className="text-muted-foreground">
            Students assigned to you by Admin to mentor and review papers.
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-10" />
            </div>
          </CardHeader>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
            <CardDescription>
              Review progress and access their submitted papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Paper Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No assigned students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student: any) =>
                    student.papers.map((paper: any, index: number) => (
                      <TableRow
                        key={`${student.uuid}-${index}`}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell>
                          <div
                            className="flex items-center gap-3 cursor-pointer hover:opacity-90"
                            onClick={() => openProfile(student.uuid)}
                          >
                            <Image
                              src={student.imageUrl || "/placeholder.svg"}
                              alt={student.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-border shadow-sm"
                              unoptimized
                              width={60}
                              height={60}
                            />
                            <div>
                              <div className="font-semibold text-foreground">
                                {student.fullName}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-xs">
                          <div className="truncate font-medium text-foreground">
                            {paper.title || "Untitled Paper"}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              paper.status === "APPROVED"
                                ? "default"
                                : paper.status === "REJECTED"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {paper.status?.toLowerCase()}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                          {paper.deadline
                            ? new Date(paper.deadline).toLocaleDateString()
                            : "-"}
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/adviser/documents/${paper.uuid}`
                                  )
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Paper
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openProfile(student.uuid)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openMessage(student.uuid)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Message Dialog */}
        {isMessageOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background border border-border rounded-xl w-full max-w-lg p-6 shadow-xl">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Send Message</h2>
                <p className="text-sm text-muted-foreground">
                  To:{" "}
                  {
                    students.find((s: any) => s.uuid === selectedStudentId)
                      ?.fullName
                  }
                </p>
              </div>
              <div>
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="rounded-lg"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMessageOpen(false);
                    setMessageText("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={sendMessage} disabled={!messageText.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
