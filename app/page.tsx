export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import MarketingNav from "./components/home/MarketingNav";
import HeroConversation from "./components/home/HeroConversation";
import HowItWorks from "./components/home/HowItWorks";
import MentorsSection from "./components/home/MentorsSection";
import PillarsSection from "./components/home/PillarsSection";
import PricingSection from "./components/home/PricingSection";
import FaqSection from "./components/home/FaqSection";
import SiteFooter from "./components/home/SiteFooter";
import FadeUp from "./components/home/FadeUp";
import { trustPillars } from "@/lib/content/homepage";

/* ── Inline icons for the safety section (2px stroke) ── */
function IconMessageOff() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M9 5h9a2 2 0 0 1 2 2v9m-1.5 2.5l-1.5 1.5h-9l-3 3v-12" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconMicOff() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}
function IconShieldCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
const trustIcons = [IconMessageOff, IconEye, IconMicOff, IconShieldCheck];

/* Eyebrow label — IBM Plex Mono, uppercase, letter-spaced */
function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p className={`font-mono-brand text-xs uppercase tracking-[0.05em] mb-4 ${onDark ? "text-gold" : "text-teal"}`}>
      {children}
    </p>
  );
}

export default async function HomePage() {
  let userId: string | null = null;
  try { ({ userId } = await auth()); } catch { /* Clerk middleware not active */ }

  if (userId) {
    // Returning user with a profile → go straight to the child hub
    const { getChildProfile } = await import("@/lib/session");
    const profile = await getChildProfile();
    if (profile) redirect("/home");
    // No profile yet: show the marketing page so they're never stuck in a loop.
  }

  return (
    <>
      <MarketingNav />

      <main>
        {/* ── 2. Hero — interactive mentor demo ── */}
        <section className="min-h-screen bg-cream flex items-center pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
            <div className="flex flex-col gap-6">
              <Eyebrow>A daily voice mentor</Eyebrow>
              <h1 className="font-serif text-[2.75rem] leading-[1.15] md:text-6xl lg:text-7xl text-charcoal max-w-[600px]">
                The answer can wait.{" "}
                <span className="italic">The question can&apos;t.</span>
              </h1>
              <p className="font-body text-lg text-charcoal/70 leading-[1.6] max-w-[520px]">
                A daily voice mentor for curious kids. Six guides. One hundred
                stories. Every conversation yours to read.
              </p>

              <div className="flex flex-col items-start gap-3 mt-2">
                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    href="/signup"
                    className="inline-block px-8 py-4 rounded-md bg-gold text-[#412402] font-semibold font-body text-base hover:brightness-95 transition-all"
                  >
                    Find Your Child&apos;s Mentor
                  </Link>
                  <a
                    href="#how-it-works"
                    className="font-body text-base text-teal hover:text-charcoal transition-colors"
                  >
                    See how it works ↓
                  </a>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-charcoal/60 font-body">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Every conversation is yours to read. Always.
                </p>
              </div>
            </div>

            {/* Animated conversation player (scripted, no live API) */}
            <div className="flex justify-center md:justify-end">
              <HeroConversation />
            </div>
          </div>
        </section>

        {/* ── 3. How It Works ── */}
        <section id="how-it-works" className="bg-white py-16 md:py-28 px-6 scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <FadeUp>
              <Eyebrow>How a session works</Eyebrow>
              <h2 className="font-serif text-3xl md:text-[2.75rem] leading-[1.2] text-charcoal max-w-[600px] mb-12">
                Fifteen minutes. One story. A conversation that sticks.
              </h2>
            </FadeUp>
            <HowItWorks />
          </div>
        </section>

        {/* ── 4. The Six Mentors ── */}
        <section id="mentors" className="bg-cream py-16 md:py-28 px-6 scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <FadeUp>
              <Eyebrow>Meet the mentors</Eyebrow>
              <h2 className="font-serif text-3xl md:text-[2.75rem] leading-[1.2] text-charcoal max-w-[600px] mb-4">
                Six mentors. Your child picks the one that feels like theirs.
              </h2>
              <p className="font-body text-base text-charcoal/70 leading-[1.6] max-w-[640px] mb-12">
                Every mentor guides through the same five ways of thinking — the
                difference is the world they tell their stories in. Tap one to
                hear how they ask.
              </p>
            </FadeUp>
            <MentorsSection />
          </div>
        </section>

        {/* ── 5. Five Pillars ── */}
        <section id="pillars" className="bg-white py-16 md:py-28 px-6 scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <FadeUp>
              <Eyebrow>What we actually teach</Eyebrow>
              <h2 className="font-serif text-3xl md:text-[2.75rem] leading-[1.2] text-charcoal max-w-[600px] mb-12">
                Five ways of thinking, woven into every story.
              </h2>
            </FadeUp>
            <PillarsSection />
          </div>
        </section>

        {/* ── 6. Safety — teal full-bleed ── */}
        <section id="safety" className="bg-teal py-16 md:py-28 px-6 scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <FadeUp>
              <Eyebrow onDark>Safety, by design</Eyebrow>
              <h2 className="font-serif text-3xl md:text-[2.75rem] leading-[1.2] text-cream max-w-[600px] mb-6">
                We know what you&apos;re thinking.
              </h2>
              <p className="font-body text-base text-cream/80 leading-[1.6] max-w-[640px] mb-14">
                An AI talking to your child should make you pause. It made us
                pause too — which is exactly why we built this differently from
                any chatbot you&apos;ve heard about.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
              {trustPillars.map((pillar, i) => {
                const Icon = trustIcons[i];
                return (
                  <FadeUp key={pillar.title} delay={i * 80} className="h-full">
                    <div className="h-full bg-cream/[0.06] border border-cream/15 rounded-lg p-6">
                      <div className="text-gold mb-4"><Icon /></div>
                      <p className="font-body font-bold text-cream text-base mb-2 leading-snug">
                        {pillar.title}
                      </p>
                      <p className="font-body text-sm text-cream/70 leading-relaxed">
                        {pillar.detail}
                      </p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>

            <FadeUp>
              <p className="font-serif text-xl md:text-2xl text-cream max-w-[640px] mb-6">
                This isn&apos;t a chatbot we made safer. It&apos;s a mentor we
                built to never be anything else.
              </p>
              <Link
                href="/safety"
                className="font-body text-base text-gold hover:text-cream transition-colors"
              >
                Read exactly how our safety system works →
              </Link>
            </FadeUp>
          </div>
        </section>

        {/* ── 7. Pricing ── */}
        <section id="pricing" className="bg-cream py-16 md:py-28 px-6 scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <FadeUp>
              <div className="text-center">
                <p className="font-mono-brand text-xs uppercase tracking-[0.05em] text-teal mb-4">
                  Simple pricing
                </p>
                <h2 className="font-serif text-3xl md:text-[2.75rem] leading-[1.2] text-charcoal max-w-[600px] mx-auto mb-12">
                  Every plan gets the full curriculum. No exceptions.
                </h2>
              </div>
            </FadeUp>
            <PricingSection />
          </div>
        </section>

        {/* ── 8. FAQ ── */}
        <section id="faq" className="bg-white py-16 md:py-28 px-6 scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <FadeUp>
              <div className="text-center">
                <p className="font-mono-brand text-xs uppercase tracking-[0.05em] text-teal mb-4">
                  Questions parents ask
                </p>
                <h2 className="font-serif text-3xl md:text-[2.75rem] leading-[1.2] text-charcoal max-w-[600px] mx-auto mb-12">
                  Fair questions. Honest answers.
                </h2>
              </div>
            </FadeUp>
            <FaqSection />
          </div>
        </section>

        {/* ── 9. Final CTA — gold-tinted band ── */}
        <section className="relative bg-gold/15 py-20 md:py-32 px-6 overflow-hidden">
          {/* Low-opacity question-mark motif */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.05] select-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ctext x='20' y='60' font-family='Georgia,serif' font-size='48' fill='%23233137'%3E%3F%3C/text%3E%3Ctext x='72' y='108' font-family='Georgia,serif' font-size='28' fill='%23233137'%3E%3F%3C/text%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative max-w-xl mx-auto flex flex-col items-center gap-6 text-center">
            <h2 className="font-serif text-3xl md:text-[2.75rem] leading-[1.2] text-charcoal">
              Let your child ask their next question.
            </h2>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 rounded-md bg-gold text-[#412402] font-semibold font-body text-base hover:brightness-95 transition-all"
            >
              Start Free Trial
            </Link>
            <p className="font-body text-sm text-charcoal/60">
              7 days, full access, cancel anytime.
            </p>
          </div>
        </section>
      </main>

      {/* ── 10. Footer ── */}
      <SiteFooter />
    </>
  );
}
