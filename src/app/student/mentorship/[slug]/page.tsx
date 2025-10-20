"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useParams } from "next/navigation";
import { useGetAllAdvisersQuery } from "@/feature/users/studentSlice";
import { useGetAllUserStarredPapersQuery } from "@/feature/star/StarSlice";
import {
  Assignment,
  useGetAllAdviserAssignmentsQuery,
} from "@/feature/paperSlice/papers";
import { useMemo, useState, useEffect } from "react";

export default function StudentMentorshipPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: user } = useGetUserProfileQuery();
  const { data: advisers, isLoading } = useGetAllAdvisersQuery();

  // Find the current adviser by UUID (slug)
  const currentAdviser = useMemo(() => {
    if (!advisers || !slug) return null;
    return advisers.find((adviser) => adviser.uuid === slug);
  }, [advisers, slug]);
  console.log("Current Adviser:", currentAdviser);

  // Fetch starred papers for the current adviser
  const { data: starredPapers } = useGetAllUserStarredPapersQuery(
    currentAdviser?.slug || "",
    {
      skip: !currentAdviser?.slug,
    }
  );
  console.log("Starred Papers:", starredPapers);

  // State to store filtered assignments
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    []
  );

  // Fetch adviser assignments for the current adviser
  const { data: adviserAssignments } = useGetAllAdviserAssignmentsQuery(
    currentAdviser?.slug || "",
    {
      skip: !currentAdviser?.slug,
    }
  );

  // Filter assignments where adviser.uuid matches currentAdviser.uuid
  useEffect(() => {
    if (adviserAssignments && currentAdviser?.slug) {
      const filtered = adviserAssignments.filter(
        (assignment) => assignment.adviserUuid === currentAdviser.slug
      );
      setFilteredAssignments(filtered);
    }
  }, [adviserAssignments, currentAdviser?.slug]);

  // Calculate months difference from the first assignment
  const calculateMonthsDifference = () => {
    if (filteredAssignments.length === 0) return 0;

    // ...existing code...
    const firstAssignment = filteredAssignments[filteredAssignments.length - 1];
    // ...existing code...
    const assignedDate = new Date(firstAssignment.assignedDate);
    const now = new Date();

    const yearDiff = now.getFullYear() - assignedDate.getFullYear();
    const monthDiff = now.getMonth() - assignedDate.getMonth();

    return yearDiff * 12 + monthDiff;
  };
  console.log("Filtered Assignments:", filteredAssignments);

  // Filter available mentors (excluding current adviser)
  const availableMentors = useMemo(() => {
    if (!advisers || !slug) return [];
    return advisers
      .filter((adviser) => adviser.uuid !== slug && !adviser.isAdvisor)
      .slice(0, 2); // Show only 2 suggestions
  }, [advisers, slug]);

  if (isLoading) {
    return (
      <DashboardLayout
        userRole="student"
        userName={user?.user.fullName}
        userAvatar={
          user?.user.imageUrl || "/placeholder.svg?height=40&width=40"
        }
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!currentAdviser) {
    return (
      <DashboardLayout
        userRole="student"
        userName={user?.user.fullName}
        userAvatar={
          user?.user.imageUrl || "/placeholder.svg?height=40&width=40"
        }
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h2 className="text-2xl font-bold">Adviser Not Found</h2>
          <p className="text-muted-foreground">
            The adviser you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const adviserInitials = currentAdviser.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout
      userRole="student"
      userName={user?.user.fullName}
      userAvatar={user?.user.imageUrl || "/placeholder.svg?height=40&width=40"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mentorship</h1>
            <p className="text-muted-foreground">
              Manage your mentor relationship and explore opportunities
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Find New Mentor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Apply for Additional Mentorship</DialogTitle>
                <DialogDescription>
                  Find mentors who match your research interests
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by research area or mentor name..."
                    className="pl-10"
                  />
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {availableMentors.map((mentor) => (
                    <div
                      key={mentor.uuid}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={mentor.imageUrl || "/placeholder.svg"}
                            alt={mentor.fullName}
                          />
                          <AvatarFallback>
                            {mentor.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{mentor.fullName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {mentor.bio || "No bio available"}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mentor.isAdvisor && (
                              <Badge variant="secondary" className="text-xs">
                                Advisor
                              </Badge>
                            )}
                            {mentor.isAdmin && (
                              <Badge variant="secondary" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Apply</Button>
                    </div>
                  ))}
                  {availableMentors.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No available mentors found
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Mentor */}
        <Card>
          <CardHeader>
            <CardTitle>Current Mentor</CardTitle>
            <CardDescription>
              Your assigned mentor and relationship details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={currentAdviser.imageUrl || "/placeholder.svg"}
                    alt={currentAdviser.fullName}
                  />
                  <AvatarFallback className="text-lg">
                    {adviserInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {currentAdviser.fullName}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentAdviser.isAdvisor ? "Advisor" : "Adviser"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentAdviser.gender ? `${currentAdviser.gender} • ` : ""}
                    Status: {currentAdviser.status || "Active"}
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {starredPapers?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Interactions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {filteredAssignments?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Papers Guided
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {calculateMonthsDifference()}
                    </div>
                    <div className="text-sm text-muted-foreground">Months</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentAdviser.isAdvisor && (
                    <Badge variant="default">Advisor</Badge>
                  )}
                  {currentAdviser.isAdmin && (
                    <Badge variant="secondary">Admin</Badge>
                  )}
                  {currentAdviser.status && (
                    <Badge variant="outline" className="capitalize">
                      {currentAdviser.status}
                    </Badge>
                  )}
                </div>
                {currentAdviser.bio && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentAdviser.bio}
                  </p>
                )}
                {/* <div className="flex gap-2">
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interaction History */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Interaction History</CardTitle>
            <CardDescription>
              Timeline of your mentorship activities and communications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interactionHistory.length > 0 ? (
                interactionHistory.map((interaction, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 border border-border rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {interaction.type === "feedback" && (
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      )}
                      {interaction.type === "approval" && (
                        <Award className="h-4 w-4 text-green-600" />
                      )}
                      {interaction.type === "meeting" && (
                        <Calendar className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{interaction.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {interaction.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {interaction.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No interaction history yet. Start by messaging your mentor!
                </div>
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </DashboardLayout>
  );
}
