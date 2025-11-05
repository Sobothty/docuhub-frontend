"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Auto-reload when connection is restored
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    // Check if we're back online
    if (navigator.onLine) {
      // Try to reload
      window.location.reload();
    } else {
      // Show message after a delay
      setTimeout(() => {
        setIsRetrying(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center relative">
        {/* WiFi Icon with Gradient Circle and Ripple Effects */}
        <div className="relative mb-10 flex justify-center items-center h-80">
          {/* Ripple Rings - Concentric circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-64 h-64 rounded-full border-2 border-purple-200/40 animate-pulse" />
            <div
              className="absolute w-72 h-72 rounded-full border-2 border-purple-200/30 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute w-80 h-80 rounded-full border-2 border-purple-200/20 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          {/* Decorative Stars - Scattered around */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12;
            const radius = 140 + (i % 3) * 20;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-purple-300/60 animate-pulse"
                >
                  <path
                    d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            );
          })}

          {/* Main Gradient Circle with WiFi Icon */}
          <div className="relative z-10">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-700 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl">
              {/* WiFi Icon SVG - Broken Signal with two dots */}
              <svg
                width="90"
                height="90"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                {/* Outer arc - broken */}
                <path
                  d="M12 20C12 20 7 15 7 10C7 8 8 6.5 9.5 5.5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="5 5"
                />
                {/* Middle arc - broken */}
                <path
                  d="M12 16.5C12 16.5 9.5 14 9.5 11C9.5 10 10 9.5 10.5 9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                />
                {/* Inner arc - broken */}
                <path
                  d="M12 13.5C12 13.5 11.2 12.7 11.2 11.5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="3 3"
                />
                {/* Two dots in center */}
                <circle
                  cx="12"
                  cy="11"
                  r="1.8"
                  fill="currentColor"
                  opacity="0.9"
                />
                <circle cx="12" cy="11" r="1" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200">
            Whoops!
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            No Internet connection found. Check your connection or try again.
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              <span>Try Again</span>
            </>
          )}
        </button>

        {/* Auto-reconnect message */}
        {isOnline && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-pulse">
            <p className="text-green-800 font-medium">
              Connection restored! Refreshing page...
            </p>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.02);
          }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
