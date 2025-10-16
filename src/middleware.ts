import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/adviser", "/student", "/profile", "/dashboard"];

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/browse",
  "/directory",
  "/login",
  "/register",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // 1) Custom cookie set by our own login flow
    const hasAccessToken = await getSession();

    if (!hasAccessToken?.accessToken) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    // Role-based redirects disabled for now
  }

  // Default passthrough
  return NextResponse.next();
}


