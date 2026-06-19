import { sql } from "./index";

export interface SessionRow {
  sessionId: string;
  childProfileId: string | null;
  lessonId: string;
  messageCount: number;
  startedAt: number;
  lastMessageAt: number;
  hasEscalation: boolean;
}

export interface MessageRow {
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export async function getSessions(childProfileId?: string | null): Promise<SessionRow[]> {
  const rows = childProfileId
    ? await sql`
        SELECT
          session_id,
          MIN(child_profile_id)  AS child_profile_id,
          MIN(lesson_id)         AS lesson_id,
          COUNT(*)               AS message_count,
          MIN(created_at)        AS started_at,
          MAX(created_at)        AS last_message_at,
          MAX(CASE WHEN role = 'assistant' AND content LIKE '[ESCALATE]%' THEN 1 ELSE 0 END) AS has_escalation
        FROM messages
        WHERE child_profile_id = ${childProfileId}
        GROUP BY session_id
        ORDER BY started_at DESC
      `
    : await sql`
        SELECT
          session_id,
          MIN(child_profile_id)  AS child_profile_id,
          MIN(lesson_id)         AS lesson_id,
          COUNT(*)               AS message_count,
          MIN(created_at)        AS started_at,
          MAX(created_at)        AS last_message_at,
          MAX(CASE WHEN role = 'assistant' AND content LIKE '[ESCALATE]%' THEN 1 ELSE 0 END) AS has_escalation
        FROM messages
        GROUP BY session_id
        ORDER BY started_at DESC
      `;

  return rows.map((r) => ({
    sessionId:      String(r.session_id),
    childProfileId: r.child_profile_id ? String(r.child_profile_id) : null,
    lessonId:       String(r.lesson_id),
    messageCount:   Number(r.message_count),
    startedAt:      Number(r.started_at),
    lastMessageAt:  Number(r.last_message_at),
    hasEscalation:  Number(r.has_escalation) === 1,
  }));
}

export async function getSessionMessages(sessionId: string): Promise<MessageRow[]> {
  const rows = await sql`
    SELECT role, content, created_at
    FROM messages
    WHERE session_id = ${sessionId}
    ORDER BY created_at ASC
  `;

  return rows.map((r) => ({
    role:      r.role as "user" | "assistant",
    content:   String(r.content),
    createdAt: Number(r.created_at),
  }));
}

export async function getStats(childProfileId?: string | null): Promise<{ sessions: number; messages: number }> {
  const [row] = childProfileId
    ? await sql`
        SELECT COUNT(DISTINCT session_id) AS sessions, COUNT(*) AS messages
        FROM messages
        WHERE child_profile_id = ${childProfileId}
      `
    : await sql`
        SELECT COUNT(DISTINCT session_id) AS sessions, COUNT(*) AS messages
        FROM messages
      `;

  return {
    sessions: Number(row?.sessions ?? 0),
    messages: Number(row?.messages ?? 0),
  };
}
