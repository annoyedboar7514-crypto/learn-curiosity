import db from "./index";
import { getLessonById } from "@/lib/content/lesson-registry";

// ── Rank ladder ──────────────────────────────────────────────────────────────
export interface RankInfo {
  level: number;
  title: string;
  icon: string;
  sparksRequired: number;
  nextSparksRequired: number | null;
}

const RANKS: RankInfo[] = [
  { level: 1, title: "Curious Mind",    icon: "🌱", sparksRequired: 0,   nextSparksRequired: 20  },
  { level: 2, title: "Young Explorer",  icon: "🧭", sparksRequired: 20,  nextSparksRequired: 50  },
  { level: 3, title: "Question Seeker", icon: "🔍", sparksRequired: 50,  nextSparksRequired: 100 },
  { level: 4, title: "Deep Thinker",    icon: "💭", sparksRequired: 100, nextSparksRequired: 200 },
  { level: 5, title: "Wisdom Scout",    icon: "⭐", sparksRequired: 200, nextSparksRequired: 350 },
  { level: 6, title: "Sage in Training",icon: "🦉", sparksRequired: 350, nextSparksRequired: null },
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

// ── Sparks formula ──────────────────────────────────────────────────────────
// 10 per session + 2 per user reflection message + 5 bonus per new pillar
function computeSparks(
  sessions: number,
  userMessages: number,
  uniquePillars: number
): number {
  return sessions * 10 + userMessages * 2 + uniquePillars * 5;
}

// ── Progress object ──────────────────────────────────────────────────────────
export interface ChildProgress {
  sparks: number;
  totalSessions: number;
  totalUserMessages: number;
  uniquePillars: string[];
  uniqueLessons: string[];
  rank: RankInfo & { progressPct: number };
  recentLessonIds: string[];
}

export function getProgress(childProfileId: string | null): ChildProgress {
  const where = childProfileId
    ? "WHERE child_profile_id = ?"
    : "WHERE child_profile_id IS NULL";
  const param = childProfileId ?? null;

  const sessionRow = db
    .prepare(
      `SELECT COUNT(DISTINCT session_id) AS sessions,
              COUNT(CASE WHEN role='user' THEN 1 END) AS user_messages
       FROM messages ${where}`
    )
    .get(param) as { sessions: number; user_messages: number };

  const lessonRows = db
    .prepare(
      `SELECT DISTINCT lesson_id FROM messages ${where}`
    )
    .all(param) as { lesson_id: string }[];

  const recentRows = db
    .prepare(
      `SELECT DISTINCT lesson_id FROM messages ${where}
       ORDER BY created_at DESC LIMIT 5`
    )
    .all(param) as { lesson_id: string }[];

  const uniqueLessons = lessonRows.map((r) => r.lesson_id);

  const uniquePillars = [
    ...new Set(
      uniqueLessons
        .map((id) => getLessonById(id)?.pillar)
        .filter(Boolean) as string[]
    ),
  ];

  const totalSessions = sessionRow.sessions;
  const totalUserMessages = sessionRow.user_messages;
  const sparks = computeSparks(totalSessions, totalUserMessages, uniquePillars.length);

  return {
    sparks,
    totalSessions,
    totalUserMessages,
    uniquePillars,
    uniqueLessons,
    rank: getRank(sparks),
    recentLessonIds: recentRows.map((r) => r.lesson_id),
  };
}
