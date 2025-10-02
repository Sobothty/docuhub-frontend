"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface Notification {
  id: number
  type:
    | "proposal_approved"
    | "proposal_rejected"
    | "mentor_assigned"
    | "document_submitted"
    | "feedback_received"
    | "review_completed"
    | "deadline_reminder"
    | "system_alert"
  title: string
  message: string
  timestamp: string
  read: boolean
  userId?: string
  userRole?: "admin" | "mentor" | "student" | "public"
  actionButton?: {
    label: string
    href?: string
    action?: () => void
  }
  priority: "low" | "medium" | "high"
  category: "academic" | "system" | "social" | "deadline"
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  removeNotification: (id: number) => void
  clearAllNotifications: () => void
  getNotificationsByRole: (role: string) => Notification[]
  getNotificationsByCategory: (category: string) => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "proposal_approved",
    title: "Proposal Approved!",
    message:
      'Your proposal "Machine Learning Applications in Healthcare" has been approved by Dr. Sarah Chen. You can now submit your document.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    userId: "student1",
    userRole: "student",
    priority: "high",
    category: "academic",
    actionButton: {
      label: "Submit Document",
      href: "/student/submissions",
    },
  },
  {
    id: 2,
    type: "mentor_assigned",
    title: "New Student Assigned",
    message: "John Smith has been assigned to you for mentorship on 'Climate Change Impact Analysis'.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    userId: "mentor1",
    userRole: "mentor",
    priority: "medium",
    category: "academic",
    actionButton: {
      label: "View Student",
      href: "/mentor/students",
    },
  },
  {
    id: 3,
    type: "review_completed",
    title: "Review Completed",
    message: "Dr. Johnson has completed the review for 'Quantum Computing Applications'.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    userId: "admin1",
    userRole: "admin",
    priority: "medium",
    category: "academic",
    actionButton: {
      label: "View Review",
      href: "/admin/submissions",
    },
  },
  {
    id: 4,
    type: "deadline_reminder",
    title: "Deadline Approaching",
    message: "Your paper submission deadline is in 3 days. Don't forget to submit your final draft.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    userId: "student2",
    userRole: "student",
    priority: "high",
    category: "deadline",
  },
  {
    id: 5,
    type: "feedback_received",
    title: "New Feedback Available",
    message: "Your mentor has provided feedback on your latest submission. Please review the comments.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: false,
    userId: "student1",
    userRole: "student",
    priority: "medium",
    category: "academic",
    actionButton: {
      label: "View Feedback",
      href: "/student/feedback",
    },
  },
  {
    id: 6,
    type: "system_alert",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    userId: "all",
    userRole: "admin",
    priority: "low",
    category: "system",
  },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const getNotificationsByRole = useCallback(
    (role: string) => {
      return notifications.filter((n) => n.userRole === role || n.userId === "all")
    },
    [notifications],
  )

  const getNotificationsByCategory = useCallback(
    (category: string) => {
      return notifications.filter((n) => n.category === category)
    },
    [notifications],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time notifications
      const randomNotifications = [
        {
          type: "document_submitted" as const,
          title: "New Document Submitted",
          message: "A student has submitted a new document for review.",
          read: false,
          userRole: "mentor" as const,
          priority: "medium" as const,
          category: "academic" as const,
        },
        {
          type: "deadline_reminder" as const,
          title: "Deadline Reminder",
          message: "You have 2 pending reviews due tomorrow.",
          read: false,
          userRole: "mentor" as const,
          priority: "high" as const,
          category: "deadline" as const,
        },
      ]

      // Randomly add a notification (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        addNotification(randomNotification)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [addNotification])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByRole,
    getNotificationsByCategory,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
