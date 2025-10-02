'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';
import type { Notification } from '@/components/contexts/notification-context';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onRemove: (id: number) => void;
  getIcon: (type: string) => React.ReactNode;
  getPriorityColor: (priority: string) => string;
  formatTimestamp: (timestamp: string) => string;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onRemove,
  getIcon,
  getPriorityColor,
  formatTimestamp,
}: NotificationItemProps) {
  return (
    <div
      className={`p-3 sm:p-4 hover:bg-muted/60 transition-colors duration-200 border-l-4 ${getPriorityColor(
        notification.priority
      )} ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-950/10' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm sm:text-base text-foreground line-clamp-1">
              {notification.title}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(notification.id)}
              className="h-6 w-6 p-0 hover:bg-primary/20 text-foreground flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between mt-2 sm:mt-3">
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              {formatTimestamp(notification.timestamp)}
            </span>
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs sm:text-sm h-7 px-2 sm:px-3 hover:bg-primary/20 text-foreground"
              >
                Mark as read
              </Button>
            )}
          </div>

          {notification.actionButton && (
            <div className="mt-3">
              {notification.actionButton.href ? (
                <Button
                  size="sm"
                  className="w-full bg-secondary text-gray-50 hover:bg-secondary/90 text-xs sm:text-sm"
                  asChild
                >
                  <Link href={notification.actionButton.href}>
                    {notification.actionButton.label}
                  </Link>
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={notification.actionButton.action}
                  className="w-full bg-primary text-text-white hover:bg-primary/90 text-xs sm:text-sm"
                >
                  {notification.actionButton.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
