'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  FileText,
  CheckCircle,
  MessageSquare,
  Search,
  Filter,
  Plus,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import HorizontalCard from '@/components/card/HorizontalCard';
import { useState } from 'react';

// Updated savedDocuments to match HorizontalCardProps
const savedDocuments = [
  {
    id: 'ml-healthcare-2024', // change id to string for compatibility
    title: 'Machine Learning Applications in Healthcare',
    status: 'approved',
    savedDate: '2024-08-15',
    feedback: 'Excellent work with comprehensive analysis',
    progress: 100,
    fileSize: '2.4 MB',
    downloads: 45,
    citations: 8,
    isWishlist: false,
    authors: ['Sarah Chen', 'John Doe'],
    journal: 'Journal of Medical AI',
    year: '2024',
    abstract:
      'This paper explores the applications of machine learning in healthcare, focusing on diagnostic tools and predictive analytics.',
    tags: ['Machine Learning', 'Healthcare', 'AI'],
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 'climate-impact-2024', // change id to string for compatibility
    title: 'Climate Change Impact Analysis',
    status: 'pending',
    savedDate: '2024-08-20',
    feedback: 'Under review by mentor',
    progress: 75,
    fileSize: '1.8 MB',
    downloads: 12,
    citations: 2,
    isWishlist: true,
    authors: ['Emma Thompson'],
    journal: 'Environmental Science Review',
    year: '2024',
    abstract:
      'An analysis of climate change impacts on coastal ecosystems, with a focus on adaptation strategies.',
    tags: ['Climate Change', 'Environment', 'Sustainability'],
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 'economic-recovery-2024', // change id to string for compatibility
    title: 'Economic Recovery Patterns',
    status: 'revision',
    savedDate: '2024-08-18',
    feedback: 'Please address the methodology section',
    progress: 60,
    fileSize: '3.1 MB',
    downloads: 8,
    citations: 1,
    isWishlist: false,
    authors: ['Alex Kim'],
    journal: 'Economic Studies Quarterly',
    year: '2024',
    abstract:
      'This study examines patterns of economic recovery post-recession, with emphasis on regional differences.',
    tags: ['Economics', 'Recovery', 'Policy'],
    image: '/placeholder.svg?height=200&width=300',
  },
];

export default function StudentOverviewPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter documents based on search query
  const filteredDocuments = savedDocuments.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      userRole="student"
      userName="Sarah Chen"
      userAvatar="/placeholder.svg?height=40&width=40"
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
              <CardTitle className="text-sm font-medium">
                Saved Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedDocuments.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+1</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Wishlist Items
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {savedDocuments.filter((doc) => doc.isWishlist).length}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">25%</span> of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Downloads
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {savedDocuments.reduce((sum, doc) => sum + doc.downloads, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+10</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citations</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {savedDocuments.reduce((sum, doc) => sum + doc.citations, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Academic impact</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Saved/Wishlist Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Saved & Wishlist Documents</CardTitle>
                  <CardDescription>
                    Your saved papers and wishlist items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedDocuments.slice(0, 3).map((doc) => (
                      <div key={doc.id} className="p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{doc.title}</h4>
                          <Badge
                            variant={doc.isWishlist ? 'secondary' : 'default'}
                            className="capitalize"
                          >
                            {doc.isWishlist ? 'Wishlist' : 'Saved'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Progress value={doc.progress} className="flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {doc.progress}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{doc.feedback}</span>
                          <span>{doc.fileSize}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Saved: {doc.savedDate}</span>
                          <span>
                            {doc.downloads} downloads • {doc.citations}{' '}
                            citations
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                    asChild
                  >
                    <Link href="/student/saved">View All Saved Documents</Link>
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
                    'Machine Learning',
                    'Healthcare Technology',
                    'Data Analysis',
                    'Computer Vision',
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
                    <CardTitle>Saved & Wishlist Documents</CardTitle>
                    <CardDescription>
                      Manage your saved academic papers and wishlist items
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search saved documents..."
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
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <HorizontalCard
                      key={doc.id}
                      id={doc.id} // use id prop instead of paperId
                      title={doc.title}
                      authors={doc.authors}
                      authorImage="/placeholder.svg?height=24&width=24"
                      journal={doc.journal}
                      year={doc.year}
                      citations={`${doc.citations}`}
                      abstract={doc.abstract}
                      tags={doc.tags}
                      image={doc.image}
                      isBookmarked={doc.isWishlist}
                      onDownloadPDF={() =>
                        console.log(`Download PDF for ${doc.title}`)
                      }
                      onToggleBookmark={() =>
                        console.log(`Toggle bookmark for ${doc.title}`)
                      }
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
