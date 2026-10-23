import { cookies } from "next/headers";
import type { MemberTier } from "./types";

export type MemberSession = { email: string; tier: MemberTier } | null;

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

/** Returns true if the session tier meets or exceeds the required tier. */
export function canAccess(session: MemberSession, requiredTier?: MemberTier | null): boolean {
  if (!requiredTier) return true;
  if (!session) return false;
  const rank: Record<MemberTier, number> = { free: 1, paid: 2, founding: 3 };
  return (rank[session.tier] ?? 0) >= (rank[requiredTier] ?? 0);
}
