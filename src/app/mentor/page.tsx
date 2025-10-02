"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MentorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const roles: string[] | undefined = (session as any)?.user?.roles;

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      // If user is not adviser, bounce to general profile
      if (!roles?.includes("ADVISER")) {
        router.push("/profile");
      }
    }
  }, [isLoading, isAuthenticated, roles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!roles?.includes("ADVISER")) return null;

  return (
    <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Adviser Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Manage mentees, review submissions, and provide feedback.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">Pending Reviews</h2>
          <p className="text-sm text-muted-foreground">No items yet.</p>
        </div>
        <div className="p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">Upcoming Meetings</h2>
          <p className="text-sm text-muted-foreground">No meetings scheduled.</p>
        </div>
        <div className="p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">Messages</h2>
          <p className="text-sm text-muted-foreground">Inbox is clear.</p>
        </div>
      </div>
    </main>
  );
}
