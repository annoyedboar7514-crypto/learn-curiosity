export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getLessonForArchetype } from "@/lib/content/lesson-registry";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { getChildProfile } from "@/lib/session";
import LessonClient from "./LessonClient";
import type { Archetype, GradeBand } from "@/lib/content/lesson.types";

export default async function LessonPage({
  searchParams,
}: {
  searchParams: Promise<{ archetype?: string; mentor?: string; gradeBand?: string }>;
}) {
  const params = await searchParams;
  const profile = await getChildProfile();

  if (!profile) redirect("/login");

  // URL params take precedence, then fall back to saved profile, then defaults
  const archetype  = (params.archetype  ?? profile.archetype  ?? "detective") as Archetype;
  const gradeBand  = (params.gradeBand  ?? profile.gradeBand  ?? "3-4")       as GradeBand;
  const mentorId   =  params.mentor     ?? profile.mentorId   ?? "luna";

  const { lesson, isFallback } = getLessonForArchetype(archetype, gradeBand);
  const mentorChar = getMentorCharacter(mentorId);

  return (
    <LessonClient
      lesson={lesson}
      mentor={mentorChar}
      archetype={archetype}
      gradeBand={gradeBand}
      isFallback={isFallback}
      childProfileId={profile.id}
    />
  );
}
