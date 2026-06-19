import { sql } from "./index";

export async function runMigrations() {
  await sql`
    CREATE TABLE IF NOT EXISTS parent_accounts (
      id            TEXT PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    INTEGER NOT NULL DEFAULT floor(extract(epoch from now()))::INTEGER
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS coppa_consent (
      id              TEXT PRIMARY KEY,
      parent_id       TEXT NOT NULL REFERENCES parent_accounts(id),
      agreed_to_terms INTEGER NOT NULL,
      agreed_to_coppa INTEGER NOT NULL,
      agreed_to_age   INTEGER NOT NULL,
      consented_at    INTEGER NOT NULL DEFAULT floor(extract(epoch from now()))::INTEGER
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS child_profiles (
      id         TEXT PRIMARY KEY,
      parent_id  TEXT NOT NULL REFERENCES parent_accounts(id),
      nickname   TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      archetype  TEXT,
      mentor_id  TEXT,
      created_at INTEGER NOT NULL DEFAULT floor(extract(epoch from now()))::INTEGER
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id               BIGSERIAL PRIMARY KEY,
      session_id       TEXT    NOT NULL,
      child_profile_id TEXT,
      lesson_id        TEXT    NOT NULL,
      role             TEXT    NOT NULL CHECK(role IN ('user', 'assistant')),
      content          TEXT    NOT NULL,
      created_at       INTEGER NOT NULL DEFAULT floor(extract(epoch from now()))::INTEGER
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_messages_child   ON messages(child_profile_id)`;
}
