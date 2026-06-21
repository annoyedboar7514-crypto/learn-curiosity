export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getChildProfile } from "@/lib/session";
import HomeClient from "@/app/home/HomeClient";
import type { Pillar } from "@/lib/content/levels";

const ARCHETYPE_EMOJI: Record<string, string> = {
  "explorer":        "🧭",
  "astronaut":       "🚀",
  "detective":       "🔍",
  "inventor-builder":"🔧",
  "artist":          "🎨",
  "doctor-healer":   "🩺",
};

export default async function HomePage() {
  const profile = await getChildProfile();
  if (!profile) redirect("/login");

  const archKey   = profile.archetype ?? "explorer";
  const gradeBand = (["K-2","3-4","5-6"].includes(profile.gradeBand)
    ? profile.gradeBand
    : "K-2") as "K-2" | "3-4" | "5-6";

  return (
    <HomeClient profile={{
      nickname:        profile.nickname,
      gradeBand,
      archetype:       archKey,
      archetypeEmoji:  ARCHETYPE_EMOJI[archKey] ?? "🧭",
      completedLevels: [],
      currentLevelId:  1,
      xp:              { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<Pillar, number>,
      streakDays:      0,
    }} />
  );
}
