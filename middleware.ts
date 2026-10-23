import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD;

export function middleware(req: NextRequest) {
  // Redirect old unlock page to home
  if (req.nextUrl.pathname.startsWith("/unlock")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // No password set = gate is open (production release)
  if (!SITE_PASSWORD) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [, password] = atob(encoded).split(":");
      if (password === SITE_PASSWORD) return NextResponse.next();
    }
  }

  return new NextResponse("Restricted", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="WW2 & All That"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
