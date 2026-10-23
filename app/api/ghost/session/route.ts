import { getMemberSession } from "@/lib/member-session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getMemberSession();
  return Response.json(session ?? { tier: null, email: null });
}
