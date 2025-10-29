"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";

export function AutoSignOutHandler() {
  const { data: session, update } = useSession();
  const isRefreshing = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasSetupListeners = useRef(false);

  // Memoize the update function to prevent re-renders
  const updateSession = useCallback(async () => {
    if (isRefreshing.current) return;

    isRefreshing.current = true;
    try {
      await update();
      console.log("[v0] Session updated successfully");
    } catch (error) {
      console.error("[v0] Failed to update session:", error);
    } finally {
      isRefreshing.current = false;
    }
  }, [update]);

  // Handle token refresh error
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.log(
        "[v0] Token refresh failed, signing out and clearing session..."
      );
      signOut({
        callbackUrl: "/",
        redirect: true,
      });
    }
  }, [session?.error]);

  // Setup session checking and event listeners
  useEffect(() => {
    if (!session || hasSetupListeners.current) return;

    const handleBeforeUnload = () => {
      console.log("[v0] User leaving website, signing out...");
      navigator.sendBeacon("/api/auth/signout");
    };

    const checkTokenExpiry = () => {
      if (!session?.accessTokenExpires || isRefreshing.current) return;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = session.accessTokenExpires - currentTime;

      // Only log if token is about to expire (reduce console spam)
      if (timeUntilExpiry < 600) {
        console.log(
          "[v0] Token expiring soon. Time remaining:",
          timeUntilExpiry,
          "seconds"
        );
      }

      // Refresh token only when it's about to expire (less than 10 minutes)
      if (timeUntilExpiry < 600 && timeUntilExpiry > 0) {
        console.log("[v0] Proactively triggering token refresh...");
        updateSession();
      }
    };

    // Check on mount only if needed
    if (session?.accessTokenExpires) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = session.accessTokenExpires - currentTime;
      // Only check immediately if token is expiring soon
      if (timeUntilExpiry < 600) {
        checkTokenExpiry();
      }
    }

    // Check every 5 minutes
    if (!intervalRef.current) {
      intervalRef.current = setInterval(checkTokenExpiry, 300000);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    hasSetupListeners.current = true;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
      hasSetupListeners.current = false;
    };
  }, [session?.accessTokenExpires, updateSession]);

  return null;
}
