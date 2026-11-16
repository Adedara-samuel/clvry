import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/admin/session";

/**
 * Keeps the admin portal behind the login. Signed-out page visits go to /admin/login; signed-out API
 * calls get a 401. Route handlers check the session again themselves (see lib/admin/guard.ts).
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login" || pathname === "/api/admin/login") return NextResponse.next();

  const user = await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value).catch(() => null);
  if (user) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return Response.json({ ok: false, error: "Please sign in again." }, { status: 401 });
  }
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
