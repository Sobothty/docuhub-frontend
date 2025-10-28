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
  TrendingUp,
  Star,
} from "lucide-react";
import Link from "next/link";
import HorizontalCard from "@/components/card/HorizontalCardForAuthor";
import { useState, useEffect } from "react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetPapersByAuthorQuery } from "@/feature/paperSlice/papers";
import {
  useGetUserStarsQuery,
  useGetStarCountQuery,
  StarResponse,
} from "@/feature/star/StarSlice";
import { useRouter } from "next/navigation";
import ProposalCardPlaceholder from "./proposals/PaperSkeleton";

// Type definitions
interface User {
  uuid: string;
  fullName: string;
  imageUrl?: string;
  isStudent: boolean;
}

interface UserProfileResponse {
  user: User;
}

interface Paper {
  uuid: string;
  title: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  isApproved: boolean;
  downloads?: number;
  authorUuid: string;
  categoryNames: string[];
  abstractText?: string;
  thumbnailUrl?: string;
}

interface PapersResponse {
  papers: {
    content: Paper[];
  };
}

interface FilteredDocument {
  id: string;
  title: string;
  status: string;
  savedDate: string;
  feedback: string;
  progress: number;
  fileSize: string;
  downloads: number;
  isWishlist: boolean;
  authors: string[];
  journal: string;
  year: string;
  abstract?: string;
  tags: string[];
  image: string;
  starCount: number;
}

// Add this above the main component
interface MentorInfo {
  fullName: string;
  imageUrl?: string;
  title?: string;
  university?: string;
  lastInteraction?: string;
  feedbackCount?: number;
  responseTime?: string;
  uuid?: string;
}

