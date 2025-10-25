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
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  useGetUserProfileQuery,
  useCheckPendingStudentQuery,
} from "@/feature/profileSlice/profileSlice";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {

  const { status } = useSession();
  const { data: profileData, isLoading, error } = useGetUserProfileQuery();

  // Get user UUID from profile data
  const userUuid = profileData?.user?.uuid;

  // Check if student promotion is pending
  const {
    data: pendingStudentData,
    isLoading: isPendingCheckLoading
  } = useCheckPendingStudentQuery(userUuid!, {
    skip: !userUuid, // Skip the query if no UUID is available
  });

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

  return (
    <DashboardLayout
      userRole="public"
      userAvatar={user.imageUrl}
      userName={user.fullName}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Profile
            </h1>
            <p className="text-muted-foreground">
              View and manage your public profile information
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/profile/settings">
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Pending Student Notice */}
        {pendingStudentData?.isStudent && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
                    Student Verification Pending
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                    Your student verification request is being reviewed by our
                    team. This process usually takes 24-48 hours. Youll be
                    notified once your student status is approved.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                    <Clock className="h-3 w-3" />
                    <span>Under review</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Account Status Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Status
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  user.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </div>
              <p className="text-xs text-muted-foreground">
                Member since {memberSince}
              </p>
            </CardContent>
          </Card>

          {/* User Role Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Role</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.isAdmin
                  ? "Admin"
                  : user.isAdvisor
                  ? "Advisor"
                  : user.isStudent
                  ? "Student"
                  : "Basic"}
              </div>
              <p className="text-xs text-muted-foreground">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profile Completion
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {completedFields}/{profileFields.length} fields completed
              </p>
            </CardContent>
          </Card>

          {/* Student Promotion / Status Card */}
          {(() => {
            // User has pending student verification (isStudent: true)
            if (pendingStudentData?.isStudent == false) {
              return (
                <Card className="bg-yellow-50  dark:bg-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                      Student Status
                    </CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      Pending
                    </div>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Verification in progress
                    </p>
                  </CardContent>
                </Card>
              );
            }

            // User can promote (isStudent: false)
            if (pendingStudentData == null) {
              return (
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Student Features
                    </CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get verified as student to access exclusive features
                    </p>
                    <Link href="/profile/verification">
                      <Button
                        size="sm"
                        className="w-full bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Promote to Student
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            }

            // Default state - user hasn't checked promotion status yet or no data
            return (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Student Features
                  </CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Basic</div>
                  <p className="text-xs text-muted-foreground">Regular User</p>
                </CardContent>
              </Card>
            );
          })()}
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your public profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.fullName}
                      className="w-20 h-20 rounded-full object-cover"
                      width={80}
                      height={80}
                      unoptimized
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {initials}
                    </span>
                  )}
                </div>
                {user.isActive && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{user.fullName}</h3>
                <p className="text-muted-foreground">@{user.userName}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="default" className="text-xs">
                    <User className="w-3 h-3 mr-1" />
                    User
                  </Badge>
                  {user.isStudent && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Student
                    </Badge>
                  )}
                  {pendingStudentData?.isStudent && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Student
                    </Badge>
                  )}
                  {user.isAdvisor && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      <Briefcase className="w-3 h-3 mr-1" />
                      Advisor
                    </Badge>
                  )}
                  {user.isAdmin && (
                    <Badge variant="destructive" className="text-xs">
                      <User className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg border-b pb-2">
                  Basic Information
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  {user.firstName && (
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm font-medium">First Name</p>
                      <p className="text-muted-foreground">{user.firstName}</p>
                    </div>
                  )}

                  {user.lastName && (
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm font-medium">Last Name</p>
                      <p className="text-muted-foreground">{user.lastName}</p>
                    </div>
                  )}

                  {user.gender && (
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm font-medium">Gender</p>
                      <p className="text-muted-foreground capitalize">
                        {user.gender.toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg border-b pb-2">
                  Contact Information
                </h4>

                <div className="space-y-4">
                  {contactNumber && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Contact Number</p>
                        <p className="text-muted-foreground">{contactNumber}</p>
                      </div>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-muted-foreground">{user.address}</p>
                      </div>
                    </div>
                  )}

                  {user.telegramId && (
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm font-medium">Telegram ID</p>
                      <p className="text-muted-foreground">{user.telegramId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {user.bio && (
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3 text-lg">Bio</h4>
                <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Account Information */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4 text-lg">Account Information</h4>
              <div className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-medium">Member Since</p>
                  <p className="text-muted-foreground">
                    {new Date(user.createDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {new Date(user.updateDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-medium">User ID</p>
                  <p className="text-muted-foreground font-mono text-xs break-all">
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
                  <h3 className="text-lg font-semibold mb-2">
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
