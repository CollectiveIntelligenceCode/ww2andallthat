"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { QUIZ, QUIZ_TITLE } from "@/lib/wireframes/quiz-data";

// Runs a real multiple-choice quiz inside the member quiz wireframe and fills the
// result wireframe from localStorage. Delegated listeners, scoped to the .quiz box.
const KEY = "ww2_quiz_last";
type Last = { score: number; total: number; at: number; answers?: number[] };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function readLast(): Last | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null");
    if (v && typeof v.score === "number" && typeof v.total === "number" && v.total > 0) return v;
  } catch {}
  return null;
}
function saveLast(v: Last) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
}

function headline(score: number, total: number): string {
  const r = score / total;
  if (score === total) return "A full house. Outstanding.";
  if (r >= 0.75) return `Good. ${total - score} more and it was a full house.`;
  if (r >= 0.5) return "A solid effort. Worth another go for practice.";
  return "A tough one. The campaign pages will help.";
}

function fillResult() {
  const last = readLast();
  const box = document.querySelector<HTMLElement>(".result");
  if (!last || !box || box.dataset.wfFilled) return;
  box.dataset.wfFilled = "1";
  const { score, total } = last;
  const big = box.querySelector<HTMLElement>(".big");
  if (big) {
    big.innerHTML = `${score}<span style="font-size: 28px; color: #666; font-weight: 600">/${total}</span>`;
  }
  const head = box.querySelector<HTMLElement>(".pts b");
  if (head) head.textContent = headline(score, total);
  const sub = box.querySelector<HTMLElement>(".pts span");
  if (sub) {
    const d = new Date(last.at);
    sub.textContent = `Scored attempt · ${d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}, ${d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })}`;
  }
  const earn = box.querySelectorAll<HTMLElement>(".earn > div");
  const pts = earn[0]?.querySelector("b");
  if (pts) pts.textContent = `+${score * 10}`;
  if (earn[1]) {
    const b = earn[1].querySelector("b");
    const s = earn[1].querySelector("span");
    if (b) b.textContent = score === total ? "+20" : "+0";
    if (s) s.textContent = score === total ? "Full score bonus" : "Full score bonus · not this time";
  }
  if (earn[2]) earn[2].remove();
  const badgeup = box.querySelector<HTMLElement>(".badgeup");
  if (badgeup) badgeup.remove();

  const lb = document.querySelector<HTMLElement>(".lb");
  const me = lb ? Array.from(lb.children).find((c) => /you/i.test(c.textContent || "")) : null;
  const sc = me?.querySelector<HTMLElement>(".score");
  if (sc) sc.textContent = String(score * 10);

  const review = document.querySelector<HTMLElement>(".review");
  if (review && last.answers && last.answers.length === QUIZ.length && total === QUIZ.length) {
    review.innerHTML = QUIZ.map((q, i) => {
      const ok = last.answers![i] === q.a;
      const extra = ok
        ? `<span class="meta">${esc(q.o[q.a])}</span>`
        : `<span class="meta">You said ${esc(q.o[last.answers![i]] ?? "nothing")}; it was ${esc(q.o[q.a])}. ${esc(q.why)}</span>`;
      return `<div><span class="${ok ? "ok" : "no"}">${ok ? "✓" : "✗"}</span><span>${i + 1} · ${esc(q.q)} ${ok ? "" : extra}</span>${ok ? extra : "<span></span>"}</div>`;
    }).join("");
  }
  const crumb = document.querySelector<HTMLElement>(".crumb");
  if (crumb) {
    const a = crumb.querySelector("a");
    crumb.textContent = "";
    if (a) crumb.appendChild(a);
    crumb.appendChild(document.createTextNode(` · ${QUIZ_TITLE}`));
  }
}

