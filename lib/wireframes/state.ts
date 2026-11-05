import { cookies } from "next/headers";
import { getMemberSession } from "@/lib/member-session";
import { STATE_COOKIE, type ViewerState } from "./states";

/** Viewer state: the preview bar's explicit choice wins, otherwise the real Ghost member session, otherwise visitor. */
export async function resolveState(): Promise<{ state: ViewerState; fromSession: boolean }> {
  const picked = (await cookies()).get(STATE_COOKIE)?.value;
  if (picked === "v" || picked === "f" || picked === "m") return { state: picked, fromSession: false };
  const session = await getMemberSession();
  if (!session) return { state: "v", fromSession: false };
  return { state: session.tier === "free" ? "f" : "m", fromSession: true };
}
