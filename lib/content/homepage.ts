// Homepage marketing content — single source for all copy on the landing page.
// Copy rules (from the homepage spec): voice-first language only, short
// sentences, no edtech jargon, no exclamation marks, sentence case except hero.

/* ── Hero conversation (the lying-friend dialogue, played out message-by-message) ── */

export interface ConversationTurn {
  role: "mentor" | "child";
  text: string;
}

export const heroConversation: ConversationTurn[] = [
  {
    role: "mentor",
    text: "If you found out your best friend had been lying to you — to protect your feelings — would that make it better or worse?",
  },
  {
    role: "child",
    text: "Worse, I think. Because now I don't know what else might not be true.",
  },
  {
    role: "mentor",
    text: "What would it take for you to be able to trust them again?",
  },
];

/* ── How a session works (four-step loop from the pivot plan) ── */

export interface SessionStep {
  number: string;
  title: string;
  description: string;
  // Micro-mock content shown in the illustrative panel
  panelLabel: string;
  panelLines: string[];
}

export const sessionSteps: SessionStep[] = [
  {
    number: "01",
    title: "The story",
    description:
      "Your child's mentor tells a story from history — and stops at the hardest moment.",
    panelLabel: "The mentor is telling a story",
    panelLines: [
      "The young sailor stared at the two maps. One was old and trusted. One was new — and said the trusted one was wrong.",
      "The captain wanted an answer by morning.",
    ],
  },
  {
    number: "02",
    title: "Your child decides",
    description:
      "The mentor asks: what would you do? Your child answers out loud.",
    panelLabel: "The mentor asks",
    panelLines: [
      "“Both maps can't be right. Before you pick one — what would you want to check first?”",
      "Your child answers in their own words. There is no wrong way to start.",
    ],
  },
  {
    number: "03",
    title: "The consequence",
    description:
      "The story continues. Real cause and effect — never a lecture.",
    panelLabel: "The story continues",
    panelLines: [
      "The sailor chose the old map because everyone else did. Three days later, the coastline wasn't where it should have been.",
      "Nobody says the moral out loud. The story shows it.",
    ],
  },
  {
    number: "04",
    title: "The conversation",
    description:
      "Then the real learning: questions that make your child think thoughts they've never had before.",
    panelLabel: "The mentor asks better questions",
    panelLines: [
      "“The whole crew agreed with him. Does everyone agreeing make something true?”",
      "Fifteen minutes of thinking out loud, with a guide who never gives the answer away.",
    ],
  },
];

/* ── The six mentors ── */

export interface MentorArchetype {
  id: string;
  name: string;
  icon: string; // emoji fallback until avatar art lands — see TODO in MentorsSection
  personality: string; // one-line tone descriptor
  world: string; // story world description shown on expand
  sampleQuestion: string; // one question in that mentor's voice
  accent: string; // pillar-adjacent accent hex
}