export default function QuizEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/quizzes/result")) {
      fillResult();
      const mo = new MutationObserver(fillResult);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }
    if (!pathname.startsWith("/quizzes")) return;

    let idx = 0;
    let score = 0;
    let answered = false;
    let answers: number[] = [];
    let started = false;

    const quizEl = () =>
      document.querySelector<HTMLElement>("main .quiz");
    const isMember = () => !document.querySelector(".gate-cta") && !!quizEl();

    const renderIntro = () => {
      const el = quizEl();
      if (!el || !isMember()) return;
      started = false;
      el.dataset.wfQuiz = "1";
      el.innerHTML = `<div class="qbar"><span>${QUIZ.length} questions</span><span>${esc(QUIZ_TITLE)}</span></div>
<div class="progress"><span style="width: 0%"></span></div>
<p class="q">Ready? ${QUIZ.length} questions on Malta, the Battle of Britain and the wider war. One answer is right each time.</p>
<div class="row" style="justify-content: space-between"><span class="meta">Explanations appear after every answer, right or wrong</span><button class="btn primary" data-wf-start>Start quiz</button></div>`;
    };

    const renderQ = () => {
      const el = quizEl();
      if (!el) return;
      const q = QUIZ[idx];
      answered = false;
      el.innerHTML = `<div class="qbar"><span>Question ${idx + 1} of ${QUIZ.length}</span><span>Score so far: ${score}</span></div>
<div class="progress"><span style="width: ${Math.round((idx / QUIZ.length) * 100)}%"></span></div>
<p class="q">${esc(q.q)}</p>
<div class="opts">${q.o
        .map((t, i) => `<button class="opt" data-wf-opt="${i}"><span class="k">${"ABCD"[i]}</span>${esc(t)}</button>`)
        .join("")}</div>
<div data-wf-fb></div>
<div class="row" style="justify-content: space-between"><span class="meta">Explanations appear after every answer, right or wrong</span><button class="btn primary" data-wf-next disabled>${idx === QUIZ.length - 1 ? "See result" : "Next question"}</button></div>`;
    };

    const answer = (choice: number) => {
      const el = quizEl();
      if (!el || answered) return;
      answered = true;
      const q = QUIZ[idx];
      answers[idx] = choice;
      const ok = choice === q.a;
      if (ok) score++;
      el.querySelectorAll<HTMLElement>(".opt").forEach((b, i) => {
        b.setAttribute("disabled", "");
        if (i === q.a) b.classList.add("right");
        else if (i === choice) b.classList.add("picked");
      });
      const fb = el.querySelector<HTMLElement>("[data-wf-fb]");
      if (fb) {
        fb.className = "explain";
        fb.setAttribute("role", "status");
        fb.innerHTML = `<b>${ok ? "Correct." : "Not quite."}</b> ${esc(q.why)}`;
      }
      const next = el.querySelector<HTMLButtonElement>("[data-wf-next]");
      if (next) { next.disabled = false; next.focus(); }
      const qbar = el.querySelector(".qbar span:last-child");
      if (qbar) qbar.textContent = `Score so far: ${score}`;
    };

    const finish = () => {
      saveLast({ score, total: QUIZ.length, at: Date.now(), answers });
      window.location.assign("/quizzes/result");
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const el = quizEl();

      if (el && el.contains(t)) {
        if (t.closest("[data-wf-start]")) {
          e.preventDefault();
          idx = 0; score = 0; answers = []; started = true;
          renderQ();
          return;
        }
        const opt = t.closest<HTMLElement>("[data-wf-opt]");
        if (opt) {
          e.preventDefault();
          answer(Number(opt.dataset.wfOpt));
          return;
        }
        if (t.closest("[data-wf-next]")) {
          e.preventDefault();
          if (!answered) return;
          if (idx >= QUIZ.length - 1) finish();
          else { idx++; renderQ(); }
          return;
        }
        return;
      }

      // "Take it" / "Replay for practice" links in the member wireframe start the quiz.
      const a = t.closest("a");
      if (a && el && isMember() && /replay for practice|take it/i.test(a.textContent || "")) {
        e.preventDefault();
        idx = 0; score = 0; answers = []; started = true;
        renderQ();
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    const init = () => {
      const el = quizEl();
      if (el && isMember() && !el.dataset.wfQuiz && !started) renderIntro();
    };

    document.addEventListener("click", onClick, true);
    init();
    const mo = new MutationObserver(init);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
