import db from "./index";

interface RawSessionRow {
  session_id: string;
  child_profile_id: string | null;
  lesson_id: string;
  message_count: number;
  started_at: number;
  last_message_at: number;
  has_escalation: number;
}

interface RawMessageRow {
  role: string;
  content: string;
  created_at: number;
}

export interface SessionRow {
  sessionId: string;
  childProfileId: string | null;
  lessonId: string;
  messageCount: number;
  startedAt: number;    // Unix epoch seconds
  lastMessageAt: number;
  hasEscalation: boolean;
}

export interface MessageRow {
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

// All sessions, most recent first. Optionally filtered by child profile.
export function getSessions(childProfileId?: string | null): SessionRow[] {
  const base = `
    SELECT
      session_id,
      child_profile_id,
      lesson_id,
      COUNT(*)                          AS message_count,
      MIN(created_at)                   AS started_at,
      MAX(created_at)                   AS last_message_at,
      MAX(CASE WHEN role = 'assistant'
               AND content LIKE '[ESCALATE]%'
               THEN 1 ELSE 0 END)      AS has_escalation
    FROM messages
    ${childProfileId ? "WHERE child_profile_id = ?" : ""}
    GROUP BY session_id
    ORDER BY started_at DESC
  `;
  const rows = childProfileId
    ? (db.prepare(base).all(childProfileId) as RawSessionRow[])
    : (db.prepare(base).all() as RawSessionRow[]);

  return rows.map((r) => ({
    sessionId: r.session_id,
    childProfileId: r.child_profile_id ?? null,
    lessonId: r.lesson_id,
    messageCount: r.message_count,
    startedAt: r.started_at,
    lastMessageAt: r.last_message_at,
    hasEscalation: r.has_escalation === 1,
  }));
}

// Messages for a single session, chronological.
export function getSessionMessages(sessionId: string): MessageRow[] {
  const rows = db
    .prepare(
      `SELECT role, content, created_at
       FROM messages
       WHERE session_id = ?
       ORDER BY created_at ASC`
    )
    .all(sessionId) as RawMessageRow[];

  return rows.map((r) => ({
    role: r.role as "user" | "assistant",
    content: r.content,
    createdAt: r.created_at,
  }));
}

// Quick aggregate stats across all (or one child's) sessions.
export function getStats(childProfileId?: string | null) {
  const where = childProfileId ? "WHERE child_profile_id = ?" : "";
  const args = childProfileId ? [childProfileId] : [];

  const totals = db
    .prepare(`SELECT COUNT(DISTINCT session_id) AS sessions, COUNT(*) AS messages FROM messages ${where}`)
    .get(...args) as { sessions: number; messages: number };

  return { sessions: totals.sessions, messages: totals.messages };
}
