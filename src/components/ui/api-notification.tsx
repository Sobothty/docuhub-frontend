"use client";

import React, { useEffect } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";

export type NotificationType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading";

export interface ApiNotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-600",
    bgLight: "rgba(34, 197, 94, 0.1)",
    bgDark: "rgba(34, 197, 94, 0.15)",
    borderColor: "rgba(34, 197, 94, 0.3)",
    iconBg: "#10b981",
    textColor: "#059669",
  },
  error: {
    icon: XCircle,
    gradient: "from-red-500 to-pink-600",
    bgLight: "rgba(239, 68, 68, 0.1)",
    bgDark: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    iconBg: "#ef4444",
    textColor: "#dc2626",
  },
  warning: {
    icon: AlertCircle,
    gradient: "from-orange-500 to-amber-600",
    bgLight: "rgba(245, 158, 11, 0.1)",
    bgDark: "rgba(245, 158, 11, 0.15)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    iconBg: "#f59e0b",
    textColor: "#d97706",
  },
  info: {
    icon: Info,
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "rgba(37, 99, 235, 0.1)",
    bgDark: "rgba(37, 99, 235, 0.15)",
    borderColor: "rgba(37, 99, 235, 0.3)",
    iconBg: "#2563eb",
    textColor: "#1d4ed8",
  },
  loading: {
    icon: Loader2,
    gradient: "from-gray-500 to-gray-600",
    bgLight: "rgba(107, 114, 128, 0.1)",
    bgDark: "rgba(107, 114, 128, 0.15)",
    borderColor: "rgba(107, 114, 128, 0.3)",
    iconBg: "#6b7280",
    textColor: "#4b5563",
  },
};

export function ApiNotification({
  type,
  title,
  message,
  isOpen,
  onClose,
  autoClose = true,
  autoCloseDuration = 4000,
}: ApiNotificationProps) {
  const config = notificationConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (isOpen && autoClose && type !== "loading") {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDuration, onClose, type]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Notification Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-top-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative overflow-hidden rounded-3xl shadow-2xl border-2"
            style={{
              background: `linear-gradient(135deg, ${config.bgLight}, ${config.bgDark})`,
              borderColor: config.borderColor,
            }}
          >
            {/* Animated Background Gradient */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at top right, ${config.iconBg}40, transparent)`,
              }}
            />

            {/* Top Gradient Bar */}
            <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />

            {/* Content */}
            <div className="relative p-8">
              {/* Close Button */}
              {type !== "loading" && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors group"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              )}

              {/* Icon and Content */}
              <div className="flex items-start gap-5">
                {/* Animated Icon */}
                <div
                  className="flex-shrink-0 p-4 rounded-2xl shadow-xl"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <Icon
                    className={`w-8 h-8 text-white ${
                      type === "loading"
                        ? "animate-spin"
                        : "animate-in zoom-in-50"
                    }`}
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 pt-1">
                  <h3
                    className="text-xl font-black mb-2"
                    style={{ color: config.textColor }}
                  >
                    {title}
                  </h3>
                  <p className="text-base leading-relaxed text-foreground/80 font-medium">
                    {message}
                  </p>
                </div>
              </div>

              {/* Action Button (optional - only for non-loading) */}
              {type !== "loading" && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    style={{ backgroundColor: config.iconBg }}
                  >
                    Got it
                  </button>
                </div>
              )}

              {/* Auto-close Progress Bar */}
              {autoClose && type !== "loading" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
                  <div
                    className={`h-full bg-gradient-to-r ${config.gradient}`}
                    style={{
                      animation: `shrink ${autoCloseDuration}ms linear forwards`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </>
  );
}

// Hook for easy usage
export function useApiNotification() {
  const [notification, setNotification] = React.useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const showNotification = React.useCallback(
    (type: NotificationType, title: string, message: string) => {
      setNotification({
        isOpen: true,
        type,
        title,
        message,
      });
    },
    []
  );

  const showSuccess = React.useCallback(
    (title: string, message: string) => {
      showNotification("success", title, message);
    },
    [showNotification]
  );

  const showError = React.useCallback(
    (title: string, message: string) => {
      showNotification("error", title, message);
    },
    [showNotification]
  );

  const showWarning = React.useCallback(
    (title: string, message: string) => {
      showNotification("warning", title, message);
    },
    [showNotification]
  );

  const showInfo = React.useCallback(
    (title: string, message: string) => {
      showNotification("info", title, message);
    },
    [showNotification]
  );

  const showLoading = React.useCallback(
    (title: string, message: string) => {
      showNotification("loading", title, message);
    },
    [showNotification]
  );

  const closeNotification = React.useCallback(() => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const NotificationComponent = React.useCallback(() => {
    return <ApiNotification {...notification} onClose={closeNotification} />;
  }, [notification, closeNotification]);

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    closeNotification,
    NotificationComponent,
  };
}
