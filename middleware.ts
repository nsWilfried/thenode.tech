import { NextRequest, NextResponse } from "next/server";
import {
  isValidLocale,
  getLocaleFromAcceptLanguage,
} from "./lib/i18n/locales";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API, static, etc.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // Root: redirect to locale (Accept-Language or default)
  if (pathname === "/" || segments.length === 0) {
    const locale = getLocaleFromAcceptLanguage(
      request.headers.get("accept-language")
    );
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // First segment is a valid locale — continue (set pathname for SEO in layout)
  if (isValidLocale(firstSegment)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Otherwise treat as path without locale: redirect to /locale/path
  const locale = getLocaleFromAcceptLanguage(
    request.headers.get("accept-language")
  );
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
