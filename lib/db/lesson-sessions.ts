import { sql } from "./index";

export interface RedirectFlag {
  topic: string;
  action: string;
  ts: number;
}

export interface LessonSessionMeta {
  sessionId: string;
  lessonId: string;
  level: number | null;
  pillar: string | null;
  pillarGain: number;
  decisionAnswer: string | null;
  durationMs: number;
  startedAt: number;
  endedAt: number | null;
  flags: RedirectFlag[];
}

/**
 * Record (or update) the metadata for one completed lesson session.
 * Call this when a lesson's four-phase loop finishes. The chat itself is
 * already stored turn-by-turn in `messages` via logMessage().
 */
export async function recordLessonSession(params: {
  sessionId: string;
  clerkUserId: string | null;
  childProfileId: string | null;
  lessonId: string;
  level?: number | null;
  pillar?: string | null;
  pillarGain?: number;
  decisionAnswer?: string | null;
  durationMs?: number;
  startedAt?: number;
  endedAt?: number | null;
  flags?: RedirectFlag[];
}): Promise<void> {
  await sql`
    INSERT INTO lesson_sessions (
      session_id, clerk_user_id, child_profile_id, lesson_id, level, pillar,
      pillar_gain, decision_answer, duration_ms, started_at, ended_at, flags
    ) VALUES (
      ${params.sessionId}, ${params.clerkUserId ?? null}, ${params.childProfileId ?? null},
      ${params.lessonId}, ${params.level ?? null}, ${params.pillar ?? null},
      ${params.pillarGain ?? 0}, ${params.decisionAnswer ?? null},
      ${params.durationMs ?? 0},
      ${params.startedAt ?? Math.floor(Date.now() / 1000)},
      ${params.endedAt ?? null},
      ${JSON.stringify(params.flags ?? [])}
    )
    ON CONFLICT (session_id) DO UPDATE SET
      level           = EXCLUDED.level,
      pillar          = EXCLUDED.pillar,
      pillar_gain     = EXCLUDED.pillar_gain,
      decision_answer = EXCLUDED.decision_answer,
      duration_ms     = EXCLUDED.duration_ms,
      ended_at        = EXCLUDED.ended_at,
      flags           = EXCLUDED.flags
  `;
}

export async function getLessonSessionMeta(
  clerkUserId: string
): Promise<Map<string, LessonSessionMeta>> {
  const map = new Map<string, LessonSessionMeta>();
  let rows: Record<string, unknown>[] = [];
  try {
    rows = await sql`
      SELECT session_id, lesson_id, level, pillar, pillar_gain, decision_answer,
             duration_ms, started_at, ended_at, flags
      FROM lesson_sessions
      WHERE clerk_user_id = ${clerkUserId}
    `;
  } catch {
    return map;
  }
  for (const r of rows) {
    let flags: RedirectFlag[] = [];
    const raw = r.flags;
    if (Array.isArray(raw)) flags = raw as RedirectFlag[];
    else if (typeof raw === "string") { try { flags = JSON.parse(raw); } catch { flags = []; } }
    map.set(String(r.session_id), {
      sessionId: String(r.session_id),
      lessonId: String(r.lesson_id),
      level: r.level != null ? Number(r.level) : null,
      pillar: r.pillar != null ? String(r.pillar) : null,
      pillarGain: Number(r.pillar_gain ?? 0),
      decisionAnswer: r.decision_answer != null ? String(r.decision_answer) : null,
      durationMs: Number(r.duration_ms ?? 0),
      startedAt: Number(r.started_at ?? 0),
      endedAt: r.ended_at != null ? Number(r.ended_at) : null,
      flags,
    });
  }
  return map;
}
