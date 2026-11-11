"use client";
import { useEffect } from "react";
import { observeWf } from "./observe";

// Turns the static audio strips (blog voice notes, audio page) into working
// players: play and pause, a seekable progress bar and the real duration.
// The clip is a placeholder until James's recordings are uploaded; set a
// data-src attribute on a .audio element to point it at a real file.
const PLACEHOLDER = "/media/placeholder-voice-note.wav";

function fmt(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function build(box: HTMLElement) {
  box.dataset.enh = "1";
  const label = box.closest("article")?.querySelector("h3")?.textContent?.trim() || "voice note";
  const old = box.querySelector(".play");
  const wave = box.querySelector<HTMLElement>(".wave");
  const bar = wave?.querySelector<HTMLElement>("span");
  const time = Array.from(box.children).find((c) => c !== old && c !== wave && c.tagName === "SPAN") as HTMLElement | undefined;
  if (!old || !wave || !bar || !time) return;

  const audio = document.createElement("audio");
  audio.preload = "metadata";
  audio.src = box.dataset.src || PLACEHOLDER;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "play";
  btn.textContent = "▶";
  btn.setAttribute("aria-label", `Play: ${label}`);
  old.replaceWith(btn);

  wave.setAttribute("role", "slider");
  wave.setAttribute("aria-label", `Seek: ${label}`);
  wave.setAttribute("aria-valuemin", "0");
  wave.setAttribute("aria-valuemax", "100");
  wave.setAttribute("aria-valuenow", "0");
  wave.tabIndex = 0;
  wave.style.cursor = "pointer";
  time.textContent = "0:00";
  box.append(audio);

  const paint = () => {
    const d = audio.duration || 0;
    const pct = d ? (audio.currentTime / d) * 100 : 0;
    bar.style.width = `${pct}%`;
    wave.setAttribute("aria-valuenow", String(Math.round(pct)));
    time.textContent = audio.paused && !audio.currentTime ? fmt(d) : `${fmt(audio.currentTime)} / ${fmt(d)}`;
  };

  btn.addEventListener("click", () => {
    if (audio.paused) {
      document.querySelectorAll("audio").forEach((a) => { if (a !== audio) a.pause(); });
      void audio.play();
    } else audio.pause();
  });
  audio.addEventListener("play", () => { btn.textContent = "❚❚"; btn.setAttribute("aria-label", `Pause: ${label}`); });
  const idle = () => { btn.textContent = "▶"; btn.setAttribute("aria-label", `Play: ${label}`); };
  audio.addEventListener("pause", idle);
  audio.addEventListener("ended", () => { audio.currentTime = 0; idle(); paint(); });
  audio.addEventListener("timeupdate", paint);
  audio.addEventListener("loadedmetadata", paint);

  const seekTo = (frac: number) => { if (audio.duration) { audio.currentTime = Math.min(1, Math.max(0, frac)) * audio.duration; paint(); } };
  wave.addEventListener("click", (e) => {
    const r = wave.getBoundingClientRect();
    seekTo((e.clientX - r.left) / r.width);
  });
  wave.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); audio.currentTime += 5; }
    if (e.key === "ArrowLeft") { e.preventDefault(); audio.currentTime -= 5; }
  });
}

export default function AudioEnhancer() {
  useEffect(() => {
    const stop = observeWf(() => {
      document.querySelectorAll<HTMLElement>(".audio:not([data-enh])").forEach(build);
    });
    return () => {
      stop();
      document.querySelectorAll("audio").forEach((a) => a.pause());
    };
  }, []);
  return null;
}
