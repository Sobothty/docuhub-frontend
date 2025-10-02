import type React from "react"
import ProtectedRoute from "@/components/auth/protected-route"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute requiredRole="student">{children}</ProtectedRoute>
}
