"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sessionSteps } from "@/lib/content/homepage";

const AUTO_ADVANCE_MS = 5000;

// Four-step session walkthrough. Horizontal numbered tabs swap an
// illustrative panel; auto-advances every 5s until the user interacts.
// On mobile the panel area is a swipeable snap carousel.
export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [userTouched, setUserTouched] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const progressKey = useRef(0); // remount progress bar to restart its animation

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance until first interaction
  useEffect(() => {
    if (userTouched || !inView) return;
    const t = setTimeout(() => {
      progressKey.current += 1;
      setActive((a) => (a + 1) % sessionSteps.length);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [active, userTouched, inView]);

  const select = useCallback((i: number) => {
    setUserTouched(true);
    setActive(i);
    // Keep the mobile carousel in sync with tab clicks
    const track = carouselRef.current;
    if (track) {
      const panel = track.children[i] as HTMLElement | undefined;
      panel?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  // Sync active tab when the user swipes the mobile carousel
  const onCarouselScroll = useCallback(() => {
    const track = carouselRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== active && i >= 0 && i < sessionSteps.length) {
      setUserTouched(true);
      setActive(i);
    }
  }, [active]);

  return (
    <div ref={sectionRef}>
      {/* Step tabs */}
      <div role="tablist" aria-label="Session steps" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {sessionSteps.map((step, i) => (
          <button
            key={step.number}
            role="tab"
            id={`step-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`step-panel-${i}`}
            onClick={() => select(i)}
            className={[
              "relative text-left p-4 rounded-md border-[1.5px] transition-colors cursor-pointer bg-transparent",
              active === i
                ? "border-teal bg-white"
                : "border-cream-border hover:border-teal/40",
            ].join(" ")}
          >
            <span className="font-mono-brand text-xs text-gold tracking-[0.05em]">{step.number}</span>
            <span className="block font-serif text-charcoal text-base md:text-lg mt-1 leading-snug">
              {step.title}
            </span>
            {/* Auto-advance progress bar under the active tab */}
            {active === i && !userTouched && (
              <span
                key={progressKey.current}
                className="absolute bottom-0 left-0 h-0.5 bg-gold rounded-full motion-safe:animate-[stepProgress_5s_linear_forwards] motion-reduce:hidden"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      {/* Desktop / tablet: single sliding panel */}
      <div className="hidden md:block relative overflow-hidden rounded-lg">
        {sessionSteps.map((step, i) => (
          <div
            key={step.number}
            role="tabpanel"
            id={`step-panel-${i}`}
            aria-labelledby={`step-tab-${i}`}
            hidden={active !== i}
            className={active === i ? "animate-[slideIn_0.35s_ease-out]" : ""}
          >
            <StepPanel index={i} />
          </div>
        ))}
      </div>

      {/* Mobile: swipeable snap carousel */}
      <div
        ref={carouselRef}
        onScroll={onCarouselScroll}
        className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-6 px-6 gap-4"
      >
        {sessionSteps.map((step, i) => (
          <div key={step.number} className="snap-center shrink-0 w-full">
            <StepPanel index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepPanel({ index }: { index: number }) {
  const step = sessionSteps[index];
  return (
    <div className="bg-white rounded-lg border-[0.5px] border-cream-border p-8 md:p-12 min-h-[280px] flex flex-col gap-5">
      <p className="font-body text-lg md:text-xl text-charcoal leading-relaxed max-w-[640px]">
        {step.description}
      </p>
      {/* Micro-mock of this beat of the session */}
      <div className="mt-auto bg-cream rounded-md p-5 border border-cream-border max-w-[560px]">
        <p className="font-mono-brand text-xs uppercase tracking-[0.05em] text-teal mb-3">
          {step.panelLabel}
        </p>
        {step.panelLines.map((line) => (
          <p key={line} className="font-body text-sm text-charcoal/80 leading-relaxed mb-2 last:mb-0">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
