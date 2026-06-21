import { auth } from "@clerk/nextjs/server";
import { sql } from "./db/index";

export interface ChildProfile {
  id: string;
  nickname: string;
  gradeBand: string;
  archetype: string | null;
  mentorId: string | null;
}

export async function getChildProfileId(): Promise<string | null> {
  const profile = await getChildProfile();
  return profile?.id ?? null;
}

export async function getChildProfile(): Promise<ChildProfile | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const [row] = await sql`
    SELECT id, nickname, grade_band, archetype, mentor_id
    FROM child_profiles
    WHERE clerk_user_id = ${userId}
    ORDER BY created_at ASC LIMIT 1
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
