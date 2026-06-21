export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getChildProfile } from "@/lib/session";
import { StudentDashboard } from "@/app/components/StudentDashboard";
import type { Pillar } from "@/lib/content/levels";

const ARCHETYPE_EMOJI: Record<string, string> = {
  "explorer":        "🧭",
  "astronaut":       "🚀",
  "detective":       "🔍",
  "inventor-builder":"🔧",
  "artist":          "🎨",
  "doctor-healer":   "🩺",
};

const ARCHETYPE_LABEL: Record<string, string> = {
  "explorer":        "Explorer",
  "astronaut":       "Astronaut",
  "detective":       "Detective",
  "inventor-builder":"Inventor",
  "artist":          "Artist",
  "doctor-healer":   "Healer",
};

export default async function HomePage() {
  const profile = await getChildProfile();
  if (!profile) redirect("/login");

  const archKey  = profile.archetype ?? "explorer";
  const gradeBand = (["K-2","3-4","5-6"].includes(profile.gradeBand)
    ? profile.gradeBand
    : "K-2") as "K-2" | "3-4" | "5-6";

  const childProfile = {
    nickname:        profile.nickname,
    gradeBand,
    archetype:       ARCHETYPE_LABEL[archKey] ?? "Explorer",
    archetypeEmoji:  ARCHETYPE_EMOJI[archKey] ?? "🧭",
    completedLevels: [] as number[],
    currentLevelId:  1,
    xp:              { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<Pillar, number>,
    streakDays:      0,
  };

  return <StudentDashboard profile={childProfile} />;
}
