import type { Metadata } from "next";
import MarketingNav from "../components/home/MarketingNav";
import SiteFooter from "../components/home/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — LearnCuriosity",
  description:
    "What LearnCuriosity collects, why, how long we keep it, and your rights as a parent.",
};

// Stub for attorney review — plain-language summary of the intended policy.
export default function PrivacyPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-cream min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono-brand text-xs uppercase tracking-[0.05em] text-teal mb-4">
            Privacy
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.15] text-charcoal mb-6">
            Privacy policy
          </h1>
          <p className="font-body text-base text-charcoal/70 leading-[1.6] mb-12">
            This page summarizes our privacy practices in plain language. A full
            policy reviewed by counsel will replace this summary before public
            launch.
          </p>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-charcoal mb-3">What we collect</h2>
            <p className="font-body text-base text-charcoal/75 leading-[1.6]">
              A parent email address and login credentials, payment details
              (handled by our payment processor — we never store card numbers),
              your child&apos;s nickname (never a legal name), their grade band,
              their quiz result, and the text of their mentor conversations.
              That&apos;s the whole list.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-charcoal mb-3">What we never collect</h2>
            <p className="font-body text-base text-charcoal/75 leading-[1.6]">
              Photos, addresses beyond billing, your child&apos;s full name, or
              recordings of your child&apos;s voice. Audio becomes text and is
              deleted the moment it&apos;s heard.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-charcoal mb-3">No advertising, ever</h2>
            <p className="font-body text-base text-charcoal/75 leading-[1.6]">
              Quiz and archetype data is used only to personalize lessons. We do
              not build advertising profiles, and we do not sell or share data
              with advertisers. This is a design decision, not a settings toggle.
            </p>
          </section>

          <section id="coppa" className="mb-10 scroll-mt-24">
            <h2 className="font-serif text-2xl text-charcoal mb-3">COPPA statement</h2>
            <p className="font-body text-base text-charcoal/75 leading-[1.6]">
              LearnCuriosity is designed for children under 13, which means the
              Children&apos;s Online Privacy Protection Act applies to everything
              we do. Verifiable parental consent is captured before a child can
              use the product, we collect the minimum data needed to run a
              session, session logs have a defined retention window, and you can
              request deletion of your child&apos;s data at any time from your
              dashboard or by contacting us.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-charcoal mb-3">Your rights</h2>
            <p className="font-body text-base text-charcoal/75 leading-[1.6]">
              You can read every conversation, export your data, and request
              deletion at any time. Questions? Write to{" "}
              <a href="mailto:hello@learncuriosity.com" className="text-teal hover:underline">
                hello@learncuriosity.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
