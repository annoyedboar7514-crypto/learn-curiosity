// Crossroads registry + landmark placement.
// Cadence (per Dylan): one crossroads landmark every ~20 levels — i.e. one per
// era, at the era boundary. (Spec v1.1's launch slate used tighter positions;
// the every-20 cadence is the product decision and wins.)

import type { GradeBand } from "@/lib/content/lessonSchema";
import type { CrossroadsStory } from "./schema";
import { validateStory } from "./schema";
import { EDGE_OF_THE_MAP } from "./edge-of-the-map";

export const CROSSROADS_STORIES: CrossroadsStory[] = [
  EDGE_OF_THE_MAP, // after level 20 (era 1 → 2 gateway)
  // TODO(content): "The Frozen Choice" (Shackleton, tradeoff, no-win, 3-4/5-6) — after level 40
  // TODO(content): "The Inventor's Gamble" (sunk cost, 3-4/5-6) — after level 60
  // TODO(content): "Four Days Home" (Apollo 13, win-loss vs loss-loss, no-win) — after level 80
  // TODO(content): era-5 capstone crossroads — after level 100
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
