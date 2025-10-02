import type React from "react"
import ProtectedRoute from "@/components/auth/protected-route"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute requiredRole="public">{children}</ProtectedRoute>
}
