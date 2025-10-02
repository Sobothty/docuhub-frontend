import type React from "react"
import ProtectedRoute from "@/components/auth/protected-route"

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute requiredRole="mentor">{children}</ProtectedRoute>
}
