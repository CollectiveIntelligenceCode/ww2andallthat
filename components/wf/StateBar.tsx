"use client";
import { useRouter } from "next/navigation";
import { STATES, STATE_COOKIE, type ViewerState } from "@/lib/wireframes/states";

// Preview-only control: the real site reads the Ghost tier on every request.
export default function StateBar({ current }: { current: ViewerState }) {
  const router = useRouter();
  const set = (s: ViewerState) => {
    document.cookie = `${STATE_COOKIE}=${s}; path=/; max-age=2592000; samesite=lax`;
    router.refresh();
  };
  return (
    <div role="group" aria-label="Preview as" style={{ position: "fixed", right: 12, bottom: 12, zIndex: 1000, background: "#1A1A1A", color: "#fff", padding: "8px 10px", display: "flex", gap: 6, alignItems: "center", fontSize: 12, fontFamily: "system-ui, sans-serif", boxShadow: "0 2px 12px rgba(0,0,0,.25)", flexWrap: "wrap", maxWidth: "calc(100vw - 24px)" }}>
      <span style={{ opacity: 0.7, letterSpacing: ".08em", textTransform: "uppercase", fontSize: 10 }}>Preview as</span>
      {STATES.map((s) => (
        <button key={s.key} onClick={() => set(s.key)} aria-pressed={current === s.key}
          style={{ minHeight: 32, padding: "0 10px", border: "1px solid #fff", background: current === s.key ? "#fff" : "transparent", color: current === s.key ? "#1A1A1A" : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
          {s.label}
        </button>
      ))}
      <a href="/build-status" style={{ color: "#BFD3F2", marginLeft: 4 }}>All pages</a>
    </div>
  );
}
