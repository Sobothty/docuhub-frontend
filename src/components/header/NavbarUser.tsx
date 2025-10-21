"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Bell,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { signOut, useSession } from "next-auth/react";

export default function NavbarUser() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const { data: user } = useGetUserProfileQuery();
  const tokens = useSession();
  const userRoles = tokens.data?.user.roles || [];

  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentLang, setCurrentLang] = useState<"en" | "kh">("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedDarkMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialDarkMode = savedDarkMode
      ? savedDarkMode === "true"
      : prefersDark;
    setIsDarkMode(initialDarkMode);
    document.documentElement.classList.toggle("dark", initialDarkMode);

    if (i18n?.language) setCurrentLang(i18n.language as "en" | "kh");
  }, [i18n]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  const toggleLanguage = async () => {
    if (!mounted || !i18n?.changeLanguage) return;
    const newLang = currentLang === "en" ? "kh" : "en";
    try {
      await i18n.changeLanguage(newLang);
      setCurrentLang(newLang);
      // Force re-render after language change
      setMounted(false);
      setTimeout(() => setMounted(true), 0);
    } catch (err) {
      console.error("Failed to change language", err);
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = () => {
    if (!user) return null;
    if (user.adviser)
      return (
        <Badge variant="secondary" className="text-xs">
          Mentor
        </Badge>
      );
    if (user.student && user.student.isStudent)
      return (
        <Badge variant="outline" className="text-xs">
          Student
        </Badge>
      );
    return (
      <Badge variant="default" className="text-xs">
        User
      </Badge>
    );
  };

  const handleLogout = () => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  const handleProfileClick = () => {
    if (
      userRoles.includes("STUDENT") &&
      user?.student &&
      user?.student.isStudent
    ) {
      router.push(`/student`);
    } else if (userRoles.includes("ADVISER") && user?.adviser) {
      router.push("/adviser");
    } else {
      router.push("/profile");
    }
  };
  const handleClickStars = () => {
    if (
      userRoles.includes("STUDENT") &&
      user?.student &&
      user?.student.isStudent
    ) {
      router.push(`/student/starts`);
    } else if (userRoles.includes("ADVISER") && user?.adviser) {
      router.push("/adviser");
    } else {
      router.push("/profile");
    }
  };

  const handleProfileSettingClick = () => {
    if (userRoles.includes("STUDENT") && user?.student && user?.student.isStudent) {
      router.push(`/student/settings`);
    } else if (userRoles.includes("ADVISER") && user?.adviser) {
      router.push("/adviser/settings");
    } else {
      router.push("/profile/settings");
    }
  };

  if (!mounted) return null;

  const navLinks = [
    { path: "/", name: t("home") },
    { path: "/browse", name: t("browse") },
    { path: "/about", name: t("about") },
    { path: "/contact", name: t("contact") },
  ];

  return (
    <nav className="fixed top-16 sm:top-13 md:top-12 left-0 w-full z-40 border-b bg-background/95 backdrop-blur-sm border-border py-2 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="inline-block">
          <Image
            src="/logo/Docohub.png"
            alt="DocuHub Logo"
            width={120}
            height={40}
            className="transition-all hover:brightness-110"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.path}
              className={`transition-all duration-200 ${
                pathname === link.path
                  ? "text-accent font-semibold border-b-2 border-accent pb-1"
                  : "text-foreground hover:text-accent hover:scale-105"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-muted transition"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-secondary" />
            ) : (
              <Moon className="h-5 w-5 text-secondary" />
            )}
          </button>

          <button className="p-2 rounded-full hover:bg-muted transition">
            <Bell className="h-5 w-5 text-secondary" />
          </button>

          <button className="p-2 rounded-full hover:bg-muted transition">
            <Heart className="h-5 w-5 text-secondary" />
          </button>

          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleLanguage}
          >
            <Image
              src={currentLang === "en" ? "/flag-UK.svg" : "/flag-Cam.svg"}
              alt="flag"
              width={45}
              height={25}
              className="rounded-[8px]"
            />
            <span className="text-foreground font-medium">
              {currentLang.toUpperCase()}
            </span>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-auto px-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user?.user.imageUrl ||
                        "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                      }
                      alt={user?.user.firstName || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user ? getInitials(user.user.slug) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium truncate max-w-24">
                      {user?.user.userName || "User"}
                    </span>
                    {getRoleBadge()}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user.fullName || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.user.email || "user@example.com"}
                  </p>
                  <div className="mt-1">{getRoleBadge()}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleProfileSettingClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/discussions">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClickStars}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Saved Papers</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg border border-border text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground" />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t border-border bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.path}
              className={`transition ${
                pathname === link.path
                  ? "text-accent font-semibold"
                  : "text-foreground hover:text-accent"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-muted transition"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-secondary" />
              ) : (
                <Moon className="h-5 w-5 text-secondary" />
              )}
            </button>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleLanguage}
            >
              <Image
                src={currentLang === "en" ? "/flag-UK.svg" : "/flag-Cam.svg"}
                alt="flag"
                width={32}
                height={20}
                className="rounded-[6px]"
              />
              <span className="text-foreground font-medium">
                {currentLang.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <button className="p-2 rounded-full hover:bg-muted transition">
                <Bell className="h-5 w-5 text-secondary" />
              </button>
              <button className="p-2 rounded-full hover:bg-muted transition">
                <Heart className="h-5 w-5 text-secondary" />
              </button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.user.imageUrl || "/avatar.png"}
                    alt={user?.user.slug || "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user ? getInitials(user.user.firstName) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">
                    {user?.user.fullName || "User"}
                  </span>
                  {getRoleBadge()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
