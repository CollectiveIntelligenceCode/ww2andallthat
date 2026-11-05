import Link from "next/link";
import { getGhostPosts, getGhostPostsByTag } from "@/lib/ghost-content";
import type { Post } from "@/lib/types";

export const revalidate = 1800;

// ── Helpers ──────────────────────────────────────────────────────────────────

function readingLabel(post: Post) {
  if (post.readingTime) return `${post.readingTime} min read`;
  return "";
}

function dateLabel(post: Post) {
  return new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function AccessTag({ post }: { post: Post }) {
  if (!post.isPaid) return <span className="tag free">Free</span>;
  return <span className="tag members">Members</span>;
}

function PostImage({ post, ratio = "4 / 3", label }: { post: Post; ratio?: string; label?: string }) {
  if (post.coverImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={post.coverImage}
        alt={post.title}
        style={{ aspectRatio: ratio, width: "100%", objectFit: "cover", display: "block" }}
      />
    );
  }
  return (
    <div className="ph" style={{ aspectRatio: ratio }}>
      {label ?? "Image"}
    </div>
  );
}

// ── Sections ─────────────────────────────────────────────────────────────────

function LeadSection({ posts }: { posts: Post[] }) {
  const hero = posts[0];
  const leftCards = posts.slice(1, 4);
  const rightCards = posts.slice(4, 7);

  if (!hero) {
    return (
      <section className="lead" aria-label="This week">
        <div className="side" />
        <div className="hero">
          <span className="kicker">Coming soon</span>
          <h1>WW2 &amp; All That</h1>
          <p>History, analysis, and storytelling about World War Two by James Holland.</p>
        </div>
        <div className="side" />
      </section>
    );
  }

  return (
    <section className="lead" aria-label="This week">
      <div className="side">
        {leftCards.map(post => (
          <article key={post._id} className="card">
            <span className="kicker">{post.tags?.[0] ?? "Analysis"}</span>
            <h3><Link href={`/articles/${post.slug.current}`}>{post.title}</Link></h3>
            <div className="row">
              <span className="meta">{readingLabel(post)}</span>
              <AccessTag post={post} />
            </div>
          </article>
        ))}
      </div>

      <div className="hero">
        <span className="kicker">This week · {hero.tags?.[0] ?? "Featured"}</span>
        <h1><Link href={`/articles/${hero.slug.current}`}>{hero.title}</Link></h1>
        <PostImage post={hero} ratio="16 / 10" label="Hero image · 16:10" />
        {hero.excerpt && <p>{hero.excerpt}</p>}
        <div className="row" style={{ justifyContent: "center" }}>
          <span className="meta">{dateLabel(hero)}</span>
          <AccessTag post={hero} />
        </div>
      </div>

      <div className="side">
        {rightCards.map(post => (
          <article key={post._id} className="card">
            <span className="kicker">{post.tags?.[0] ?? "Analysis"}</span>
            <h3><Link href={`/articles/${post.slug.current}`}>{post.title}</Link></h3>
            {post.excerpt && <p>{post.excerpt}</p>}
            <div className="row">
              <span className="meta">{readingLabel(post)}</span>
              <AccessTag post={post} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LessonsSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="section" aria-label="Lessons of History">
      <div className="sec-head">
        <h2>Lessons of History</h2>
        <Link href="/articles?type=lessons">See all →</Link>
      </div>
      <div className="grid-3">
        {posts.slice(0, 3).map(post => (
          <article key={post._id} className="card">
            <PostImage post={post} ratio="4 / 3" />
            <span className="kicker">Lessons of History</span>
            <h3><Link href={`/articles/${post.slug.current}`}>{post.title}</Link></h3>
            <div className="row">
              <span className="meta">{readingLabel(post)}</span>
              <AccessTag post={post} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FilmsSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="section" aria-label="Films">
      <div className="sec-head">
        <h2>Films</h2>
        <Link href="/videos">All films →</Link>
      </div>
      <div className="grid-3">
        {posts.slice(0, 3).map(post => (
          <article key={post._id} className="card">
            <PostImage post={post} ratio="16 / 9" label="Video · 16:9" />
            <span className="kicker">{post.tags?.[0] ?? "Film"}</span>
            <h3><Link href={`/articles/${post.slug.current}`}>{post.title}</Link></h3>
            <div className="row">
              <span className="meta">{readingLabel(post)}</span>
              <AccessTag post={post} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function NewsletterBand() {
  return (
    <section className="band" aria-label="Newsletter sign-up">
      <span className="kicker" style={{ color: "#BFD3F2" }}>Every Friday</span>
      <h3>This week&apos;s essay and every short cut, in your inbox each Friday</h3>
      <form>
        <label htmlFor="nl-email" style={{ position: "absolute", left: -9999 }}>Email address</label>
        <input id="nl-email" type="email" placeholder="Type your email" />
        <button type="submit">Subscribe free</button>
      </form>
    </section>
  );
}

function DiscussionsSection() {
  const threads = [
    { title: "Ask James: your questions for the next live chat", meta: "Ask James · Open" },
    { title: "What made the difference: air cover or convoy timing?", meta: "Discussions · this week" },
    { title: "Introduce yourself: where did your interest in the war begin?", meta: "General · always open" },
  ];
  return (
    <section className="section" aria-label="Discussions">
      <div className="sec-head">
        <h2>Discussions</h2>
        <Link href="/discussions">All rooms →</Link>
      </div>
      {threads.map((t, i) => (
        <div key={i} className="thread" style={i === threads.length - 1 ? { borderBottom: 0 } : {}}>
          <span className="avatar" />
          <div className="card">
            <h3 style={{ fontSize: 16 }}><Link href="/discussions">{t.title}</Link></h3>
            <span className="meta">{t.meta}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

function FoundingPromo() {
  return (
    <section className="promo-band" aria-label="Founding membership">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="kicker">Founding members</span>
        <h3>Back the first year, and get every new book signed</h3>
        <p>A limited number of founding places: signed copies, your name in the credits, first refusal on tours.</p>
        <Link href="/join" style={{ fontSize: 14, fontWeight: 700, color: "#2457A6" }}>Founding places →</Link>
      </div>
      <div className="ph" style={{ aspectRatio: "4 / 3" }}>Promo image</div>
    </section>
  );
}

function StartHere() {
  return (
    <section className="section" aria-label="Start here">
      <div className="sec-head">
        <h2><Link href="/start-here" style={{ color: "inherit", textDecoration: "none" }}>New here? Start here</Link></h2>
        <Link href="/start-here">The whole guide →</Link>
      </div>
      <div className="steps">
        <div className="step">
          <b>1</b>
          <div className="card">
            <h3 style={{ fontSize: 16 }}>Read this week&apos;s essay</h3>
            <p>Every Friday flagship is free the week it comes out.</p>
          </div>
        </div>
        <div className="step">
          <b>2</b>
          <div className="card">
            <h3 style={{ fontSize: 16 }}>Follow a campaign</h3>
            <p>Each block tells one story in order. Start at part one.</p>
          </div>
        </div>
        <div className="step">
          <b>3</b>
          <div className="card">
            <h3 style={{ fontSize: 16 }}>Become a member</h3>
            <p>Full films, the archive, live chats, downloads, quizzes and discussions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MembershipSection() {
  return (
    <section className="join" aria-label="Membership">
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="sec-head" style={{ borderBottomColor: "#1A1A1A" }}>
          <h2>Membership</h2>
          <Link href="/join">Compare in full →</Link>
        </div>
        <div className="tiers">
          <div className="tier">
            <span className="kicker">Free</span>
            <span className="price">£0</span>
            <ul>
              <li>This week&apos;s essay, in full</li>
              <li>Lessons of History</li>
              <li>Short cuts of every film</li>
            </ul>
            <Link href="/join" className="btn">Subscribe free</Link>
          </div>
          <div className="tier" style={{ borderColor: "#2457A6" }}>
            <span className="kicker">Member</span>
            <span className="price">
              £5 <span style={{ fontSize: 14, fontWeight: 400, color: "#666" }}>a month, or £50 a year</span>
            </span>
            <ul>
              <li>Full master-cut films with archive</li>
              <li>The whole archive and downloads</li>
              <li>Live chats, quizzes, discussions</li>
            </ul>
            <Link href="/join" className="btn primary">Become a member</Link>
          </div>
          <div className="tier">
            <span className="kicker">Founding</span>
            <span className="price">
              £250 <span style={{ fontSize: 14, fontWeight: 400, color: "#666" }}>a year, limited</span>
            </span>
            <ul>
              <li>Everything in Member</li>
              <li>A signed copy of every new book</li>
              <li>Credits, first refusal on tours</li>
            </ul>
            <Link href="/join" className="btn">Founding places</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [allPosts, lessonsPosts, filmPosts] = await Promise.all([
    getGhostPosts(20),
    getGhostPostsByTag("lessons", 3),
    getGhostPostsByTag("film", 3),
  ]);

  const lessonsFallback = lessonsPosts.length
    ? lessonsPosts
    : allPosts.filter(p => p.contentType === "lessons").slice(0, 3);

  const filmsFallback = filmPosts.length
    ? filmPosts
    : allPosts.filter(p => p.contentType === "film").slice(0, 3);

  const campaignPosts = allPosts
    .filter(p => p.contentType === "flagship" || p.contentType === "film")
    .slice(0, 4);

  return (
    <>
      <div className="wrap" style={{ flexGrow: 1 }}>
        <LeadSection posts={allPosts} />
        <LessonsSection posts={lessonsFallback} />

        {/* Campaign section */}
        <section className="section" aria-label="Current campaign">
          <div className="sec-head">
            <h2>Campaign · Latest block</h2>
            <Link href="/campaigns">Go to the hub →</Link>
          </div>
          {campaignPosts.length > 0 ? (
            <div className="grid-4">
              {campaignPosts.map((post, i) => (
                <article key={post._id} className="card">
                  <PostImage post={post} ratio="4 / 3" label={post.contentType === "film" ? "Film" : "Essay"} />
                  <span className="kicker">Part {i + 1} · {post.contentType === "film" ? "Film" : "Essay"}</span>
                  <h3><Link href={`/articles/${post.slug.current}`}>{post.title}</Link></h3>
                  <AccessTag post={post} />
                </article>
              ))}
            </div>
          ) : (
            <div className="grid-4">
              {["Why start here: the story so far", "The first film", "Map pack", "Documents preview"].map((title, i) => (
                <article key={i} className="card">
                  <div className="ph" style={{ aspectRatio: "4 / 3" }}>{i % 2 === 0 ? "Essay" : "Film"}</div>
                  <span className="kicker">Part {i + 1}</span>
                  <h3>{title}</h3>
                  <span className="tag members">Members</span>
                </article>
              ))}
            </div>
          )}
        </section>

        <FilmsSection posts={filmsFallback} />
        <NewsletterBand />

        {/* Live and quiz */}
        <section className="section" aria-label="Live and quiz">
          <div className="grid-2">
            <div className="panel">
              <span className="kicker">Next live chat</span>
              <h3>Live with James Holland</h3>
              <p style={{ fontSize: 15, color: "#444" }}>Members only · recorded and kept. See the events page for the next session.</p>
              <div className="row">
                <Link href="/events" className="btn primary">See upcoming events</Link>
              </div>
            </div>
            <div className="panel">
              <span className="kicker">Quizzes</span>
              <h3>Test your knowledge</h3>
              <p style={{ fontSize: 15, color: "#444" }}>Weekly quizzes tied to the current campaign. Members only. Leaderboard tracked.</p>
              <div className="row">
                <Link href="/quizzes" className="btn primary">Take a quiz</Link>
              </div>
            </div>
          </div>
        </section>

        <DiscussionsSection />
        <FoundingPromo />
        <StartHere />
      </div>

      <MembershipSection />
    </>
  );
}
