// Ghost native referral tracking.
// Called client-side when a referred visitor lands on the site (?ref=xxx).
// Records the referral source against the member when they sign up.
//
// Ghost(Pro) Publisher has built-in referral tracking via the Ghost Portal.
// This endpoint is a server-side companion for custom referral attribution.

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { referralCode, email } = await request.json().catch(() => ({})) as {
    referralCode?: string;
    email?: string;
  };

  if (!referralCode) {
    return Response.json({ error: "referralCode required" }, { status: 400 });
  }

  // Log the referral — extend this to write to Ghost member labels
  // or a FirstPromoter webhook when those are configured.
  console.log(`Referral tracked: code=${referralCode} email=${email ?? "unknown"}`);

  return Response.json({ ok: true });
}

// GET — return referral stats for a member (extend when Ghost referrals configured)
export async function GET() {
  return Response.json({
    message: "Referral stats available after Ghost native referrals configured in Ghost Admin > Integrations",
  });
}
