import { sql } from "./index";

export async function runMigrations() {
  // Clerk manages parent accounts — we only store child profiles and consent
  await sql`
    CREATE TABLE IF NOT EXISTS child_profiles (
      id              TEXT PRIMARY KEY,
      clerk_user_id   TEXT NOT NULL,
      nickname        TEXT NOT NULL,
      grade_band      TEXT NOT NULL,
      archetype       TEXT CHECK(archetype IN ('explorer','astronaut','detective','inventor-builder','artist','doctor-healer')),
      mentor_id       TEXT,
      created_at      BIGINT NOT NULL DEFAULT extract(epoch from now())::BIGINT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS coppa_consent (
      id              TEXT PRIMARY KEY,
      clerk_user_id   TEXT NOT NULL,
      agreed_to_terms INTEGER NOT NULL,
      agreed_to_coppa INTEGER NOT NULL,
      agreed_to_age   INTEGER NOT NULL,
      consented_at    BIGINT NOT NULL DEFAULT extract(epoch from now())::BIGINT
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
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS child_profiles_clerk_user_id_unique ON child_profiles(clerk_user_id)`;

  // Idempotent upgrades for existing installs
  await sql`ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS clerk_user_id TEXT`.catch(() => {});
  await sql`ALTER TABLE coppa_consent  ADD COLUMN IF NOT EXISTS clerk_user_id TEXT`.catch(() => {});
  await sql`ALTER TABLE child_profiles ALTER COLUMN created_at TYPE BIGINT USING created_at::BIGINT`.catch(() => {});
  await sql`ALTER TABLE coppa_consent  ALTER COLUMN consented_at TYPE BIGINT USING consented_at::BIGINT`.catch(() => {});
  await sql`ALTER TABLE messages       ALTER COLUMN created_at TYPE BIGINT USING created_at::BIGINT`.catch(() => {});
}
