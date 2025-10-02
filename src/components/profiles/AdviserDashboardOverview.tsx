'use client';

import { useGetAdviserDetailByUuidQuery, useGetAdviserAssignmentsQuery } from '@/feature/apiSlice/adviserDetailApiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

interface AdviserDashboardOverviewProps {
  adviserUuid: string;
}

export default function AdviserDashboardOverview({ adviserUuid }: AdviserDashboardOverviewProps) {
  const { data: adviser } = useGetAdviserDetailByUuidQuery(adviserUuid);
  const { data: assignments } = useGetAdviserAssignmentsQuery({ page: 0, size: 100 });

  // Calculate statistics
  const totalAssignments = assignments?.content?.length || 0;
  const completedAssignments = assignments?.content?.filter(a => a.status.toLowerCase() === 'completed')?.length || 0;
  const pendingAssignments = assignments?.content?.filter(a => a.status.toLowerCase() === 'pending')?.length || 0;
  const inProgressAssignments = assignments?.content?.filter(a => a.status.toLowerCase() === 'in_progress')?.length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssignments}</div>
          <p className="text-xs text-muted-foreground">
            Students assigned to you
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingAssignments}</div>
          <p className="text-xs text-muted-foreground">
            Waiting for your review
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressAssignments}</div>
          <p className="text-xs text-muted-foreground">
            Currently being reviewed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedAssignments}</div>
          <p className="text-xs text-muted-foreground">
            Successfully completed
          </p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Profile Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {adviser?.name || 'Loading...'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {adviser?.specialization || 'Adviser'}
                  </p>
                </div>
                <Badge variant={adviser?.isAvailable ? 'default' : 'outline'}>
                  {adviser?.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}