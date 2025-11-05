"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  // Show reconnected message when coming back online
  useEffect(() => {
    if (wasOffline && isOnline && !showReconnected) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [wasOffline, isOnline, showReconnected]);

  if (isOnline && !showReconnected) return null;

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes successBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        
        .animate-pulse-soft {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }
        
        .animate-success-bounce {
          animation: successBounce 0.6s ease-out;
        }
      `}</style>

      <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
        {!isOnline ? (
          <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white px-6 py-4 shadow-2xl overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white animate-pulse-soft"
                    style={{
                      width: `${Math.random() * 60 + 20}px`,
                      height: `${Math.random() * 60 + 20}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="container mx-auto relative z-10">
              <div className="flex items-center justify-center gap-4">
                {/* Icon with ripple effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ripple" />
                  <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-3 animate-float">
                    <WifiOff className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-base font-bold tracking-wide">
                    No Internet Connection
                  </p>
                  <p className="text-sm text-red-100 font-medium">
                    Some features may be unavailable
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom glow effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
          </div>
        ) : (
          <div className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 text-white px-6 py-4 shadow-2xl overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white animate-pulse-soft"
                    style={{
                      width: `${Math.random() * 40 + 15}px`,
                      height: `${Math.random() * 40 + 15}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 1.5}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="container mx-auto relative z-10">
              <div className="flex items-center justify-center gap-4">
                {/* Success icon with celebration effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full opacity-30 animate-ripple" />
                  <div className="relative bg-white/30 backdrop-blur-sm rounded-full p-3 animate-success-bounce">
                    <Wifi className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-base font-bold tracking-wide">
                    Back Online!
                  </p>
                  <p className="text-sm text-emerald-100 font-medium">
                    Connection successfully restored
                  </p>
                </div>

                {/* Checkmark animation */}
                <svg
                  className="h-8 w-8 animate-success-bounce"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  <path
                    d="M8 12l3 3 5-6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom shine effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-40" />
          </div>
        )}
      </div>
    </>
  );
}
