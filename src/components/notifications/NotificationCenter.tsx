"use client";

import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: number | null;
  senderUuid: string;
  receiverUuid: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export function NotificationCenter() {
  const { allChats, isConnected } = useWebSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Flatten all messages from all chats into notifications
    const allNotifications = Object.values(allChats)
      .flat()
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    setNotifications(allNotifications);
    setUnreadCount(allNotifications.filter((n) => !n.isRead).length);
  }, [allChats]);

  const markAsRead = async (notificationId: number) => {
    // Update locally
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );

    // TODO: Call API to mark as read in database
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    // Update locally
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    // TODO: Call API to mark all as read
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const clearNotification = (notificationId: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell
            className={`h-5 w-5 ${
              isConnected ? "text-foreground" : "text-gray-400"
            }`}
          />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-4 cursor-pointer ${
                  !notification.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""
                }`}
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {!notification.isRead && notification.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => markAsRead(notification.id!)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      notification.id && clearNotification(notification.id)
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {!notification.isRead && (
                  <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm" size="sm">
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
