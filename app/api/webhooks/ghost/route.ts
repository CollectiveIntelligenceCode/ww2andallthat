// Ghost webhook receiver — forwards events to Zapier for email automation flows.
// Set this URL in Ghost Admin > Integrations > Webhooks.
// Events handled: member.added, member.updated, member.deleted, post.published
//
// Zapier target URL: set ZAPIER_WEBHOOK_URL env var in Vercel.

export const runtime = "nodejs";

const ZAPIER_URL = process.env.ZAPIER_WEBHOOK_URL ?? "";
const GHOST_WEBHOOK_SECRET = process.env.GHOST_WEBHOOK_SECRET ?? "";

interface GhostWebhookPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export async function POST(request: Request) {
  // Validate secret if configured
  if (GHOST_WEBHOOK_SECRET) {
    const signature = request.headers.get("x-ghost-signature") ?? "";
    if (!signature.includes(GHOST_WEBHOOK_SECRET)) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: GhostWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = request.headers.get("x-ghost-event") ?? payload?.event ?? "unknown";

  // Forward to Zapier if configured
  if (ZAPIER_URL) {
    try {
      await fetch(ZAPIER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, data: payload, receivedAt: new Date().toISOString() }),
      });
    } catch (err) {
      console.error("Ghost webhook: Zapier forward failed", err);
    }
  }

  console.log(`Ghost webhook received: ${event}`);
  return Response.json({ ok: true, event });
}
