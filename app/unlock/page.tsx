import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function unlock(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const from = (formData.get("from") as string) || "/";
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword || password === sitePassword) {
    const cookieStore = await cookies();
    cookieStore.set("ww2_access", sitePassword ?? "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    redirect(from);
  }

  redirect(`/unlock?from=${encodeURIComponent(from)}&error=1`);
}

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from = "/", error } = await searchParams;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-[380px]">
        <div className="mb-10 text-center">
          <p className="font-[var(--font-baskerville)] text-2xl font-bold text-[#111111] mb-1">
            WW2 &amp; All That
          </p>
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF]">
            Preview access
          </p>
        </div>

        <form action={unlock} className="space-y-4">
          <input type="hidden" name="from" value={from} />
          <div>
            <label htmlFor="password" className="block text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              className="w-full border-b-2 border-[#111111] bg-transparent py-2 text-base font-[var(--font-lato)] text-[#111111] outline-none focus:border-[#D72638] transition-colors placeholder:text-[#9CA3AF]"
              placeholder="Enter preview password"
            />
          </div>
          {error && (
            <p className="text-[11px] font-[var(--font-barlow)] text-[#D72638] tracking-wide">
              Incorrect password. Try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-[#111111] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#D72638] transition-colors active:scale-[0.98]">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
