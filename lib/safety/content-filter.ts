// Input safety classification for child messages.
// Runs BEFORE the Claude API call so we never send unsafe content to the model
// and can return a graceful redirect response immediately.

export type SafetyCategory =
  | "safe"
  | "self-harm"
  | "violence"
  | "inappropriate"
  | "drugs";

export interface SafetyResult {
  safe: boolean;
  category: SafetyCategory;
  redirectResponse: string | null;
}

const PATTERNS: Array<{ category: SafetyCategory; regex: RegExp }> = [
  {
    category: "self-harm",
    regex:
      /\b(kill\s+myself|hurt\s+myself|cut\s+myself|suicide|want\s+to\s+die|end\s+my\s+life|don'?t\s+want\s+to\s+be\s+here)\b/i,
  },
  {
    category: "violence",
    regex:
      /\b(bomb|shoot\s+someone|stab|murder|kill\s+(you|them|him|her)|weapon|gun\s+to)\b/i,
  },
  {
    category: "inappropriate",
    regex:
      /\b(sex|porn|naked|nude|boobs|penis|vagina|condom)\b/i,
  },
  {
    category: "drugs",
    regex:
      /\b(cocaine|heroin|meth|weed|smoke\s+weed|vape|get\s+high|illegal\s+drugs)\b/i,
  },
];

// Gentle, age-appropriate redirect responses. Never cold-silent, never preachy.
const REDIRECTS: Record<SafetyCategory, string> = {
  "safe": "",
  "self-harm":
    "That sounds like something really important — and not something I can " +
    "help with in a story. The best thing right now would be to find a grown-up " +
    "you really trust and tell them what's on your mind. A parent, a teacher, " +
    "or another adult close to you. Can you think of someone like that?",
  "violence":
    "That's not something our story can explore. Let's come back to the " +
    "lesson — what did you think about the choice the character made?",
  "inappropriate":
    "That's outside what we talk about in our lessons. Let's get back to the " +
    "story — what were you thinking about the question I asked?",
  "drugs":
    "That's not something our story covers. Let's return to the lesson — " +
    "what did the character's decision make you think about?",
};

export function classifyInput(text: string): SafetyResult {
  for (const { category, regex } of PATTERNS) {
    if (regex.test(text)) {
      return {
        safe: false,
        category,
        redirectResponse: REDIRECTS[category],
      };
    }
  }
  return { safe: true, category: "safe", redirectResponse: null };
}
