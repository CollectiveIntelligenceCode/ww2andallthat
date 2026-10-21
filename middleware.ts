import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD;
const COOKIE = "ww2_access";

export function middleware(req: NextRequest) {
  // No password set = gate is open (production release)
  if (!SITE_PASSWORD) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Allow the unlock page and its assets through
  if (pathname.startsWith("/unlock") || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  // Check access cookie
  const token = req.cookies.get(COOKIE)?.value;
  if (token === SITE_PASSWORD) return NextResponse.next();

  // Redirect to unlock page, preserving intended destination
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
