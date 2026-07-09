import { sql } from "./index";
import { getLessonById } from "@/lib/content/lesson-registry";

export interface ChildProgress {
  totalSessions: number;
  totalUserMessages: number;
  uniquePillars: string[];
  uniqueLessons: string[];
  recentLessonIds: string[];
}

export async function getProgress(childProfileId: string | null): Promise<ChildProgress> {
  const [sessionRow, lessonRows, recentRows] = childProfileId
    ? await Promise.all([
        sql`SELECT COUNT(DISTINCT session_id) AS sessions, COUNT(*) FILTER (WHERE role = 'user') AS user_messages FROM messages WHERE child_profile_id = ${childProfileId}`,
        sql`SELECT DISTINCT lesson_id FROM messages WHERE child_profile_id = ${childProfileId}`,
        sql`SELECT lesson_id FROM messages WHERE child_profile_id = ${childProfileId} GROUP BY lesson_id ORDER BY MAX(created_at) DESC LIMIT 5`,
      ])
    : await Promise.all([
        sql`SELECT COUNT(DISTINCT session_id) AS sessions, COUNT(*) FILTER (WHERE role = 'user') AS user_messages FROM messages WHERE child_profile_id IS NULL`,
        sql`SELECT DISTINCT lesson_id FROM messages WHERE child_profile_id IS NULL`,
        sql`SELECT lesson_id FROM messages WHERE child_profile_id IS NULL GROUP BY lesson_id ORDER BY MAX(created_at) DESC LIMIT 5`,
      ]);

  const uniqueLessons = lessonRows.map((r) => String(r.lesson_id));

  const uniquePillars = [
    ...new Set(
      uniqueLessons
        .map((id) => getLessonById(id)?.pillar)
        .filter(Boolean) as string[]
    ),
  ];

  return {
    totalSessions: Number(sessionRow[0]?.sessions ?? 0),
    totalUserMessages: Number(sessionRow[0]?.user_messages ?? 0),
    uniquePillars,
    uniqueLessons,
    recentLessonIds: recentRows.map((r) => String(r.lesson_id)),
  };
}
