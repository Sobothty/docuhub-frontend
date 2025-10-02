'use client';

import { use } from 'react';
import { useGetUserByIdQuery } from '@/feature/apiSlice/authApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin,
  MessageSquare,
  User as UserIcon, 
  GraduationCap, 
  Shield, 
  BookOpen,
  ArrowLeft,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import Loading from '@/app/Loading';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params);
  
  const { data: user, isLoading, error } = useGetUserByIdQuery(id);

  if (isLoading) return <Loading />;

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-500 text-center text-lg">Failed to load user profile</p>
          <Link href="/users">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = () => {
    if (user.isAdmin) return <Shield className="h-5 w-5" />;
    if (user.isAdvisor) return <BookOpen className="h-5 w-5" />;
    if (user.isStudent) return <GraduationCap className="h-5 w-5" />;
    return <UserIcon className="h-5 w-5" />;
  };

  const getRoleBadge = () => {
    if (user.isAdmin) return <Badge variant="destructive">Admin</Badge>;
    if (user.isAdvisor) return <Badge variant="secondary">Mentor</Badge>;
    if (user.isStudent) return <Badge variant="outline">Student</Badge>;
    if (user.isUser) return <Badge variant="default">User</Badge>;
    return <Badge variant="secondary">Member</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleDescription = () => {
    if (user.isAdmin) return "Platform Administrator with full system access";
    if (user.isAdvisor) return "Academic mentor guiding students in their research journey";
    if (user.isStudent) return "Student researcher working on academic projects";
    return "Community member";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/users" className="hover:text-foreground flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
          <span>/</span>
          <span className="text-foreground">{user.fullName}</span>
        </div>

        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={user.imageUrl || '/placeholder-avatar.png'} 
                  alt={user.fullName} 
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  {getRoleIcon()}
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>@{user.userName}</span>
                  <span>•</span>
                  {getRoleBadge()}
                </div>
                
                <p className="text-muted-foreground">
                  {getRoleDescription()}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Globe className="h-4 w-4" />
                  View Public Profile
                </Button>
              </div>
            </div>
          </CardHeader>

          {user.bio && (
            <CardContent className="pt-0">
              <Separator className="mb-4" />
              <p className="text-muted-foreground leading-relaxed">
                {user.bio}
              </p>
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                {user.contactNumber && user.contactNumber !== 'null' && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{user.contactNumber}</p>
                    </div>
                  </div>
                )}
                
                {user.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">{user.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity & Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Papers Published</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Collaborations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Member Since</p>
                  <p className="text-sm">{formatDate(user.createDate)}</p>
                </div>
                
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{formatDate(user.updateDate)}</p>
                </div>
                
                {user.gender && (
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Gender</p>
                    <p className="text-sm">{user.gender}</p>
                  </div>
                )}
                
                {user.telegramId && (
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Telegram</p>
                    <p className="text-sm">@{user.telegramId}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Access</span>
                  <Badge variant={user.isUser ? "default" : "secondary"}>
                    {user.isUser ? "Granted" : "Not Granted"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Admin Access</span>
                  <Badge variant={user.isAdmin ? "destructive" : "secondary"}>
                    {user.isAdmin ? "Granted" : "Not Granted"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Student Status</span>
                  <Badge variant={user.isStudent ? "outline" : "secondary"}>
                    {user.isStudent ? "Active" : "Not Active"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mentor Status</span>
                  <Badge variant={user.isAdvisor ? "secondary" : "outline"}>
                    {user.isAdvisor ? "Active" : "Not Active"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
