"use client";

import { useWebSocket } from "@/hooks/useWebSocket";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface WebSocketStatusProps {
  showIcon?: boolean;
  showText?: boolean;
  variant?: "default" | "dot";
  className?: string;
}

/**
 * WebSocket Status Indicator Component
 *
 * Displays the current WebSocket connection status with visual feedback.
 * Useful for debugging or showing users the real-time connection state.
 *
 * @example
 * ```tsx
 * // Show icon and text (full version)
 * <WebSocketStatus />
 *
 * // Show minimal dot indicator
 * <WebSocketStatus variant="dot" />
 *
 * // Show only icon
 * <WebSocketStatus showText={false} />
 *
 * // Show only text
 * <WebSocketStatus showIcon={false} />
 *
 * // Custom styling
 * <WebSocketStatus className="fixed top-4 right-4" />
 * ```
 */
export default function WebSocketStatus({
  showIcon = true,
  showText = true,
  variant = "default",
  className = "",
}: WebSocketStatusProps) {
  const { isConnected } = useWebSocket();

  // Minimal dot variant
  if (variant === "dot") {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <span
          className={`flex h-3 w-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-gray-400"
          }`}
          title={isConnected ? "Connected" : "Disconnected"}
        >
          {isConnected && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          )}
        </span>
      </div>
    );
  }

  // Default badge variant
  return (
    <Badge
      variant={isConnected ? "default" : "secondary"}
      className={`flex items-center gap-2 ${className}`}
    >
      {showIcon &&
        (isConnected ? (
          <Wifi className="h-3 w-3 text-green-500" />
        ) : (
          <WifiOff className="h-3 w-3 text-gray-400" />
        ))}
      {showText && (
        <span className={isConnected ? "text-green-700" : "text-gray-600"}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      )}
    </Badge>
  );
}
