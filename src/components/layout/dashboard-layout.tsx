"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/contexts/sidebar-context";
interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "admin" | "adviser" | "student" | "public";
  userName?: string;
  userAvatar?: string;
}

function DashboardLayoutContent({
  children,
  userRole,
  userName,
  userAvatar,
}: DashboardLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="dashboard-background">
      <Sidebar
        userRole={userRole}
        userName={userName || "User"} // Fallback to session user name
        userAvatar={userAvatar || "/placeholder.svg"} // Remove user.avatar reference
      />

      {/* Main content */}
      <div
        className={`${
          isOpen ? "md:pl-64" : "md:pl-16"
        } transition-all duration-300 w-full`}
      >
        <main className="px-4 sm:px-6 lg:px-8 pt-16 md:pt-4 pb-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({
  children,
  userRole,
  userName,
  userAvatar,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
      >
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

export default DashboardLayout;
