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

  // Clerk linkage columns (the live app keys child/consent rows by clerk_user_id)
  await sql`ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS clerk_user_id TEXT`.catch(() => {});
  await sql`ALTER TABLE coppa_consent  ADD COLUMN IF NOT EXISTS clerk_user_id TEXT`.catch(() => {});
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS child_profiles_clerk_user_unique ON child_profiles(clerk_user_id)`.catch(() => {});

  // ---- Quiz baseline results (the graded report shown to parents) ----
  await sql`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id               TEXT PRIMARY KEY,
      clerk_user_id    TEXT,
      child_profile_id TEXT,
      archetype        TEXT NOT NULL,
      grade_band       TEXT NOT NULL,
      pillar_ct        INTEGER NOT NULL DEFAULT 0,
      pillar_res       INTEGER NOT NULL DEFAULT 0,
      pillar_cre       INTEGER NOT NULL DEFAULT 0,
      pillar_com       INTEGER NOT NULL DEFAULT 0,
      pillar_learn     INTEGER NOT NULL DEFAULT 0,
      answers          JSONB,
      duration_ms      BIGINT NOT NULL DEFAULT 0,
      completed_at     BIGINT NOT NULL DEFAULT extract(epoch from now())::BIGINT
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS quiz_results_clerk_user_unique ON quiz_results(clerk_user_id)`.catch(() => {});
  await sql`CREATE INDEX IF NOT EXISTS idx_quiz_results_child ON quiz_results(child_profile_id)`.catch(() => {});

  // ---- Lesson session metadata (duration, decision, pillar gain, flags) ----
  // The full chat transcript itself lives in `messages`; this is the per-session
  // metadata layer the parent report enriches transcripts with.
  await sql`
    CREATE TABLE IF NOT EXISTS lesson_sessions (
      session_id       TEXT PRIMARY KEY,
      clerk_user_id    TEXT,
      child_profile_id TEXT,
      lesson_id        TEXT NOT NULL,
      level            INTEGER,
      pillar           TEXT,
      pillar_gain      INTEGER NOT NULL DEFAULT 0,
      decision_answer  TEXT,
      duration_ms      BIGINT NOT NULL DEFAULT 0,
      started_at       BIGINT NOT NULL DEFAULT extract(epoch from now())::BIGINT,
      ended_at         BIGINT,
      flags            JSONB,
      created_at       BIGINT NOT NULL DEFAULT extract(epoch from now())::BIGINT
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_lesson_sessions_child ON lesson_sessions(child_profile_id)`.catch(() => {});
  await sql`CREATE INDEX IF NOT EXISTS idx_lesson_sessions_clerk ON lesson_sessions(clerk_user_id)`.catch(() => {});

  // Drop the NOT NULL on parent_id — Clerk auth replaced the parent_accounts system
  // and current code inserts without parent_id. Safe to run multiple times.
  await sql`ALTER TABLE coppa_consent  ALTER COLUMN parent_id DROP NOT NULL`.catch(() => {});
  await sql`ALTER TABLE child_profiles ALTER COLUMN parent_id DROP NOT NULL`.catch(() => {});
}
