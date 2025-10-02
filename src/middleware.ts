import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// (Optional) role-based route permissions (currently unused)
const roleRoutes = {
  ADMIN: ["/admin"],
  ADVISER: ["/mentor"],
  STUDENT: ["/student"],
  PUBLIC: ["/profile"],
};

// Protected routes that require authentication
const protectedRoutes = ["/admin", "/mentor", "/student", "/profile", "/dashboard"];

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/browse",
  "/directory",
  "/login",
  "/register",
  "/auth/signin",
  "/auth/signup",
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
    const hasAccessToken = Boolean(req.cookies.get('access_token')?.value);
    // 2) NextAuth session cookies (no import required in middleware)
    const hasNextAuthCookie = Boolean(
      req.cookies.get('__Secure-next-auth.session-token')?.value ||
      req.cookies.get('next-auth.session-token')?.value
    );

    if (!hasAccessToken && !hasNextAuthCookie) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    // Role-based redirects disabled for now
  }

  // Default passthrough
  return NextResponse.next();
}

// function getRoleBasedRedirect(role: string[] | undefined): string {
//   if (!role || role.length === 0) return "/";
//   if (role.includes("ADMIN")) return "/admin";
//   if (role.includes("ADVISER")) return "/mentor";
//   if (role.includes("STUDENT")) return "/student";
//   if (role.includes("PUBLIC")) return "/profile";
//   return "/";
// }
