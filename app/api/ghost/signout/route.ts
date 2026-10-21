export const runtime = "nodejs";

import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("ghost_member");
  return Response.json({ success: true });
}
