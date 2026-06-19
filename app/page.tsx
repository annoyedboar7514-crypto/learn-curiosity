import Image from "next/image";
import Link from "next/link";
import StickyHeader from "./components/StickyHeader";
import DialogueCard from "./components/DialogueCard";
import PillarsTrail from "./components/PillarsTrail";

// Inline SVG icons (Tabler-style, 2px stroke)
function IconMessageOff() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M9 5h9a2 2 0 0 1 2 2v9m-1.5 2.5l-1.5 1.5h-9l-3 3v-12" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconShieldCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <StickyHeader />

      {/* ── Section 1: Hero ── */}
      <section className="min-h-screen bg-cream flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          {/* Left: text + CTA */}
          <div className="flex flex-col gap-6">
            <p className="font-mono-brand text-xs uppercase tracking-widest text-teal">
              Learn Curiosity
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-navy leading-tight">
              The answer can wait.{" "}
              <span className="italic">The question can&apos;t.</span>
            </h1>
            <p className="font-body text-lg text-navy/70 leading-relaxed max-w-md">
              A daily mentor for curious kids — built on questions, never on
              screens that just entertain.
            </p>

            <DialogueCard />

            <div className="flex flex-col items-start gap-2">
              <Link
                href="/signup"
                className="inline-block px-8 py-4 rounded-full bg-teal text-cream font-semibold font-body text-base hover:bg-teal/90 transition-colors"
              >
                Find Your Child&apos;s Mentor
              </Link>
              <p className="flex items-center gap-1.5 text-sm text-navy/60 font-body">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Every conversation is yours to read. Always.
              </p>
            </div>
          </div>

          {/* Right: mascot illustration */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <Image
                src="/brand/Logo.png"
                alt="Learn Curiosity — a curious explorer on the path of learning"
                fill
                sizes="(max-width: 768px) 320px, 384px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Five Pillars trail ── */}
      <section className="bg-cream py-20 px-6" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <p className="font-body font-medium text-navy text-center text-lg mb-12">
            Five ways of thinking, woven into every story.
          </p>
          <PillarsTrail />
        </div>
      </section>

      {/* ── Section 3: We know what you're thinking ── */}
      <section className="bg-parchment py-20 px-6" id="safety">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-serif text-4xl text-navy mb-6">
            We know what you&apos;re thinking.
          </h2>
          <p className="font-body text-navy/75 text-base leading-relaxed">
            An AI talking to your child should make you pause. It made us pause
            too — which is exactly why we built this differently from any chatbot
            you&apos;ve heard about.
          </p>
        </div>

        {/* Three columns */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <IconMessageOff />,
              claim: "It only knows one thing: today's lesson.",
              detail:
                "The mentor can't roleplay a friendship, can't wander into open conversation, can't be anything other than a guide through today's story. That's not a limitation we apologize for — it's the entire design.",
            },
            {
              icon: <IconEye />,
              claim: "You can read every word.",
              detail:
                "Every conversation is logged and visible on your parent dashboard. Not a summary, not a sample — the actual conversation, every time.",
            },
            {
              icon: <IconShieldCheck />,
              claim: "Built on Claude, by Anthropic.",
              detail:
                "We chose the AI company built around safety as a starting design constraint, not an afterthought bolted on later.",
            },
          ].map((item) => (
            <div key={item.claim} className="flex flex-col gap-3">
              <div className="text-teal">{item.icon}</div>
              <p className="font-body font-bold text-navy text-base">{item.claim}</p>
              <p className="font-body text-sm text-navy/70 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <p className="max-w-xl mx-auto text-center font-body text-lg text-navy font-medium">
          This isn&apos;t a chatbot we made safer. It&apos;s a mentor we built to never be
          anything else.
        </p>
      </section>

      {/* ── Section 4: Closing CTA ── */}
      <section className="bg-teal py-24 px-6 text-center" id="pricing">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <h2 className="font-serif text-4xl text-cream">
            Let your child ask their next question.
          </h2>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-full bg-cream text-teal font-semibold font-body text-base hover:bg-cream/90 transition-colors"
          >
            Start Free Trial
          </Link>
          <p className="font-body text-sm text-cream/70">
            7 days, full access, cancel anytime.
          </p>
        </div>
      </section>
    </>
  );
}
