import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function logMessage(params: {
  sessionId: string;
  childProfileId: string | null;
  lessonId: string;
  role: "user" | "assistant";
  content: string;
}) {
  await sql`
    INSERT INTO messages (session_id, child_profile_id, lesson_id, role, content)
    VALUES (
      ${params.sessionId},
      ${params.childProfileId},
      ${params.lessonId},
      ${params.role},
      ${params.content}
    )
  `;
}
