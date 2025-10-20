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
  MessageSquare,
  Download,
  Calendar,
  User,
  GraduationCap,
  Briefcase,
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
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  You can still proceed with verification.
                </p>
                <Link href="/profile/verification">
                  <Button size="sm">Promote to Student</Button>
                </Link>
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
            Manage your public profile and activity
          </p>
        </div>

        {/* Activity Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Papers downloaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Discussions participated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saved Papers
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Papers bookmarked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Member Since
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberSince}</div>
              <p className="text-xs text-muted-foreground">Active member</p>
            </CardContent>
          </Card>

          {/* Promote to Student CTA */}
          {!user.isStudent && (
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unlock Student Features
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Get verified as a student to submit papers, access mentorship,
                  and more.
                </p>
                <Link href="/profile/verification">
                  <Button size="sm">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Promote to Student
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
          <CardContent className="space-y-4">
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
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  {user.isStudent && (
                    <Badge variant="outline" className="text-xs">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Student
                    </Badge>
                  )}
                  {user.isAdvisor && (
                    <Badge variant="outline" className="text-xs">
                      <Briefcase className="w-3 h-3 mr-1" />
                      Advisor
                    </Badge>
                  )}
                  {user.isAdmin && (
                    <Badge variant="outline" className="text-xs">
                      <User className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {user.bio && (
              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
            )}

            {user.address && (
              <div>
                <h4 className="font-medium mb-2">Address</h4>
                <p className="text-muted-foreground">{user.address}</p>
              </div>
            )}

            {user.contactNumber && user.contactNumber !== "null" && (
              <div>
                <h4 className="font-medium mb-2">Contact Number</h4>
                <p className="text-muted-foreground">{user.contactNumber}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button>Edit Profile</Button>
              {!user.isStudent && (
                <Link href="/profile/verification" className="inline-block">
                  <Button variant="secondary">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Promote to Student
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Student Information */}
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

        {/* End main content */}
      </div>
    </DashboardLayout>
  );
}
