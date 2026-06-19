"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StickyHeader from "../components/StickyHeader";

// ── Illustrations ─────────────────────────────────────────────────────────────

function ConstellationOwl() {
  return (
    <svg viewBox="0 0 180 220" fill="none" className="w-40 h-48 shrink-0">
      {/* Background scatter stars */}
      {[[22,30],[158,18],[12,110],[170,140],[45,205],[10,180]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="#E8A33D" opacity="0.35" />
      ))}
      {/* Constellation lines */}
      <g stroke="#1e3a52" strokeWidth="0.8" opacity="0.45">
        <line x1="58" y1="38" x2="72" y2="68" />
        <line x1="122" y1="38" x2="108" y2="68" />
        <line x1="72"  y1="68" x2="108" y2="68" />
        <line x1="72"  y1="88" x2="90" y2="108" />
        <line x1="108" y1="88" x2="90" y2="108" />
        <line x1="90"  y1="108" x2="48" y2="138" />
        <line x1="90"  y1="108" x2="132" y2="138" />
        <line x1="48"  y1="138" x2="90" y2="158" />
        <line x1="132" y1="138" x2="90" y2="158" />
        <line x1="90"  y1="158" x2="76" y2="185" />
        <line x1="90"  y1="158" x2="104" y2="185" />
      </g>
      {/* Star nodes */}
      <circle cx="58"  cy="38"  r="4"  fill="#1e3a52" />
      <circle cx="122" cy="38"  r="4"  fill="#1e3a52" />
      {/* Eyes — prominent */}
      <circle cx="72"  cy="73"  r="10" fill="#1e3a52" />
      <circle cx="72"  cy="73"  r="4"  fill="#E8A33D" />
      <circle cx="108" cy="73"  r="10" fill="#1e3a52" />
      <circle cx="108" cy="73"  r="4"  fill="#E8A33D" />
      <circle cx="72"  cy="88"  r="3"  fill="#1e3a52" />
      <circle cx="108" cy="88"  r="3"  fill="#1e3a52" />
      <circle cx="90"  cy="108" r="4"  fill="#1e3a52" />
      <circle cx="48"  cy="138" r="4"  fill="#1e3a52" />
      <circle cx="132" cy="138" r="4"  fill="#1e3a52" />
      <circle cx="90"  cy="158" r="4"  fill="#1e3a52" />
      <circle cx="76"  cy="185" r="3"  fill="#1e3a52" />
      <circle cx="104" cy="185" r="3"  fill="#1e3a52" />
    </svg>
  );
}

function SocratesSilhouette() {
  return (
    <svg viewBox="0 0 110 200" className="w-24 h-44 shrink-0">
      {/* Rim-light edge — slightly larger cream shape behind */}
      <g fill="#f0e8d8">
        <circle cx="55" cy="27" r="22" />
        <path d="M32 52 C28 65, 18 148, 22 185 L88 185 C92 148, 82 65, 78 52 Z" />
      </g>
      {/* Charcoal silhouette */}
      <g fill="#1e3a52">
        <circle cx="55" cy="26" r="20" />
        <path d="M35 50 C30 63, 20 147, 24 183 L86 183 C90 147, 80 63, 75 50 Z" />
        {/* Beard */}
        <path d="M42 42 C46 56, 64 56, 68 42 C63 52, 47 52, 42 42 Z" />
        {/* Arm gesturing outward */}
        <path d="M76 95 L100 118 L97 122 L72 100 Z" />
      </g>
    </svg>
  );
}

function SmallOwl({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`w-8 h-8 ${className}`} fill="#1e3a52" opacity="0.25">
      <circle cx="20" cy="16" r="12" />
      <circle cx="15" cy="14" r="4" fill="#FBF6EC" />
      <circle cx="25" cy="14" r="4" fill="#FBF6EC" />
      <circle cx="15" cy="14" r="2" fill="#1e3a52" />
      <circle cx="25" cy="14" r="2" fill="#1e3a52" />
      <polygon points="20,19 18,23 22,23" fill="#E8A33D" />
      <polygon points="11,7 8,2 14,5" />
      <polygon points="29,7 32,2 26,5" />
      <path d="M8 28 C8 36, 32 36, 32 28 Z" />
    </svg>
  );
}

function SmallFox({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 40" className={`w-10 h-8 ${className}`} fill="#1e3a52" opacity="0.22">
      {/* Body */}
      <ellipse cx="28" cy="26" rx="16" ry="11" />
      {/* Head */}
      <circle cx="14" cy="18" r="10" />
      {/* Ears */}
      <polygon points="7,10 4,0 12,8" />
      <polygon points="21,10 24,0 16,8" />
      {/* Tail */}
      <path d="M44 26 C52 20, 55 30, 48 34 C55 30, 50 22, 44 26 Z" />
      {/* Snout */}
      <ellipse cx="8" cy="20" rx="5" ry="4" fill="#f0e8d8" opacity="0.7" />
    </svg>
  );
}

// ── Animated section wrapper ───────────────────────────────────────────────────

