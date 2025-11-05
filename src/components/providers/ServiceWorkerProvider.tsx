"use client";

import { useEffect } from "react";

export function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      "serviceWorker" in navigator === false
    ) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log(
          "[Service Worker] Registered successfully:",
          registration.scope
        );

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker available
                console.log("[Service Worker] New version available");
                // Optionally show a notification to the user
              }
            });
          }
        });

        // Handle service worker updates
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          refreshing = true;
          console.log("[Service Worker] New service worker activated");
          // Optionally reload the page
          // window.location.reload();
        });
      } catch (error) {
        console.error("[Service Worker] Registration failed:", error);
      }
    };

    // Register service worker after a short delay to avoid blocking initial load
    const timer = setTimeout(() => {
      registerServiceWorker();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
