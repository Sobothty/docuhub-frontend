"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const user = session?.user
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      // Redirect to role-specific dashboard based on roles array
      if (user?.roles) {
        const roles = user.roles as string[]
        if (roles.includes("ADMIN")) {
          router.push("/admin")
        } else if (roles.includes("ADVISER")) {
          router.push("/mentor")
        } else if (roles.includes("STUDENT")) {
          router.push("/student")
        } else {
          router.push("/profile")
        }
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, isAuthenticated, router])

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

  return null
}
