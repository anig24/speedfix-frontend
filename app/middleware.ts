import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  CORPORATE_SESSION_COOKIE,
} from "@/lib/corporateAuth";
import { corporateLegacyRedirects } from "@/lib/corporatePortal";

function resolveCorporateRedirect(pathname: string) {
  const exactMatch = corporateLegacyRedirects[pathname];

  if (exactMatch) {
    return exactMatch;
  }

  const matchingPrefix = Object.keys(corporateLegacyRedirects)
    .filter((key) => pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchingPrefix) {
    return null;
  }

  return corporateLegacyRedirects[matchingPrefix];
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const corporateRedirect = resolveCorporateRedirect(pathname);

  if (corporateRedirect) {
    return NextResponse.redirect(new URL(corporateRedirect, request.url));
  }

  const hasCorporateSession = Boolean(
    request.cookies.get(CORPORATE_SESSION_COOKIE)?.value
  );

  if (
    pathname.startsWith("/corporate") &&
    pathname !== "/corporate/login" &&
    !hasCorporateSession
  ) {
    const loginUrl = new URL("/corporate/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/corporate/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/executive/:path*",
    "/management/:path*",
    "/operations/:path*",
    "/support/:path*",
    "/corporateStaff/:path*",
    "/entry/:path*",
    "/hr/:path*",
  ],
};
