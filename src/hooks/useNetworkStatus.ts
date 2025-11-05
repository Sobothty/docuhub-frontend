"use client";

import { useState, useEffect } from "react";

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

function getNetworkConnection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection
  );
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    wasOffline: false,
  });

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const updateNetworkStatus = () => {
      const online = navigator.onLine;
      const connection = getNetworkConnection();

      setNetworkStatus((prev) => {
        const status: NetworkStatus = {
          isOnline: online,
          wasOffline: !online && prev.isOnline,
          connectionType: connection?.type,
          effectiveType: connection?.effectiveType,
          downlink: connection?.downlink,
          rtt: connection?.rtt,
        };
        return status;
      });
    };

    // Initial check
    updateNetworkStatus();

    // Listen to online/offline events
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    // Listen to connection changes (if available)
    const connection = getNetworkConnection();

    if (connection) {
      connection.addEventListener("change", updateNetworkStatus);
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
      if (connection) {
        connection.removeEventListener("change", updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
}
