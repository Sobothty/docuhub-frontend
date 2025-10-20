"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import NavbarGuest from "./NavbarGuest";
import NavbarUser from "./NavbarUser";

export default function NavbarWrapper() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (
    pathname.startsWith("/adviser") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/setting")
  ) {
    return null;
  }

  if (session?.accessToken) {
    return <NavbarUser />;
  }

  return <NavbarGuest />;
}
