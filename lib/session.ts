import { cookies } from "next/headers";
import { sql } from "./db/index";

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

  const [row] = await sql`
    SELECT id, nickname, grade_band, archetype, mentor_id
    FROM child_profiles
    WHERE id = ${id}
  `;

  if (!row) return null;

  return {
    id:        String(row.id),
    nickname:  String(row.nickname),
    gradeBand: String(row.grade_band),
    archetype: row.archetype ? String(row.archetype) : null,
    mentorId:  row.mentor_id ? String(row.mentor_id) : null,
  };
}
