"use client"

import { useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

export function AutoSignOutHandler() {
  const { data: session, update } = useSession()
  const isRefreshing = useRef(false)

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.log("[v0] Token refresh failed, signing out and clearing session...")
      signOut({
        callbackUrl: "/",
        redirect: true,
      })
      return
    }

    const handleBeforeUnload = () => {
      if (session) {
        console.log("[v0] User leaving website, signing out...")
        // Use navigator.sendBeacon for reliable sign-out during page unload
        navigator.sendBeacon("/api/auth/signout")
      }
    }

    const checkTokenExpiry = async () => {
      if (!session?.accessTokenExpires || isRefreshing.current) return

      const currentTime = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = session.accessTokenExpires - currentTime

      console.log("[v0] Checking token expiry. Time remaining:", timeUntilExpiry, "seconds")

      if (timeUntilExpiry < 600 && timeUntilExpiry > 0) {
        console.log("[v0] Proactively triggering token refresh...")
        isRefreshing.current = true
        try {
          await update()
          console.log("[v0] Session updated successfully")
        } catch (error) {
          console.error("[v0] Failed to update session:", error)
        } finally {
          isRefreshing.current = false
        }
      }
    }

    const interval = setInterval(checkTokenExpiry, 60000)

    // Check immediately on mount
    checkTokenExpiry()

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [session, update])

  return null
}
