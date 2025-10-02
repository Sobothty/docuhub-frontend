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
import { Bell, UserPlus, FileText, CheckCircle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'assignment',
    title: 'New student assigned',
    message: 'Admin assigned John Smith to you for mentorship.',
    time: '2h ago',
    icon: UserPlus,
  },
  {
    id: 2,
    type: 'submission',
    title: 'Document submitted',
    message: 'Sarah Chen submitted a new document for review.',
    time: '1d ago',
    icon: FileText,
  },
  {
    id: 3,
    type: 'status',
    title: 'Document approved',
    message:
      'Your feedback was applied and the document was approved by Admin.',
    time: '3d ago',
    icon: CheckCircle,
  },
];

export default function MentorNotificationsPage() {
  return (
    <DashboardLayout userRole="mentor">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent</CardTitle>
            <CardDescription>
              Updates related to your advising activity
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-4">
                <n.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{n.title}</div>
                    <Badge variant="secondary">{n.time}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {n.message}
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Mark read
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
