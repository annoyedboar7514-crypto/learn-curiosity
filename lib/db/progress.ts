import { sql } from "./index";
import { getLessonById } from "@/lib/content/lesson-registry";

export interface RankInfo {
  level: number;
  title: string;
  icon: string;
  sparksRequired: number;
  nextSparksRequired: number | null;
}

const RANKS: RankInfo[] = [
  { level: 1, title: "Curious Mind",     icon: "🌱", sparksRequired: 0,   nextSparksRequired: 20  },
  { level: 2, title: "Young Explorer",   icon: "🧭", sparksRequired: 20,  nextSparksRequired: 50  },
  { level: 3, title: "Question Seeker",  icon: "🔍", sparksRequired: 50,  nextSparksRequired: 100 },
  { level: 4, title: "Deep Thinker",     icon: "💭", sparksRequired: 100, nextSparksRequired: 200 },
  { level: 5, title: "Wisdom Scout",     icon: "⭐", sparksRequired: 200, nextSparksRequired: 350 },
  { level: 6, title: "Sage in Training", icon: "🦉", sparksRequired: 350, nextSparksRequired: null },
];

export function getRank(sparks: number): RankInfo & { progressPct: number } {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (sparks >= r.sparksRequired) rank = r;
  }
  const pct =
    rank.nextSparksRequired === null
      ? 100
      : Math.round(
          ((sparks - rank.sparksRequired) /
            (rank.nextSparksRequired - rank.sparksRequired)) *
            100
        );
  return { ...rank, progressPct: Math.min(pct, 100) };
}

export interface ChildProgress {
  sparks: number;
  totalSessions: number;
  totalUserMessages: number;
  uniquePillars: string[];
  uniqueLessons: string[];
  rank: RankInfo & { progressPct: number };
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

  const totalSessions     = Number(sessionRow[0]?.sessions ?? 0);
  const totalUserMessages = Number(sessionRow[0]?.user_messages ?? 0);
  const sparks = totalSessions * 10 + totalUserMessages * 2 + uniquePillars.length * 5;

  return {
    sparks,
    totalSessions,
    totalUserMessages,
    uniquePillars,
    uniqueLessons,
    rank: getRank(sparks),
    recentLessonIds: recentRows.map((r) => String(r.lesson_id)),
  };
}
