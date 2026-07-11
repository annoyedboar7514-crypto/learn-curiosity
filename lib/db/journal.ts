import { sql } from "./index";

export interface ReasoningQuote {
  lessonId: string;
  quote: string;       // the child's own best line of reasoning
  createdAt: number;   // epoch seconds
}

/**
 * The Curiosity Journal's raw material: for each lesson the child has talked
 * through, their single strongest line of reasoning (longest substantive
 * child message in that lesson's mentor conversation).
 */
export async function getBestReasoning(childProfileId: string): Promise<ReasoningQuote[]> {
  let rows: Record<string, unknown>[] = [];
  try {
    rows = await sql`
      SELECT DISTINCT ON (lesson_id) lesson_id, content, created_at
      FROM messages
      WHERE child_profile_id = ${childProfileId}
        AND role = 'user'
        AND lesson_id NOT LIKE 'crossroads:%'
        AND LENGTH(content) >= 12
      ORDER BY lesson_id, LENGTH(content) DESC, created_at DESC
    `;
  } catch {
    return [];
  }
  return rows
    .map((r) => ({
      lessonId: String(r.lesson_id),
      quote: String(r.content),
      createdAt: Number(r.created_at ?? 0),
    }))
    .sort((a, b) => a.createdAt - b.createdAt);
}
