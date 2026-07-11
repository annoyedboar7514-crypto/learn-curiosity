// GameMoment content — Engagement Games, Stage 2.5.
// (No standalone games spec exists in /docs; designed here per the July 2026
// ruling that missing docs are Claude-designed. Hard rules honored: dual
// voice/touch input, results injected into mentor context, NO win states —
// no scores, no right answers, no streaks. The games are thinking made
// visible, hosted by the mentor mid-conversation.)

export interface GameMomentResult {
  game: "fairness-line" | "know-or-guess";
  /** One plain sentence describing what the child did, for the mentor's context. */
  summary: string;
}

// ── The Fairness Line ────────────────────────────────────────────────────────
// The child places how the story's outcome FELT on a line from fair to unfair.
// There is no correct position — the position is the conversation starter.

export function fairnessHostLine(): string {
  return `Before we keep talking — here's my fairness line. Show me where this lands.`;
}

export function fairnessQuestion(choiceLabel: string): string {
  return `You chose to ${choiceLabel.toLowerCase()}, and the story played out the way it did. How fair was how it turned out — for everyone in the story?`;
}

/** Spoken keywords → a position on the line (0 = fair, 1 = unfair). */
export const FAIRNESS_VOICE_MAP: { match: RegExp; pos: number }[] = [
  { match: /really unfair|totally unfair|so unfair|very unfair/i, pos: 0.92 },
  { match: /(a (little|bit)|kind of|kinda|sort of|mostly) unfair/i, pos: 0.7 },
  { match: /unfair|not fair/i, pos: 0.8 },
  { match: /middle|half|both|mixed|some of each/i, pos: 0.5 },
  { match: /(a (little|bit)|kind of|kinda|sort of|mostly) fair/i, pos: 0.3 },
  { match: /really fair|totally fair|very fair|super fair/i, pos: 0.08 },
  { match: /fair/i, pos: 0.2 },
];

/** The mentor's spoken reaction to a placement — curiosity, never judgment. */
export function fairnessReaction(pos: number): string {
  if (pos < 0.33) return "You put it near fair. Someone in the story might disagree — hold that thought.";
  if (pos > 0.67) return "You put it toward unfair. I want to hear who it was unfair TO.";
  return "Right in the middle — fair for some, not for others. That's often the honest answer.";
}

export function fairnessSummary(pos: number): string {
  const where = pos < 0.33 ? "closer to fair" : pos > 0.67 ? "closer to unfair" : "in the middle";
  return `On the fairness line, the child placed the story's outcome ${where} (${Math.round(pos * 100)}% toward unfair).`;
}

// ── Know It or Guess It ──────────────────────────────────────────────────────
// Metacognition (pillar 5): the child sorts statements about their own session
// into "I know it" vs "I'm guessing." Self-referential statements, so they are
// valid for every lesson; there is no scoring — noticing the difference IS the game.

export interface KnowGuessItem {
  statement: string;
}

export function knowGuessHostLine(): string {
  return `Quick game. I'll show you four things — you tell me which ones you KNOW, and which ones you're really just guessing.`;
}

export function knowGuessItems(choiceLabel: string): KnowGuessItem[] {
  return [
    { statement: "How the story ended" },
    { statement: `What would have happened if you hadn't chosen to ${choiceLabel.toLowerCase()}` },
    { statement: "Why you made the choice you made" },
    { statement: "What the real people back then were feeling" },
  ];
}

/** Gentle spoken reactions as the child sorts — never "right/wrong". */
export function knowGuessReaction(bucket: "know" | "guess"): string {
  return bucket === "know"
    ? "You know it — you were there for that part."
    : "A guess — and saying so out loud is the smart part.";
}

export function knowGuessSummary(sorted: { statement: string; bucket: "know" | "guess" }[]): string {
  const knows = sorted.filter(s => s.bucket === "know").map(s => `"${s.statement}"`).join(", ") || "nothing";
  const guesses = sorted.filter(s => s.bucket === "guess").map(s => `"${s.statement}"`).join(", ") || "nothing";
  return `In Know It or Guess It, the child said they KNOW: ${knows}; and they're GUESSING about: ${guesses}.`;
}
