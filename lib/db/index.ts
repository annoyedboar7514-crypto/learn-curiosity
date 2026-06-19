import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Singleton — avoids re-opening the file on every hot-reload in dev
const g = global as typeof globalThis & { __learnDb?: Database.Database };

if (!g.__learnDb) {
  g.__learnDb = new Database(path.join(DATA_DIR, "messages.db"));
  g.__learnDb.exec(`
    CREATE TABLE IF NOT EXISTS parent_accounts (
      id            TEXT PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS coppa_consent (
      id              TEXT PRIMARY KEY,
      parent_id       TEXT NOT NULL,
      agreed_to_terms INTEGER NOT NULL,
      agreed_to_coppa INTEGER NOT NULL,
      agreed_to_age   INTEGER NOT NULL,
      consented_at    INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (parent_id) REFERENCES parent_accounts(id)
    );

    CREATE TABLE IF NOT EXISTS child_profiles (
      id         TEXT PRIMARY KEY,
      parent_id  TEXT NOT NULL,
      nickname   TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      archetype  TEXT,
      mentor_id  TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (parent_id) REFERENCES parent_accounts(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id       TEXT    NOT NULL,
      child_profile_id TEXT,
      lesson_id        TEXT    NOT NULL,
      role             TEXT    NOT NULL CHECK(role IN ('user', 'assistant')),
      content          TEXT    NOT NULL,
      created_at       INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_messages_child   ON messages(child_profile_id);
  `);
}

const db = g.__learnDb;
export default db;

export function logMessage(params: {
  sessionId: string;
  childProfileId: string | null;
  lessonId: string;
  role: "user" | "assistant";
  content: string;
}) {
  db.prepare(
    `INSERT INTO messages (session_id, child_profile_id, lesson_id, role, content)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    params.sessionId,
    params.childProfileId ?? null,
    params.lessonId,
    params.role,
    params.content
  );
}
