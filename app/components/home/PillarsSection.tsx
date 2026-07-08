"use client";

import { useState } from "react";
import { pillars } from "@/lib/content/homepage";

// Five expandable pillar cards. Click to expand, revealing what the child
// practices (from the pillar breakdowns) and one real sample mentor question.
// Only one card expanded at a time.
export default function PillarsSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {pillars.map((pillar, i) => {
        const open = openId === pillar.id;
        return (
          <button
            key={pillar.id}
            type="button"
            aria-expanded={open}
            onClick={() => setOpenId(open ? null : pillar.id)}
            className={[
              "text-left w-full bg-white rounded-lg border-[0.5px] border-cream-border p-6 cursor-pointer",
              "transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(35,49,55,0.10)]",
              // Last two cards center on the 3-col grid's second row
              i === 3 ? "lg:col-start-1 lg:ml-auto lg:w-full" : "",
            ].join(" ")}
          >
            {/* Pillar badge in the pillar's accent color (badge spec: 15% bg, 40% border) */}
            <span
              className="inline-flex items-center rounded-full px-3 py-1 font-body font-medium text-xs mb-4"
              style={{
                backgroundColor: `${pillar.accent}26`,
                color: pillar.accent,
                border: `1px solid ${pillar.accent}66`,
              }}
            >
              Pillar {i + 1}
            </span>

            <span className="block font-serif text-charcoal text-xl mb-2">{pillar.name}</span>
            <span className="block font-body text-sm text-charcoal/70 leading-relaxed">
              {pillar.summary}
            </span>

            <span
              className={[
                "grid transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]",
              ].join(" ")}
            >
              <span className="overflow-hidden block">
                <span className="block font-mono-brand text-[11px] uppercase tracking-[0.05em] text-teal mb-2">
                  What your child practices
                </span>
                <span className="block mb-3">
                  {pillar.practices.map((p) => (
                    <span key={p} className="flex gap-2 font-body text-sm text-charcoal/80 leading-relaxed mb-1.5">
                      <span style={{ color: pillar.accent }} aria-hidden="true">•</span>
                      {p}
                    </span>
                  ))}
                </span>
                <span
                  className="block font-body text-sm italic text-charcoal leading-relaxed border-l-2 pl-3"
                  style={{ borderColor: pillar.accent }}
                >
                  &ldquo;{pillar.sampleQuestion}&rdquo;
                </span>
              </span>
            </span>

            <span className="block mt-3 font-mono-brand text-[11px] uppercase tracking-[0.05em] text-teal">
              {open ? "− Close" : "+ What they practice"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
