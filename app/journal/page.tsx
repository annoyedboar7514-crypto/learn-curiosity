export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getChildProfile } from "@/lib/session";
import { getBestReasoning } from "@/lib/db/journal";
import { getCrossroadsRuns } from "@/lib/db/crossroads-runs";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { getLevelById } from "@/lib/content/levels/all100Levels";
import { CROSSROADS_STORIES } from "@/lib/content/crossroads";
import { getJournalNote } from "@/lib/content/journal-notes";
import JournalClient, { type JournalPage } from "./JournalClient";

function fmtDate(epochSeconds: number): string {
  if (!epochSeconds) return "";
  return new Date(epochSeconds * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default async function JournalPage() {
  let userId: string | null = null;
  try { ({ userId } = await auth()); } catch { /* Clerk not active */ }
  if (!userId) redirect("/login");

  const profile = await getChildProfile();
  if (!profile) redirect("/signup/complete");

  const pages: JournalPage[] = [];

  // The child's own best-reasoning lines, one per lesson, in the order lived.
  try {
    const quotes = await getBestReasoning(profile.id);
    for (const q of quotes) {
      const levelId = parseInt(q.lessonId, 10);
      const lesson = isNaN(levelId) ? undefined : getLevelById(levelId);
      pages.push({
        kind: "reasoning",
        title: lesson?.title ?? "A story we shared",
        quote: q.quote,
        note: getJournalNote(lesson?.pillar, isNaN(levelId) ? q.lessonId : levelId),
        date: fmtDate(q.createdAt),
      });
    }
  } catch { /* DB unavailable — journal shows what it can */ }

  // Completed Crossroads become fold-out map pages (latest completed walk).
  try {
    for (const story of CROSSROADS_STORIES) {
      const runs = (await getCrossroadsRuns(userId, story.id)).filter((r) => r.endingId);
      const last = runs[runs.length - 1];
      if (!last) continue;
      pages.push({
        kind: "crossroads",
        storyId: story.id,
        title: story.title,
        path: last.path,
        whys: last.whys.map((w) => ({ choiceLabel: w.choiceLabel, why: w.why })),
        date: fmtDate(last.startedAt),
      });
    }
  } catch { /* DB unavailable */ }

  const mentor = getMentorCharacter(profile.mentorId ?? "luna");

  return (
    <JournalClient
      pages={pages}
      nickname={profile.nickname}
      mentorName={mentor.name}
      mentorEmoji={mentor.emoji}
    />
  );
}
