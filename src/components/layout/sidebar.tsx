"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Settings,
  Home,
  Upload,
  MessageSquare,
  LogOut,
  User,
  ChevronDown,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  Star,
  Stars,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useSidebar } from "@/components/contexts/sidebar-context";
import WebSocketStatus from "@/components/ui/WebSocketStatus";

interface SidebarProps {
  userRole: "admin" | "adviser" | "student" | "public";
  userName: string;
  userAvatar?: string;
}

const roleNavigation = {
  admin: [
    { name: "Overview", href: "/admin", icon: Home },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Proposals", href: "/admin/proposals", icon: ClipboardList },
    { name: "Submissions", href: "/admin/submissions", icon: FileText },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
  adviser: [
    { name: "Overview", href: "/adviser", icon: Home },
    { name: "Assigned Students", href: "/adviser/students", icon: Users },
    { name: "Documents", href: "/adviser/documents", icon: ClipboardList },
    { name: "Resources", href: "/adviser/resources", icon: BookOpen },
    { name: "Favorites", href: "/adviser/favorites", icon: Star },
    { name: "Settings", href: "/adviser/settings", icon: Settings },
  ],
  student: [
    { name: "Overview", href: "/student", icon: Home },
    { name: "Documents", href: "/student/proposals", icon: ClipboardList },
    { name: "My Submissions", href: "/student/submissions", icon: Upload },
    { name: "Feedback", href: "/student/feedback", icon: MessageSquare },
    { name: "Favorites", href: "/student/favorites", icon: Star },
    { name: "Mentorship", href: "/student/mentorship", icon: Users },
    { name: "Settings", href: "/student/settings", icon: Settings },
  ],
  public: [
    { name: "Overview", href: "/profile", icon: Home },
    { name: "Favorites", href: "/profile/favorites", icon: Stars },
    { name: "Settings", href: "/profile/settings", icon: Settings },
  ],
};

export function Sidebar({ userRole, userName, userAvatar }: SidebarProps) {
  const { isOpen, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const navigation = roleNavigation[userRole] || [];

  // Function to handle navigation with loading bar
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (pathname === href) return; // Don't navigate if already on the page

    e.preventDefault();

    // Trigger loading bar
    window.dispatchEvent(new Event("startLoading"));

    // Navigate
    router.push(href);

    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      window.dispatchEvent(new Event("startLoading"));
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      window.dispatchEvent(new Event("completeLoading"));
    }
  };

  return (
    <>
      {/* Toggle Button (Moved outside sidebar, near right edge) */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed z-50 transition-all duration-300 ease-in-out sidebar-toggle",
          isOpen ? "left-64 top-4 md:left-64" : "left-4 top-4 md:left-16",
          "rounded-full"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <PanelLeftClose className="h-5 w-5 sidebar-toggle-icon" />
        ) : (
          <PanelLeftOpen className="h-5 w-5 sidebar-toggle-icon" />
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 sidebar-container transform transition-all duration-300 ease-in-out",
          isOpen
            ? "w-64 translate-x-0"
            : "w-64 md:w-16 -translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sidebar-header">
            <div className="flex items-center gap-2 flex-1">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              {isOpen && (
                <div className="flex-1">
                  <Link
                    href="/"
                    className="inline-block"
                    onClick={(e) => handleNavigation(e, "/")}
                  >
                    <Image
                      src="/logo/Docohub.png"
                      alt="DocuHub Logo"
                      width={120}
                      height={40}
                      className="transition-all"
                      priority
                    />
                  </Link>
                  <p className="text-xs sidebar-portal-text capitalize font-medium">
                    {userRole} Portal
                  </p>
                </div>
              )}
            </div>
            {/* WebSocket Status Indicator */}
            <div className="ml-auto">
              <WebSocketStatus variant="dot" />
            </div>
          </div>

          {/* User Profile with Dropdown */}
          <div className="p-4 sidebar-profile-section">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2.5 h-auto sidebar-profile-button rounded-xl"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-orange-500 dark:ring-orange-600">
                        <AvatarImage
                          src={userAvatar || "/placeholder.svg"}
                          alt={userName}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                          {userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 sidebar-online-indicator"></div>
                    </div>
                    {isOpen && (
                      <>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-semibold sidebar-username truncate">
                            {userName}
                          </p>
                          <p className="text-xs sidebar-role-text capitalize font-medium">
                            {userRole} Account
                          </p>
                        </div>
                        <ChevronDown className="h-4 w-4 sidebar-role-text" />
                      </>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-64 sidebar-dropdown-menu rounded-xl p-2"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${
                      userRole === "public" ? "profile" : userRole
                    }/settings`}
                    onClick={(e) =>
                      handleNavigation(
                        e,
                        `/${
                          userRole === "public" ? "profile" : userRole
                        }/settings`
                      )
                    }
                    className="flex items-center gap-3 px-3 py-2.5 sidebar-dropdown-item"
                  >
                    <div className="sidebar-dropdown-icon-wrapper sidebar-dropdown-icon-wrapper-blue">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm sidebar-dropdown-text">
                      Profile Settings
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/browse"
                    onClick={(e) => handleNavigation(e, "/browse")}
                    className="flex items-center gap-3 px-3 py-2.5 sidebar-dropdown-item sidebar-dropdown-item-orange"
                  >
                    <div className="sidebar-dropdown-icon-wrapper sidebar-dropdown-icon-wrapper-orange">
                      <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-sm sidebar-dropdown-text">
                      Browse Publications
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sidebar-dropdown-separator" />
                <div className="sidebar-dropdown-toggle-section ">
                  <ThemeToggle />
                </div>
                <div className="sidebar-dropdown-toggle-section">
                  <LanguageSwitcher />
                </div>
                <DropdownMenuSeparator className="sidebar-dropdown-separator" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 sidebar-dropdown-item sidebar-dropdown-item-danger text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <div className="sidebar-dropdown-icon-wrapper sidebar-dropdown-icon-wrapper-red">
                    <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm sidebar-dropdown-text">
                    Sign Out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavigation(e, item.href)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl group relative overflow-hidden",
                    isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  )}
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200 relative z-10 sidebar-nav-icon group-hover:scale-110",
                      isActive && "text-white"
                    )}
                  />
                  {isOpen && (
                    <span
                      className={cn(
                        "text-sm font-semibold truncate relative z-10 sidebar-nav-text",
                        isActive && "text-white"
                      )}
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          {isOpen && (
            <div className="p-4 sidebar-footer">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sm font-semibold rounded-xl",
                    pathname === "/browse"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
                      : "sidebar-footer-button"
                  )}
                  asChild
                >
                  <Link
                    href="/browse"
                    onClick={(e) => handleNavigation(e, "/browse")}
                  >
                    <BookOpen
                      className={cn(
                        "h-4 w-4 mr-2",
                        pathname === "/browse" && "text-white"
                      )}
                    />
                    Browse Papers
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-sm font-semibold rounded-xl sidebar-footer-button hover:!bg-red-50 dark:hover:!bg-red-950/30 hover:!border-red-400 dark:hover:!border-red-700 hover:!text-red-600 dark:hover:!text-red-400"
                  onClick={() => handleLogout()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
