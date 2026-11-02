import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * First line of defence for private pages: no session cookie means the visitor goes to Login,
 * and the original path is remembered so they land back on it afterwards.
 * The (private) layout then verifies the session against the database, so a stale cookie cannot get through.
 *
 * A logged-in user who reloads a private route has a valid cookie, so they simply stay where they are.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Hand the requested path to the (private) layout so it can build the same ?redirect= link.
  const forwarded = new Headers(request.headers);
  forwarded.set("x-pathname", `${pathname}${search}`);
  return NextResponse.next({ request: { headers: forwarded } });
}

export const config = {
  matcher: ["/create-event/:path*", "/manage-events/:path*", "/joined-events/:path*", "/profile/:path*"],
};