function AnimSection({ id, children, className = "" }: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // once only
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={[
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-[0.15] translate-y-5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ── Scroll progress trail ──────────────────────────────────────────────────────

function ScrollTrail() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop: vertical left rail */}
      <div className="hidden md:block fixed left-7 top-0 h-full w-[2px] z-20 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full bg-gold transition-all duration-150"
          style={{ height: `${pct}%` }}
        />
        <div
          className="absolute left-0 w-full"
          style={{
            top: `${pct}%`,
            height: `${100 - pct}%`,
            backgroundImage:
              "repeating-linear-gradient(to bottom, #E8A33D55 0px, #E8A33D55 4px, transparent 4px, transparent 8px)",
          }}
        />
      </div>

      {/* Mobile: horizontal top rail (below sticky header) */}
      <div className="md:hidden fixed top-16 left-0 right-0 h-[2px] z-20 pointer-events-none">
        <div
          className="absolute top-0 left-0 h-full bg-gold transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-0 h-full"
          style={{
            left: `${pct}%`,
            width: `${100 - pct}%`,
            backgroundImage:
              "repeating-linear-gradient(to right, #E8A33D55 0px, #E8A33D55 4px, transparent 4px, transparent 8px)",
          }}
        />
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutUsClient() {
  return (
    <div className="bg-cream min-h-screen">
      <StickyHeader />
      <ScrollTrail />

      <main className="pt-24 md:pl-20 max-w-4xl mx-auto px-6 pb-24 space-y-28">

        {/* §1 — Opening */}
        <AnimSection id="opening" className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1">
            <h1 className="font-serif text-4xl md:text-5xl text-navy mb-6">
              Every child starts as a scientist.
            </h1>
            <p className="font-body text-navy/75 text-base leading-relaxed max-w-xl">
              Before they&apos;re taught to find the one right answer, every child is a relentless
              asker of &ldquo;why.&rdquo; Somewhere between kindergarten and middle school, most
              curriculums quietly train that instinct out of them, in favor of speed and the correct
              bubble on a test. We built Learn Curiosity on the opposite bet: that curiosity,
              protected and guided instead of managed out of a child, is the most powerful learning
              engine there is.
            </p>
          </div>
          <ConstellationOwl />
        </AnimSection>

        {/* §2 — Socrates */}
        <AnimSection id="socrates" className="flex flex-col md:flex-row-reverse gap-10 items-start">
          <div className="flex-1">
            <h2 className="font-serif text-4xl text-navy mb-6">
              2,400 years ago, someone figured this out.
            </h2>
            <p className="font-body text-navy/75 text-base leading-relaxed max-w-xl">
              Socrates never lectured. He asked. He believed the best way to help someone think
              clearly wasn&apos;t to hand them a conclusion, but to ask the question that helped
              them find it themselves. That&apos;s not a teaching trend — it&apos;s the oldest,
              most tested method of building a real thinker that exists. It&apos;s also the only
              method our mentor is allowed to use.
            </p>
          </div>
          <SocratesSilhouette />
        </AnimSection>

        {/* §3 — Galileo */}
        <AnimSection id="galileo" className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1">
            <h2 className="font-serif text-4xl text-navy mb-6">
              Looking up changed everything.
            </h2>
            <p className="font-body text-navy/75 text-base leading-relaxed max-w-xl">
              Galileo didn&apos;t discover the moons of Jupiter by being told they existed. He
              looked, and asked what he was seeing, and kept asking. That&apos;s the spirit behind
              every mentor on this platform — not handing a child a fact, but handing them a
              telescope.
            </p>
          </div>
          {/* Galileo logo at larger scale */}
          <div className="relative w-44 h-44 shrink-0">
            <Image
              src="/brand/Logo.png"
              alt="The Galileo explorer — our brand mark"
              fill
              sizes="176px"
              className="object-contain"
            />
          </div>
        </AnimSection>

        {/* §4 — Trust & Safety */}
        <AnimSection id="trust" className="relative">
          {/* Sparse animal silhouettes — calmer than other sections */}
          <SmallOwl className="absolute top-2 right-8 hidden md:block" />
          <SmallFox className="absolute bottom-6 right-2 hidden md:block" />

          <h2 className="font-serif text-4xl text-navy mb-4">
            Now, about letting an AI talk to your child.
          </h2>
          <p className="font-body text-navy/75 text-base leading-relaxed max-w-xl mb-8">
            We&apos;d be skeptical too. Here&apos;s exactly how this works, with nothing left vague:
          </p>

          <ul className="space-y-4 max-w-xl">
            {[
              "The mentor only ever discusses today's lesson and your child's own questions about it. It cannot roleplay a friendship, a relationship, or an identity of its own — that capability simply isn't part of what we built.",
              "Every single conversation is logged and visible to you, in full, on your parent dashboard. Not a sample. Not a summary. All of it.",
              "We built this on Claude, made by Anthropic — the AI company that treats safety as a starting design constraint, not a patch applied after something goes wrong.",
              "If a question veers somewhere it shouldn't, the mentor redirects gently and your dashboard gets a note. It never goes cold silent, and it never just answers anyway.",
              "We will never build an advertising profile from your child's data. Said plainly, because it should be.",
            ].map((item) => (
              <li key={item.slice(0, 30)} className="flex gap-3 items-start">
                <svg className="shrink-0 mt-1 text-teal" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="font-body text-sm text-navy/75 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </AnimSection>

        {/* §5 — Closing CTA */}
        <AnimSection id="closing" className="text-center py-12 border-t border-parchment">
          <h2 className="font-serif text-4xl text-navy mb-8">
            Let your child ask their next question.
          </h2>
          <Link
            href="/quiz"
            className="inline-block px-10 py-4 rounded-full bg-teal text-cream font-semibold font-body text-base hover:bg-teal/90 transition-colors mb-3"
          >
            Start Free Trial
          </Link>
          <p className="font-body text-sm text-navy/50">
            7 days, full access, cancel anytime.
          </p>
        </AnimSection>

      </main>
    </div>
  );
}
