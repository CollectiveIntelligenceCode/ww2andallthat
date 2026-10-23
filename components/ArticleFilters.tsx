"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "flagship", label: "Flagship" },
  { value: "midweek", label: "Midweek" },
  { value: "film", label: "Film" },
  { value: "series", label: "Series" },
  { value: "audio", label: "Audio" },
  { value: "lessons", label: "Lessons" },
  { value: "photo-essay", label: "Photo Essay" },
  { value: "quiz", label: "Quiz" },
];

export default function ArticleFilters() {
  const searchParams = useSearchParams();
  const active = searchParams.get("type") ?? "all";

  return (
    <div className="flex gap-2 flex-wrap mb-8">
      {FILTERS.map(f => (
        <Link
          key={f.value}
          href={f.value === "all" ? "/articles" : `/articles?type=${f.value}`}
          className={`px-3 py-1.5 text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase transition-colors ${
            active === f.value
              ? "bg-[#111111] text-white"
              : "border border-[#E5E7EB] text-[#6B7280] hover:border-[#111111] hover:text-[#111111]"
          }`}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}
