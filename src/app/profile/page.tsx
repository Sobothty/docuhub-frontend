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
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();

  const token = useSession();
  if (!token.data?.accessToken) {
    router.push("/login");
  }

  const { status } = useSession();
  const { data: profileData, isLoading } = useGetUserProfileQuery();

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout userRole="public">
        <div className="space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (status === "unauthenticated") {
    return (
      <DashboardLayout userRole="public">
        <div className="space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
              <p className="text-muted-foreground">
                You need to be authenticated to view your profile.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profileData) {
    return (
      <DashboardLayout userRole="public">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Unable to load profile
                </h2>
                <p className="text-muted-foreground">Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const { user, student } = profileData;
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

  return (
    <DashboardLayout
      userRole="public"
      userAvatar={profileData.user.imageUrl}
      userName={profileData.user.fullName}
    >
      <div className="space-y-6">
        {/* Overview Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            View your public profile information
          </p>
        </div>

        {/* Activity Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Status
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">
                Member since {memberSince}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Role</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Basic</div>
              <p className="text-xs text-muted-foreground">Regular User</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profile Completion
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  [
                    user.firstName,
                    user.lastName,
                    user.bio,
                    user.address,
                    contactNumber,
                  ].filter(Boolean).length
                }
                /5
              </div>
              <p className="text-xs text-muted-foreground">Basic info added</p>
            </CardContent>
          </Card>

          {/* Student Promotion CTA - Only show if not student */}
          {!user.isStudent && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Student Features
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">
                  Get verified as student
                </p>
                <Link href="/profile/verification">
                  <Button size="sm" className="w-full">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Promote
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
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
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                    width={100}
                    height={100}
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {initials}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.fullName}</h3>
                <p className="text-muted-foreground">@{user.userName}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default" className="text-xs">
                    <User className="w-3 h-3 mr-1" />
                    User
                  </Badge>
                  {user.isStudent && (
                    <Badge variant="secondary" className="text-xs">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Student
                    </Badge>
                  )}
                  {user.isAdvisor && (
                    <Badge variant="secondary" className="text-xs">
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

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  {user.firstName && (
                    <div>
                      <p className="text-sm font-medium">First Name</p>
                      <p className="text-muted-foreground">{user.firstName}</p>
                    </div>
                  )}

                  {user.lastName && (
                    <div>
                      <p className="text-sm font-medium">Last Name</p>
                      <p className="text-muted-foreground">{user.lastName}</p>
                    </div>
                  )}

                  {user.gender && (
                    <div>
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

                <div className="space-y-3">
                  {contactNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Contact Number</p>
                        <p className="text-muted-foreground">{contactNumber}</p>
                      </div>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-muted-foreground">{user.address}</p>
                      </div>
                    </div>
                  )}

                  {user.telegramId && (
                    <div>
                      <p className="text-sm font-medium">Telegram ID</p>
                      <p className="text-muted-foreground">{user.telegramId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {user.bio && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Account Information */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Account Information</h4>
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <p className="font-medium">Member Since</p>
                  <p className="text-muted-foreground">
                    {new Date(user.createDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {new Date(user.updateDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">User ID</p>
                  <p className="text-muted-foreground font-mono text-xs">
                    {user.uuid}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Information - Only show if student exists */}
        {student && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Student Information
              </CardTitle>
              <CardDescription>Your academic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">University</h4>
                  <p className="text-muted-foreground">{student.university}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Major</h4>
                  <p className="text-muted-foreground">{student.major}</p>
                </div>
                {student.yearsOfStudy && (
                  <div>
                    <h4 className="font-medium mb-2">Years of Study</h4>
                    <p className="text-muted-foreground">
                      {student.yearsOfStudy}
                    </p>
                  </div>
                )}
              </div>
              {student.studentCardUrl && (
                <div>
                  <h4 className="font-medium mb-2">Student Card</h4>
                  <Image
                    src={student.studentCardUrl}
                    alt="Student Card"
                    className="w-full max-w-md rounded-lg border"
                    width={400}
                    height={400}
                    unoptimized
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State for Missing Information */}
        {!user.bio && !user.address && !contactNumber && !user.telegramId && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-2">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">Complete Your Profile</h3>
                <p className="text-muted-foreground">
                  Add more information to your profile to get the most out of
                  our platform.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
