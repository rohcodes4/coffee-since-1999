import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { verifyWaiterToken, WAITER_COOKIE } from "@/lib/waiter-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token || !verifyAdminToken(token)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect all /waiter/* except /waiter/login
  if (pathname.startsWith("/waiter") && !pathname.startsWith("/waiter/login")) {
    const token = request.cookies.get(WAITER_COOKIE)?.value;
    if (!token || !verifyWaiterToken(token)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/waiter/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/waiter/:path*"],
  runtime: "nodejs",
};
