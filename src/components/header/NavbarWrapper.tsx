"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import NavbarGuest from "./NavbarGuest";
import NavbarUser from "./NavbarUser";

export default function NavbarWrapper() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  console.log("=== NavbarWrapper Debug ===");
  console.log("1. Status:", status);
  console.log("2. Pathname:", pathname);
  console.log("3. Session:", session);
  console.log("4. Has accessToken?", !!session?.accessToken);
  console.log(
    "5. AccessToken (first 20):",
    session?.accessToken?.substring(0, 20)
  );

  if (pathname.startsWith("/mentor") || pathname.startsWith("/student")) {
    console.log("❌ Returning null - protected route");
    return null;
  }

  if (status === "loading") {
    console.log("⏳ Returning Loading...");
    return <div>Loading...</div>;
  }

  if (status === "authenticated" && session?.accessToken) {
    console.log("✅ Returning NavbarUser - authenticated with token");
    return <NavbarUser />;
  }

  console.log("❌ Returning NavbarGuest - not authenticated");
  console.log("=== End Debug ===");
  return <NavbarGuest />;
}
