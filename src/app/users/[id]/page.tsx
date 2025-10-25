"use client";

import { use } from "react";
import { useGetUserByIdQuery } from "@/feature/apiSlice/authApi";
import { useGetAllPublishedPapersQuery } from "@/feature/paperSlice/papers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  GraduationCap,
  Shield,
  BookOpen,
  ArrowLeft,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Loading from "@/app/loading";
import { Paper } from "@/types/paperType";

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params);

  const { data: user, isLoading, error } = useGetUserByIdQuery(id);
  const { data: papersData } = useGetAllPublishedPapersQuery({
    page: 0,
    size: 10,
  });

  const userPaper = papersData?.papers.content.filter(
    (paper) => paper.authorUuid === id
  );

  if (isLoading) return <Loading />;

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-500 text-center text-lg">
            Failed to load user profile
          </p>
          <Link href="/users">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = () => {
    if (user.isAdmin) return <Shield className="h-5 w-5" />;
    if (user.isAdvisor) return <BookOpen className="h-5 w-5" />;
    if (user.isStudent) return <GraduationCap className="h-5 w-5" />;
    return <UserIcon className="h-5 w-5" />;
  };

  const getRoleBadge = () => {
    if (user.isAdmin) return <Badge variant="destructive">Admin</Badge>;
    if (user.isAdvisor) return <Badge variant="secondary">Mentor</Badge>;
    if (user.isStudent) return <Badge variant="outline">Student</Badge>;
    if (user.isUser) return <Badge variant="default">User</Badge>;
    return <Badge variant="secondary">Member</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleDescription = () => {
    if (user.isAdmin) return "Platform Administrator with full system access";
    if (user.isAdvisor)
      return "Academic mentor guiding students in their research journey";
    if (user.isStudent)
      return "Student researcher working on academic projects";
    return "Community member";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/users"
            className="hover:text-foreground flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
          <span>/</span>
          <span className="text-foreground">{user.fullName}</span>
        </div>

        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.imageUrl || "/placeholder-avatar.png"}
                  alt={user.fullName}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  {getRoleIcon()}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>@{user.userName}</span>
                  <span>•</span>
                  {getRoleBadge()}
                </div>

                <p className="text-muted-foreground">{getRoleDescription()}</p>
              </div>
            </div>
          </CardHeader>

          {user.bio && (
            <CardContent className="pt-0">
              <Separator className="mb-4" />
              <p className="text-muted-foreground leading-relaxed">
                {user.bio}
              </p>
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {user.contactNumber && user.contactNumber !== "null" && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">
                        {user.contactNumber}
                      </p>
                    </div>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">{user.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity & Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Papers List */}
                {userPaper && (
                  <div className="space-y-3">
                    <Separator />
                    <div className="space-y-2">
                      {userPaper.slice(0, 5).map((paper: Paper) => (
                        <Link
                          key={paper.uuid}
                          href={`/papers/${paper.uuid}`}
                          className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-1">
                                {paper.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(
                                  paper.publishedAt || paper.createdAt
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <Badge
                              variant={
                                paper.isPublished ? "default" : "secondary"
                              }
                              className="shrink-0"
                            >
                              {paper.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {userPaper.length > 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        asChild
                      >
                        <Link href={`/users/${id}/papers`}>
                          View All Papers ({userPaper.length})
                        </Link>
                      </Button>
                    )}
                  </div>
                )}

                {papersData && papersData.papers.content.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No papers published yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    Member Since
                  </p>
                  <p className="text-sm">{formatDate(user.createDate)}</p>
                </div>
                {/* Gender */}
                {user.gender && (
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">
                      Gender
                    </p>
                    <p className="text-sm">{user.gender}</p>
                  </div>
                )}
                {/* Telegram */}
                {user.telegramId && (
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">
                      Telegram
                    </p>
                    <p className="text-sm">@{user.telegramId}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
