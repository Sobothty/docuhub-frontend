"use client";

import React from "react";
import { useApiNotification } from "@/components/ui/api-notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from "lucide-react";

/**
 * Test page for the API Notification System
 * Visit: http://localhost:3000/test-notifications
 *
 * This page demonstrates all notification types and their usage.
 * You can use this as a reference when implementing notifications in your components.
 */

export default function TestNotificationsPage() {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

  // Example: Simulate a create operation
  const simulateCreate = () => {
    showLoading(
      "Creating Document",
      "Please wait while we create your document..."
    );

    setTimeout(() => {
      closeNotification();
      setTimeout(() => {
        showSuccess(
          "Document Created!",
          "Your document has been successfully created and submitted for review."
        );
      }, 100);
    }, 2000);
  };

  // Example: Simulate an update operation
  const simulateUpdate = () => {
    showLoading("Updating...", "Saving your changes...");

    setTimeout(() => {
      closeNotification();
      setTimeout(() => {
        showSuccess("Updated Successfully!", "Your changes have been saved.");
      }, 100);
    }, 2000);
  };

  // Example: Simulate a delete operation
  const simulateDelete = () => {
    showLoading("Deleting...", "Removing the item...");

    setTimeout(() => {
      closeNotification();
      setTimeout(() => {
        showSuccess("Deleted!", "The item has been removed successfully.");
      }, 100);
    }, 2000);
  };

  // Example: Simulate a failed operation
  const simulateError = () => {
    showLoading("Processing...", "Please wait...");

    setTimeout(() => {
      closeNotification();
      setTimeout(() => {
        showError(
          "Operation Failed",
          "Something went wrong. Please try again later."
        );
      }, 100);
    }, 2000);
  };

  // Example: Simulate a download operation
  const simulateDownload = () => {
    showLoading(
      "Preparing Download",
      "Please wait while we prepare your file..."
    );

    setTimeout(() => {
      closeNotification();
      setTimeout(() => {
        showSuccess(
          "Download Started!",
          "Your file is being downloaded. Check your downloads folder."
        );
      }, 100);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            API Notification System
          </h1>
          <p className="text-muted-foreground text-lg">
            Test all notification types and see them in action
          </p>
        </div>

        {/* Quick Test Section */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5" />
              Quick Tests (with API simulation)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                onClick={simulateCreate}
                className="h-20 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Test Create Operation
              </Button>

              <Button
                onClick={simulateUpdate}
                className="h-20 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Info className="w-6 h-6 mr-2" />
                Test Update Operation
              </Button>

              <Button
                onClick={simulateDelete}
                className="h-20 text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
              >
                <AlertCircle className="w-6 h-6 mr-2" />
                Test Delete Operation
              </Button>

              <Button
                onClick={simulateDownload}
                className="h-20 text-lg font-bold bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Test Download Operation
              </Button>

              <Button
                onClick={simulateError}
                className="h-20 text-lg font-bold bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                <XCircle className="w-6 h-6 mr-2" />
                Test Error Operation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Individual Notification Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Success */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                Success
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Use for successful operations
              </p>
              <Button
                onClick={() =>
                  showSuccess(
                    "Operation Successful!",
                    "Your changes have been saved successfully."
                  )
                }
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Show Success
              </Button>
              <code className="block text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                showSuccess(title, message)
              </code>
            </CardContent>
          </Card>

          {/* Error */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="w-5 h-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Use for failed operations
              </p>
              <Button
                onClick={() =>
                  showError(
                    "Operation Failed",
                    "Something went wrong. Please try again."
                  )
                }
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Show Error
              </Button>
              <code className="block text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                showError(title, message)
              </code>
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
                Warning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Use for warnings or confirmations
              </p>
              <Button
                onClick={() =>
                  showWarning(
                    "Are you sure?",
                    "This action cannot be undone. Please confirm."
                  )
                }
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Show Warning
              </Button>
              <code className="block text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                showWarning(title, message)
              </code>
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Info className="w-5 h-5" />
                Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Use for informational messages
              </p>
              <Button
                onClick={() =>
                  showInfo(
                    "Information",
                    "Your document is currently under review by the admin."
                  )
                }
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Show Info
              </Button>
              <code className="block text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                showInfo(title, message)
              </code>
            </CardContent>
          </Card>

          {/* Loading */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Use during async operations
              </p>
              <Button
                onClick={() =>
                  showLoading(
                    "Processing...",
                    "Please wait while we process your request."
                  )
                }
                className="w-full bg-gray-600 hover:bg-gray-700"
              >
                Show Loading
              </Button>
              <code className="block text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                showLoading(title, message)
              </code>
            </CardContent>
          </Card>

          {/* Close */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Close Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Manually close any notification
              </p>
              <Button
                onClick={closeNotification}
                variant="outline"
                className="w-full border-2"
              >
                Close Current
              </Button>
              <code className="block text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                closeNotification()
              </code>
            </CardContent>
          </Card>
        </div>

        {/* Usage Info */}
        <Card className="mt-8 border-2 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle>How to Use in Your Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">
                  1. Import the hook:
                </p>
                <code className="block text-xs bg-muted p-3 rounded overflow-auto">
                  {`import { useApiNotification } from "@/components/ui/api-notification";`}
                </code>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">
                  2. Use in your component:
                </p>
                <code className="block text-xs bg-muted p-3 rounded overflow-auto whitespace-pre">
                  {`const {
  showSuccess,
  showError,
  showLoading,
  closeNotification,
  NotificationComponent,
} = useApiNotification();`}
                </code>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">
                  3. Add to your JSX:
                </p>
                <code className="block text-xs bg-muted p-3 rounded overflow-auto">
                  {`<NotificationComponent />`}
                </code>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">
                  4. Use in your functions:
                </p>
                <code className="block text-xs bg-muted p-3 rounded overflow-auto whitespace-pre">
                  {`showSuccess("Title", "Message");
showError("Title", "Message");
showLoading("Title", "Message");
closeNotification();`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Render the notification */}
      <NotificationComponent />
    </div>
  );
}
