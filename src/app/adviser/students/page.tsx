'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Progress } from '@/components/ui/progress';
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
  Search,
  MoreHorizontal,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Mock student data
const initialStudents = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    project: 'Machine Learning Applications in Healthcare Diagnostics',
    status: 'in-review',
    progress: 75,
    lastInteraction: '2 days ago',
    joinDate: '2024-01-15',
    submissions: 2,
  },
  {
    id: 2,
    name: 'Mike Rodriguez',
    email: 'mike.r@student.edu',
    project: 'Climate Change Impact on Agricultural Productivity',
    status: 'approved',
    progress: 100,
    lastInteraction: '1 week ago',
    joinDate: '2024-02-01',
    submissions: 1,
  },
  {
    id: 3,
    name: 'Emma Thompson',
    email: 'emma.t@student.edu',
    project: 'Economic Trends in Post-Pandemic Recovery',
    status: 'draft',
    progress: 45,
    lastInteraction: '3 days ago',
    joinDate: '2024-02-15',
    submissions: 0,
  },
  {
    id: 4,
    name: 'Alex Kim',
    email: 'alex.kim@student.edu',
    project: 'Quantum Computing Algorithms for Optimization',
    status: 'revision',
    progress: 60,
    lastInteraction: '1 day ago',
    joinDate: '2024-01-30',
    submissions: 3,
  },
];

export default function MentorStudentsPage() {
  const router = useRouter();
  const [studentList, setStudentList] = useState(initialStudents);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  const openProfile = (id: number) => {
    router.push(`/mentor/students/${id}`);
  };

  const openMessage = (id: number) => {
    setSelectedStudentId(id);
    setIsMessageOpen(true);
  };

  const sendMessage = () => {
    if (!selectedStudentId) return;
    // Here you would call your API to send a message
    // For now, just close dialog and clear input
    setIsMessageOpen(false);
    setMessageText('');
  };

  const updateStatus = (id: number, status: 'approved' | 'revision') => {
    setStudentList((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: status === 'approved' ? 'approved' : 'revision',
              lastInteraction: 'just now',
              progress: status === 'approved' ? 100 : s.progress,
            }
          : s
      )
    );
  };

  return (
    <DashboardLayout userRole="mentor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Assigned Students
          </h1>
          <p className="text-muted-foreground">
            Students assigned to you by Admin to track and mentor
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-10" />
            </div>
          </CardHeader>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
            <CardDescription>
              Monitor progress and provide guidance to your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Last Interaction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentList.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">
                          {student.project}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.submissions} submissions
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === 'approved'
                            ? 'default'
                            : student.status === 'in-review'
                            ? 'secondary'
                            : student.status === 'revision'
                            ? 'outline'
                            : 'secondary'
                        }
                        className="capitalize"
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.progress} className="w-16" />
                        <span className="text-sm text-muted-foreground">
                          {student.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {student.lastInteraction}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openProfile(student.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openMessage(student.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus(student.id, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Work
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus(student.id, 'revision')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Request Revision
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Send Message Dialog */}
        <div className={isMessageOpen ? '' : 'hidden'}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background border border-border rounded-lg w-full max-w-lg p-4 sm:p-6 shadow-lg">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Send Message</h2>
                <p className="text-sm text-muted-foreground">
                  To:{' '}
                  {studentList.find((s) => s.id === selectedStudentId)?.name}
                </p>
              </div>
              <div>
                <Input
                  value={messageText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMessageText(e.target.value)
                  }
                  placeholder="Type your message..."
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMessageOpen(false);
                    setMessageText('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={sendMessage} disabled={!messageText.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
