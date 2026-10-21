// Read the ghost_member cookie server-side (RSC / route handlers).
import { cookies } from "next/headers";

export type MemberSession = { email: string; tier: "paid" | "free" } | null;

export async function getMemberSession(): Promise<MemberSession> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("ghost_member")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MemberSession;
  } catch {
    return null;
  }
}
