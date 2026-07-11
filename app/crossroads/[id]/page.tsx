export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getChildProfile } from "@/lib/session";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { getCrossroadsStory } from "@/lib/content/crossroads";
import type { GradeBand } from "@/lib/content/lessonSchema";
import { CrossroadsPlayer } from "./CrossroadsPlayer";

const GRADE_MAP: Record<string, GradeBand> = {
  "K-2": "k2",
  "3-4": "grade34",
  "5-6": "grade56",
};

export default async function CrossroadsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = getCrossroadsStory(id);
  if (!story) notFound();

  let userId: string | null = null;
  try { ({ userId } = await auth()); } catch { /* Clerk not active */ }
  if (!userId) redirect("/login");

  const profile = await getChildProfile();
  const gradeBand: GradeBand = GRADE_MAP[profile?.gradeBand ?? ""] ?? "grade34";
  // Age-band gate: a child outside the band never plays the story.
  if (!story.ageBands.includes(gradeBand)) redirect("/home");

  const mentorId = profile?.mentorId ?? "luna";
  let mentorName = "Luna";
  try {
    mentorName = getMentorCharacter(mentorId)?.name ?? "Luna";
  } catch { /* default */ }

  return (
    <CrossroadsPlayer
      story={story}
      gradeBand={gradeBand}
      childName={profile?.nickname ?? "Explorer"}
      mentorId={mentorId}
      mentorName={mentorName}
    />
  );
}
