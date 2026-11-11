import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findRoute, readFragment } from "@/lib/wireframes";
import { getEssay, getEssays } from "@/lib/wireframes/content";
import { hydrateCards, hydrateEssay, hydrateHero, hydrateList, wireNavLinks } from "@/lib/wireframes/hydrate";
import { resolveState } from "@/lib/wireframes/state";
import StateBar from "@/components/wf/StateBar";
import LinkInterceptor from "@/components/wf/LinkInterceptor";
import Enhancers from "@/components/wf/Enhancers";

type Props = { params: Promise<{ slug?: string[] }> };

const STATIC_ONLY = /^(access-states|components|menus)/;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const route = findRoute(slug);
  if (route) return { title: route.title };
  if (slug?.[0] === "essays" && slug.length === 2) {
    const e = await getEssay(slug[1]);
    if (e) return { title: e.title, description: e.excerpt.slice(0, 160) };
  }
  return { title: "Not found" };
}

export default async function WireframePage({ params }: Props) {
  const slug = (await params).slug;
  const { state } = await resolveState();
  let html: string;

  const route = findRoute(slug);
  if (route) {
    html = readFragment(route.files[state]);
    if (!STATIC_ONLY.test(route.path)) {
      const essays = await getEssays();
      if (route.path === "" && essays.length) {
        html = hydrateHero(html, essays[0]);
        html = hydrateCards(html, essays.slice(1));
      } else if (route.path === "latest" || route.path === "essays") {
        html = hydrateList(hydrateCards(html, essays), essays);
      } else {
        html = hydrateCards(html, essays);
      }
    }
  } else if (slug?.[0] === "essays" && slug.length === 2) {
    const essay = await getEssay(slug[1]);
    if (!essay) notFound();
    const gated = essay.paid && state !== "m";
    const file = state === "m" ? "essay--member" : gated ? (state === "f" ? "essay--free-archive" : "essay--visitor-archive") : "essay--visitor-free-week";
    const more = (await getEssays()).filter((e) => e.slug !== essay.slug).slice(0, 12);
    html = hydrateEssay(readFragment(file), essay, gated, more);
  } else {
    notFound();
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: wireNavLinks(html) }} />
      <LinkInterceptor />
      <Enhancers />
      <StateBar current={state} />
    </>
  );
}
