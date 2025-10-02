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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CheckCircle,
  MessageSquare,
  Edit,
  XCircle,
  Eye,
  Download,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock feedback data
const feedbackTimeline = [
  {
    id: 1,
    type: 'approval',
    paper: 'Machine Learning Applications in Healthcare Diagnostics',
    mentor: 'Dr. Sarah Johnson',
    mentorAvatar: '/placeholder.svg?height=40&width=40',
    date: '2024-03-12',
    time: '2:30 PM',
    message:
      'Excellent work! Your methodology is sound and the results are well-presented. Approved for publication.',
    status: 'approved',
    hasAnnotations: true,
    annotatedPdfUrl:
      'http://localhost:9000/docuhub/06a558b2-eb2b-4f4f-8ffd-2ccc4a8ca9e5_html_tutorial.pdf',
  },
  {
    id: 2,
    type: 'comment',
    paper: 'Climate Change Impact on Agricultural Productivity',
    mentor: 'Dr. Sarah Johnson',
    mentorAvatar: '/placeholder.svg?height=40&width=40',
    date: '2024-03-15',
    time: '10:15 AM',
    message:
      'Good progress on this paper. Please consider adding more recent data from 2023-2024 to strengthen your analysis.',
    status: 'pending',
  },
  {
    id: 3,
    type: 'revision',
    paper: 'Economic Recovery Patterns Post-Pandemic',
    mentor: 'Dr. Sarah Johnson',
    mentorAvatar: '/placeholder.svg?height=40&width=40',
    date: '2024-03-14',
    time: '4:45 PM',
    message:
      "The paper shows promise but needs revision. Please address the methodology section and provide more detailed statistical analysis. I've attached specific comments in the document.",
    status: 'revision',
    hasAnnotations: true,
    annotatedPdfUrl:
      'http://localhost:9000/docuhub/06a558b2-eb2b-4f4f-8ffd-2ccc4a8ca9e5_html_tutorial.pdf',
  },
  {
    id: 4,
    type: 'comment',
    paper: 'Economic Recovery Patterns Post-Pandemic',
    mentor: 'Dr. Sarah Johnson',
    mentorAvatar: '/placeholder.svg?height=40&width=40',
    date: '2024-03-08',
    time: '11:20 AM',
    message:
      'Initial review looks good. The topic is relevant and your introduction is well-written. Looking forward to seeing the complete analysis.',
    status: 'in-review',
  },
  {
    id: 5,
    type: 'rejection',
    paper: 'Social Media Impact on Mental Health',
    mentor: 'Dr. Sarah Johnson',
    mentorAvatar: '/placeholder.svg?height=40&width=40',
    date: '2024-03-05',
    time: '3:15 PM',
    message:
      'Unfortunately, this paper needs significant work before it can be approved. The literature review is incomplete and the methodology has several issues. Please consider reworking the entire approach.',
    status: 'rejected',
    hasAnnotations: true,
    annotatedPdfUrl:
      'http://localhost:9000/docuhub/06a558b2-eb2b-4f4f-8ffd-2ccc4a8ca9e5_html_tutorial.pdf',
  },
];

const feedbackStats = {
  totalFeedback: 15,
  approvals: 2,
  revisionRequests: 3,
  rejections: 1,
};

export default function StudentFeedbackPage() {
  const router = useRouter();
  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Feedback Timeline
          </h1>
          <p className="text-muted-foreground">
            Track all mentor feedback and comments on your submissions
          </p>
        </div>

        {/* Feedback Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Feedback
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbackStats.totalFeedback}
              </div>
              <p className="text-xs text-muted-foreground">Comments received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approvals</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbackStats.approvals}
              </div>
              <p className="text-xs text-muted-foreground">Papers approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revisions</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbackStats.revisionRequests}
              </div>
              <p className="text-xs text-muted-foreground">Revision requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejections</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbackStats.rejections}
              </div>
              <p className="text-xs text-muted-foreground">Papers rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback History</CardTitle>
            <CardDescription>
              Chronological timeline of all mentor feedback and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {feedbackTimeline.map((feedback, index) => (
                <div key={feedback.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={feedback.mentorAvatar || '/placeholder.svg'}
                        alt={feedback.mentor}
                      />
                      <AvatarFallback>
                        {feedback.mentor
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    {index < feedbackTimeline.length - 1 && (
                      <div className="w-px h-16 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{feedback.mentor}</h4>
                      <Badge
                        variant={
                          feedback.type === 'approval'
                            ? 'default'
                            : feedback.type === 'rejection'
                            ? 'destructive'
                            : feedback.type === 'revision'
                            ? 'outline'
                            : 'secondary'
                        }
                        className="capitalize"
                      >
                        {feedback.type === 'approval' && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {feedback.type === 'rejection' && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {feedback.type === 'revision' && (
                          <Edit className="h-3 w-3 mr-1" />
                        )}
                        {feedback.type === 'comment' && (
                          <MessageSquare className="h-3 w-3 mr-1" />
                        )}
                        {feedback.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {feedback.date} at {feedback.time}
                      </span>
                    </div>
                    <h5 className="font-medium text-sm mb-2">
                      {feedback.paper}
                    </h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feedback.message}
                    </p>

                    {/* Action Buttons */}
                    {feedback.hasAnnotations && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() =>
                            router.push(`/student/feedback/${feedback.id}`)
                          }
                        >
                          <Eye className="h-3 w-3" />
                          View Annotated PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download Feedback
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
