'use client';

import { User } from '@/types/authTypes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Phone, 
  Calendar, 
  User as UserIcon, 
  GraduationCap, 
  Shield, 
  BookOpen 
} from 'lucide-react';
import Link from 'next/link';

interface UserCardProps {
  user: User;
  showActions?: boolean;
  onViewProfile?: (user: User) => void;
  onMessage?: (user: User) => void;
}

export default function UserCard({ 
  user, 
  showActions = true, 
  onViewProfile, 
  onMessage 
}: UserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = () => {
    if (user.isAdmin) return <Shield className="h-4 w-4" />;
    if (user.isAdvisor) return <BookOpen className="h-4 w-4" />;
    if (user.isStudent) return <GraduationCap className="h-4 w-4" />;
    return <UserIcon className="h-4 w-4" />;
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
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start space-y-0 space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage 
            src={user.imageUrl || '/placeholder-avatar.png'} 
            alt={user.fullName} 
          />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(user.fullName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg truncate">
              {user.fullName}
            </h3>
            {getRoleIcon()}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-muted-foreground">@{user.userName}</p>
            {getRoleBadge()}
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span className="truncate">{user.email}</span>
            </div>
            
            {user.contactNumber && user.contactNumber !== 'null' && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{user.contactNumber}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Joined {formatDate(user.createDate)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {user.bio && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {user.bio}
          </p>
        </CardContent>
      )}

      {showActions && (
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onViewProfile?.(user)}
              asChild={!onViewProfile}
            >
              {onViewProfile ? (
                'View Profile'
              ) : (
                <Link href={`/users/${user.uuid}`}>View Profile</Link>
              )}
            </Button>
            
            {onMessage && (
              <Button 
                size="sm" 
                variant="secondary" 
                className="flex-1"
                onClick={() => onMessage(user)}
              >
                Message
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}