export const mentorArchetypes: MentorArchetype[] = [
  {
    id: "explorer",
    name: "The Explorer",
    icon: "🧭",
    personality: "Bold and warm. Treats every question like an unmapped trail.",
    world:
      "Rivers, ridgelines, and places no map has finished. Explorer stories are about deciding when the path runs out — and noticing what the wilderness is telling you.",
    sampleQuestion:
      "The map ends here. The river doesn't. What do you do next — and what do you check before you do it?",
    accent: "#4F8B6E",
  },
  {
    id: "astronaut",
    name: "The Astronaut",
    icon: "🚀",
    personality:
      "Precise and genuinely curious. Finds the question more interesting than the conclusion.",
    world:
      "Launch pads, night skies, and instruments that only tell part of the truth. Astronaut stories are about discovery under pressure — when being careful and being curious have to work together.",
    sampleQuestion:
      "The instruments say it's safe. Your gut says wait. Which one gets to decide — and why that one?",
    accent: "#5B6FA8",
  },
  {
    id: "detective",
    name: "The Detective",
    icon: "🔍",
    personality: "Sharp and playful. Never accepts the first explanation.",
    world:
      "Puzzles, clues, and cases where the obvious answer is usually the wrong one. Detective stories are about evidence — and the courage to follow it somewhere unpopular.",
    sampleQuestion:
      "The evidence says one thing. Everyone believes another. Which do you trust?",
    accent: "#5B6FA8",
  },
  {
    id: "inventor",
    name: "The Inventor",
    icon: "⚙️",
    personality:
      "Hands-on and patient. Believes everything broken is halfway to better.",
    world:
      "Workshops, bridges, and machines that almost work. Inventor stories are about how things fail — and how the failure itself points to the fix.",
    sampleQuestion:
      "It broke in the same place twice. What is it trying to tell you?",
    accent: "#C98A3E",
  },
  {
    id: "artist",
    name: "The Artist",
    icon: "🎨",
    personality: "Imaginative and gentle. Sees ten answers where others see one.",
    world:
      "Studios, stages, and stories inside stories. Artist adventures are about reframing — finding the version of the problem that nobody else thought to look for.",
    sampleQuestion:
      "Everyone sees a ruined painting. What do you see?",
    accent: "#8B5FA3",
  },
  {
    id: "doctor",
    name: "The Doctor",
    icon: "🩺",
    personality: "Calm and kind. Listens first, always.",
    world:
      "Clinics, field hospitals, and moments where helping one person means understanding many. Doctor stories are about care under constraint — who needs you first, and how you know.",
    sampleQuestion:
      "You can't help everyone at once. Who needs you first — and how do you know?",
    accent: "#D9714F",
  },
];

/* ── Five pillars (breakdowns from Master Blueprint §1) ── */

export interface Pillar {
  id: string;
  name: string;
  accent: string;
  summary: string; // front of card, one sentence
  practices: string[]; // "What your child practices" — 2–3 bullets
  sampleQuestion: string; // one real question from that pillar's bank
}

export const pillars: Pillar[] = [
  {
    id: "critical",
    name: "Critical thinking",
    accent: "#5B6FA8",
    summary: "Pausing before accepting — the habit of asking whether something is actually true.",
    practices: [
      "Spotting the assumption hidden inside a statement",
      "Telling the difference between a cause and a coincidence",
      "Asking “what would have to be true for this to be wrong?”",
    ],
    sampleQuestion:
      "Did the group agree with her? Does that make her right?",
  },
  {
    id: "resilience",
    name: "Resilience & character",
    accent: "#4F8B6E",
    summary: "Stories show what choices really cost — the moral is never stated, it's arrived at.",
    practices: [
      "Experiencing a setback without catastrophizing it",
      "Seeing that honesty costs something now and pays later",
      "Owning the gap between what you meant and what you did",
    ],
    sampleQuestion:
      "He thought it was easier to say nothing. Was it? What happened instead?",
  },
  {
    id: "creativity",
    name: "Creativity & vision",
    accent: "#8B5FA3",
    summary: "Reframing problems and inventing solutions before the story reveals what happened.",
    practices: [
      "Generating more than one answer before committing to one",
      "Treating constraints as interesting, not as stops",
      "Sitting with “I don't know yet” without shutting down",
    ],
    sampleQuestion:
      "If you could only use what was already in the room, what would you try?",
  },
  {
    id: "articulation",
    name: "Communication & articulation",
    accent: "#D9714F",
    summary: "Saying what you think clearly, out loud — and being willing to revise it.",
    practices: [
      "Stating a position in one sentence before defending it",
      "Listening for the strongest version of the other side",
      "Updating your view when a better argument appears",
    ],
    sampleQuestion:
      "What is the strongest thing someone who disagrees with you would say?",
  },
  {
    id: "learning",
    name: "Learning how to learn",
    accent: "#C98A3E",
    summary: "Thinking about thinking — noticing confusion and treating it as information.",
    practices: [
      "Finding the exact moment something went wrong",
      "Turning “I can't do this” into “I can't do this yet”",
      "Spotting the same pattern in a completely different place",
    ],
    sampleQuestion:
      "At what moment did she first notice something was wrong? What was the first clue?",
  },
];

/* ── Safety (trust pillars) ── */

export interface TrustPillar {
  title: string;
  detail: string;
}

