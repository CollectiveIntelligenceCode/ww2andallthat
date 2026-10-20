// Client-side reading progress tracking via localStorage
// All functions guard against SSR (window undefined)

export const RANKS = [
  { name: "Civilian",    min: 0,   stars: 0 },
  { name: "Private",     min: 1,   stars: 1 },
  { name: "Lance Cpl",  min: 5,   stars: 2 },
  { name: "Corporal",   min: 10,  stars: 3 },
  { name: "Sergeant",   min: 20,  stars: 4 },
  { name: "Lieutenant", min: 35,  stars: 5 },
  { name: "Captain",    min: 55,  stars: 6 },
  { name: "Major",      min: 80,  stars: 7 },
  { name: "Colonel",    min: 110, stars: 8 },
  { name: "Field Marshal", min: 150, stars: 9 },
] as const;

export type Rank = (typeof RANKS)[number];

export function getRank(count: number): Rank {
  return [...RANKS].reverse().find(r => count >= r.min) ?? RANKS[0];
}

export function getNextRank(count: number): Rank | null {
  return RANKS.find(r => r.min > count) ?? null;
}

export function getReadArticles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("ww2_read") ?? "[]");
  } catch { return []; }
}

export function markArticleRead(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const read = getReadArticles();
    if (!read.includes(slug)) {
      localStorage.setItem("ww2_read", JSON.stringify([...read, slug]));
      updateStreak();
    }
  } catch {}
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const data = JSON.parse(localStorage.getItem("ww2_streak") ?? "{}") as {
      lastRead?: string; streak?: number;
    };
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];
    if (data.lastRead === today || data.lastRead === yesterday) return data.streak ?? 0;
    return 0;
  } catch { return 0; }
}

export function updateStreak(): void {
  if (typeof window === "undefined") return;
  try {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];
    const data = JSON.parse(localStorage.getItem("ww2_streak") ?? "{}") as {
      lastRead?: string; streak?: number;
    };
    let streak = 1;
    if (data.lastRead === yesterday) streak = (data.streak ?? 0) + 1;
    else if (data.lastRead === today) streak = data.streak ?? 1;
    localStorage.setItem("ww2_streak", JSON.stringify({ lastRead: today, streak }));
  } catch {}
}
