import { sql } from "./index";
import { getChildProfile } from "@/lib/session";
import { getQuizResult } from "./quiz-results";
import { getLessonSessionMeta } from "./lesson-sessions";
import { getLessonById } from "@/lib/content/lesson-registry";
import { getLevelById } from "@/lib/content/levels/all100Levels";
import { getCrossroadsStory } from "@/lib/content/crossroads";
import {
  buildPillarReport,
  emptyPillars,
  normalizePillar,
  lessonPillarGain,
  type PillarReportRow,
  type PillarScores,
  type QuizAnswer,
} from "@/lib/grading";

export interface TranscriptTurn {
  role: "mentor" | "child";
  text: string;
  escalated: boolean;
}

export interface SessionEntry {
  sessionId: string;
  lessonId: string;
  lessonTitle: string;
  pillar: string | null;        // short key
  pillarName: string | null;
  startedAt: number;            // ms
  durationMs: number;
  childTurns: number;
  decisionAnswer: string | null;
  transcript: TranscriptTurn[];
  redirectCount: number;
  escalationCount: number;
  redirectFlags: { topic: string; action: string }[];
}

export interface ParentReport {
  hasProfile: boolean;
  child: { nickname: string; gradeBand: string; archetype: string | null } | null;
  hasQuiz: boolean;
  quiz: { archetype: string; durationMs: number; completedAt: number; answers: QuizAnswer[]; avgPerQuestionMs: number } | null;
  usage: {
    totalMs: number;
    quizMs: number;
    lessonMs: number;
    lessonsCompleted: number;
    questionsAnswered: number;
    mentorQuestions: number;
    streakDays: number;
    lastActive: number | null;
    sessionsCount: number;
  };
  pillarReport: PillarReportRow[];
  pillarsMeasured: boolean;
  sessions: SessionEntry[];
  timeByDay: { label: string; minutes: number }[];
  consentAt: number | null;
}

const PILLAR_NAMES: Record<string, string> = {
  ct: "Critical Thinking",
  res: "Resilience & Character",
  cre: "Creativity & Vision",
  com: "Communication",
  learn: "Learning How to Learn",
};
const DAY = 86400000;

interface MsgRow { session_id: string; lesson_id: string; role: string; content: string; created_at: number; }

