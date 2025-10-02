"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { type UserRole } from "@/lib/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export default function ProtectedRoute({ children, requiredRole, redirectTo = "/login" }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const user = session?.user

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && user?.roles) {
        const roles = user.roles as string[]
        const hasRequiredRole = requiredRole === "public" || roles.includes(requiredRole.toUpperCase())
        
        if (!hasRequiredRole) {
          // Redirect to appropriate dashboard based on user role
          if (roles.includes("ADMIN")) {
            router.push("/admin")
          } else if (roles.includes("ADVISER")) {
            router.push("/mentor")
          } else if (roles.includes("STUDENT")) {
            router.push("/student")
          } else {
            router.push("/profile")
          }
        }
      }
    }
  }, [user, isLoading, isAuthenticated, requiredRole, router, redirectTo])

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

  if (requiredRole && user?.roles) {
    const roles = user.roles as string[]
    const hasRequiredRole = requiredRole === "public" || roles.includes(requiredRole.toUpperCase())
    
    if (!hasRequiredRole) {
      return null
    }
  }

  return <>{children}</>
}
