// Ghost magic-link callback: ?token=xxx&redirect=/articles/foo
// Verifies the token, sets a session cookie, applies referral label if present.
export const runtime = "nodejs";

import { verifyMemberToken, getMemberProfile, addReferralLabel } from "@/lib/ghost";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const rawRedirect = searchParams.get("redirect");
  const redirect = rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/welcome";

  if (!token) {
    return Response.redirect(new URL("/sign-in?error=missing_token", request.url));
  }

  const member = await verifyMemberToken(token);
  if (!member) {
    return Response.redirect(new URL("/sign-in?error=invalid_token", request.url));
  }

  const cookieStore = await cookies();

  // Apply referral label if this sign-in came via a referral link
  const referrerId = cookieStore.get("ww2_ref")?.value;
  if (referrerId && referrerId !== "") {
    const profile = await getMemberProfile(member.email);
    if (profile && profile.id !== referrerId) {
      await addReferralLabel(profile.id, referrerId).catch(() => {});
    }
    cookieStore.delete("ww2_ref");
  }

  cookieStore.set("ghost_member", JSON.stringify({ email: member.email, tier: member.tier }), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return Response.redirect(new URL(redirect, request.url));
}
