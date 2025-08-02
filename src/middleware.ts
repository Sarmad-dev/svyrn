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

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("Middlware Token: ", token);
  const pathname = request.nextUrl.pathname;

  // Redirect unauthenticated user from protected pages
  // const token = await auth.api.getSession({ headers: request.headers });
  // const pathname = request.nextUrl.pathname;

  // // Redirect unauthenticated user from protected pages
  // if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  // }

  // // Redirect logged-in user away from auth pages
  // if (authRoutes.includes(pathname) && token) {
  //   return NextResponse.redirect(new URL("/home", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
