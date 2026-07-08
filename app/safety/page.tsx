import type { Metadata } from "next";
import MarketingNav from "../components/home/MarketingNav";
import SiteFooter from "../components/home/SiteFooter";

export const metadata: Metadata = {
  title: "How Our Safety System Works — LearnCuriosity",
  description:
    "A plain-language explanation of how the LearnCuriosity mentor is scoped, logged, and built to never be anything but a guide.",
};

const sections = [
  {
    heading: "The mentor only knows today's lesson",
    body: "Every conversation runs inside a scoped instruction set that fixes the mentor's role, restricts the dialogue to the current lesson and our five thinking pillars, and tells the mentor to gently redirect — never silently ignore — anything outside that scope. It cannot roleplay a friendship, promise ongoing contact, or wander into open conversation. That isn't a filter added on top. It is the whole design.",
  },
  {
    heading: "You can read every word",
    body: "Every message in every session is logged independently of the AI itself and shown on your parent dashboard. Every plan gets a session summary; Plus and Family plans include the full word-for-word transcript. Transparency is never paywalled — only the depth of detail is.",
  },
  {
    heading: "Your child's voice is never stored",
    body: "When your child speaks, their words become text and the audio is deleted the moment it's heard. We keep the words so you can read them. We never keep the voice.",
  },
  {
    heading: "Hard boundaries, gentle handling",
    body: "Self-harm, violence, sexual content, and off-scope topics are refused by design — with a warm redirection, never a cold shutdown. If a child expresses genuine distress, the mentor responds gently, suggests talking to a trusted adult, and the session is flagged clearly on your dashboard so you see it immediately.",
  },
  {
    heading: "Built on Claude, by Anthropic",
    body: "We built on the AI company that treats safety as a starting design constraint. On top of the model's own protections, we add our curriculum scope, age-banded prompts for K–2, 3–4, and 5–6, independent logging, and parent flags — layers that work even if any single one fails.",
  },
  {
    heading: "Minimal data, no advertising, COPPA-first",
    body: "We collect the minimum needed to run a session: a parent email, your child's nickname (never a legal name), a grade band, and their quiz result. Nothing is used for behavioral advertising — ever. Parental consent comes before anything else, and you can request deletion of your child's data at any time.",
  },
];

export default function SafetyPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-cream min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono-brand text-xs uppercase tracking-[0.05em] text-teal mb-4">
            Safety, in plain language
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.15] text-charcoal mb-6">
            How our safety system works
          </h1>
          <p className="font-body text-lg text-charcoal/70 leading-[1.6] mb-14">
            No legal fog, no fine print you need a lawyer for. This is exactly
            what the mentor can do, what it can&apos;t, and what you can see.
          </p>

          {sections.map((s) => (
            <section key={s.heading} className="mb-10">
              <h2 className="font-serif text-2xl text-charcoal mb-3">{s.heading}</h2>
              <p className="font-body text-base text-charcoal/75 leading-[1.6] max-w-[640px]">
                {s.body}
              </p>
            </section>
          ))}

          <p className="font-serif text-xl text-charcoal mt-16 border-l-2 border-gold pl-5">
            This isn&apos;t a chatbot we made safer. It&apos;s a mentor we built
            to never be anything else.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
