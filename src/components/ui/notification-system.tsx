'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  Bell,
  Clock,
  FileText,
  Users,
  Settings,
} from 'lucide-react';
import { useNotifications } from '@/components/contexts/notification-context';
import { NotificationItem } from './notification-item';

export function NotificationSystem() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByCategory,
  } = useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'proposal_approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'proposal_rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'mentor_assigned':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'document_submitted':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'feedback_received':
        return <Bell className="w-5 h-5 text-orange-500" />;
      case 'review_completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'deadline_reminder':
        return <Clock className="w-5 h-5 text-red-500" />;
      case 'system_alert':
        return <Settings className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50/20 dark:bg-red-950/10';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50/20 dark:bg-yellow-950/10';
      case 'low':
        return 'border-l-blue-500 bg-blue-50/20 dark:bg-blue-950/10';
      default:
        return 'border-l-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const academicNotifications = getNotificationsByCategory('academic');
  const deadlineNotifications = getNotificationsByCategory('deadline');
  const systemNotifications = getNotificationsByCategory('system');

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 hover:bg-accent/20 rounded-full text-accent"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-text-buttons text-accent"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown */}
      {showNotifications && (
        <div className="absolute -left-50 top-full mt-2 w-[95vw] sm:w-[28rem] md:w-[32rem] lg:w-[36rem] max-h-[75vh] bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-border flex items-center justify-between bg-card/80">
            <h3 className="font-semibold text-sm sm:text-base text-foreground">
              Notifications
            </h3>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-7 px-2 hover:bg-primary/10 text-foreground"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs h-7 px-2 hover:bg-primary/10 text-foreground"
                disabled={notifications.length === 0}
              >
                Clear all
              </Button>
            </div>
          </div>

          {/* Content */}
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 mx-2 sm:mx-3 mt-3 mb-2 h-8 gap-1">
                <TabsTrigger
                  value="all"
                  className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-text-white"
                >
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger
                  value="academic"
                  className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-text-white"
                >
                  Academic ({academicNotifications.length})
                </TabsTrigger>
                <TabsTrigger
                  value="deadlines"
                  className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-text-white"
                >
                  Deadlines ({deadlineNotifications.length})
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-text-white"
                >
                  System ({systemNotifications.length})
                </TabsTrigger>
              </TabsList>

              <div className="max-h-[60vh] overflow-y-auto px-1 sm:px-2">
                <TabsContent value="all" className="mt-0">
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkAsRead={markAsRead}
                      onRemove={removeNotification}
                      getIcon={getNotificationIcon}
                      getPriorityColor={getPriorityColor}
                      formatTimestamp={formatTimestamp}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="academic" className="mt-0">
                  {academicNotifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkAsRead={markAsRead}
                      onRemove={removeNotification}
                      getIcon={getNotificationIcon}
                      getPriorityColor={getPriorityColor}
                      formatTimestamp={formatTimestamp}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="deadlines" className="mt-0">
                  {deadlineNotifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkAsRead={markAsRead}
                      onRemove={removeNotification}
                      getIcon={getNotificationIcon}
                      getPriorityColor={getPriorityColor}
                      formatTimestamp={formatTimestamp}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="system" className="mt-0">
                  {systemNotifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkAsRead={markAsRead}
                      onRemove={removeNotification}
                      getIcon={getNotificationIcon}
                      getPriorityColor={getPriorityColor}
                      formatTimestamp={formatTimestamp}
                    />
                  ))}
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
}
