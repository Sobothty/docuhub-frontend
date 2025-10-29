"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  User,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Clock,
  Edit,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  useGetUserProfileQuery,
  useCheckPendingStudentQuery,
} from "@/feature/profileSlice/profileSlice";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useWebSocket } from "@/components/providers/WebSocketProvider";
import { useEffect } from "react";

export default function ProfilePage() {
  const { status } = useSession();
  const {
    data: profileData,
    isLoading,
    error,
    refetch: refetchProfile,
  } = useGetUserProfileQuery(undefined, {
    // Refetch on mount and focus to get latest data
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Get user UUID from profile data
  const userUuid = profileData?.user?.uuid;

  // Check if student promotion is pending with auto-refetch settings
  const {
    data: pendingStudentData,
    isLoading: isPendingCheckLoading,
    refetch: refetchPendingStatus,
  } = useCheckPendingStudentQuery(userUuid!, {
    skip: !userUuid, // Skip the query if no UUID is available
    // Refetch on mount and focus to get latest data
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    // Poll every 30 seconds as fallback
    pollingInterval: 30000,
  });

  // Listen to WebSocket messages for real-time updates
  const { lastMessage } = useWebSocket();

  // Refetch data when receiving WebSocket notification about student status change
  useEffect(() => {
    if (lastMessage) {
      try {
        const message = JSON.parse(lastMessage);
        // Check if the message is about student verification status
        if (
          message.type === "STUDENT_VERIFICATION" ||
          message.message?.includes("student") ||
          message.message?.includes("verification")
        ) {
          console.log("Student status update received, refetching...");
          refetchProfile();
          refetchPendingStatus();
        }
      } catch {
        // Not a JSON message, might be a simple notification
        console.log("WebSocket message received, refetching data...");
        refetchProfile();
        refetchPendingStatus();
      }
    }
  }, [lastMessage, refetchProfile, refetchPendingStatus]);

  // Loading state
  if (status === "loading" || isLoading || isPendingCheckLoading) {
    return (
      <DashboardLayout userRole="public">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-7 w-16 bg-muted rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 w-60 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-5 w-12 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Profile data error state
  if (!profileData || error) {
    return (
      <DashboardLayout userRole="public">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Unable to load profile
                </h2>
                <p className="text-muted-foreground">
                  {error
                    ? "There was an error loading your profile."
                    : "Please try again later."}
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const { user } = profileData;
  const memberSince = new Date(user.createDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user.userName.slice(0, 2).toUpperCase();

  // Format contact number - handle "null" string case
  const contactNumber =
    user.contactNumber && user.contactNumber !== "null"
      ? user.contactNumber
      : null;

  // Calculate profile completion percentage
  const profileFields = [
    user.firstName,
    user.lastName,
    user.bio,
    user.address,
    contactNumber,
    user.telegramId,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const completionPercentage = Math.round(
    (completedFields / profileFields.length) * 100
  );

  // Handle promotion button click
  const handlePromoteClick = () => {
    // Refetch the pending status to get latest data
    refetchPendingStatus();
  };

  return (
    <DashboardLayout
      userRole="public"
      userAvatar={user.imageUrl}
      userName={user.fullName}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="dashboard-header rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                My Profile
              </h1>
              <p className="text-muted-foreground text-lg">
                View and manage your public profile information
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/profile/settings">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Case 1: isStudent = false, reason = null, status = PENDING - Show pending card normally */}
        {pendingStudentData?.isStudent === false &&
          !pendingStudentData?.reason &&
          pendingStudentData?.status === "PENDING" && (
            <Card className="dashboard-card border-0 overflow-hidden">
              {/* Top Accent Bar */}
              <div className="h-1 bg-gradient-to-r from-yellow-500 to-amber-500" />

              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-card-foreground">
                        Student Verification Pending
                      </h4>
                      <Badge className="px-2.5 py-0.5 text-xs font-semibold !rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                        Under Review
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Your student verification request is being reviewed by our
                      team. This process usually takes 24-48 hours. You&apos;ll
                      be notified once your student status is approved.
                    </p>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-400 dark:border-yellow-600">
                      <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-800 dark:text-yellow-300">
                        Verification in progress
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Case 3: isStudent = false, reason exists, status = ADMIN_REJECTED - Show rejection with reason and allow re-promote */}
        {pendingStudentData?.isStudent === false &&
          pendingStudentData?.reason &&
          pendingStudentData?.status === "ADMIN_REJECTED" && (
            <Card className="dashboard-card border-0 overflow-hidden">
              {/* Top Accent Bar */}
              <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />

              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-rose-500 shadow-lg">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-card-foreground">
                        Student Verification Rejected
                      </h4>
                      <Badge className="px-2.5 py-0.5 text-xs font-semibold !rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white border-0">
                        Rejected
                      </Badge>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
                      <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                        <strong className="font-semibold">Reason:</strong>{" "}
                        {pendingStudentData.reason}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/profile/verification"
                        onClick={handlePromoteClick}
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0 shadow-md font-semibold"
                        >
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Apply Again
                        </Button>
                      </Link>
                      <Link href="/profile/settings">
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-medium"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Update Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Activity Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Account Status Card */}
          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Account Status
              </CardTitle>
              <div
                className={`h-10 w-10 rounded-full ${
                  user.isActive ? "bg-green-500/20" : "bg-red-500/20"
                } flex items-center justify-center`}
              >
                <User
                  className={`h-5 w-5 ${
                    user.isActive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${
                  user.isActive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Member since {memberSince}
              </p>
            </CardContent>
          </Card>

          {/* User Role Card */}
          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">User Role</CardTitle>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                {user.isAdmin
                  ? "Admin"
                  : user.isAdvisor
                  ? "Advisor"
                  : user.isStudent
                  ? "Student"
                  : "Basic"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {user.isAdmin
                  ? "Administrator"
                  : user.isAdvisor
                  ? "Professional Advisor"
                  : user.isStudent
                  ? "Verified Student"
                  : "Regular User"}
              </p>
            </CardContent>
          </Card>

          {/* Profile Completion Card */}
          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Profile Completion
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {completionPercentage}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedFields}/{profileFields.length} fields completed
              </p>
            </CardContent>
          </Card>

          {/* Student Promotion / Status Card */}
          {(() => {
            // Case 1: Pending verification (isStudent: false, reason: null, status: PENDING)
            if (
              pendingStudentData?.isStudent === false &&
              !pendingStudentData?.reason &&
              pendingStudentData?.status === "PENDING"
            ) {
              return (
                <Card className="stat-card border-0 overflow-hidden">
                  {/* Top Accent Bar */}
                  <div className="h-1 bg-gradient-to-r from-yellow-500 to-amber-500" />

                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-card-foreground">
                      Student Status
                    </CardTitle>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-md">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                      Pending
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Verification in progress
                    </p>
                  </CardContent>
                </Card>
              );
            }

            // Case 3: Rejected (isStudent: false, reason exists, status: ADMIN_REJECTED)
            if (
              pendingStudentData?.isStudent === false &&
              pendingStudentData?.reason &&
              pendingStudentData?.status === "ADMIN_REJECTED"
            ) {
              return (
                <Card className="stat-card border-0 overflow-hidden">
                  {/* Top Accent Bar */}
                  <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />

                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-card-foreground">
                      Student Status
                    </CardTitle>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-md">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent mb-1">
                      Rejected
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {pendingStudentData.reason}
                    </p>
                    <Link
                      href="/profile/verification"
                      onClick={handlePromoteClick}
                    >
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0 font-semibold shadow-md"
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Apply Again
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            }

            // User can promote (no pending student data or user is not a student)
            if (!pendingStudentData || pendingStudentData.isStudent === null) {
              return (
                <Card className="dashboard-card border-0 overflow-hidden">
                  <div
                    className="h-1"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">
                      Student Features
                    </CardTitle>
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    >
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get verified as student to access exclusive features
                    </p>
                    <Link href="/profile/verification">
                      <Button
                        size="sm"
                        className="w-full text-white border-0"
                        style={{ backgroundColor: "var(--color-secondary)" }}
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Promote to Student
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            }

            // Default state - user is already a student or other cases
            return (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Student Features
                  </CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {user.isStudent ? "Student" : "Basic"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.isStudent ? "Verified Student" : "Regular User"}
                  </p>
                </CardContent>
              </Card>
            );
          })()}
        </div>

        {/* Profile Information */}
        <Card className="dashboard-card border-0 overflow-hidden">
          {/* Top Accent Bar */}
          <div
            className="h-1"
            style={{ backgroundColor: "var(--color-secondary)" }}
          />

          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-card-foreground">
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Your public profile details
                  </CardDescription>
                </div>
              </div>
              <Link href="/profile/settings">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Edit className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                      width={96}
                      height={96}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
                {user.isActive && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-gray-800 shadow-md"></div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {user.fullName}
                </h3>
                <p className="text-muted-foreground mb-3">@{user.userName}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge
                    className="gap-1.5 px-3 py-1 text-xs font-semibold text-white border-0 !rounded-full"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <User className="w-3 h-3" />
                    User
                  </Badge>
                  {user.isStudent && (
                    <Badge className="gap-1.5 px-3 py-1 text-xs font-semibold !rounded-full bg-green-500 text-white border-0">
                      <GraduationCap className="w-3 h-3" />
                      Student
                    </Badge>
                  )}
                  {/* Show pending badge only for case 1 */}
                  {pendingStudentData?.isStudent === false &&
                    !pendingStudentData?.reason &&
                    pendingStudentData?.status === "PENDING" && (
                      <Badge className="gap-1.5 px-3 py-1 text-xs font-semibold !rounded-full bg-yellow-500 text-white border-0">
                        <Clock className="w-3 h-3" />
                        Pending Student
                      </Badge>
                    )}
                  {user.isAdvisor && (
                    <Badge className="gap-1.5 px-3 py-1 text-xs font-semibold !rounded-full bg-blue-500 text-white border-0">
                      <Briefcase className="w-3 h-3" />
                      Advisor
                    </Badge>
                  )}
                  {user.isAdmin && (
                    <Badge className="gap-1.5 px-3 py-1 text-xs font-semibold !rounded-full bg-red-500 text-white border-0">
                      <User className="w-3 h-3" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Basic Information Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="p-1.5 rounded-md"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h4 className="font-semibold text-base text-foreground">
                    Basic Information
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">
                        Email Address
                      </p>
                      <p className="text-sm font-medium text-foreground break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {user.firstName && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">
                        First Name
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {user.firstName}
                      </p>
                    </div>
                  )}

                  {user.lastName && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">
                        Last Name
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {user.lastName}
                      </p>
                    </div>
                  )}

                  {user.gender && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">
                        Gender
                      </p>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {user.gender.toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="p-1.5 rounded-md"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <Phone className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h4 className="font-semibold text-base text-foreground">
                    Contact Information
                  </h4>
                </div>

                <div className="space-y-3">
                  {contactNumber ? (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-0.5">
                          Contact Number
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {contactNumber}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30">
                      <p className="text-xs text-muted-foreground">
                        No contact number provided
                      </p>
                    </div>
                  )}

                  {user.address ? (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-0.5">
                          Address
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {user.address}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30">
                      <p className="text-xs text-muted-foreground">
                        No address provided
                      </p>
                    </div>
                  )}

                  {user.telegramId && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">
                        Telegram ID
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {user.telegramId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {user.bio && (
              <div className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="p-1.5 rounded-md"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h4 className="font-semibold text-base text-foreground">
                    About Me
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Account Information */}
            <div className="pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <Clock className="h-3.5 w-3.5 text-white" />
                </div>
                <h4 className="font-semibold text-base text-foreground">
                  Account Details
                </h4>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">
                    Member Since
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(user.createDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(user.updateDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 sm:col-span-2 lg:col-span-1">
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">
                    User ID
                  </p>
                  <p className="text-xs font-mono text-foreground break-all">
                    {user.uuid}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State for Missing Information */}
        {completionPercentage < 50 && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-4 max-w-md mx-auto">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add more information to your profile to get the most out of
                    our platform and increase your credibility.
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {completionPercentage}% complete • {completedFields}/
                  {profileFields.length} fields
                </p>
                <Link href="/profile/settings">
                  <Button className="mt-2">
                    <Edit className="w-4 h-4 mr-2" />
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
