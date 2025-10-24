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
import { Input } from "@/components/ui/input";
import {
  Search,
  UserPlus,
  Mail,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { Adviser, useGetAllAdvisersQuery } from "@/feature/users/studentSlice";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    router.push(`/advisers/${uuid}`);
  };

  return (
    <DashboardLayout
      userRole="student"
      userName={user?.user.fullName}
      userAvatar={user?.user.imageUrl || "/placeholder.svg?height=40&width=40"}
    >
      <div className="space-y-6">
        {/* Header with gradient background */}
        <div className="rounded-xl p-6">
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
                {advisers?.length || 0} Advisers
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
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1,2,3,4,5,6,7,8,9].map((i) => (
                  <AdvisorCardPlaceholder key={i} />
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
                    onClick={() => handleOnClickDynamic(adviser.uuid)}
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
  onClick,
}: {
  adviser: Adviser;
  isCurrent?: boolean;
  onClick?: () => void;
}) {
  return (
    <Card className="relative group max-w-sm w-full transition-all duration-300 hover:shadow-2xl overflow-hidden border-0 shadow-xl">

      {/* Main card */}
      <div className="relative bg-card rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Header gradient with pattern */}
        <div className="relative h-32 bg-blue-600 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-700 rounded-full translate-y-1/2 -translate-x-1/4 opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
          </div>
        </div>

        {/* Avatar section */}
        <div className="relative px-6 -mt-16 mb-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-2xl bg-card p-1 shadow-2xl ring-4 ring-card">
              <Image
                height={400}
                width={400}
                unoptimized
                src={adviser.imageUrl || "/placeholder.svg"}
                alt={adviser.fullName}
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-accent text-white rounded-xl p-1.5 text-xs font-bold shadow-lg flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Name and badges */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold ">
              {adviser.fullName}
            </h3>
          </div>
          {/* Bio */}
          {adviser.bio ? (
            <p className="text-sm leading-relaxed">
              {adviser.bio}
            </p>
          ) : (
            <p className="text-sm text-slate-400 leading-relaxed">
              No bio available.
            </p>
          )}

          {/* Stats with modern design */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="relative overflow-hidden">
              <div className="text-xs font-medium text-foreground mb-1">
                Joined
              </div>
              <div className="text-lg font-bold text-foreground">
                {new Date(adviser.createDate).getFullYear()}
              </div>
            </div>
            <div className="relative overflow-hidden">
              <div className="text-xs font-medium text-foreground mb-1">
                Gender
              </div>
              <div className="text-lg font-bold text-foreground">
                {adviser.gender || "N/A"}
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            {isCurrent ? (
              <>
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                  <Mail className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Telegram
                </Button>
                <Button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 group" onClick={onClick}>
                  <BookOpen className="h-4 w-4 hover:rotate-12 transition-transform" />
                  View
                </Button>
              </>
            ) : (
              <>
                <Button className="flex-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold py-2.5 px-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Request
                </Button>
                <Button
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-all duration-300"
                >
                  View Profile
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function AdvisorCardPlaceholder() {
  return (
    <Card className="relative group max-w-sm w-full transition-all duration-300 hover:shadow-2xl overflow-hidden border-0 shadow-xl">
      {/* Main card */}
      <div className="relative bg-card rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Header gradient with pattern */}
        <div className="relative h-32 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden animate-pulse">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-300 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-400 rounded-full translate-y-1/2 -translate-x-1/4 opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-slate-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
          </div>
        </div>

        {/* Avatar section */}
        <div className="relative px-6 -mt-16 mb-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-2xl bg-slate-200 p-1 shadow-2xl ring-4 ring-card animate-pulse">
              <div className="w-full h-full rounded-xl bg-slate-300"></div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-300 text-transparent rounded-xl p-1.5 text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
              <Sparkles className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Name placeholder */}
          <div className="space-y-2">
            <div className="h-7 bg-slate-200 rounded-lg w-3/4 animate-pulse"></div>
          </div>

          {/* Bio placeholder */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
          </div>

          {/* Stats placeholder */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="relative overflow-hidden space-y-2">
              <div className="h-3 bg-slate-200 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-slate-200 rounded w-12 animate-pulse"></div>
            </div>
            <div className="relative overflow-hidden space-y-2">
              <div className="h-3 bg-slate-200 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-slate-200 rounded w-12 animate-pulse"></div>
            </div>
          </div>

          {/* Action buttons placeholder */}
          <div className="flex gap-2 pt-2">
            <div className="flex-1 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="flex-1 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

