// POST { email } → sends Ghost magic link, redirects to confirm page.
export const runtime = "nodejs";

import { sendMagicLink } from "@/lib/ghost";

export async function POST(request: Request) {
  try {
    const { email, redirect = "/" } = await request.json() as { email?: string; redirect?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://ww2andallthat.com"}/api/ghost/callback?redirect=${encodeURIComponent(redirect)}`;
    await sendMagicLink(email, callbackUrl);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Ghost signin error:", err);
    return Response.json({ error: "Could not send sign-in link. Please try again." }, { status: 500 });
  }
}
