import { getLessonForArchetype } from "@/lib/content/lesson-registry";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import LessonClient from "./LessonClient";
import type { Archetype, GradeBand } from "@/lib/content/lesson.types";

const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const CLERK_ENABLED = /^pk_(test|live)_/.test(CLERK_KEY) && CLERK_KEY.length > 40;

async function getChildProfileId(): Promise<string | null> {
  if (!CLERK_ENABLED) return null;
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

export default async function LessonPage({
  searchParams,
}: {
  searchParams: Promise<{ archetype?: string; mentor?: string; gradeBand?: string }>;
}) {
  const { archetype = "detective", mentor = "luna", gradeBand = "3-4" } =
    await searchParams;

  const { lesson, isFallback } = getLessonForArchetype(
    archetype as Archetype,
    gradeBand as GradeBand
  );
  const mentorChar = getMentorCharacter(mentor);
  const childProfileId = await getChildProfileId();

  return (
    <LessonClient
      lesson={lesson}
      mentor={mentorChar}
      archetype={archetype}
      gradeBand={gradeBand}
      isFallback={isFallback}
      childProfileId={childProfileId}
    />
  );
}
