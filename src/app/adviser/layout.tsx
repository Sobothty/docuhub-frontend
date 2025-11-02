import type React from "react"
import type { Metadata } from "next"
import ProtectedRoute from "@/components/auth/protected-route"
import { pageSEO } from "@/lib/seo"

export const metadata: Metadata = pageSEO.adviserDashboard

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute requiredRole="adviser">{children}</ProtectedRoute>
}