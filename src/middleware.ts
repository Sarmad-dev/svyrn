// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/home",
  "/ads",
  "/groups",
  "/marketplace",
  "/pages",
  "/post",
  "/settings",
  "profile",
  "/user",
  "/chat",
];
const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  console.log("Token: ", token);
  console.log("Pathname: ", pathname);

  // Redirect unauthenticated user from protected pages
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect logged-in user away from auth pages
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
