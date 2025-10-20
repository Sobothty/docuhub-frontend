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
import { Separator } from "@/components/ui/separator";
import {
  Search,
  UserPlus,
  Mail,
  BookOpen,
  Users,
  Star,
  GraduationCap,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { Adviser, useGetAllAdvisersQuery } from "@/feature/users/studentSlice";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function StudentMentorshipPage() {
  const { data: user } = useGetUserProfileQuery();
  const { data: advisers, isLoading } = useGetAllAdvisersQuery();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter advisers based on search query
  const filteredAdvisers = useMemo(() => {
    if (!advisers) return [];
    return advisers.filter(
      (adviser) =>
        adviser.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adviser.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [advisers, searchQuery]);

  // Separate advisers into advisors and non-advisors
  const { availableMentors } = useMemo(() => {
    const active = filteredAdvisers.filter((a) => a.isAdvisor);
    const available = filteredAdvisers.filter((a) => !a.isAdvisor);
    return { activeAdvisors: active, availableMentors: available };
  }, [filteredAdvisers]);

  const handleOnClickDynamic = (uuid: string) => {
    router.push(`/student/mentorship/${uuid}`);
  };

  return (
    <DashboardLayout
      userRole="student"
      userName={user?.user.fullName}
      userAvatar={user?.user.imageUrl || "/placeholder.svg?height=40&width=40"}
    >
      <div className="space-y-6">
        {/* Header with gradient background */}
        <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="h-8 w-8" />
                Mentorship
              </h1>
              <p className="text-muted-foreground mt-1">
                Connect with experienced advisers and grow your research
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Users className="h-3 w-3 mr-1" />
                {advisers?.length || 0} Advisers Available
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search advisers by name or expertise..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Mentors Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Available Advisers
                </CardTitle>
                <CardDescription>
                  Explore and connect with potential mentors
                </CardDescription>
              </div>
              {!isLoading && (
                <Badge variant="secondary">
                  {availableMentors.length} Available
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : availableMentors.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? "No advisers found" : "No advisers available"}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search query."
                    : "Check back later for new advisers."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableMentors.map((adviser) => (
                  <AdvisorCard
                    key={adviser.uuid}
                    adviser={adviser}
                    isCurrent={true}
                    onClickDynamic={() => handleOnClickDynamic(adviser.uuid)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Advisor Card Component
function AdvisorCard({
  adviser,
  isCurrent = true,
  onClickDynamic,
}: {
  adviser: Adviser;
  isCurrent?: boolean;
  onClickDynamic?: (uuid: string) => void;
}) {
  const initials = adviser.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card
      className={`group transition-all duration-300 ${
        isCurrent ? "border-primary/50" : "hover:border-primary/30"
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-accent shadow-lg group-hover:scale-105 transition-transform">
              <AvatarImage
                src={adviser.imageUrl || "/placeholder.svg"}
                alt={adviser.fullName}
              />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isCurrent && (
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                <Star className="h-3 w-3 fill-current" />
              </div>
            )}
          </div>

          {/* Name and Role */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{adviser.fullName}</h3>
            <div className="flex flex-wrap justify-center gap-1">
              {adviser.isAdvisor && (
                <Badge variant="default" className="text-xs">
                  Advisor
                </Badge>
              )}
              {adviser.isAdmin && (
                <Badge variant="secondary" className="text-xs">
                  Admin
                </Badge>
              )}
              {adviser.status && (
                <Badge variant="outline" className="text-xs capitalize">
                  {adviser.status}
                </Badge>
              )}
            </div>
          </div>

          {/* Bio */}
          {adviser.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {adviser.bio}
            </p>
          )}

          <Separator />

          {/* Stats */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Joined</div>
              <div className="text-sm font-semibold">
                {new Date(adviser.createDate).getFullYear()}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Gender</div>
              <div className="text-sm font-semibold capitalize">
                {adviser.gender || "N/A"}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex gap-2">
            {isCurrent ? (
              <>
                <Button size="sm" className="flex-1 gap-1">
                  <Mail className="h-3 w-3" />
                  Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1"
                  onClick={() => onClickDynamic?.(adviser.uuid)}
                >
                  <BookOpen className="h-3 w-3" />
                  View
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1 group-hover:border-primary group-hover:text-primary"
                >
                  <UserPlus className="h-3 w-3" />
                  Request
                </Button>
                <Button size="sm" variant="ghost" className="flex-1 gap-1">
                  View Profile
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Card Component
function SkeletonCard() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2 w-full">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 mx-auto animate-pulse" />
          </div>
          <div className="h-12 bg-muted rounded w-full animate-pulse" />
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="h-12 bg-muted rounded animate-pulse" />
            <div className="h-12 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-full flex gap-2">
            <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
            <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
