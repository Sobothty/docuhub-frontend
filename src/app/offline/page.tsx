"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        window.location.reload();
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
        alert("Still offline. Please check your internet connection.");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center space-y-8">
          {/* Animated Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full animate-ping opacity-75" />
            <div className="relative bg-red-50 dark:bg-red-900/30 rounded-full p-6">
              <WifiOff className="h-16 w-16 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              No Internet Connection
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              It looks like you&apos;re offline. Please check your internet
              connection and try again.
            </p>
          </div>

          {/* Connection Status */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  isOnline
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500 animate-pulse"
                }`}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {isOnline ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed min-w-[160px] justify-center"
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

            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-w-[160px] justify-center"
            >
              <Home className="h-5 w-5" />
              <span>Go Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-w-[160px] justify-center"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Helpful Tips */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Troubleshooting Tips:
            </h3>
            <ul className="text-left text-sm text-slate-600 dark:text-slate-400 space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Check your Wi-Fi or mobile data connection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Restart your router or modem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Disable and re-enable your network adapter</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Check if other websites are accessible</span>
              </li>
            </ul>
          </div>

          {/* Auto-reconnect message */}
          {isOnline && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-pulse">
              <p className="text-green-800 dark:text-green-300 font-medium">
                Connection restored! Refreshing page...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Docuhub - Academic Paper Management Platform
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Powered by ISTAD
          </p>
        </div>
      </div>
    </div>
  );
}
