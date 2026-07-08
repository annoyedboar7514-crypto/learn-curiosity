"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { heroConversation } from "@/lib/content/homepage";

// Scripted front-end animation only — no live API call on the homepage.
// The lying-friend dialogue plays out message-by-message: mentor lines type
// out behind a typing indicator, child replies fade in, then the loop pauses
// and restarts. Pauses entirely while off-screen or with reduced motion.

const TURN_GAP_MS = 1500; // pause between turns
const TYPING_MS = 1100; // how long the mentor "types" before the line appears
const LOOP_PAUSE_MS = 5000; // rest at the end before looping

type Phase =
  | { kind: "typing"; turn: number }
  | { kind: "shown"; turn: number } // turns 0..turn are visible
  | { kind: "loop-pause" };

function WaveformIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <line x1="4" y1="10" x2="4" y2="14" />
      <line x1="8" y1="7" x2="8" y2="17" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="16" y1="7" x2="16" y2="17" />
      <line x1="20" y1="10" x2="20" y2="14" />
    </svg>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 items-center" aria-label="Mentor is speaking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-teal/60 animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "900ms" }}
        />
      ))}
    </span>
  );
}

export default function HeroConversation() {
  const [phase, setPhase] = useState<Phase>({ kind: "typing", turn: 0 });
  const [inView, setInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Pause the animation while the card is off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const advance = useCallback((current: Phase): Phase => {
    if (current.kind === "typing") return { kind: "shown", turn: current.turn };
    if (current.kind === "shown") {
      const next = current.turn + 1;
      if (next >= heroConversation.length) return { kind: "loop-pause" };
      return { kind: "typing", turn: next };
    }
    return { kind: "typing", turn: 0 }; // loop-pause → restart
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const delay =
      phase.kind === "typing"
        ? heroConversation[phase.turn].role === "mentor"
          ? TYPING_MS
          : 400 // child replies fade in quickly, no typing indicator
        : phase.kind === "shown"
        ? TURN_GAP_MS
        : LOOP_PAUSE_MS;
    timerRef.current = setTimeout(() => setPhase((p) => advance(p)), delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, inView, reducedMotion, advance]);

  // With reduced motion, show the full conversation statically.
  const visibleThrough = reducedMotion
    ? heroConversation.length - 1
    : phase.kind === "loop-pause"
    ? heroConversation.length - 1
    : phase.kind === "shown"
    ? phase.turn
    : phase.turn - 1;

  const typingTurn =
    !reducedMotion && phase.kind === "typing" && heroConversation[phase.turn].role === "mentor"
      ? phase.turn
      : null;

  return (
    // Fixed min-height reserves space so the loop causes zero layout shift
    <div
      ref={containerRef}
      className="w-full max-w-md bg-white rounded-xl border-[0.5px] border-cream-border p-5 space-y-4 min-h-[320px] shadow-[0_1px_3px_rgba(35,49,55,0.08)]"
      role="img"
      aria-label="Example conversation between a mentor and a child about a friend who lied to protect their feelings"
    >
      {heroConversation.map((turn, i) => {
        if (i > visibleThrough && i !== typingTurn) return null;

        if (i === typingTurn) {
          return (
            <div key={i} className="flex gap-3 items-start">
              <MentorAvatar />
              <div className="bg-bubble rounded-xl rounded-tl-sm px-4 py-3">
                <TypingDots />
              </div>
            </div>
          );
        }

        return turn.role === "mentor" ? (
          <div
            key={i}
            className="flex gap-3 items-start animate-[fadeIn_0.4s_ease-out]"
          >
            <MentorAvatar />
            <div className="bg-bubble rounded-xl rounded-tl-sm px-4 py-3 text-sm text-charcoal leading-relaxed max-w-[75%]">
              <span className="flex items-center gap-1.5 text-teal mb-1.5">
                <WaveformIcon />
                <span className="font-mono-brand text-[10px] uppercase tracking-[0.05em]">
                  Spoken aloud
                </span>
              </span>
              {turn.text}
            </div>
          </div>
        ) : (
          <div
            key={i}
            className="flex gap-3 items-start flex-row-reverse animate-[fadeIn_0.4s_ease-out]"
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-cream text-sm font-bold" aria-hidden="true">
              A
            </div>
            <div className="bg-teal text-bubble rounded-xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed max-w-[75%]">
              {turn.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MentorAvatar() {
  return (
    <div
      className="shrink-0 w-8 h-8 rounded-full bg-teal flex items-center justify-center text-cream text-sm font-bold"
      aria-hidden="true"
    >
      L
    </div>
  );
}
