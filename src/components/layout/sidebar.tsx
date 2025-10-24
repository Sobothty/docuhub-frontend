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
import { NotificationSystem } from "@/components/ui/notification-system";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useSidebar } from "@/components/contexts/sidebar-context";

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
          "fixed z-50 transition-all duration-300 ease-in-out bg-background/90 backdrop-blur-sm",
          isOpen ? "left-64 top-4" : "left-16 top-4 md:left-16",
          "rounded-full shadow-lg hover:bg-accent/20 hover:text-accent-foreground border border-border"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <PanelLeftClose className="h-5 w-5 text-foreground" />
        ) : (
          <PanelLeftOpen className="h-5 w-5 text-foreground" />
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background border-r border-border transform transition-all duration-300 ease-in-out",
          isOpen
            ? "w-64 translate-x-0"
            : "w-16 md:w-16 -translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {isOpen && (
                <div>
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
                  <p className="text-xs text-muted-foreground capitalize">
                    {userRole} Portal
                  </p>
                </div>
              )}
            </div>
            {isOpen && userRole !== "public" && (
              <div className="flex items-center gap-2">
                <NotificationSystem />
              </div>
            )}
          </div>

          {/* User Profile with Dropdown */}
          <div className="p-4 border-b border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto hover:bg-accent/10 rounded-lg"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userAvatar || "/placeholder.svg"}
                        alt={userName}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isOpen && (
                      <>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-foreground truncate">
                            {userName}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {userRole} Account
                          </p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-64 bg-background text-foreground border-border"
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
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-foreground" />
                    <span className="text-sm font-medium">
                      Profile Settings
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/browse"
                    onClick={(e) => handleNavigation(e, "/browse")}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4 text-foreground" />
                    <span className="text-sm font-medium">
                      Browse Publications
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <div className="px-2 py-1.5">
                  <ThemeToggle />
                </div>
                <div className="px-2 py-1.5">
                  <LanguageSwitcher />
                </div>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 text-foreground" />
                  <span className="text-sm font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavigation(e, item.href)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-foreground"
                      : "text-foreground hover:bg-slate-800 hover:text-accent-foreground"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground hover:text-accent-foreground"
                    )}
                  />
                  {isOpen && (
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        isActive ? "text-gray-100" : "text-foreground"
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
            <div className="p-4 border-t border-border">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sm font-medium transition-all duration-200 border-border",
                    pathname === "/browse"
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                      : "bg-background text-foreground hover:bg-accent/20 hover:border-accent"
                  )}
                  asChild
                >
                  <Link
                    href="/browse"
                    onClick={(e) => handleNavigation(e, "/browse")}
                  >
                    <BookOpen className="h-4 w-4 mr-2 text-foreground" />
                    Browse Papers
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sm font-medium transition-all duration-200 border-border",
                    pathname === "/directory"
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                      : "bg-background text-foreground hover:bg-accent/20 hover:border-accent"
                  )}
                  asChild
                >
                  <Link href="" onClick={() => handleLogout()}>
                    <Users className="h-4 w-4 mr-2 text-foreground" />
                    Sign Out
                  </Link>
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
