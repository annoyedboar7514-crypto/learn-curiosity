// Crossroads registry + landmark placement.
// Placement (per Dylan, July 2026 — overrules the earlier every-20 cadence):
// spec v1.1 §10 launch slate positions win. The Builder's Shortcut lands after
// level 3, The Edge of the Map after level 7; pilot ships both.

import type { GradeBand } from "@/lib/content/lessonSchema";
import type { CrossroadsStory } from "./schema";
import { validateStory } from "./schema";
import { EDGE_OF_THE_MAP } from "./edge-of-the-map";

export const CROSSROADS_STORIES: CrossroadsStory[] = [
  // TODO(content): "The Builder's Shortcut" (integrity vs speed) — after level 3 (spec §10, needed for pilot)
  EDGE_OF_THE_MAP, // after level 7 (spec §10, needed for pilot)
  // TODO(content): "The Frozen Choice" (Shackleton, tradeoff, no-win, 3-4/5-6)
  // TODO(content): "The Inventor's Gamble" (sunk cost, 3-4/5-6)
  // TODO(content): "Four Days Home" (Apollo 13, win-loss vs loss-loss, no-win)
  // TODO(content): era-5 capstone crossroads
];

// Fail loudly at build/dev time if a story breaks the diamond rules.
if (process.env.NODE_ENV !== "production") {
  for (const s of CROSSROADS_STORIES) {
    const errs = validateStory(s);
    if (errs.length) console.error(`[crossroads] ${s.id} INVALID:\n - ${errs.join("\n - ")}`);
  }
}

export function getCrossroadsStory(id: string): CrossroadsStory | null {
  return CROSSROADS_STORIES.find((s) => s.id === id) ?? null;
}

/** Landmarks a child can see (age-band gated) that are unlocked by their progress.
 *  Unlocked = the child completed the landmark's level. Permanently replayable. */
export function getUnlockedCrossroads(
  completedLevels: number[],
  gradeBand: GradeBand
): CrossroadsStory[] {
  const done = new Set(completedLevels);
  return CROSSROADS_STORIES.filter(
    (s) => s.ageBands.includes(gradeBand) && done.has(s.landmarkAfterLevel)
  );
}

/** The next landmark ahead of the child (for "a crossroads in history is ahead" teasers). */
export function getNextCrossroads(
  currentLevel: number,
  gradeBand: GradeBand
): CrossroadsStory | null {
  return (
    CROSSROADS_STORIES
      .filter((s) => s.ageBands.includes(gradeBand) && s.landmarkAfterLevel >= currentLevel)
      .sort((a, b) => a.landmarkAfterLevel - b.landmarkAfterLevel)[0] ?? null
  );
}
