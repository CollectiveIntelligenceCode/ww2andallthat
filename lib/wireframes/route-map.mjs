// Route table: site path -> wireframe file per viewer state.
// State = visitor (v), free subscriber (f), paid member (m). One file = same for all states.
// Where the pack has no wireframe for a state, the closest one is used (noted inline).

const all = (file) => ({ v: file, f: file, m: file });
const vfm = (v, f, m) => ({ v, f, m });

/** @type {{ path: string, title: string, section: string, files: {v:string,f:string,m:string} }[]} */
export const ROUTES = [
  // Core
  { path: "", title: "Home", section: "Core", files: vfm("home--visitor", "home--free", "home--member") },
  { path: "start-here", title: "Start here", section: "Core", files: all("start-here") },
  { path: "latest", title: "Latest", section: "Core", files: all("latest") },
  { path: "about", title: "About", section: "Core", files: all("about") },
  { path: "faqs", title: "FAQs and contact", section: "Core", files: all("faqs") },
  { path: "membership", title: "Membership", section: "Core", files: all("membership") },
  { path: "welcome", title: "Welcome modal (first login)", section: "Core", files: all("welcome-modal") },

  // Campaigns
  { path: "campaigns", title: "Campaigns index", section: "Campaigns", files: all("campaigns") },
  // no free wireframe: free subscribers see the visitor hub
  { path: "campaigns/fortress-malta", title: "Campaign hub", section: "Campaigns", files: vfm("campaign-hub--visitor", "campaign-hub--visitor", "campaign-hub--member") },
  { path: "series/boots-on-the-ground", title: "Series page (film)", section: "Campaigns", files: all("series--film") },
  { path: "series/george-cross-at-85", title: "Set-piece series hub", section: "Campaigns", files: all("series--set-piece") },

  // Films
  { path: "films", title: "Films index", section: "Films", files: all("films") },
  { path: "films/fortress-malta", title: "Film post", section: "Films", files: vfm("film--visitor", "film--free", "film--member") },
  { path: "films/fortress-malta-trailer", title: "Film post (trailer as the free version)", section: "Films", files: vfm("film--visitor-trailer", "film--visitor-trailer", "film--member") },

  // Essays
  { path: "essays", title: "Essays index", section: "Essays", files: all("essays") },
  // current flagship, free for a week: no free-tier wireframe, free sees the visitor version
  { path: "essays/the-siege-of-malta", title: "Essay (free this week)", section: "Essays", files: vfm("essay--visitor-free-week", "essay--visitor-free-week", "essay--member") },
  { path: "essays/the-convoy-that-saved-malta", title: "Essay (archive, gated)", section: "Essays", files: vfm("essay--visitor-archive", "essay--free-archive", "essay--member") },
  { path: "essays/gift/siege-of-malta", title: "Essay (opened with a gift link)", section: "Essays", files: vfm("essay--gift-link", "essay--gift-link", "essay--member") },

  // Formats
  { path: "documents/malta-war-diary", title: "Document viewer", section: "Formats", files: vfm("documents--visitor", "documents--visitor", "documents--member") },
  { path: "audio", title: "Audio index", section: "Formats", files: all("formats--audio") },
  { path: "audio/malta-voices", title: "Audio post", section: "Formats", files: all("audio") },
  { path: "galleries", title: "Galleries index", section: "Formats", files: all("formats--galleries") },
  { path: "galleries/malta-1942", title: "Photo gallery (grid)", section: "Formats", files: all("gallery") },
  { path: "galleries/malta-1942/lightbox", title: "Photo gallery (lightbox)", section: "Formats", files: all("gallery--lightbox") },
  { path: "photo-essays/malta-in-photographs", title: "Photo essay", section: "Formats", files: all("photo-essay") },
  { path: "maps", title: "Maps index", section: "Formats", files: all("formats--maps") },
  { path: "downloads", title: "Downloads index", section: "Formats", files: all("formats--downloads") },

  // Search
  { path: "search", title: "Search results", section: "Search", files: all("search--results") },
  { path: "search/opened", title: "Search opened (nothing typed)", section: "Search", files: all("search--opened") },
  { path: "search/typing", title: "Search instant results", section: "Search", files: all("search--typing") },

  // Live, discussions, quizzes, books
  // no visitor/free wireframe for the live room beyond the visitor one
  { path: "live", title: "Live", section: "Live", files: vfm("live--visitor", "live--visitor", "live--member") },
  // discussions run behind sign-in: visitors see the free-subscriber room
  { path: "discussions", title: "Discussions (campaign room)", section: "Discussions", files: vfm("discussions--free", "discussions--free", "discussions--member") },
  { path: "discussions/thread", title: "Discussion thread", section: "Discussions", files: all("discussion-thread") },
  { path: "discussions/ask-james", title: "Ask James room", section: "Discussions", files: all("ask-james-room") },
  { path: "quizzes", title: "Quiz", section: "Quizzes", files: vfm("quizzes--visitor", "quizzes--visitor", "quizzes--member") },
  { path: "quizzes/result", title: "Quiz result", section: "Quizzes", files: all("quiz-result") },
  { path: "books", title: "Books", section: "Books", files: vfm("books--free", "books--free", "books--member") },

  // Account
  { path: "account", title: "Account", section: "Account", files: all("account--account") },
  { path: "account/founding", title: "Account (founding member)", section: "Account", files: all("account--account-founding") },
  { path: "account/subscription", title: "Account: Subscription", section: "Account", files: all("account--subscription") },
  { path: "account/refer", title: "Account: Refer a friend", section: "Account", files: all("account--refer") },
  { path: "account/notifications", title: "Account: Notifications", section: "Account", files: all("account--notifications") },
  { path: "account/library", title: "Account: My library", section: "Account", files: all("account--library") },
  { path: "account/badges", title: "Account: Badges", section: "Account", files: all("account--badges") },

  // Sign in, gifts, founding
  { path: "sign-in", title: "Sign in / subscribe", section: "Sign in", files: all("sign-in--subscribe") },
  { path: "sign-in/returning", title: "Sign in (returning member)", section: "Sign in", files: all("sign-in--returning") },
  { path: "sign-in/sent", title: "Sign in (link sent)", section: "Sign in", files: all("sign-in--sent") },
  { path: "gift", title: "Give a year", section: "Gifts", files: all("gift--give-a-year") },
  { path: "gift/sent", title: "Give a year (sent)", section: "Gifts", files: all("gift--sent") },
  { path: "gift/claim", title: "Claim your gift", section: "Gifts", files: all("gift--claim") },
  { path: "founding/welcome", title: "Founding members: welcome and wall", section: "Gifts", files: all("founding-welcome") },

  // Menus (open from the header; reachable directly for review)
  ...["campaigns", "latest", "films", "essays", "live", "discussions", "books"].map((m) => ({
    path: `menus/${m}`, title: `Menu: ${m[0].toUpperCase()}${m.slice(1)}`, section: "Menus", files: all(`menu--${m}`),
  })),

  // Reference
  { path: "access-states", title: "Access states: the rules", section: "Reference", files: all("access-states-rules") },
  { path: "components/header", title: "Component: header", section: "Reference", files: all("component--header") },
  { path: "components/footer", title: "Component: footer", section: "Reference", files: all("component--footer") },
];

/** wireframe file (no extension, no state-stripping) -> site route. First route to use a file wins. */
export const FILE_TO_ROUTE = {};
for (const r of ROUTES) {
  for (const f of new Set([r.files.v, r.files.f, r.files.m])) {
    const key = `${f}.html`;
    if (!(key in FILE_TO_ROUTE)) FILE_TO_ROUTE[key] = `/${r.path}`;
  }
}
