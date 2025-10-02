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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Clock,
  Award,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  TrendingUp,
  Star,
  Eye,
  Edit,
  Send,
  Plus,
  Download,
} from 'lucide-react';
import Link from 'next/link';

const mentorStats = {
  assignedStudents: 8,
  pendingReviews: 3,
  approvedPapers: 15,
  totalFeedback: 42,
  averageReviewTime: 2.5,
  studentSatisfaction: 4.8,
  totalProposals: 12,
  approvedProposals: 9,
};

const assignedStudents = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    project: 'Machine Learning in Healthcare',
    status: 'in-review',
    progress: 75,
    lastInteraction: '2 days ago',
    submissionDate: '2024-03-10',
    avatar: '/placeholder.svg?height=32&width=32',
    priority: 'high',
    nextDeadline: '2024-03-25',
  },
  {
    id: 2,
    name: 'Mike Rodriguez',
    email: 'mike.r@college.edu',
    project: 'Climate Change Analysis',
    status: 'approved',
    progress: 100,
    lastInteraction: '1 week ago',
    submissionDate: '2024-02-28',
    avatar: '/placeholder.svg?height=32&width=32',
    priority: 'low',
    nextDeadline: null,
  },
  {
    id: 3,
    name: 'Emma Thompson',
    email: 'emma.t@university.edu',
    project: 'Economic Recovery Patterns',
    status: 'draft',
    progress: 45,
    lastInteraction: '3 days ago',
    submissionDate: null,
    avatar: '/placeholder.svg?height=32&width=32',
    priority: 'medium',
    nextDeadline: '2024-04-01',
  },
];

const pendingReviews = [
  {
    id: 1,
    title: 'Quantum Computing Applications',
    author: 'Alex Kim',
    submittedDate: '2024-03-15',
    category: 'Physics',
    priority: 'high',
    fileSize: '2.1 MB',
    pages: 45,
    abstract:
      'This paper explores the practical applications of quantum computing in modern cryptography and data processing...',
    keywords: ['Quantum Computing', 'Cryptography', 'Data Processing'],
  },
  {
    id: 2,
    title: 'Social Media Impact Study',
    author: 'Lisa Wang',
    submittedDate: '2024-03-14',
    category: 'Psychology',
    priority: 'medium',
    fileSize: '1.8 MB',
    pages: 32,
    abstract:
      "An comprehensive analysis of social media's psychological impact on adolescents and young adults...",
    keywords: ['Social Media', 'Psychology', 'Mental Health'],
  },
  {
    id: 3,
    title: 'Renewable Energy Solutions',
    author: 'David Brown',
    submittedDate: '2024-03-12',
    category: 'Engineering',
    priority: 'low',
    fileSize: '3.2 MB',
    pages: 58,
    abstract:
      'Innovative approaches to renewable energy storage and distribution in urban environments...',
    keywords: ['Renewable Energy', 'Sustainability', 'Urban Planning'],
  },
];

const recentFeedback = [
  {
    student: 'Sarah Chen',
    paper: 'Machine Learning in Healthcare',
    feedback:
      'Excellent methodology section. Consider expanding the literature review.',
    date: '2024-03-18',
    rating: 4,
  },
  {
    student: 'Mike Rodriguez',
    paper: 'Climate Change Analysis',
    feedback:
      'Well-structured paper with comprehensive data analysis. Approved for publication.',
    date: '2024-03-15',
    rating: 5,
  },
  {
    student: 'Emma Thompson',
    paper: 'Economic Recovery Patterns',
    feedback:
      'Good start, but needs more statistical analysis. Please revise methodology.',
    date: '2024-03-12',
    rating: 3,
  },
];

const upcomingDeadlines = [
  {
    student: 'Sarah Chen',
    task: 'Final submission review',
    date: '2024-03-25',
    priority: 'high',
  },
  {
    student: 'Emma Thompson',
    task: 'Proposal approval',
    date: '2024-04-01',
    priority: 'medium',
  },
  {
    student: 'John Smith',
    task: 'Initial draft review',
    date: '2024-04-05',
    priority: 'low',
  },
];

