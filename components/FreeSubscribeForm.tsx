"use client";
import { useState, useRef } from "react";

interface Props {
  dark?: boolean; // true = white text on dark background
  placeholder?: string;
  buttonLabel?: string;
}

export default function FreeSubscribeForm({
  dark = false,
  placeholder = "Your email address",
  buttonLabel = "Subscribe free",
}: Props) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? "";
    if (!email) return;

    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (data.success) {
        setState("success");
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
      setState("error");
    }
  }

  const labelColor = dark ? "text-white/40" : "text-[#9CA3AF]";
  const inputBorder = dark ? "border-white/20 text-white placeholder:text-white/30 bg-transparent focus:border-white" : "border-[#111111] text-[#111111] placeholder:text-[#9CA3AF] bg-transparent focus:border-[#D72638]";
  const btnBase = "px-6 py-2.5 text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase transition-colors active:scale-[0.98] whitespace-nowrap";
  const btnColor = dark ? "bg-[#D72638] text-white hover:bg-[#B91C2C]" : "bg-[#111111] text-white hover:bg-[#D72638]";

  if (state === "success") {
    return (
      <div className="text-center">
        <p className={`font-[var(--font-baskerville)] text-lg font-bold mb-1 ${dark ? "text-white" : "text-[#111111]"}`}>
          You&apos;re in.
        </p>
        <p className={`text-sm font-[var(--font-lato)] ${labelColor}`}>
          Check your inbox for a confirmation from James.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          ref={inputRef}
          type="email"
          required
          placeholder={placeholder}
          disabled={state === "loading"}
          className={`flex-1 border-b-2 py-2.5 text-sm font-[var(--font-lato)] outline-none transition-colors ${inputBorder}`}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className={`${btnBase} ${btnColor} disabled:opacity-50`}
        >
          {state === "loading" ? "Subscribing..." : buttonLabel}
        </button>
      </div>
      {state === "error" && (
        <p className="text-[11px] font-[var(--font-barlow)] text-[#D72638] tracking-wide mt-2 text-center">
          {errorMsg}
        </p>
      )}
      <p className={`text-[11px] font-[var(--font-barlow)] tracking-wide mt-3 text-center ${labelColor}`}>
        Free forever. No card required.
      </p>
    </form>
  );
}
