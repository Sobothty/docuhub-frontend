"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function NavbarGuest() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation("common");

  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<"en" | "kh">("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    if (i18n?.language) setCurrentLang(i18n.language as "en" | "kh");

    // Add scroll listener for navbar shadow effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [i18n]);

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = async () => {
    if (!mounted || !i18n?.changeLanguage) return;
    const newLang = currentLang === "en" ? "kh" : "en";
    try {
      await i18n.changeLanguage(newLang);
      setCurrentLang(newLang);
    } catch (err) {
      console.error("Failed to change language", err);
    }
  };

  if (!mounted) return null;

  const navLinks = [
    { path: "/", name: t("home", "Home") },
    { path: "/browse", name: t("browse", "Browse") },
    { path: "/roadmap", name: t("roadmap", "Roadmap") },
    { path: "/about", name: t("about", "About Us") },
    { path: "/contact", name: t("contact", "Contact") },
  ];

  return (
    <nav className={`navbar-container ${scrolled ? "scrolled" : ""}`}>
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

            {/* Login Button */}
            <Link href="/login?force=true" className="navbar-btn-register">
              {t("login", "Login")}
            </Link>

            {/* Sign Up Button */}
            <Link href="/register" className="navbar-btn-login">
              {t("signup", "Sign Up")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-muted/50 transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "max-h-[500px] opacity-100 visible"
            : "max-h-0 opacity-0 invisible overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {/* Mobile Nav Links */}
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.path}
              onClick={() => {
                window.dispatchEvent(new Event("startLoading"));
                setMobileOpen(false);
              }}
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
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex gap-3 px-2">
              <Link
                href="/login?force=true"
                className="flex-1 text-center navbar-btn-register"
              >
                {t("login", "Login")}
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center navbar-btn-login"
              >
                {t("signup", "Sign Up")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
