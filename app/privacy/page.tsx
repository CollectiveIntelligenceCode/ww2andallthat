import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How WW2 & All That collects and uses your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="max-w-[680px] mx-auto">
        <header className="mb-10 pb-4 border-b-2 border-[#111111]">
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">Legal</p>
          <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Privacy Policy</h1>
          <p className="text-xs font-[var(--font-barlow)] text-[#9CA3AF] mt-2">Last updated: October 2026</p>
        </header>

        <div className="article-prose">
          <p>
            This Privacy Policy explains how James Holland WW2 Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
            uses, and protects your personal data when you use <strong>ww2andallthat.com</strong> and subscribe
            to James Holland&rsquo;s Substack newsletter at <strong>james1940.substack.com</strong>.
          </p>

          <h2>Who we are</h2>
          <p>
            James Holland WW2 Ltd is registered in England and Wales. This website is operated on behalf of
            James Holland, author and historian. For data queries, contact us at
            {" "}<a href="mailto:hello@ww2andallthat.com">hello@ww2andallthat.com</a>.
          </p>

          <h2>What data we collect</h2>
          <p>
            This website itself does not require you to create an account. When you interact with the site,
            the following may be collected:
          </p>
          <ul>
            <li>
              <strong>Reading progress</strong> — stored locally in your browser only (localStorage). This never
              leaves your device and is not sent to any server.
            </li>
            <li>
              <strong>Server logs</strong> — your IP address, browser type, and pages visited, retained briefly
              by our hosting provider (Vercel) for security and performance purposes.
            </li>
            <li>
              <strong>Substack</strong> — if you subscribe via Substack, Substack&rsquo;s own
              {" "}<a href="https://substack.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a> applies.
              We receive your email address and subscription status.
            </li>
          </ul>

          <h2>How we use your data</h2>
          <p>
            We use data solely to operate the website, send newsletters you have opted into, and improve the
            reading experience. We do not sell, rent, or share your personal data with third parties for
            marketing purposes.
          </p>

          <h2>Cookies</h2>
          <p>
            This website does not use tracking or advertising cookies. We use no analytics cookies. Your
            gamification progress is stored in your browser&rsquo;s localStorage, not cookies.
          </p>

          <h2>Your rights (UK GDPR)</h2>
          <p>Under UK GDPR you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request erasure of your data</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with the ICO (<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>)</li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:hello@ww2andallthat.com">hello@ww2andallthat.com</a>.
          </p>

          <h2>Third-party services</h2>
          <ul>
            <li><strong>Vercel</strong> — website hosting (US/EU infrastructure). See Vercel&rsquo;s privacy policy.</li>
            <li><strong>Substack</strong> — newsletter and paid subscription management.</li>
            <li><strong>YouTube</strong> — embedded video content via YouTube&rsquo;s standard embed. YouTube&rsquo;s privacy policy applies.</li>
          </ul>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Significant changes will be notified via the Substack
            newsletter. Continued use of the site constitutes acceptance of the updated policy.
          </p>
        </div>
      </div>
    </div>
  );
}
