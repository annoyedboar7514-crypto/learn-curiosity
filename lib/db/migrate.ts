import { sql } from "./index";

export async function runMigrations() {
  // Use BIGINT for timestamps to avoid 2038 overflow
  await sql`
    CREATE TABLE IF NOT EXISTS parent_accounts (
      id            TEXT PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    BIGINT NOT NULL DEFAULT extract(epoch from now())::BIGINT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS coppa_consent (
      id              TEXT PRIMARY KEY,
      parent_id       TEXT NOT NULL REFERENCES parent_accounts(id),
      agreed_to_terms INTEGER NOT NULL,
      agreed_to_coppa INTEGER NOT NULL,
      agreed_to_age   INTEGER NOT NULL,
      consented_at    BIGINT NOT NULL DEFAULT extract(epoch from now())::BIGINT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS child_profiles (
      id         TEXT PRIMARY KEY,
      parent_id  TEXT NOT NULL REFERENCES parent_accounts(id),
      nickname   TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      archetype  TEXT CHECK(archetype IN ('explorer','astronaut','detective','inventor-builder','artist','doctor-healer')),
      mentor_id  TEXT,
      created_at BIGINT NOT NULL DEFAULT extract(epoch from now())::BIGINT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id               BIGSERIAL PRIMARY KEY,
      session_id       TEXT   NOT NULL,
      child_profile_id TEXT,
      lesson_id        TEXT   NOT NULL,
      role             TEXT   NOT NULL CHECK(role IN ('user', 'assistant')),
      content          TEXT   NOT NULL,
      created_at       BIGINT NOT NULL DEFAULT extract(epoch from now())::BIGINT
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_messages_child   ON messages(child_profile_id)`;

  // Idempotent schema upgrades for existing installs
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS child_profiles_parent_id_unique ON child_profiles(parent_id)`;
  await sql`ALTER TABLE parent_accounts  ALTER COLUMN created_at TYPE BIGINT USING created_at::BIGINT`.catch(() => {});
  await sql`ALTER TABLE coppa_consent    ALTER COLUMN consented_at TYPE BIGINT USING consented_at::BIGINT`.catch(() => {});
  await sql`ALTER TABLE child_profiles   ALTER COLUMN created_at TYPE BIGINT USING created_at::BIGINT`.catch(() => {});
  await sql`ALTER TABLE messages         ALTER COLUMN created_at TYPE BIGINT USING created_at::BIGINT`.catch(() => {});
}
