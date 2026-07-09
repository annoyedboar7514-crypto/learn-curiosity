import { sql } from "./index";
import { randomUUID } from "crypto";

export interface WhyQuote {
  nodeId: string;      // decision node
  choiceId: string;
  choiceLabel: string;
  why: string;         // the child's stated reason (the pedagogy)
}

export interface CrossroadsRun {
  id: string;
  storyId: string;
  runNumber: number;
  path: string[];          // node ids visited, in order
  whys: WhyQuote[];
  endingId: string | null;
  rewindCount: number;
  durationMs: number;
  startedAt: number;       // epoch seconds
}

export async function saveCrossroadsRun(params: {
  clerkUserId: string;
  childProfileId: string | null;
  storyId: string;
  runNumber: number;
  path: string[];
  whys: WhyQuote[];
  endingId: string | null;
  rewindCount: number;
  durationMs: number;
  startedAt?: number;
}): Promise<void> {
  await sql`
    INSERT INTO crossroads_runs (
      id, clerk_user_id, child_profile_id, story_id, run_number,
      path, whys, ending_id, rewind_count, duration_ms, started_at, ended_at
    ) VALUES (
      ${randomUUID()}, ${params.clerkUserId}, ${params.childProfileId},
      ${params.storyId}, ${params.runNumber},
      ${JSON.stringify(params.path)}, ${JSON.stringify(params.whys)},
      ${params.endingId}, ${params.rewindCount}, ${params.durationMs},
      ${params.startedAt ?? Math.floor(Date.now() / 1000)},
      ${Math.floor(Date.now() / 1000)}
    )
  `;
}

export async function getCrossroadsRuns(
  clerkUserId: string,
  storyId: string
): Promise<CrossroadsRun[]> {
  let rows: Record<string, unknown>[] = [];
  try {
    rows = await sql`
      SELECT id, story_id, run_number, path, whys, ending_id, rewind_count, duration_ms, started_at
      FROM crossroads_runs
      WHERE clerk_user_id = ${clerkUserId} AND story_id = ${storyId}
      ORDER BY started_at ASC
    `;
  } catch {
    return [];
  }
  return rows.map((r) => ({
    id: String(r.id),
    storyId: String(r.story_id),
    runNumber: Number(r.run_number ?? 1),
    path: parseJson<string[]>(r.path, []),
    whys: parseJson<WhyQuote[]>(r.whys, []),
    endingId: r.ending_id != null ? String(r.ending_id) : null,
    rewindCount: Number(r.rewind_count ?? 0),
    durationMs: Number(r.duration_ms ?? 0),
    startedAt: Number(r.started_at ?? 0),
  }));
}

function parseJson<T>(v: unknown, fallback: T): T {
  if (Array.isArray(v) || (v && typeof v === "object")) return v as T;
  if (typeof v === "string") { try { return JSON.parse(v) as T; } catch { return fallback; } }
  return fallback;
}
