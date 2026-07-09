// Crossroads — branching "would you rather" story mode.
// Canonical spec: docs/crossroads-spec-v1.1.md
// Diamond structure: 3-4 decisions, 10-14 nodes, 3-4 endings, exactly one True Path.

import type { GradeBand } from "@/lib/content/lessonSchema";

export type ConceptTag =
  | "risk-reward"
  | "cause-effect"
  | "tradeoff"
  | "sunk-cost"
  | "irreversibility"
  | "win-loss-vs-loss-loss";

export const CONCEPT_FRAMING: Record<ConceptTag, string> = {
  "risk-reward": "What you might lose vs. what you might gain — and you never know for sure",
  "cause-effect": "Choices are dominoes — the fall starts quietly",
  "tradeoff": "Sometimes choosing one good thing means losing another good thing",
  "sunk-cost": "'We've come too far to stop' — is that a reason, or a trap?",
  "irreversibility": "Some doors lock behind you",
  "win-loss-vs-loss-loss": "Some crossroads have no winning path — only choosing what you can live with losing",
};

export interface StoryChoice {
  id: string;
  label: string;          // the choice card text
  stakesLine: string;     // risk/reward stated aloud BEFORE choosing
  nextNodeId: string;
  isTruePath: boolean;    // exactly one full route through the story is history
}

export interface ConsequenceEcho {
  triggeredByChoiceId: string;  // fires only if this choice is on the current run's path
  narrationInsert: string;      // e.g. "You said speed mattered most. It just cost you the water barrels."
}

export interface StoryNode {
  id: string;
  type: "scene" | "decision" | "ending";
  narrationByBand: Record<GradeBand, string>;
  panelEmoji?: string;             // placeholder visual until panel art exists
  choices?: StoryChoice[];         // decision nodes only
  nextNodeId?: string;             // scene nodes: linear advance
  consequenceEchoes?: ConsequenceEcho[];
  endingSummary?: { whatWasLost: string; whatWasGained: string };
}

export interface CrossroadsStory {
  id: string;
  era: 1 | 2 | 3 | 4 | 5;
  title: string;
  pillarTag: string;               // lesson pillar this feeds ("critical" | "resilience" | ...)
  conceptTag: ConceptTag;
  noWin: boolean;                  // never announced to the child — discovering it IS the lesson
  ageBands: GradeBand[];           // gating: a child outside the band never sees the landmark
  landmarkAfterLevel: number;      // unlocks after completing this level
  startNodeId: string;
  truePathNodeIds: string[];       // the historical route, revealed after first completion
  nodes: StoryNode[];
  whatReallyHappened: string;      // short telling shown with the True Path reveal
}

// ── Build-time validation (spec build-prompt §1) ─────────────────────────────
export function validateStory(story: CrossroadsStory): string[] {
  const errors: string[] = [];
  const byId = new Map(story.nodes.map((n) => [n.id, n]));

  const decisions = story.nodes.filter((n) => n.type === "decision");
  const endings = story.nodes.filter((n) => n.type === "ending");
  if (decisions.length < 3 || decisions.length > 4) errors.push(`decisions=${decisions.length}, spec wants 3-4`);
  if (story.nodes.length < 10 || story.nodes.length > 14) errors.push(`nodes=${story.nodes.length}, spec wants 10-14`);
  if (endings.length < 3 || endings.length > 4) errors.push(`endings=${endings.length}, spec wants 3-4`);
  if (!byId.has(story.startNodeId)) errors.push(`startNodeId ${story.startNodeId} missing`);

  // every path terminates + links resolve
  for (const n of story.nodes) {
    if (n.type === "scene" && (!n.nextNodeId || !byId.has(n.nextNodeId))) errors.push(`scene ${n.id} has bad nextNodeId`);
    if (n.type === "decision") {
      if (!n.choices?.length) errors.push(`decision ${n.id} has no choices`);
      for (const c of n.choices ?? []) {
        if (!byId.has(c.nextNodeId)) errors.push(`choice ${c.id} → missing node ${c.nextNodeId}`);
        if (!c.stakesLine?.trim()) errors.push(`choice ${c.id} missing stakesLine`);
      }
    }
    if (n.type === "ending" && !n.endingSummary) errors.push(`ending ${n.id} missing endingSummary`);
    if (story.noWin && n.type === "ending" && !n.endingSummary?.whatWasLost?.trim())
      errors.push(`noWin story: ending ${n.id} has empty whatWasLost`);
  }

  // exactly one complete true path: walk it
  let cursor: StoryNode | undefined = byId.get(story.startNodeId);
  const walked: string[] = [];
  let guard = 0;
  while (cursor && guard++ < 30) {
    walked.push(cursor.id);
    if (cursor.type === "ending") break;
    if (cursor.type === "scene") { cursor = byId.get(cursor.nextNodeId ?? ""); continue; }
    const truePicks: StoryChoice[] = (cursor.choices ?? []).filter((c: StoryChoice) => c.isTruePath);
    if (truePicks.length !== 1) { errors.push(`decision ${cursor.id} has ${truePicks.length} true-path choices (needs exactly 1)`); break; }
    cursor = byId.get(truePicks[0].nextNodeId);
  }
  if (cursor?.type !== "ending") errors.push("true path does not terminate at an ending");
  const declared = new Set(story.truePathNodeIds);
  if (story.truePathNodeIds.length && walked.some((id) => !declared.has(id)))
    errors.push("walked true path diverges from declared truePathNodeIds");

  return errors;
}
