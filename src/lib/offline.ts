/**
 * Offline utility functions for Docuhub
 */

/**
 * Get network connection (cross-browser compatible)
 */
function getNetworkConnection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection
  );
}

/**
 * Check if the browser is online
 */
export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  if (typeof navigator === "undefined") return false;
  return "serviceWorker" in navigator;
}

/**
 * Check if service worker is registered
 */
export async function isServiceWorkerRegistered(): Promise<boolean> {
  if (!isServiceWorkerSupported()) return false;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return !!registration;
  } catch (error) {
    console.error("Error checking service worker registration:", error);
    return false;
  }
}

/**
 * Get network connection information (if available)
 */
export function getNetworkInfo(): {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
} | null {
  if (typeof navigator === "undefined") return null;

  const connection = getNetworkConnection();

  if (!connection) return null;

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
    type: connection.type,
  };
}

/**
 * Wait for online status
 */
export function waitForOnline(): Promise<void> {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve();
      return;
    }

    const handleOnline = () => {
      window.removeEventListener("online", handleOnline);
      resolve();
    };

    window.addEventListener("online", handleOnline);
  });
}

/**
 * Wait for offline status
 */
export function waitForOffline(): Promise<void> {
  return new Promise((resolve) => {
    if (!isOnline()) {
      resolve();
      return;
    }

    const handleOffline = () => {
      window.removeEventListener("offline", handleOffline);
      resolve();
    };

    window.addEventListener("offline", handleOffline);
  });
}

/**
 * Retry a function when online
 */
export async function retryWhenOnline<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      if (!isOnline()) {
        await waitForOnline();
      }
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retries reached");
}

/**
 * Queue a request for when online
 */
export function queueRequestWhenOnline(requestFn: () => Promise<void>): void {
  if (isOnline()) {
    requestFn().catch(console.error);
  } else {
    const handleOnline = async () => {
      window.removeEventListener("online", handleOnline);
      try {
        await requestFn();
      } catch (error) {
        console.error("Queued request failed:", error);
      }
    };
    window.addEventListener("online", handleOnline);
  }
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    errorMessage.includes("fetch") ||
    errorMessage.includes("network") ||
    errorMessage.includes("Failed to fetch") ||
    errorMessage.includes("NetworkError") ||
    errorMessage.includes("Network request failed") ||
    errorMessage.includes("ERR_INTERNET_DISCONNECTED") ||
    errorMessage.includes("ERR_NETWORK_CHANGED")
  );
}
