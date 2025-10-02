'use client';

import { useState } from 'react';
import { 
  useGetAllUsersQuery, 
  useGetAllStudentsQuery, 
  useGetAllMentorsQuery,
  useGetPublicUsersQuery 
} from '@/feature/apiSlice/authApi';
import UserCard from '@/components/card/UserCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { User } from '@/types/authTypes';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Fetch different user types
  const { 
    data: allUsers, 
    isLoading: allUsersLoading, 
    error: allUsersError 
  } = useGetAllUsersQuery();

  const { 
    data: publicUsers, 
    isLoading: publicUsersLoading, 
    error: publicUsersError 
  } = useGetPublicUsersQuery();

  const { 
    data: students, 
    isLoading: studentsLoading, 
    error: studentsError 
  } = useGetAllStudentsQuery();

  const { 
    data: mentors, 
    isLoading: mentorsLoading, 
    error: mentorsError 
  } = useGetAllMentorsQuery();

  // Filter users based on search term
  const filterUsers = (users: User[] | undefined) => {
    if (!users) return [];
    if (!searchTerm) return users;
    
    return users.filter(user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleViewProfile = (user: User) => {
    // Navigate to user profile or open modal
    window.open(`/users/${user.uuid}`, '_blank');
  };

  const handleMessage = (user: User) => {
    // Handle messaging functionality
    console.log('Message user:', user.fullName);
    alert(`Messaging feature coming soon! User: ${user.fullName}`);
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Loading users...</span>
    </div>
  );

  const ErrorState = ({ error }: { error: unknown }) => (
    <div className="flex items-center justify-center py-8 text-red-500">
      <AlertCircle className="h-8 w-8 mr-2" />
      <span>Error loading users: {(error as Error)?.message || 'Unknown error'}</span>
    </div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center py-8 text-muted-foreground">
      <Users className="h-8 w-8 mr-2" />
      <span>{message}</span>
    </div>
  );

  const UserGrid = ({ users, loading, error }: { 
    users: User[] | undefined, 
    loading: boolean, 
    error: unknown 
  }) => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    
    const filteredUsers = filterUsers(users);
    
    if (filteredUsers.length === 0) {
      return <EmptyState message="No users found" />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.uuid}
            user={user}
            onViewProfile={handleViewProfile}
            onMessage={handleMessage}
          />
        ))}
      </div>
    );
  };

  // Get stats
  const getStats = () => ({
    total: allUsers?.length || 0,
    public: publicUsers?.length || 0,
    students: students?.length || 0,
    mentors: mentors?.length || 0,
  });

  const stats = getStats();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Community Directory</h1>
          <p className="text-muted-foreground">
            Connect with students, mentors, and fellow researchers in our academic community.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.public}</p>
                  <p className="text-xs text-muted-foreground">Public Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.students}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.mentors}</p>
                  <p className="text-xs text-muted-foreground">Mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <UserGrid 
              users={allUsers} 
              loading={allUsersLoading} 
              error={allUsersError} 
            />
          </TabsContent>

          <TabsContent value="public" className="space-y-6">
            <UserGrid 
              users={publicUsers} 
              loading={publicUsersLoading} 
              error={publicUsersError} 
            />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <UserGrid 
              users={students} 
              loading={studentsLoading} 
              error={studentsError} 
            />
          </TabsContent>

          <TabsContent value="mentors" className="space-y-6">
            <UserGrid 
              users={mentors} 
              loading={mentorsLoading} 
              error={mentorsError} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}