function MentorCard({ mentor }: { mentor: MentorInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Mentor</CardTitle>
        <CardDescription>Connect with your assigned mentor</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={mentor.imageUrl || "/placeholder.svg?height=48&width=48"}
              alt={mentor.fullName}
            />
            <AvatarFallback>
              {mentor.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-medium">{mentor.fullName}</h4>
            <p className="text-sm text-muted-foreground">
              {mentor.title || "Mentor"}
            </p>
            <p className="text-sm text-muted-foreground">
              {mentor.university || ""}
            </p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Last interaction:</span>
            <span className="text-muted-foreground">
              {mentor.lastInteraction || "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total feedback received:</span>
            <span className="text-muted-foreground">
              {mentor.feedbackCount ?? "-"} comments
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Response time:</span>
            <span className="text-muted-foreground">
              {mentor.responseTime || "-"}
            </span>
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
            <Link href={mentor.uuid ? `/mentors/${mentor.uuid}` : "#"}>
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentOverviewPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("documents");
  const router = useRouter();
  const { data: user } = useGetUserProfileQuery() as {
    data: UserProfileResponse | undefined;
  };

  // Get user's starred papers
  const { data: starData, isLoading: starLoading } = useGetUserStarsQuery(
    user?.user.uuid || "",
    { skip: !user?.user.uuid }
  );

  // Use useEffect to redirect if not a student (prevent SSR issues)
  useEffect(() => {
    if (user?.user.isStudent === false) {
      router.push("/");
    }
  }, [user?.user.isStudent, router]);

  // Fetch author's papers with pagination
  const { data: papersData, isLoading: papersLoading } =
    useGetPapersByAuthorQuery({
      page: 0,
      size: 10,
      sortBy: "createdAt",
      direction: "desc",
    }) as {
      data: PapersResponse | undefined;
      isLoading: boolean;
    };

  // Extract papers from the response
  const authorPapers: Paper[] = papersData?.papers?.content || [];

  // Filter documents based on search query
  const filteredDocuments: FilteredDocument[] = authorPapers
    .filter((paper: Paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((paper: Paper) => ({
      id: paper.uuid,
      title: paper.title,
      status: paper.status,
      savedDate: new Date(paper.createdAt).toLocaleDateString("en-US"),
      feedback: paper.isApproved ? "Approved" : "Under review",
      progress: paper.isApproved ? 100 : 75,
      fileSize: "2.4 MB",
      downloads: paper.downloads || 0,
      isWishlist: false,
      authors: [paper.authorUuid],
      journal: paper.categoryNames[0] || "N/A",
      year: new Date(paper.publishedAt || paper.createdAt)
        .getFullYear()
        .toString(),
      abstract: paper.abstractText,
      tags: paper.categoryNames,
      image: paper.thumbnailUrl || "/placeholder.svg?height=200&width=300",
      starCount: 0,
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
            <Button asChild className="text-white">
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
                {authorPapers.filter((p: Paper) => p.isApproved).length}
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
                {authorPapers.reduce(
                  (sum: number, p: Paper) => sum + (p.downloads || 0),
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                All time downloads of documents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Star</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {starLoading
                  ? "..."
                  : (starData as StarResponse[])?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Academic impact</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          defaultValue={activeTab}
          className="space-y-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-accent transition-colors duration-700"
            >
              My Papers
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-accent transition-colors duration-700"
            >
              Overview
            </TabsTrigger>
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
                  ) : (
                    <div className="space-y-4">
                      {authorPapers.slice(0, 3).map((paper: Paper) => (
                        <PaperWithStarCount key={paper.uuid} paper={paper} />
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
              <MentorCard
                mentor={{
                  fullName: "Dr. Sarah Johnson",
                  imageUrl: "/placeholder.svg?height=48&width=48",
                  title: "Professor of Computer Science",
                  university: "Stanford University",
                  lastInteraction: "2 days ago",
                  feedbackCount: 8,
                  responseTime: "~24 hours",
                  uuid: "1", // Replace with real mentor uuid if available
                }}
              />
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
                  ].map((interest: string, index: number) => (
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSearchQuery(e.target.value)
                        }
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
                  <ProposalCardPlaceholder />
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No papers found. Start by submitting your first paper!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc: FilteredDocument) => (
                      <HorizontalCardWithStarCount
                        key={doc.id}
                        doc={doc}
                        onDownloadPDF={() =>
                          window.open(
                            `/student/submissions/${doc.id}`,
                            "_blank"
                          )
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

// Component to display paper with star count in Recent Papers section
interface PaperWithStarCountProps {
  paper: Paper;
}

function PaperWithStarCount({ paper }: PaperWithStarCountProps) {
  const { data: starCount = 0, isLoading } = useGetStarCountQuery(paper.uuid);

  return (
    <div className="p-3 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">{paper.title}</h4>
        <div className="flex items-center gap-2">
          <Badge
            variant={paper.isApproved ? "approved" : "pending"}
            className="capitalize"
          >
            {paper.status}
          </Badge>
          {!isLoading && starCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <Star className="h-3 w-3 fill-yellow-500" />
              <span>{starCount}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Submitted: {new Date(paper.createdAt).toLocaleDateString()}</span>
        <span>{paper.categoryNames.join(", ")}</span>
      </div>
    </div>
  );
}

// Component to wrap HorizontalCard with star count
interface HorizontalCardWithStarCountProps {
  doc: FilteredDocument;
  onDownloadPDF: () => void;
}

function HorizontalCardWithStarCount({
  doc,
  onDownloadPDF,
}: HorizontalCardWithStarCountProps) {
  const { data: starCount = 0, isLoading } = useGetStarCountQuery(doc.id);

  return (
    <HorizontalCard
      key={doc.id}
      id={doc.id}
      title={doc.title}
      journal={doc.journal}
      year={doc.year}
      downloads={doc.downloads.toString()}
      abstract={doc.abstract || ""}
      tags={doc.tags}
      image={doc.image}
      star={isLoading ? "..." : starCount.toString()}
      onDownloadPDF={onDownloadPDF}
    />
  );
}
