import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How WW2 & All That uses cookies and local browser storage.",
};

export default function CookiesPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="max-w-[680px] mx-auto">
        <header className="mb-10 pb-4 border-b-2 border-[#111111]">
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">Legal</p>
          <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Cookie Policy</h1>
          <p className="text-xs font-[var(--font-barlow)] text-[#9CA3AF] mt-2">Last updated: October 2026</p>
        </header>

        <div className="article-prose">
          <p>
            This Cookie Policy explains how <strong>ww2andallthat.com</strong> uses cookies and similar
            browser storage technologies. We take a minimal approach: this website does not use
            advertising, tracking, or analytics cookies.
          </p>

          <h2>What are cookies?</h2>
          <p>
            Cookies are small files stored in your browser by a website. They are used to remember
            preferences, track sessions, and enable certain features. Some cookies are set by the
            website itself; others are set by third-party services embedded in the page.
          </p>

          <h2>Cookies we use</h2>
          <p>
            <strong>This website does not set any tracking, advertising, or analytics cookies.</strong>
          </p>
          <p>
            We use <strong>localStorage</strong> (a browser storage mechanism similar to cookies,
            but not transmitted to servers) for the following purposes:
          </p>
          <ul>
            <li>
              <strong>Reading progress</strong> (<code>ww2_read</code>) — stores the slugs of
              articles you have read, to power the rank and gamification features on your profile page.
            </li>
            <li>
              <strong>Reading streak</strong> (<code>ww2_streak</code>) — stores the date of your
              last reading session and your current streak count.
            </li>
          </ul>
          <p>
            This data is stored only in your own browser. It is never sent to our servers, never
            shared with third parties, and is not linked to any personal identity or account.
          </p>

          <h2>Third-party cookies</h2>
          <p>
            Third-party services embedded on this website may set their own cookies:
          </p>
          <ul>
            <li>
              <strong>Substack</strong> — if you click a Subscribe link and visit Substack,
              Substack&rsquo;s own cookie policy applies. Substack may set session and authentication
              cookies on their domain.
            </li>
            <li>
              <strong>YouTube</strong> — embedded YouTube video players may set cookies when you
              interact with them (play a video). YouTube&rsquo;s cookie policy governs this use.
              We use standard YouTube embeds (not the privacy-enhanced mode), which may set
              analytics cookies on playback.
            </li>
            <li>
              <strong>Vercel</strong> — our hosting provider may set technical cookies for
              performance and security purposes (e.g., bot detection). These are strictly necessary.
            </li>
          </ul>

          <h2>Strictly necessary storage</h2>
          <p>
            The localStorage items listed above (<code>ww2_read</code>, <code>ww2_streak</code>)
            are strictly functional and power features you use voluntarily (the rank and profile
            pages). They are not required for basic browsing of the site and can be cleared at
            any time from the{" "}
            <a href="/profile">profile page</a> or through your browser&rsquo;s developer tools.
          </p>

          <h2>How to manage cookies and storage</h2>
          <p>
            You can clear your reading history and streak at any time by visiting the{" "}
            <a href="/profile">Your Record</a> page and clicking &ldquo;Clear record&rdquo;.
          </p>
          <p>
            You can also manage all cookies and localStorage through your browser settings:
          </p>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Clear browsing data</li>
            <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Privacy, search and services → Clear browsing data</li>
          </ul>
          <p>
            Note that clearing cookies and storage will reset your reading record and rank.
          </p>

          <h2>Do we use consent banners?</h2>
          <p>
            Because we do not use any tracking, advertising, or analytics cookies, we do not
            require a cookie consent banner under the UK&rsquo;s PECR (Privacy and Electronic
            Communications Regulations) or UK GDPR. The only storage we use is strictly functional
            and user-initiated.
          </p>
          <p>
            If we introduce any third-party analytics or advertising services in the future, we
            will update this policy and add appropriate consent mechanisms before doing so.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy:{" "}
            <a href="mailto:hello@ww2andallthat.com">hello@ww2andallthat.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
