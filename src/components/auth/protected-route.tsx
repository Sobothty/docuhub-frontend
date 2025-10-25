"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { type UserRole } from "@/lib/auth";
import DocuhubLoader from "../loader/docuhub-loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (requiredRole && user?.roles) {
      const roles = user.roles as string[];
      const hasRequiredRole = roles.includes(requiredRole.toUpperCase());

      if (!hasRequiredRole) {
        router.replace("/unauthorized");
      }
    }
  }, [user, isLoading, isAuthenticated, requiredRole, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <DocuhubLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.roles) {
    const roles = user.roles as string[];
    const hasRequiredRole =
      requiredRole === "public" || roles.includes(requiredRole.toUpperCase());

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
