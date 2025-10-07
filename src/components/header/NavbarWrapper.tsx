"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import NavbarGuest from "./NavbarGuest";
import NavbarUser from "./NavbarUser";

export default function NavbarWrapper() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (
    pathname.startsWith("/adviser") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/setting") 
  ) {
    return null;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated" && session?.accessToken) {
    return <NavbarUser />;
  }

  return <NavbarGuest />;
}
