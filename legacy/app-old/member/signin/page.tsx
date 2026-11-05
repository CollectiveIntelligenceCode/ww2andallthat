import type { Metadata } from "next";
import GhostSignInForm from "@/components/GhostSignInForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your WW2 & All That subscription.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect = "/", error } = await searchParams;

  return (
    <div className="min-h-[60dvh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-3">
            Subscriber access
          </p>
          <h1 className="font-[var(--font-baskerville)] text-3xl font-bold text-[#111111] mb-3">
            Sign in to your subscription
          </h1>
          <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed">
            Enter your email and we'll send a sign-in link. No password needed.
          </p>
        </div>

        {error && (
          <p className="text-[11px] font-[var(--font-barlow)] text-[#D72638] tracking-wide text-center mb-6">
            {error === "missing_token" ? "Sign-in link was missing. Please try again." : "Sign-in link was invalid or expired. Please request a new one."}
          </p>
        )}

        <GhostSignInForm redirect={redirect} buttonLabel="Send sign-in link" />

        <p className="text-[11px] font-[var(--font-barlow)] text-[#9CA3AF] tracking-wide text-center mt-6">
          Not a subscriber yet?{" "}
          <Link href="/join" className="text-[#111111] hover:text-[#D72638] transition-colors font-semibold">
            Join for £5/month →
          </Link>
        </p>
      </div>
    </div>
  );
}
