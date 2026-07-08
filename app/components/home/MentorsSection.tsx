"use client";

import { useState } from "react";
import { mentorArchetypes } from "@/lib/content/homepage";

// Six mentor cards. Clicking a card expands it in place, revealing that
// mentor's story world and a sample question in their voice. One open at a
// time. 3×2 desktop, 2×3 tablet, horizontal snap-scroll on mobile.
export default function MentorsSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      {/* Tablet & desktop grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mentorArchetypes.map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            open={openId === mentor.id}
            onToggle={() => setOpenId(openId === mentor.id ? null : mentor.id)}
          />
        ))}
      </div>

      {/* Mobile: horizontal snap-scroll */}
      <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-6 px-6 gap-4">
        {mentorArchetypes.map((mentor) => (
          <div key={mentor.id} className="snap-center shrink-0 w-[85%]">
            <MentorCard
              mentor={mentor}
              open={openId === mentor.id}
              onToggle={() => setOpenId(openId === mentor.id ? null : mentor.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function MentorCard({
  mentor,
  open,
  onToggle,
}: {
  mentor: (typeof mentorArchetypes)[number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={[
        "group text-left w-full h-full bg-white rounded-lg border-[0.5px] border-cream-border p-6 cursor-pointer",
        "transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(35,49,55,0.10)]",
        "border-t-4",
      ].join(" ")}
      style={{ borderTopColor: mentor.accent }}
    >
      {/* TODO: replace emoji circle with the flat-illustrated avatar PNG when
          the six avatar assets are produced (DesignSystem: 512×512, transparent) */}
      <span
        aria-hidden="true"
        className="flex items-center justify-center w-16 h-16 rounded-full text-3xl mb-4"
        style={{ backgroundColor: `${mentor.accent}26` }}
      >
        {mentor.icon}
      </span>

      <span className="block font-serif text-charcoal text-xl mb-1.5">{mentor.name}</span>
      <span className="block font-body text-sm text-charcoal/70 leading-relaxed">
        {mentor.personality}
      </span>

      {/* Expanded: story world + sample question in their voice */}
      <span
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <span className="overflow-hidden block">
          <span className="block font-body text-sm text-charcoal/80 leading-relaxed mb-3">
            {mentor.world}
          </span>
          <span
            className="block font-body text-sm italic text-charcoal leading-relaxed border-l-2 pl-3"
            style={{ borderColor: mentor.accent }}
          >
            &ldquo;{mentor.sampleQuestion}&rdquo;
          </span>
        </span>
      </span>

      <span className="block mt-3 font-mono-brand text-[11px] uppercase tracking-[0.05em] text-teal">
        {open ? "− Close" : "+ Meet them"}
      </span>
    </button>
  );
}
