'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Download,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  FileText,
} from 'lucide-react';

type Submission = {
  id: number;
  title: string;
  status: 'approved' | 'pending' | 'revision' | 'rejected';
  submittedDate: string;
  lastUpdated: string;
  mentor: string;
  category: string;
  abstract: string;
};

type BadgeVariant = 'default' | 'destructive' | 'outline' | 'secondary';

// Define demoSubmissions array
const demoSubmissions: Submission[] = [
  {
    id: 1,
    title: 'Machine Learning Applications in Healthcare Diagnostics',
    status: 'approved',
    submittedDate: '2024-03-10',
    lastUpdated: '2024-03-12',
    mentor: 'Dr. Sarah Johnson',
    category: 'Computer Science',
    abstract:
      'This paper explores the application of machine learning algorithms in medical diagnostics...',
  },
  {
    id: 2,
    title: 'Climate Change Impact on Agricultural Productivity',
    status: 'pending',
    submittedDate: '2024-03-15',
    lastUpdated: '2024-03-15',
    mentor: 'Dr. Sarah Johnson',
    category: 'Environmental Science',
    abstract:
      'An analysis of how climate change affects crop yields and farming practices...',
  },
  {
    id: 3,
    title: 'Economic Recovery Patterns Post-Pandemic',
    status: 'revision',
    submittedDate: '2024-03-08',
    lastUpdated: '2024-03-14',
    mentor: 'Dr. Sarah Johnson',
    category: 'Economics',
    abstract:
      'This study examines economic recovery patterns following the global pandemic...',
  },
  {
    id: 4,
    title: 'Social Media Impact on Mental Health',
    status: 'rejected',
    submittedDate: '2024-02-28',
    lastUpdated: '2024-03-05',
    mentor: 'Dr. Sarah Johnson',
    category: 'Psychology',
    abstract:
      'Research into the correlation between social media usage and mental health outcomes...',
  },
];

function StatusBadge({ status }: { status: Submission['status'] }) {
  const icon =
    status === 'approved' ? (
      <CheckCircle className="h-3 w-3 mr-1" />
    ) : status === 'rejected' ? (
      <XCircle className="h-3 w-3 mr-1" />
    ) : status === 'revision' ? (
      <Edit className="h-3 w-3 mr-1" />
    ) : (
      <Clock className="h-3 w-3 mr-1" />
    );

  const variant: BadgeVariant =
    status === 'approved'
      ? 'default'
      : status === 'rejected'
      ? 'destructive'
      : status === 'revision'
      ? 'outline'
      : 'secondary';

  return (
    <Badge variant={variant} className="capitalize">
      {icon}
      {status}
    </Badge>
  );
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();

  const submission = useMemo(() => {
    const id = Number(params?.id);
    return demoSubmissions.find((s) => s.id === id) || null;
  }, [params?.id]);

  if (!submission) {
    return (
      <DashboardLayout userRole="student">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/student/submissions')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to submissions
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Submission not found</CardTitle>
              <CardDescription>
                We couldn&apos;t find that document. It may have been moved or
                deleted.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 sm:p-6 border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {submission.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <StatusBadge status={submission.status} />
                <Separator orientation="vertical" className="h-4" />
                <span>
                  Category:{' '}
                  <span className="font-medium text-foreground">
                    {submission.category}
                  </span>
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span>Submitted: {submission.submittedDate}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Updated: {submission.lastUpdated}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/student/submissions')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  A quick look at your document details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="about">
                  <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold">Abstract</h3>
                      <p className="text-sm text-muted-foreground leading-6">
                        {submission.abstract}
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-border p-4">
                        <div className="text-xs text-muted-foreground">
                          Mentor
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {submission.mentor
                                .split(' ')
                                .map((n: string) => n[0]) // Type n as string
                                .join('')
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm font-medium">
                            {submission.mentor}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-border p-4">
                        <div className="text-xs text-muted-foreground">
                          Status
                        </div>
                        <div className="mt-1">
                          <StatusBadge status={submission.status} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="files" className="space-y-3">
                    <div className="rounded-lg border border-border p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <div>
                          <div className="text-sm font-medium">
                            Main Document.pdf
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Uploaded {submission.submittedDate}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="feedback" className="space-y-3">
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm text-muted-foreground">
                        No mentor feedback yet.
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Recent updates and comments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">You</span> submitted this
                        document
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {submission.submittedDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm">Document last updated</div>
                      <div className="text-xs text-muted-foreground">
                        {submission.lastUpdated}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Info</CardTitle>
                <CardDescription>Key details at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="text-sm font-medium">
                    {submission.category}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Mentor</div>
                  <div className="text-sm font-medium">{submission.mentor}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Submitted</div>
                  <div className="text-sm font-medium">
                    {submission.submittedDate}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Last updated
                  </div>
                  <div className="text-sm font-medium">
                    {submission.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/student/submissions')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to list
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
