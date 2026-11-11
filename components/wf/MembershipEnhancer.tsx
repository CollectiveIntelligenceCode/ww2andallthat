"use client";
import { useEffect } from "react";
import { observeWf } from "./observe";

// Makes the Yearly / Monthly switch on /membership work. The Member tier shows
// the matching price and the Founding tier says it is yearly only. The choice
// survives the page being re-rendered (for example when "Preview as" changes).
type Mode = "yearly" | "monthly";
let mode: Mode = "yearly";

const PRICE_STYLE = "font-size: 14px; font-weight: 400; color: #666";

function setHtml(el: Element | null | undefined, html: string) {
  if (el && el.innerHTML !== html) el.innerHTML = html;
}
function setText(el: Element | null | undefined, text: string) {
  if (el && el.textContent !== text) el.textContent = text;
}

function apply() {
  const group = document.querySelector<HTMLElement>(".switch");
  if (!group) return;
  const [yearly, monthly] = Array.from(group.querySelectorAll<HTMLButtonElement>("button"));
  if (!yearly || !monthly) return;

  if (!group.dataset.enh) {
    group.dataset.enh = "1";
    yearly.type = monthly.type = "button";
    yearly.addEventListener("click", () => { mode = "yearly"; apply(); });
    monthly.addEventListener("click", () => { mode = "monthly"; apply(); });
  }

  const isYearly = mode === "yearly";
  yearly.classList.toggle("on", isYearly);
  monthly.classList.toggle("on", !isYearly);
  yearly.setAttribute("aria-pressed", String(isYearly));
  monthly.setAttribute("aria-pressed", String(!isYearly));

  const member = document.querySelector(".tier.featured");
  setHtml(member?.querySelector(".price"), isYearly
    ? `£50 <span style="${PRICE_STYLE}">a year</span>`
    : `£5 <span style="${PRICE_STYLE}">a month</span>`);
  setText(member?.querySelector(":scope > p"), isYearly
    ? "Or £5 a month. Cancel any time."
    : "Or £50 a year and save £10. Cancel any time.");

  const tiers = document.querySelectorAll(".tier");
  const founding = tiers[tiers.length - 1];
  setText(founding?.querySelector(":scope > p"), isYearly
    ? "A limited number of places."
    : "A limited number of places. Founding is yearly only.");
}

export default function MembershipEnhancer() {
  useEffect(() => observeWf(apply), []);
  return null;
}
