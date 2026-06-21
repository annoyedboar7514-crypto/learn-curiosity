export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
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

const ZERO_XP = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<Pillar, number>;

export default async function HomePage() {
  // Must be logged in — if not, send to login
  let userId: string | null = null;
  try { ({ userId } = await auth()); } catch { /* Clerk not active */ }
  if (!userId) redirect("/login");

  // Try to load child profile — if none exists yet, fall back to defaults
  const profile = await getChildProfile();

  const archKey   = profile?.archetype ?? "explorer";
  const gradeBand = (["K-2","3-4","5-6"].includes(profile?.gradeBand ?? "")
    ? profile!.gradeBand
    : "K-2") as "K-2" | "3-4" | "5-6";

  return (
    <HomeClient profile={{
      nickname:        profile?.nickname ?? "Explorer",
      gradeBand,
      archetype:       archKey,
      archetypeEmoji:  ARCHETYPE_EMOJI[archKey] ?? "🧭",
      completedLevels: [],
      currentLevelId:  1,
      xp:              ZERO_XP,
      streakDays:      0,
    }} />
  );
}
