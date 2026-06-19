import { cookies } from "next/headers";
import db from "./db/index";

export interface ChildProfile {
  id: string;
  nickname: string;
  gradeBand: string;
  archetype: string | null;
  mentorId: string | null;
}

export async function getChildProfileId(): Promise<string | null> {
  const store = await cookies();
  return store.get("lc_child_id")?.value ?? null;
}

export async function getChildProfile(): Promise<ChildProfile | null> {
  const id = await getChildProfileId();
  if (!id) return null;

  const row = db
    .prepare("SELECT id, nickname, grade_band, archetype, mentor_id FROM child_profiles WHERE id = ?")
    .get(id) as { id: string; nickname: string; grade_band: string; archetype: string | null; mentor_id: string | null } | undefined;

  if (!row) return null;

  return {
    id: row.id,
    nickname: row.nickname,
    gradeBand: row.grade_band,
    archetype: row.archetype,
    mentorId: row.mentor_id,
  };
}
