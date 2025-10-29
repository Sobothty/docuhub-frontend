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

  // Separate advisers into advisors and non-advisors and remove duplicates
  const { availableMentors } = useMemo(() => {
    // Remove duplicates based on uuid
    const uniqueAdvisers = filteredAdvisers.filter(
      (adviser, index, self) =>
        index === self.findIndex((a) => a.uuid === adviser.uuid)
    );

    const active = uniqueAdvisers.filter((a) => a.isAdvisor);
    const available = uniqueAdvisers.filter((a) => !a.isAdvisor);
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
        <div className="dashboard-header rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
                <GraduationCap className="h-10 w-10" />
                Mentorship
              </h1>
              <p className="text-muted-foreground text-lg">
                Connect with experienced advisers and grow your research
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-sm px-4 py-2 shadow-md"
              >
                <Users className="h-4 w-4 mr-2" />
                {advisers?.length || 0} Advisers Available
              </Badge>
            </div>
          </div>
        </div>

        {/* Modern Search Bar */}
        <Card className="dashboard-card border-0">
          <CardContent className="p-6">
            <div className="relative group">
              {/* Search icon with animated background */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(to right, var(--color-secondary), var(--color-accent))",
                    }}
                  ></div>
                  <div
                    className="relative p-2 rounded-full shadow-lg"
                    style={{
                      background:
                        "linear-gradient(to right, var(--color-secondary), var(--color-accent))",
                    }}
                  >
                    <Search className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Search input */}
              <Input
                placeholder="Search advisers by name or expertise..."
                className="pl-16 pr-4 py-7 text-base bg-card text-card-foreground border-border rounded-xl focus:shadow-lg transition-all duration-300 placeholder:text-muted-foreground/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Clear button (shows when there's text) */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-accent hover:bg-accent/80 text-accent-foreground transition-all duration-200"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Search suggestions/info */}
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Sparkles
                className="w-3.5 h-3.5"
                style={{ color: "var(--color-secondary)" }}
              />
              <span>Try searching by name, expertise, or field of study</span>
            </div>
          </CardContent>
        </Card>

        {/* Available Mentors Section */}
        <Card className="dashboard-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                  <UserPlus className="h-6 w-6" />
                  Available Advisers
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Explore and connect with potential mentors
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <AdvisorCardPlaceholder key={i} />
                ))}
              </div>
            ) : availableMentors.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery ? "No advisers found" : "No advisers available"}
                </h3>
                <p className="text-muted-foreground text-base">
                  {searchQuery
                    ? "Try adjusting your search query."
                    : "Check back later for new advisers."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
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
    <Card
      className="relative group max-w-sm w-full h-full transition-all duration-500 overflow-hidden border-2 bg-card hover:shadow-2xl hover:-translate-y-1 p-0"
      style={{ borderColor: "#bfdbfe" }}
    >
      {/* Main card */}
      <div className="relative h-full overflow-hidden transition-all duration-500 flex flex-col">
        {/* Header gradient with pattern */}
        <div
          className="relative h-32 flex-shrink-0 overflow-hidden transition-all duration-500"
          style={{ background: "var(--color-secondary)" }}
        >
          <div className="absolute inset-0">
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 transition-all duration-500 group-hover:opacity-70"
              style={{ backgroundColor: "#3b82f6" }}
            ></div>
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/4 opacity-40 transition-all duration-500 group-hover:opacity-60"
              style={{ backgroundColor: "#1d4ed8" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 transition-all duration-500 group-hover:opacity-50"
              style={{ backgroundColor: "#60a5fa" }}
            ></div>
          </div>
        </div>

        {/* Avatar section */}
        <div className="relative px-6 -mt-16 mb-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-2xl bg-card p-1 shadow-2xl ring-4 ring-card transition-all duration-500">
              <Image
                height={400}
                width={400}
                unoptimized
                src={adviser.imageUrl || "/placeholder.svg"}
                alt={adviser.fullName}
                className="w-full h-full rounded-xl object-cover transition-all duration-500 group-hover:scale-105"
              />
            </div>
            <div
              className="absolute -bottom-2 -right-2 text-white rounded-xl p-1.5 text-xs font-bold shadow-lg flex items-center gap-1 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <Sparkles className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pb-6 w-full">
          {/* Name and badges */}
          <div className="w-full mb-3">
            <h3 className="text-2xl font-bold text-card-foreground w-full">
              {adviser.fullName}
            </h3>
          </div>
          {/* Bio */}
          <div className="flex-1 w-full mb-4">
            {adviser.bio ? (
              <p className="text-sm text-card-foreground/80 leading-relaxed w-full">
                {adviser.bio}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed w-full">
                Cambodia software developer !
              </p>
            )}
          </div>

          {/* Stats with modern design */}
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <div className="w-full">
              <div className="text-xs font-medium text-card-foreground/70 mb-1">
                Joined
              </div>
              <div className="text-lg font-bold text-card-foreground">
                {new Date(adviser.createDate).getFullYear()}
              </div>
            </div>
            <div className="w-full">
              <div className="text-xs font-medium text-card-foreground/70 mb-1">
                Gender
              </div>
              <div className="text-lg font-bold text-card-foreground">
                {adviser.gender || "Male"}
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 w-full mt-auto">
            {isCurrent ? (
              <>
                <Button
                  className="flex-1 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                  style={{
                    background:
                      "linear-gradient(to right, var(--color-secondary), var(--color-accent))",
                  }}
                >
                  <Mail className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Telegram
                </Button>
                <Button
                  className="flex-1 bg-card hover:bg-accent text-card-foreground font-semibold py-2.5 px-4 rounded-xl border-2 border-border transition-all duration-300 flex items-center justify-center gap-2 group"
                  onClick={onClick}
                >
                  <BookOpen className="h-4 w-4 hover:rotate-12 transition-transform" />
                  View
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="flex-1 bg-card hover:bg-accent text-card-foreground font-semibold py-2.5 px-4 rounded-xl border-2 border-border transition-all duration-300 flex items-center justify-center gap-2 group"
                  style={{ borderColor: "var(--color-secondary)" }}
                >
                  <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Request
                </Button>
                <Button className="flex-1 bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-2.5 px-4 rounded-xl transition-all duration-300">
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
    <Card
      className="relative group max-w-sm w-full h-full transition-all duration-300 overflow-hidden border-2 bg-card shadow-md p-0"
      style={{ borderColor: "#bfdbfe" }}
    >
      {/* Main card */}
      <div className="relative h-full overflow-hidden transition-all duration-300 flex flex-col">
        {/* Header gradient with pattern */}
        <div
          className="relative h-32 flex-shrink-0 overflow-hidden animate-pulse"
          style={{
            background: "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)",
          }}
        >
          <div className="absolute inset-0">
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"
              style={{ backgroundColor: "#93c5fd" }}
            ></div>
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/4 opacity-40"
              style={{ backgroundColor: "#60a5fa" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30"
              style={{ backgroundColor: "#bfdbfe" }}
            ></div>
          </div>
        </div>

        {/* Avatar section */}
        <div className="relative px-6 -mt-16 mb-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-2xl bg-accent/20 p-1 shadow-2xl ring-4 ring-card animate-pulse">
              <div className="w-full h-full rounded-xl bg-accent/30"></div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-accent/30 text-transparent rounded-xl p-1.5 text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
              <Sparkles className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 pb-6 w-full">
          {/* Name placeholder */}
          <div className="w-full mb-3">
            <div className="h-7 bg-accent/20 rounded-lg w-3/4 animate-pulse"></div>
          </div>

          {/* Bio placeholder */}
          <div className="flex-1 w-full mb-4">
            <div className="h-4 bg-accent/20 rounded w-full animate-pulse mb-2"></div>
            <div className="h-4 bg-accent/20 rounded w-5/6 animate-pulse"></div>
          </div>

          {/* Stats placeholder */}
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <div className="w-full space-y-2">
              <div className="h-3 bg-accent/20 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-accent/20 rounded w-12 animate-pulse"></div>
            </div>
            <div className="w-full space-y-2">
              <div className="h-3 bg-accent/20 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-accent/20 rounded w-12 animate-pulse"></div>
            </div>
          </div>

          {/* Action buttons placeholder */}
          <div className="flex gap-2 w-full mt-auto">
            <div className="flex-1 h-10 bg-accent/20 rounded-xl animate-pulse"></div>
            <div className="flex-1 h-10 bg-accent/20 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
