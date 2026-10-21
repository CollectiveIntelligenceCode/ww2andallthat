// Server-side proxy to Substack's free subscribe API.
// Keeps the user on ww2andallthat.com — no redirect to Substack.

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email } = await request.json() as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    const res = await fetch("https://james1940.substack.com/api/v1/free", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://ww2andallthat.com",
      },
      body: JSON.stringify({
        email,
        first_url: "https://ww2andallthat.com",
        first_referrer: "https://ww2andallthat.com",
      }),
    });

    // Substack returns 200 on success, 400 if already subscribed (treat as success)
    if (res.ok || res.status === 400) {
      return Response.json({ success: true });
    }

    console.error("Substack subscribe error:", res.status, await res.text());
    return Response.json({ error: "Subscription failed. Please try again." }, { status: 502 });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
