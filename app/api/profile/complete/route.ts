import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db/index";
import { randomUUID } from "crypto";
import { ensureMigrations } from "@/lib/db/migrate";

// Fire migrations on first request to this route (idempotent — safe to repeat).
ensureMigrations();

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { nickname, gradeBand, consent } = await req.json();

  if (!nickname?.trim() || nickname.trim().length < 2) {
    return NextResponse.json({ error: "Nickname must be at least 2 characters" }, { status: 400 });
  }
  if (!["K-2", "3-4", "5-6"].includes(gradeBand)) {
    return NextResponse.json({ error: "Invalid grade band" }, { status: 400 });
  }
  if (!consent?.terms || !consent?.coppa || !consent?.age) {
    return NextResponse.json({ error: "All consent fields are required" }, { status: 400 });
  }

  try {
    await sql.transaction([
      sql`
        INSERT INTO coppa_consent (id, clerk_user_id, agreed_to_terms, agreed_to_coppa, agreed_to_age)
        VALUES (${randomUUID()}, ${userId}, 1, 1, 1)
        ON CONFLICT DO NOTHING
      `,
      sql`
        INSERT INTO child_profiles (id, clerk_user_id, nickname, grade_band)
        VALUES (${randomUUID()}, ${userId}, ${nickname.trim()}, ${gradeBand})
        ON CONFLICT (clerk_user_id) DO UPDATE
          SET nickname = EXCLUDED.nickname, grade_band = EXCLUDED.grade_band
      `,
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[profile/complete]", err);
    return NextResponse.json({ error: "Failed to save profile. Please try again." }, { status: 500 });
  }
}
