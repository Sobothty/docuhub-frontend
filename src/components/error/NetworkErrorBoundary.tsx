"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class NetworkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a network error
    const isNetworkError =
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError") ||
      !navigator.onLine;

    if (isNetworkError) {
      return { hasError: true, error };
    }
    return { hasError: false, error: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Network error caught by boundary:", error, errorInfo);
  }

  componentDidUpdate() {
    // Reset error state when connection is restored
    if (this.state.hasError && navigator.onLine) {
      // Auto-recover after a short delay
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 1000);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Network Error
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {navigator.onLine
                ? "Unable to reach the server. Please try again."
                : "You are currently offline. Please check your internet connection."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
