"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
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
    <div className="min-h-screen bg-background">
      <Sidebar
        userRole={userRole}
        userName={userName || "User"} // Fallback to session user name
        userAvatar={userAvatar || "/placeholder.svg"} // Remove user.avatar reference
      />

      {/* Main content */}
      <div className={`${isOpen ? "md:pl-64" : "md:pl-16"} transition-all duration-300`}>
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="space-y-6">{children}</div>
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
