"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  FileText,
  CheckCircle,
  MessageSquare,
  Search,
  Filter,
  Plus,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import HorizontalCard from "@/components/card/HorizontalCard";
import { useState } from "react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetPapersByAuthorQuery } from "@/feature/paperSlice/papers";
import { useGetAllStarOfPapersQuery } from "@/feature/star/StarSlice";

export default function StudentOverviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data:user } = useGetUserProfileQuery();
  const {
    data: starData,
    isLoading: starLoading,
  } = useGetAllStarOfPapersQuery();

  if (user?.user.isStudent === false) {
    window.location.href = "/";
  }

  // Fetch author's papers with pagination
  const {
    data: papersData,
    error: paperError,
    isLoading: papersLoading,
  } = useGetPapersByAuthorQuery({
    page: 0,
    size: 10,
    sortBy: "createdAt",
    direction: "desc",
  });

  // Extract papers from the response
  const authorPapers = papersData?.papers?.content || [];
  console.log(authorPapers);

  // Filter documents based on search query
  const filteredDocuments = authorPapers
    .filter((paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((paper) => ({
      id: paper.uuid,
      title: paper.title,
      status: paper.status,
      savedDate: new Date(paper.createdAt).toLocaleDateString("en-US"),
      feedback: paper.isApproved ? "Approved" : "Under review",
      progress: paper.isApproved ? 100 : 75,
      fileSize: "2.4 MB", // You may need to calculate this from fileUrl
      downloads: 0, // Add this to your backend if needed
      citations: 0, // Add this to your backend if needed
      isWishlist: false,
      authors: [paper.authorUuid],
      journal: paper.categoryNames[0] || "N/A",
      year: new Date(paper.publishedAt || paper.createdAt)
        .getFullYear()
        .toString(),
      abstract: paper.abstractText,
      tags: paper.categoryNames,
      image: paper.thumbnailUrl || "/placeholder.svg?height=200&width=300",
    }));

  return (
    <DashboardLayout
      userRole="student"
      userName={user?.user.fullName}
      userAvatar={
        user?.user.imageUrl ||
        "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg"
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Student Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your saved documents and manage your wishlist
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/student/proposals">
                <Plus className="h-4 w-4 mr-2" />
                New Documents
              </Link>
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{authorPapers.length}</div>
              <p className="text-xs text-muted-foreground">
                {papersLoading ? "Loading..." : "Total papers submitted"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Papers
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {authorPapers.filter((p) => p.isApproved).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Published documents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {authorPapers.reduce((sum, p) => sum + (p.downloads || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                All time downloads of documents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Star</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {starLoading ? "..." : starData?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Academic impact</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">My Papers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Papers */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Papers</CardTitle>
                  <CardDescription>
                    Your recently submitted papers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {papersLoading ? (
                    <div className="text-center py-4">Loading papers...</div>
                  ) : paperError ? (
                    <div className="text-center py-4 text-red-500">
                      Failed to load papers
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {authorPapers.slice(0, 3).map((paper) => (
                        <div key={paper.uuid} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">
                              {paper.title}
                            </h4>
                            <Badge
                              variant={
                                paper.isApproved ? "default" : "secondary"
                              }
                              className="capitalize"
                            >
                              {paper.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              Submitted:{" "}
                              {new Date(paper.createdAt).toLocaleDateString()}
                            </span>
                            <span>{paper.categoryNames.join(", ")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                    asChild
                  >
                    <Link href="/student/proposals">View All Papers</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Mentor Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Mentor</CardTitle>
                  <CardDescription>
                    Connect with your assigned mentor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="/placeholder.svg?height=48&width=48"
                        alt="Dr. Sarah Johnson"
                      />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">Dr. Sarah Johnson</h4>
                      <p className="text-sm text-muted-foreground">
                        Professor of Computer Science
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stanford University
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Last interaction:</span>
                      <span className="text-muted-foreground">2 days ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total feedback received:</span>
                      <span className="text-muted-foreground">8 comments</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Response time:</span>
                      <span className="text-muted-foreground">~24 hours</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href="/student/mentorship">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      asChild
                    >
                      <Link href="/mentors/1">View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Research Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Research Interests</CardTitle>
                <CardDescription>
                  Your areas of academic focus and interest
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Machine Learning",
                    "Healthcare Technology",
                    "Data Analysis",
                    "Computer Vision",
                  ].map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/student/settings">Edit Interests</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {/* Document Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Papers</CardTitle>
                    <CardDescription>
                      Manage your submitted academic papers
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search papers..."
                        className="pl-8 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {papersLoading ? (
                  <div className="text-center py-8">Loading your papers...</div>
                ) : paperError ? (
                  <div className="text-center py-8 text-red-500">
                    Failed to load papers. Please try again.
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No papers found. Start by submitting your first paper!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <HorizontalCard
                        key={doc.id}
                        id={doc.id}
                        title={doc.title}
                        authors={doc.authors}
                        authorImage="/placeholder.svg?height=24&width=24"
                        journal={doc.journal}
                        year={doc.year}
                        citations={doc.citations.toString()}
                        abstract={doc.abstract || ""}
                        tags={doc.tags}
                        image={doc.image}
                        isBookmarked={doc.isWishlist}
                        onDownloadPDF={() =>
                          window.open(`/papers/${doc.id}`, "_blank")
                        }
                        onToggleBookmark={() =>
                          console.log(`Toggle bookmark for ${doc.title}`)
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