export async function getParentReport(): Promise<ParentReport> {
  const profile = await getChildProfile();
  const clerkUserId = await currentClerkId();

  const empty: ParentReport = {
    hasProfile: !!profile,
    child: profile ? { nickname: profile.nickname, gradeBand: profile.gradeBand, archetype: profile.archetype } : null,
    hasQuiz: false, quiz: null,
    usage: { totalMs: 0, quizMs: 0, lessonMs: 0, lessonsCompleted: 0, questionsAnswered: 0, mentorQuestions: 0, streakDays: 0, lastActive: null, sessionsCount: 0 },
    pillarReport: buildPillarReport(emptyPillars(), emptyPillars()),
    pillarsMeasured: false, sessions: [], timeByDay: [], consentAt: null,
  };

  if (!clerkUserId) return empty;

  // Pull quiz baseline, per-session metadata, and all messages for this child.
  const quiz = await getQuizResult(clerkUserId);
  const metaBySession = await getLessonSessionMeta(clerkUserId);

  let msgs: MsgRow[] = [];
  if (profile?.id) {
    try {
      const rows = await sql`
        SELECT session_id, lesson_id, role, content, created_at
        FROM messages
        WHERE child_profile_id = ${profile.id}
        ORDER BY created_at ASC
      `;
      msgs = rows.map((r) => ({
        session_id: String(r.session_id), lesson_id: String(r.lesson_id),
        role: String(r.role), content: String(r.content), created_at: Number(r.created_at),
      }));
    } catch { msgs = []; }
  }

  // Group messages into sessions and build transcripts.
  const grouped = new Map<string, MsgRow[]>();
  for (const m of msgs) {
    if (!grouped.has(m.session_id)) grouped.set(m.session_id, []);
    grouped.get(m.session_id)!.push(m);
  }

  const sessions: SessionEntry[] = [];
  const gains = emptyPillars();
  let lessonMs = 0, mentorQuestions = 0, questionsAnswered = 0;
  const activeDays = new Set<number>();

  for (const [sessionId, rows] of grouped) {
    const lessonId = rows[0].lesson_id;
    const lesson = getLessonById(lessonId);
    // Numbered levels (all100Levels) use numeric ids the registry can't resolve
    const numericLevel = /^\d+$/.test(lessonId) ? getLevelById(Number(lessonId)) : undefined;
    // Crossroads debriefs log as "crossroads:<storyId>"
    const crossroads = lessonId.startsWith("crossroads:") ? getCrossroadsStory(lessonId.slice(11)) : null;
    const meta = metaBySession.get(sessionId);
    const startSec = rows[0].created_at;
    const endSec = rows[rows.length - 1].created_at;
    const startMs = startSec * 1000;
    // duration: prefer recorded metadata, else span of message timestamps
    const durationMs = meta?.durationMs && meta.durationMs > 0 ? meta.durationMs : Math.max(0, (endSec - startSec) * 1000);

    let messageRedirects = 0;
    const transcript: TranscriptTurn[] = rows.map((r) => {
      const isAssistant = r.role === "assistant";
      const escalated = isAssistant && r.content.startsWith("[ESCALATE]");
      if (isAssistant && r.content.startsWith("[REDIRECT]")) messageRedirects++;
      return {
        role: isAssistant ? "mentor" : "child",
        text: r.content.replace(/^\[(ESCALATE|REDIRECT)\]\s*/, ""),
        escalated,
      };
    });
    const childTurns = transcript.filter((t) => t.role === "child").length;
    const mentorTurns = transcript.filter((t) => t.role === "mentor").length;
    const escalationCount = transcript.filter((t) => t.escalated).length;

    const pillarKey =
      (meta?.pillar ? normalizePillar(meta.pillar) : null) ??
      (lesson ? normalizePillar(lesson.pillar) : null) ??
      (numericLevel ? normalizePillar(numericLevel.pillar ?? null) : null);
    const gain = meta?.pillarGain && meta.pillarGain > 0 ? meta.pillarGain : lessonPillarGain(childTurns);
    if (pillarKey) gains[pillarKey] += gain;

    lessonMs += durationMs;
    mentorQuestions += mentorTurns;
    questionsAnswered += childTurns;
    activeDays.add(Math.floor(startMs / DAY));

    sessions.push({
      sessionId, lessonId,
      lessonTitle:
        lesson?.title ??
        (crossroads ? `⭐ Crossroads — ${crossroads.title}` : undefined) ??
        (numericLevel?.title ? `Level ${lessonId} — ${numericLevel.title}` : lessonId),
      pillar: pillarKey,
      pillarName: pillarKey ? PILLAR_NAMES[pillarKey] : null,
      startedAt: startMs,
      durationMs,
      childTurns,
      decisionAnswer: meta?.decisionAnswer ?? null,
      transcript,
      redirectCount: (meta?.flags?.length ?? 0) + messageRedirects,
      escalationCount,
      redirectFlags: (meta?.flags ?? []).map((f) => ({ topic: f.topic, action: f.action })),
    });
  }
  sessions.sort((a, b) => b.startedAt - a.startedAt);

  // Quiz baseline + measured flag
  const baseline = quiz ? quiz.pillars : emptyPillars();
  const pillarsMeasured = !!quiz && Object.values(baseline).some((v) => v > 0);

  // Usage rollups
  const quizMs = quiz?.durationMs ?? 0;
  if (quiz) { questionsAnswered += quiz.answers.length; activeDays.add(Math.floor((quiz.completedAt * 1000) / DAY)); }
  const lessonsCompleted = sessions.length;
  const lastActive = sessions[0]?.startedAt ?? (quiz ? quiz.completedAt * 1000 : null);

  // Streak: consecutive days with any activity, ending at the most recent active day
  let streakDays = 0;
  if (activeDays.size) {
    let cursor = Math.max(...activeDays);
    while (activeDays.has(cursor)) { streakDays++; cursor--; }
  }

  // Time-by-day for last 7 days
  const today = Math.floor(Date.now() / DAY);
  const dayMinutes = new Map<number, number>();
  for (const s of sessions) dayMinutes.set(Math.floor(s.startedAt / DAY), (dayMinutes.get(Math.floor(s.startedAt / DAY)) ?? 0) + s.durationMs);
  if (quiz) { const d = Math.floor((quiz.completedAt * 1000) / DAY); dayMinutes.set(d, (dayMinutes.get(d) ?? 0) + quizMs); }
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeByDay: { label: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = today - i;
    timeByDay.push({ label: names[new Date(d * DAY).getDay()], minutes: Math.round((dayMinutes.get(d) ?? 0) / 60000) });
  }

  let consentAt: number | null = null;
  try {
    const [c] = await sql`SELECT consented_at FROM coppa_consent WHERE clerk_user_id = ${clerkUserId} ORDER BY consented_at DESC LIMIT 1`;
    if (c?.consented_at != null) consentAt = Number(c.consented_at) * 1000;
  } catch { /* table/column may differ — non-fatal */ }

  return {
    hasProfile: !!profile,
    child: profile ? { nickname: profile.nickname, gradeBand: profile.gradeBand, archetype: profile.archetype } : null,
    hasQuiz: !!quiz,
    quiz: quiz ? {
      archetype: quiz.archetype, durationMs: quizMs, completedAt: quiz.completedAt * 1000,
      answers: quiz.answers,
      avgPerQuestionMs: quiz.answers.length ? Math.round(quizMs / quiz.answers.length) : 0,
    } : null,
    usage: {
      totalMs: quizMs + lessonMs, quizMs, lessonMs, lessonsCompleted,
      questionsAnswered, mentorQuestions, streakDays,
      lastActive, sessionsCount: sessions.length,
    },
    pillarReport: buildPillarReport(baseline, gains),
    pillarsMeasured,
    sessions,
    timeByDay,
    consentAt,
  };
}

// Small local helper so we don't import Clerk's auth() shape in two places.
async function currentClerkId(): Promise<string | null> {
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}
