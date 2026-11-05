# WW2 & All That — website scoping pack for Collective Intelligence

James Holland WW2 Ltd · prepared by Paul Davis · 28 October 2026

This is the scope for the vanilla build that starts on 2 November 2026: the project plan, and a full set of unbranded, responsive wireframes. Everything in here is the same as the live working copies (the plan is exported at revision 153; the wireframes are the canvas as of today). If the two ever disagree, say so and we will fix the source, not the export.

## What is in the pack

**01 Project plan** — the Website Launch Project Plan in three formats: `.md` (with the three diagrams as PNGs in `images/`), `.docx` and `.pdf` (A4, 32 pages). Eleven workstreams, the timeline, the architecture, the content model and Ghost mechanics, the tag convention, the sitemap, the access rules, migration, gamification, email, UAT, risks and open decisions. Workstream 2 (content types and integrations) and Workstream 5 (gamification and the service layer) are the ones the build mostly lives in.

**02 Wireframes (responsive HTML)** — 73 standalone HTML pages plus `index.html`. Open `index.html` in a browser: the left column lists every page by section, the preview switches between desktop (1280) and phone (390), and "open in a new tab" gives you the bare page. Each file is self-contained (CSS inlined, no build step, no external requests) and responsive: the mobile layout is driven by CSS container queries on the `.page` wrapper, so the same file works at any width and inside any frame.

Pages that change by who is looking are exported once per state, named `page--state.html`:

- `--visitor` not logged in · `--free` logged in on the free tier · `--member` paid (Member or Founding)
- Essay also has `--visitor-free-week` (the current flagship, free for a week), `--visitor-archive` / `--free-archive` (older flagship, gated) and `--gift-link` (opened through a member's gift link)
- Film has `--visitor-trailer`: the free version is a trailer rather than a short cut, chosen per film in Ghost with an internal tag; the gate copy follows

Start with `access-states-rules.html` (under Reference): one table of what each kind of visitor sees on every page, and the four devices used to do it — hard gate, cover, soft prompt, lock label + sticky bar.

## How to read the wireframes

- They are vanilla on purpose. System font, grey boxes, one accent colour. The brand (type, colour, logo) arrives mid-December and is applied as a separate step (plan, Timeline). Do not design to these; build to them.
- Layout, hierarchy, states, copy tone and the order things appear in are the spec. Exact pixel values are not; where a measurement matters it is in the CSS.
- Copy is placeholder but written to length and tone, so it is a fair guide to how much text each slot holds. Dates, counts and names are invented.
- Links between pages work and go to the default state of the target page.
- Comment counts on cards appear only above a threshold (5 at launch); likes never appear on cards. "James replied" is a service-side flag. See plan, Workstream 2, navigation and page rules.
- Discussions (campaign room, thread, Ask James) run on Discourse behind Ghost sign-in. Those wireframes are the styling target for a Discourse theme, not pages to build from scratch.

## The things most likely to need a conversation

1. **Film post pattern**: one URL, both cuts in the Ghost post split at the paywall divider, the front end renders exactly one player chosen by tier, master cut via signed playback URL. Plan, Workstream 2, "Film post pattern".
2. **Comment counts**: Ghost's Content API does not return them; one batched call per page to the comment-counts endpoint Ghost's own comments UI uses (Members API). Confirm path and request shape against the deployed Ghost version.
3. **Archive lock**: a flagship flips from Public to Paid the Friday after publication; the service runs this on a schedule. Decided; adjustable later.
4. **Gift membership**: own-built (Ghost has no gift purchase). Stripe Checkout one-off → webhook → complimentary subscription via Admin API with a year's expiry → claim email on the chosen day. Plan, Workstream 3.
5. **Founding members**: no address at checkout; asked for afterwards by email and on the founding welcome page, entered under Account. The site never shows founding places sold or remaining.
6. **Search**: Typesense or Meilisearch indexed from Ghost webhooks; posts, timestamped transcripts, document text per page, Discourse topics. Members' content indexed and shown to everyone; access enforced on open. Transcript hits deep-link to the timestamp, document hits to the page.
7. **On-site notifications**: a bell in the header fed from the service's events table, each with an on/off beside its email twin under Account › Notifications. In the vanilla build.

## Not in this pack, on purpose

The brand guide (mid-December), the content schedule and budget workbooks (not needed for the build), and the "Why Ghost" stakeholder deck. Ask if any of them would help.

## Questions

Paul Davis, James Holland WW2 Ltd — paul@ww2andallthat.com
