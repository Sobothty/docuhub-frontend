'use client';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Upload,
  MoreHorizontal,
  Eye,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

// Mock submission data
const submissions = [
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

export default function StudentSubmissionsPage() {
  // Keeping dialog handlers in case we reintroduce modal view later
  // const openDetails = (submission: (typeof submissions)[number]) => {
  //   setSelected(submission);
  //   setIsDetailsOpen(true);
  // };

  const handleDownload = (submission: (typeof submissions)[number]) => {
    // Mock download: create a text file with basic submission info
    const content = `Title: ${submission.title}\nCategory: ${submission.category}\nMentor: ${submission.mentor}\nAbstract: ${submission.abstract}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submission.title
      .replace(/[^a-z0-9\-\s]/gi, '')
      .replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Submissions
            </h1>
            <p className="text-muted-foreground">
              Manage your paper submissions and track their progress
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Paper
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload New Paper</DialogTitle>
                <DialogDescription>
                  Submit your paper for mentor review and approval
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Paper Title</Label>
                  <Input id="title" placeholder="Enter your paper title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Computer Science, Biology, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea
                    id="abstract"
                    placeholder="Brief summary of your paper"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Paper File</Label>
                  <Input id="file" type="file" accept=".pdf,.doc,.docx" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Save as Draft</Button>
                <Button>Submit for Review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your submissions..."
                className="pl-10"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              Track the status and progress of your submitted papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto max-w-md space-y-2">
                  <h3 className="text-lg font-semibold">No submissions yet</h3>
                  <p className="text-muted-foreground">
                    Upload your first paper to get started.
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">
                            <Link
                              href={`/student/submissions/${submission.id}`}
                              className="hover:underline"
                            >
                              {submission.title}
                            </Link>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {submission.abstract}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            submission.status === 'approved'
                              ? 'default'
                              : submission.status === 'rejected'
                              ? 'destructive'
                              : submission.status === 'revision'
                              ? 'outline'
                              : 'secondary'
                          }
                          className="capitalize"
                        >
                          {submission.status === 'pending' && (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {submission.status === 'approved' && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {submission.status === 'rejected' && (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {submission.status === 'revision' && (
                            <Edit className="h-3 w-3 mr-1" />
                          )}
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{submission.category}</TableCell>
                      <TableCell>{submission.mentor}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {submission.submittedDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/student/submissions/${submission.id}`}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDownload(submission)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            {submission.status === 'revision' && (
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit & Resubmit
                              </DropdownMenuItem>
                            )}
                            {submission.status === 'rejected' && (
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
