// Ghost magic-link callback: ?token=xxx&redirect=/articles/foo
// Verifies the token, sets a session cookie, redirects the user.
export const runtime = "nodejs";

import { verifyMemberToken } from "@/lib/ghost";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const redirect = searchParams.get("redirect") ?? "/";

  if (!token) {
    return Response.redirect(new URL("/member/signin?error=missing_token", request.url));
  }

  const member = await verifyMemberToken(token);
  if (!member) {
    return Response.redirect(new URL("/member/signin?error=invalid_token", request.url));
  }

  const cookieStore = await cookies();
  // Store email + tier in a signed-ish cookie (httpOnly so JS can't read it)
  cookieStore.set("ghost_member", JSON.stringify({ email: member.email, tier: member.tier }), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return Response.redirect(new URL(redirect, request.url));
}
