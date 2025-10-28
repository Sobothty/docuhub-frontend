/**
 * Notification Utilities
 *
 * Helper functions for working with notifications
 */

import { Message } from "@/types/message";

export type NotificationType =
  | "document_approved"
  | "document_rejected"
  | "new_assignment"
  | "feedback_received"
  | "mentorship_request"
  | "system_message"
  | "general";

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  icon?: string;
  color?: string;
}

export const notificationTemplates: Record<
  NotificationType,
  NotificationTemplate
> = {
  document_approved: {
    type: "document_approved",
    title: "Document Approved",
    icon: "✅",
    color: "text-green-600",
  },
  document_rejected: {
    type: "document_rejected",
    title: "Document Rejected",
    icon: "❌",
    color: "text-red-600",
  },
  new_assignment: {
    type: "new_assignment",
    title: "New Assignment",
    icon: "📋",
    color: "text-blue-600",
  },
  feedback_received: {
    type: "feedback_received",
    title: "Feedback Received",
    icon: "💬",
    color: "text-purple-600",
  },
  mentorship_request: {
    type: "mentorship_request",
    title: "Mentorship Request",
    icon: "🤝",
    color: "text-orange-600",
  },
  system_message: {
    type: "system_message",
    title: "System Message",
    icon: "⚙️",
    color: "text-gray-600",
  },
  general: {
    type: "general",
    title: "Notification",
    icon: "🔔",
    color: "text-blue-600",
  },
};

/**
 * Filter notifications by read status
 */
export function filterUnreadNotifications(notifications: Message[]): Message[] {
  return notifications.filter((n) => !n.isRead);
}

/**
 * Group notifications by date
 */
export function groupNotificationsByDate(
  notifications: Message[]
): Record<string, Message[]> {
  const groups: Record<string, Message[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.timestamp);

    if (notifDate >= today) {
      groups.today.push(notification);
    } else if (notifDate >= yesterday) {
      groups.yesterday.push(notification);
    } else if (notifDate >= thisWeek) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
}

/**
 * Sort notifications by timestamp (newest first)
 */
export function sortNotificationsByDate(notifications: Message[]): Message[] {
  return [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Get notification type from message content
 */
export function getNotificationType(message: string): NotificationType {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("approved")) return "document_approved";
  if (lowerMessage.includes("rejected")) return "document_rejected";
  if (lowerMessage.includes("assignment")) return "new_assignment";
  if (lowerMessage.includes("feedback")) return "feedback_received";
  if (lowerMessage.includes("mentorship") || lowerMessage.includes("mentor")) {
    return "mentorship_request";
  }
  if (lowerMessage.includes("system")) return "system_message";

  return "general";
}

/**
 * Format notification for display
 */
export function formatNotification(notification: Message) {
  const type = getNotificationType(notification.message);
  const template = notificationTemplates[type];

  return {
    ...notification,
    type,
    title: template.title,
    icon: template.icon,
    color: template.color,
  };
}

/**
 * Check if notification is recent (within last hour)
 */
export function isRecentNotification(notification: Message): boolean {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  return new Date(notification.timestamp).getTime() > oneHourAgo;
}

/**
 * Get notification summary text
 */
export function getNotificationSummary(count: number): string {
  if (count === 0) return "No new notifications";
  if (count === 1) return "1 new notification";
  return `${count} new notifications`;
}
