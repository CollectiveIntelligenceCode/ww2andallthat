export const runtime = "nodejs";

import { getMemberSession } from "@/lib/member-session";
import { getMemberProfile } from "@/lib/ghost";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ww2andallthat.com";

export async function GET(request: Request) {
  const session = await getMemberSession();
  if (!session) return Response.json({ error: "not_signed_in" }, { status: 401 });

  const profile = await getMemberProfile(session.email);
  if (!profile) return Response.json({ error: "member_not_found" }, { status: 404 });

  return Response.json({
    url: `${BASE}/?ref=${profile.id}`,
    count: profile.referralCount,
  });
}