export const trustPillars: TrustPillar[] = [
  {
    title: "It only knows one thing: today's lesson.",
    detail:
      "The mentor can't roleplay a friendship, can't wander into open conversation, can't be anything other than a guide through today's story. That's not a limitation we apologize for — it's the entire design.",
  },
  {
    title: "You can read every word.",
    detail:
      "Every conversation is logged and visible on your parent dashboard. Not a summary, not a sample — the actual conversation, every time.",
  },
  {
    title: "Your child's voice is never stored.",
    detail:
      "Audio becomes text and is deleted the moment it's heard. We keep the words, never the voice.",
  },
  {
    title: "Built on Claude, by Anthropic.",
    detail:
      "We chose the AI company built around safety as a starting design constraint, not an afterthought bolted on later.",
  },
];

/* ── Pricing (Master Blueprint §10) ── */

export type BillingPeriod = "monthly" | "quarterly" | "annual";

export interface PricingTier {
  id: string;
  name: string;
  monthly: number; // base monthly price in dollars
  highlighted: boolean;
  features: string[];
}

// Discounts: 3-month bundle −10%, annual bundle −20% (Blueprint §10.2)
export const billingDiscounts: Record<BillingPeriod, number> = {
  monthly: 0,
  quarterly: 0.1,
  annual: 0.2,
};

export const billingLabels: Record<BillingPeriod, string> = {
  monthly: "Monthly",
  quarterly: "3-month",
  annual: "Annual",
};

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    monthly: 20,
    highlighted: false,
    features: [
      "1 child profile",
      "Their chosen mentor",
      "Session summaries after every conversation",
      "The full curriculum — nothing held back",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    monthly: 32,
    highlighted: true,
    features: [
      "1 child profile",
      "The full mentor library — switch anytime",
      "Full conversation transcripts, word for word",
      "Weekly insight reports on how your child thinks",
    ],
  },
  {
    id: "family",
    name: "Family",
    monthly: 50,
    highlighted: false,
    features: [
      "Up to 4 children",
      "Everything in Plus, for every child",
      "One dashboard for the whole family",
    ],
  },
];

export const pricingReassurance =
  "7-day free trial · Full curriculum on every tier · Cancel anytime";

/* ── FAQ ── */

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Is this safe?",
    answer:
      "It's designed around that question. The mentor only knows today's lesson — it can't wander into open conversation or pretend to be a friend. Every word is logged to your parent dashboard, and anything off-scope is gently redirected, never silently ignored. The section above covers exactly how it works.",
  },
  {
    question: "What does my child actually do in a session?",
    answer:
      "They listen to a short story that stops at a hard moment, say what they would do, hear how it really turns out, and then talk it through with their mentor — out loud, in their own words. A session takes about fifteen to twenty minutes.",
  },
  {
    question: "How is this different from ChatGPT?",
    answer:
      "A general chatbot will talk about anything and hand your child answers. Our mentor does neither. It's scoped to one lesson at a time, it asks questions instead of answering them, and every conversation is built on a human-designed curriculum. It's a mentor with one job, not an open chat window.",
  },
  {
    question: "What ages is this for?",
    answer:
      "Kindergarten through 6th grade, in three age bands: K–2, 3–4, and 5–6. The same stories, calibrated differently — younger children get simpler questions and choices, older children get open-ended reasoning and harder follow-ups.",
  },
  {
    question: "Can I read the conversations?",
    answer:
      "Yes — all of them. Every session produces a summary you can read on your dashboard, and full word-for-word transcripts are available on Plus and Family plans. Transparency is never paywalled; only the depth of detail is.",
  },
  {
    question: "Do you store my child's voice?",
    answer:
      "No. Your child's voice becomes text and is deleted the moment it's heard. We keep the words so you can read them — we never keep the voice.",
  },
  {
    question: "Is this screen time?",
    answer:
      "Not the kind you're worried about. There's nothing to swipe and nothing autoplaying next. A session is fifteen minutes of your child thinking out loud with a guide — closer to a conversation at the dinner table than to a tablet game.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. The trial is 7 days with full access, and you can cancel any plan whenever you like — no phone calls, no hoops.",
  },
];

/* ── Nav links ── */

export const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "The Mentors", href: "/#mentors" },
  { label: "Five Pillars", href: "/#pillars" },
  { label: "Safety", href: "/#safety" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];
