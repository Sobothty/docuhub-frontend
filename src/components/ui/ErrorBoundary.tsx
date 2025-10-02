'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error} resetError={this.resetError} />;
      }
      
      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
  title?: string;
  description?: string;
}

export function DefaultErrorFallback({ 
  error, 
  resetError, 
  title = 'Something went wrong',
  description = 'We encountered an unexpected error. Please try again.'
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {title}
      </h3>
      
      <p className="mb-4 text-sm text-gray-600 max-w-md">
        {description}
      </p>
      
      {error && process.env.NODE_ENV === 'development' && (
        <details className="mb-4 text-left bg-gray-50 rounded-lg p-4 w-full max-w-2xl">
          <summary className="cursor-pointer text-sm font-medium">
            Error Details
          </summary>
          <pre className="mt-2 text-xs text-red-600 overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
      
      <Button 
        onClick={resetError}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
}

export function ErrorMessage({ 
  title = 'Error', 
  description, 
  error,
  onRetry 
}: {
  title?: string;
  description?: string;
  error?: string | Error;
  onRetry?: () => void;
}) {
  const errorMessage = typeof error === 'string' ? error : error?.message;
  
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center border border-red-200 rounded-lg bg-red-50">
      <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
      <h3 className="mb-2 text-lg font-semibold text-red-900">{title}</h3>
      <p className="mb-4 text-sm text-red-700">
        {description || errorMessage || 'An unexpected error occurred'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}