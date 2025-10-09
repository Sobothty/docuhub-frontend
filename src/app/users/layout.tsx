import type React from "react";
import ProtectedRoute from "@/components/auth/protected-route";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require authentication for all /users routes
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