export default function MentorOverviewPage() {
  return (
    <DashboardLayout
      userRole="mentor"
      userName="Dr. Sarah Johnson"
      userAvatar="/placeholder.svg?height=40&width=40"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Mentor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your students and review submissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/mentor/proposals">
              <FileText className="h-4 w-4 mr-2" />
              Review Proposals
            </Link>
          </Button>
          <Button asChild>
            <Link href="/mentor/students">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Link>
          </Button>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Assigned Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mentorStats.assignedStudents}
              </div>
              <p className="text-xs text-muted-foreground">
                Active mentorships
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Reviews
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mentorStats.pendingReviews}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-600">Urgent</span> attention needed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Papers
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mentorStats.approvedPapers}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Satisfaction Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mentorStats.studentSatisfaction}
              </div>
              <p className="text-xs text-muted-foreground">
                Student feedback score
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assigned Students */}
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Students</CardTitle>
                  <CardDescription>
                    Track your students&apos; progress and projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignedStudents.slice(0, 3).map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={student.avatar || '/placeholder.svg'}
                              alt={student.name}
                            />
                            <AvatarFallback>
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm">
                                {student.name}
                              </h4>
                              <Badge
                                variant={
                                  student.status === 'approved'
                                    ? 'default'
                                    : student.status === 'in-review'
                                    ? 'secondary'
                                    : 'outline'
                                }
                                className="text-xs"
                              >
                                {student.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {student.project}
                            </p>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={student.progress}
                                className="flex-1 h-1"
                              />
                              <span className="text-xs text-muted-foreground">
                                {student.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                    asChild
                  >
                    <Link href="/mentor/students">View All Students</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>
                    Important dates and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium text-sm">
                              {deadline.student}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {deadline.task}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              deadline.priority === 'high'
                                ? 'destructive'
                                : deadline.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {deadline.date}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Student Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>
                      Manage your assigned students and their projects
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        className="pl-8 w-64"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in-review">In Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={student.avatar || '/placeholder.svg'}
                              alt={student.name}
                            />
                            <AvatarFallback>
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            student.status === 'approved'
                              ? 'default'
                              : student.status === 'in-review'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {student.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Project:</span>
                          <span className="text-muted-foreground">
                            {student.project}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Progress:</span>
                          <span className="text-muted-foreground">
                            {student.progress}%
                          </span>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Last interaction:</span>
                          <span className="text-muted-foreground">
                            {student.lastInteraction}
                          </span>
                        </div>
                        {student.nextDeadline && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Next deadline:</span>
                            <span className="text-muted-foreground">
                              {student.nextDeadline}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Work
                        </Button>
                        <Button size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Provide Feedback
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {/* Review System */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>
                  Papers awaiting your detailed review and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pendingReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{review.title}</h4>
                        <Badge
                          variant={
                            review.priority === 'high'
                              ? 'destructive'
                              : review.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {review.priority} priority
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div>
                          <span className="font-medium">Author:</span>{' '}
                          {review.author}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>{' '}
                          {review.category}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span>{' '}
                          {review.submittedDate}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span>{' '}
                          {review.fileSize} • {review.pages} pages
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Abstract:</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {review.abstract}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {review.keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            {/* Feedback Management */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>
                  Your recent reviews and feedback provided to students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFeedback.map((feedback, index) => (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{feedback.student}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {feedback.paper}
                      </p>
                      <p className="text-sm mb-2">{feedback.feedback}</p>
                      <p className="text-xs text-muted-foreground">
                        {feedback.date}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle>Provide Quick Feedback</CardTitle>
                <CardDescription>
                  Send feedback to a student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedStudents.map((student) => (
                      <SelectItem
                        key={student.id}
                        value={student.id.toString()}
                      >
                        {student.name} - {student.project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Enter your feedback..."
                  className="min-h-24"
                />
                <div className="flex gap-2">
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Feedback
                  </Button>
                  <Button variant="outline">Save Draft</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Review Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mentorStats.averageReviewTime} days
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">-0.5</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Proposals
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mentorStats.totalProposals}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      {mentorStats.approvedProposals}
                    </span>{' '}
                    approved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Success Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">75%</div>
                  <p className="text-xs text-muted-foreground">
                    Student approval rate
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Your mentoring performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Student Satisfaction
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {mentorStats.studentSatisfaction}/5.0
                    </span>
                  </div>
                  <Progress
                    value={mentorStats.studentSatisfaction * 20}
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-muted-foreground">
                      Excellent
                    </span>
                  </div>
                  <Progress value={90} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Feedback Quality
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Outstanding
                    </span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
