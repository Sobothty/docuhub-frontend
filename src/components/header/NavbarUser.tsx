"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Star,
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
import { useTheme } from "next-themes";
import WebSocketStatus from "@/components/ui/WebSocketStatus";

export default function NavbarUser() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const { data: user } = useGetUserProfileQuery();
  const tokens = useSession();
  const userRoles = tokens.data?.user.roles || [];

  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<"en" | "kh">("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    if (i18n?.language) setCurrentLang(i18n.language as "en" | "kh");
  }, [i18n]);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        document.querySelector("nav")?.classList.add("scrolled");
      } else {
        document.querySelector("nav")?.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
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
    setIsUserMenuOpen(false);
    setMobileOpen(false);
  };

  const handleClickStars = () => {
    if (
      userRoles.includes("STUDENT") &&
      user?.student &&
      user?.student.isStudent
    ) {
      router.push(`/student/favorites`);
    } else if (userRoles.includes("ADVISER") && user?.adviser) {
      router.push("/adviser/favorites");
    } else {
      router.push("/profile/favorites");
    }
    setIsUserMenuOpen(false);
    setMobileOpen(false);
  };

  const handleProfileSettingClick = () => {
    if (
      userRoles.includes("STUDENT") &&
      user?.student &&
      user?.student.isStudent
    ) {
      router.push(`/student/settings`);
    } else if (userRoles.includes("ADVISER") && user?.adviser) {
      router.push("/adviser/settings");
    } else {
      router.push("/profile/settings");
    }
    setIsUserMenuOpen(false);
    setMobileOpen(false);
  };

  if (!mounted) return null;

  const navLinks = [
    { path: "/", name: t("home") },
    { path: "/browse", name: t("browse") },
    { path: "/roadmap", name: "Roadmap" },
    { path: "/about", name: t("about") },
    { path: "/contact", name: t("contact") },
  ];

  return (
    <nav className="navbar-container scrolled">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center group transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/logo/Docohub.png"
              alt="DocuHub Logo"
              width={140}
              height={45}
              className="transition-all duration-300 group-hover:brightness-110 w-[100px] h-auto sm:w-[120px] md:w-[140px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.path}
                className={`navbar-nav-link group ${
                  pathname === link.path ? "navbar-nav-link-active" : ""
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {pathname === link.path ? (
                  <span className="navbar-nav-link-active-bg" />
                ) : (
                  <span className="navbar-nav-link-bg" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* WebSocket Status Indicator */}
            <WebSocketStatus variant="dot" className="mr-1" />

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="navbar-btn-theme group"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 navbar-icon-sun" />
              ) : (
                <Moon className="h-5 w-5 navbar-icon-moon" />
              )}
            </button>

            {/* Favorites Button */}
            <button
              onClick={handleClickStars}
              className="navbar-btn-favorites group"
              aria-label="Favorites"
            >
              <Star className="h-5 w-5 navbar-icon-star" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="navbar-btn-language group"
              aria-label="Toggle language"
            >
              <Image
                src={currentLang === "en" ? "/flag-UK.svg" : "/flag-Cam.svg"}
                alt="flag"
                width={24}
                height={16}
                className="rounded shadow-sm group-hover:shadow-lg transition-all duration-300 ease-in-out group-hover:scale-110"
              />
              <span className="navbar-btn-language-text">
                {currentLang.toUpperCase()}
              </span>
            </button>

            {/* User Profile Dropdown */}
            <DropdownMenu
              open={isUserMenuOpen}
              onOpenChange={setIsUserMenuOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="navbar-user-dropdown-trigger"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-9 w-9 ring-2 ring-blue-500/20 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-blue-500/50">
                      <AvatarImage
                        src={
                          user?.user.imageUrl ||
                          "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                        }
                        alt={user?.user.firstName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold">
                        {user ? getInitials(user.user.slug) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="navbar-user-name truncate max-w-28">
                        {user?.user.userName || "User"}
                      </span>
                      {getRoleBadge()}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-300" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl z-10000 rounded-xl"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                      <AvatarImage
                        src={
                          user?.user.imageUrl ||
                          "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                        }
                        alt={user?.user.firstName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold">
                        {user ? getInitials(user.user.slug) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-none truncate">
                        {user?.user.fullName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.user.email || "user@example.com"}
                      </p>
                      <div className="mt-1">{getRoleBadge()}</div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="cursor-pointer py-2.5 px-4 rounded-lg mx-2 transition-colors"
                >
                  <User className="mr-3 h-4 w-4 text-blue-600" />
                  <span className="font-medium">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleProfileSettingClick}
                  className="cursor-pointer py-2.5 px-4 rounded-lg mx-2 transition-colors"
                >
                  <Settings className="mr-3 h-4 w-4 text-blue-600" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleClickStars}
                  className="cursor-pointer py-2.5 px-4 rounded-lg mx-2 transition-colors"
                >
                  <Heart className="mr-3 h-4 w-4 text-blue-600" />
                  <span className="font-medium">Saved Papers</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer py-2.5 px-4 rounded-lg mx-2 text-red-600 focus:text-red-600 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu & User Controls */}
          <div className="md:hidden flex items-center space-x-2">
            {/* WebSocket Status Indicator */}
            <WebSocketStatus variant="dot" />

            {/* User Profile Dropdown for Mobile/Tablet */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 p-0 rounded-full hover:bg-muted/50 transition-all duration-300"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-blue-500/20">
                    <AvatarImage
                      src={
                        user?.user.imageUrl ||
                        "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                      }
                      alt={user?.user.firstName || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold">
                      {user ? getInitials(user.user.slug) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl z-10000 rounded-xl"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                      <AvatarImage
                        src={
                          user?.user.imageUrl ||
                          "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                        }
                        alt={user?.user.firstName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold">
                        {user ? getInitials(user.user.slug) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-none truncate">
                        {user?.user.fullName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.user.email || "user@example.com"}
                      </p>
                      <div className="mt-1">{getRoleBadge()}</div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="cursor-pointer py-2.5 px-4 rounded-lg mx-2 transition-colors"
                >
                  <User className="mr-3 h-4 w-4 text-blue-600" />
                  <span className="font-medium">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleProfileSettingClick}
                  className="cursor-pointer py-2.5 px-4 rounded-lg mx-2 transition-colors"
                >
                  <Settings className="mr-3 h-4 w-4 text-blue-600" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleClickStars}
                  className="cursor-pointer py-2.5 px-4 rounded-lg mx-2 transition-colors"
                >
                  <Heart className="mr-3 h-4 w-4 text-blue-600" />
                  <span className="font-medium">Saved Papers</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer py-2.5 px-4 rounded-lg mx-2 text-red-600 focus:text-red-600 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hamburger menu button */}
            <button
              className="p-2 rounded-xl hover:bg-muted/50 transition-all duration-300 text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {/* Mobile Nav Links */}
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              className={`navbar-mobile-link ${
                pathname === link.path ? "navbar-mobile-link-active" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Actions */}
          <div className="pt-4 border-t border-border/50 space-y-3">
            <div className="flex items-center justify-around px-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="navbar-btn-theme"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5 navbar-icon-sun" />
                ) : (
                  <Moon className="h-5 w-5 navbar-icon-moon" />
                )}
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="navbar-btn-language"
                aria-label="Toggle language"
              >
                <Image
                  src={currentLang === "en" ? "/flag-UK.svg" : "/flag-Cam.svg"}
                  alt="flag"
                  width={24}
                  height={16}
                  className="rounded shadow-sm"
                />
                <span className="navbar-btn-language-text">
                  {currentLang.toUpperCase()}
                </span>
              </button>

              {/* Favorites Button */}
              <button
                onClick={handleClickStars}
                className="navbar-btn-favorites"
                aria-label="Favorites"
              >
                <Star className="h-5 w-5 navbar-icon-star" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
