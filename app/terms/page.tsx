import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using WW2 & All That.",
};

export default function TermsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="max-w-[680px] mx-auto">
        <header className="mb-10 pb-4 border-b-2 border-[#111111]">
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">Legal</p>
          <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Terms of Use</h1>
          <p className="text-xs font-[var(--font-barlow)] text-[#9CA3AF] mt-2">Last updated: October 2026</p>
        </header>

        <div className="article-prose">
          <p>
            These Terms of Use govern your access to and use of{" "}
            <strong>ww2andallthat.com</strong>, operated by James Holland WW2 Ltd, a company registered
            in England and Wales. By using this website you agree to these terms.
          </p>

          <h2>Intellectual property</h2>
          <p>
            All content on this website — including articles, photographs, illustrations, book covers, and
            video content — is the intellectual property of James Holland and James Holland WW2 Ltd, or
            is reproduced with permission. You may not reproduce, distribute, or republish any content
            without prior written consent.
          </p>
          <p>
            Short quotations (up to 150 words) may be reproduced for non-commercial purposes provided
            clear attribution is given and a link back to the original article is included.
          </p>

          <h2>Subscriber content</h2>
          <p>
            Paid subscription access is provided through Substack. Paid content is for personal use only
            and may not be shared, redistributed, or republished. Subscription fees are charged by Substack
            and Substack&rsquo;s terms apply to the subscription relationship.
          </p>

          <h2>Accuracy of information</h2>
          <p>
            While we make every effort to ensure accuracy, historical analysis and opinion pieces represent
            the personal views of the author. Errors and omissions may occur. If you believe an article
            contains a factual error, please contact us at{" "}
            <a href="mailto:hello@ww2andallthat.com">hello@ww2andallthat.com</a>.
          </p>

          <h2>External links</h2>
          <p>
            This website links to third-party sites including Substack, YouTube, and book retailers. We are
            not responsible for the content or privacy practices of those sites.
          </p>

          <h2>Disclaimer of warranties</h2>
          <p>
            This website is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee
            continuous, uninterrupted access to the site.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, James Holland WW2 Ltd shall not be liable for any
            indirect, incidental, or consequential loss arising from your use of this website.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of England and Wales. Disputes are subject to the exclusive
            jurisdiction of the courts of England and Wales.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms:{" "}
            <a href="mailto:hello@ww2andallthat.com">hello@ww2andallthat.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
