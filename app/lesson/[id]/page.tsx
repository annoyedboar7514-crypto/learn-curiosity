export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getChildProfile } from "@/lib/session";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { getLevelById } from "@/lib/content/levels/all100Levels";
import { LessonPageClient } from "./LessonPageClient";
import type { GradeBand } from "@/lib/content/lessonSchema";

const GRADE_MAP: Record<string, GradeBand> = {
  "K-2": "k2",
  "3-4": "grade34",
  "5-6": "grade56",
};

export default async function LessonByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const levelId = parseInt(id, 10);
  if (isNaN(levelId) || levelId < 1 || levelId > 100) notFound();

  const lesson = getLevelById(levelId);
  if (!lesson) notFound();

  let userId: string | null = null;
  try {
    ({ userId } = await auth());
  } catch { /* Clerk not active */ }
  if (!userId) redirect("/login");

  const profile = await getChildProfile();
  const gradeBand: GradeBand = GRADE_MAP[profile?.gradeBand ?? ""] ?? "k2";
  const mentorId = profile?.mentorId ?? "luna";
  const childName = profile?.nickname ?? "Explorer";

  let mentorName = "Luna";
  try {
    const mentorChar = getMentorCharacter(mentorId);
    mentorName = mentorChar?.name ?? "Luna";
  } catch { /* use default */ }

  return (
    <LessonPageClient
      lesson={lesson}
      gradeBand={gradeBand}
      childName={childName}
      mentorName={mentorName}
    />
  );
}
