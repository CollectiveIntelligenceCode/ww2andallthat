// Ghost membership integration
// Handles magic-link signin and paid-membership verification via Ghost Admin + Content APIs.

const GHOST_URL = process.env.GHOST_URL!;
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY!;
const GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY!;

// ── Admin JWT ────────────────────────────────────────────────────────────────
// Ghost Admin API uses a hand-rolled JWT (not standard HS256 — it splits the
// key on the colon and uses the hex id as kid, hex secret as HMAC secret).

async function ghostAdminJwt(): Promise<string> {
  const [id, secret] = GHOST_ADMIN_API_KEY.split(":");

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", kid: id, typ: "JWT" };
  const payload = { iat: now, exp: now + 300, aud: "/admin/" };

  const enc = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const unsigned = `${enc(header)}.${enc(payload)}`;

  const keyBytes = Buffer.from(secret, "hex");
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, Buffer.from(unsigned));
  const sigB64 = Buffer.from(sig).toString("base64url");

  return `${unsigned}.${sigB64}`;
}

// ── Public API helpers ───────────────────────────────────────────────────────

/** Send a Ghost magic-link signin email to the given address. */
export async function sendMagicLink(email: string, redirectUrl: string): Promise<void> {
  const jwt = await ghostAdminJwt();
  const res = await fetch(`${GHOST_URL}/ghost/api/admin/members/`, {
    method: "POST",
    headers: {
      Authorization: `Ghost ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      members: [{ email, send_email: true, email_type: "signin" }],
    }),
  });

  if (!res.ok && res.status !== 422) {
    // 422 = member already exists — that's fine, Ghost still sends the link
    const text = await res.text();
    throw new Error(`Ghost magic-link error ${res.status}: ${text}`);
  }
}

interface GhostMemberSubscription {
  status: string;
  tier?: { name?: string; slug?: string };
  plan?: { nickname?: string };
}

interface GhostMember {
  email: string;
  subscriptions?: GhostMemberSubscription[];
  labels?: Array<{ name: string; slug: string }>;
}

type MemberTier = import("./types").MemberTier;

function resolveTier(member: GhostMember): MemberTier {
  const subs = member.subscriptions ?? [];
  const active = subs.filter(s => s.status === "active");
  if (!active.length) return "free";
  // Check for founding tier by product slug or name
  const isFounding = active.some(s =>
    s.tier?.slug?.includes("founding") ||
    s.tier?.name?.toLowerCase().includes("founding") ||
    s.plan?.nickname?.toLowerCase().includes("founding"),
  );
  if (isFounding) return "founding";
  return "paid";
}

/** Verify a Ghost member token (from ?token= in magic-link callback). */
export async function verifyMemberToken(
  token: string,
): Promise<{ email: string; tier: MemberTier } | null> {
  const jwt = await ghostAdminJwt();
  const res = await fetch(
    `${GHOST_URL}/ghost/api/admin/members/?filter=newsletters.id:-null&token=${encodeURIComponent(token)}&include=subscriptions`,
    { headers: { Authorization: `Ghost ${jwt}` } },
  );
  if (!res.ok) return null;

  const data = await res.json() as { members?: GhostMember[] };
  const member = data.members?.[0];
  if (!member) return null;

  return { email: member.email, tier: resolveTier(member) };
}

/** Look up a member by email and return their tier. Used server-side to gate content. */
export async function getMemberTier(email: string): Promise<MemberTier | null> {
  const jwt = await ghostAdminJwt();
  const res = await fetch(
    `${GHOST_URL}/ghost/api/admin/members/?filter=email:${encodeURIComponent(email)}&include=subscriptions`,
    { headers: { Authorization: `Ghost ${jwt}` } },
  );
  if (!res.ok) return null;

  const data = await res.json() as { members?: GhostMember[] };
  const member = data.members?.[0];
  if (!member) return null;

  return resolveTier(member);
}
