import { NextResponse } from "next/server";
import { getEssays } from "@/lib/wireframes/content";
import { searchDocs } from "@/lib/wireframes/search";

export async function GET(req: Request) {
  const query = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 200);
  if (!query) return NextResponse.json({ query, results: [] });
  const essays = await getEssays();
  return NextResponse.json({ query, results: searchDocs(essays, query, 20) });
}
