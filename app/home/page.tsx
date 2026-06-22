export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getChildProfile } from "@/lib/session";
import { getProgress } from "@/lib/db/progress";
import HomeClient from "@/app/home/HomeClient";
import { LEVELS, type Pillar } from "@/lib/content/levels";

const ARCHETYPE_EMOJI: Record<string, string> = {
  "explorer":         "🧭",
  "astronaut":        "🚀",
  "detective":        "🔍",
  "inventor-builder": "🔧",
  "artist":           "🎨",
  "doctor-healer":    "🩺",
};

export default async function HomePage() {
  let userId: string | null = null;
  try { ({ userId } = await auth()); } catch { /* Clerk not active */ }
  if (!userId) redirect("/login");

  const profile = await getChildProfile();

  // Quiz is mandatory before the home hub is accessible
  if (!profile?.archetype) redirect("/quiz");

  const archKey   = profile.archetype ?? "explorer";
  const gradeBand = (["K-2", "3-4", "5-6"].includes(profile?.gradeBand ?? "")
    ? profile!.gradeBand
    : "K-2") as "K-2" | "3-4" | "5-6";

  // Load real progress from DB
  let completedLevels: number[] = [];
  let xp: Record<Pillar, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  try {
    const progress = await getProgress(profile?.id ?? null);

    // Map string lesson IDs from messages table to numeric level IDs
    completedLevels = progress.uniqueLessons
      .map(id => parseInt(id, 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 100);

    // Tally per-pillar XP from completed levels using the levels definition
    for (const levelId of completedLevels) {
      const level = LEVELS.find(l => l.id === levelId);
      if (!level) continue;
      xp[level.pillar] = (xp[level.pillar] ?? 0) + level.xpReward.pillar;
      if (level.bonusPillar) {
        xp[level.bonusPillar] = (xp[level.bonusPillar] ?? 0) + Math.round(level.xpReward.pillar / 2);
      }
    }
  } catch { /* DB unavailable — fall back to zeros */ }

  // Current level = first uncompleted level after the last completed one
  const currentLevelId = completedLevels.length > 0
    ? Math.min(Math.max(...completedLevels) + 1, 100)
    : 1;

  return (
    <HomeClient profile={{
      nickname:        profile?.nickname ?? "Explorer",
      gradeBand,
      archetype:       archKey,
      archetypeEmoji:  ARCHETYPE_EMOJI[archKey] ?? "🧭",
      completedLevels,
      currentLevelId,
      xp,
      streakDays:      0,
    }} />
  );
}
