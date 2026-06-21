import { sql } from "./index";
import { randomUUID } from "crypto";
import { emptyPillars, type PillarScores, type QuizAnswer } from "@/lib/grading";

export interface QuizResultRow {
  archetype: string;
  gradeBand: string;
  pillars: PillarScores;
  answers: QuizAnswer[];
  durationMs: number;
  completedAt: number;
}

/** Upsert a child's quiz baseline (one per child, keyed by clerk user). */
export async function saveQuizResult(params: {
  clerkUserId: string;
  childProfileId: string | null;
  archetype: string;
  gradeBand: string;
  pillars: PillarScores;
  answers: QuizAnswer[];
  durationMs: number;
}): Promise<void> {
  await sql`
    INSERT INTO quiz_results (
      id, clerk_user_id, child_profile_id, archetype, grade_band,
      pillar_ct, pillar_res, pillar_cre, pillar_com, pillar_learn,
      answers, duration_ms
    ) VALUES (
      ${randomUUID()}, ${params.clerkUserId}, ${params.childProfileId},
      ${params.archetype}, ${params.gradeBand},
      ${params.pillars.ct}, ${params.pillars.res}, ${params.pillars.cre},
      ${params.pillars.com}, ${params.pillars.learn},
      ${JSON.stringify(params.answers)}, ${params.durationMs}
    )
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      child_profile_id = EXCLUDED.child_profile_id,
      archetype    = EXCLUDED.archetype,
      grade_band   = EXCLUDED.grade_band,
      pillar_ct    = EXCLUDED.pillar_ct,
      pillar_res   = EXCLUDED.pillar_res,
      pillar_cre   = EXCLUDED.pillar_cre,
      pillar_com   = EXCLUDED.pillar_com,
      pillar_learn = EXCLUDED.pillar_learn,
      answers      = EXCLUDED.answers,
      duration_ms  = EXCLUDED.duration_ms,
      completed_at = extract(epoch from now())::BIGINT
  `;
}

export async function getQuizResult(
  clerkUserId: string
): Promise<QuizResultRow | null> {
  let row: Record<string, unknown> | undefined;
  try {
    [row] = await sql`
      SELECT archetype, grade_band, pillar_ct, pillar_res, pillar_cre,
             pillar_com, pillar_learn, answers, duration_ms, completed_at
      FROM quiz_results
      WHERE clerk_user_id = ${clerkUserId}
      LIMIT 1
    `;
  } catch {
    return null;
  }
  if (!row) return null;

  const pillars = emptyPillars();
  pillars.ct = Number(row.pillar_ct ?? 0);
  pillars.res = Number(row.pillar_res ?? 0);
  pillars.cre = Number(row.pillar_cre ?? 0);
  pillars.com = Number(row.pillar_com ?? 0);
  pillars.learn = Number(row.pillar_learn ?? 0);

  let answers: QuizAnswer[] = [];
  const raw = row.answers;
  if (Array.isArray(raw)) answers = raw as QuizAnswer[];
  else if (typeof raw === "string") { try { answers = JSON.parse(raw); } catch { answers = []; } }

  return {
    archetype: String(row.archetype),
    gradeBand: String(row.grade_band),
    pillars,
    answers,
    durationMs: Number(row.duration_ms ?? 0),
    completedAt: Number(row.completed_at ?? 0),
  };
}
