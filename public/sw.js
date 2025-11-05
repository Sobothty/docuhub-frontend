// Service Worker for Docuhub - Offline Support
// Cache version - update when you want to force cache refresh
const CACHE_NAME = "docuhub-v1";
const RUNTIME_CACHE = "docuhub-runtime-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/favicon.ico",
  "/og-image.png",
  "/logo/Docohub.png",
  "/logo/istad-logo.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/site.webmanifest",
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, then network
  CACHE_FIRST: "cache-first",
  // Network first, fallback to cache
  NETWORK_FIRST: "network-first",
  // Stale while revalidate
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
};

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Force activate the new service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log("[Service Worker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - handle network requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests (unless they're from your domain)
  if (url.origin !== location.origin && !url.hostname.includes("docuhub.me")) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    // Static assets: Cache first
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request.url)) {
    // API requests: Network first with offline fallback
    event.respondWith(networkFirstWithFallback(request));
  } else if (isPageRequest(request)) {
    // Page requests: Network first, fallback to offline page
    event.respondWith(networkFirstWithOfflinePage(request));
  } else {
    // Default: Stale while revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache first strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("[Service Worker] Fetch failed:", error);
    // Return offline fallback if available
    const offlinePage = await cache.match("/offline");
    if (offlinePage && request.mode === "navigate") {
      return offlinePage;
    }
    throw error;
  }
}

// Network first with fallback to cache
async function networkFirstWithFallback(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("[Service Worker] Network failed, trying cache:", request.url);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "You are currently offline. Please check your connection.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Network first with offline page fallback
async function networkFirstWithOfflinePage(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log(
      "[Service Worker] Network failed, checking cache:",
      request.url
    );
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    // Return offline page for navigation requests
    const offlinePage = await cache.match("/offline");
    if (offlinePage && request.mode === "navigate") {
      return offlinePage;
    }
    throw error;
  }
}

// Stale while revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached); // Fallback to cache if network fails

  return cached || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return (
    url.includes("/_next/static/") ||
    url.includes("/images/") ||
    url.includes("/logo/") ||
    url.includes("/icon-") ||
    url.includes("/favicon") ||
    url.includes("/og-image") ||
    url.includes("/site.webmanifest") ||
    url.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i)
  );
}

function isAPIRequest(url) {
  return url.includes("/api/") || url.includes("/api/");
}

function isPageRequest(request) {
  return (
    request.mode === "navigate" ||
    request.headers.get("accept")?.includes("text/html")
  );
}

// Background sync (optional - for queuing requests when offline)
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("[Service Worker] Background sync triggered");
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here
  // This can queue requests and retry them when online
  console.log("[Service Worker] Performing background sync");
}

// Push notifications (optional)
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push notification received");
  const data = event.data?.json() || {
    title: "Docuhub",
    body: "New notification",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      tag: "docuhub-notification",
    })
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
