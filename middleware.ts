import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD;

export function middleware(req: NextRequest) {
  // Redirect old unlock page to home
  if (req.nextUrl.pathname.startsWith("/unlock")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Capture ?ref= referral param as a cookie (30 days)
  const ref = req.nextUrl.searchParams.get("ref");
  const hasRefCookie = req.cookies.has("ww2_ref");

  // No password set = gate is open (production release)
  if (!SITE_PASSWORD) {
    const response = NextResponse.next();
    if (ref && !hasRefCookie) {
      response.cookies.set("ww2_ref", ref, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }
    return response;
  }

  const auth = req.headers.get("authorization");
  let authenticated = false;
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [, password] = atob(encoded).split(":");
      if (password === SITE_PASSWORD) authenticated = true;
    }
  }

  if (!authenticated) {
    const resp = new NextResponse("Restricted", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="WW2 & All That"' },
    });
    if (ref && !hasRefCookie) {
      resp.cookies.set("ww2_ref", ref, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }
    return resp;
  }

  const response = NextResponse.next();
  if (ref && !hasRefCookie) {
    response.cookies.set("ww2_ref", ref, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
