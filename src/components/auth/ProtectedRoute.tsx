"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const { status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
