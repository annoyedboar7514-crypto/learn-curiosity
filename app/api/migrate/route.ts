import { NextRequest, NextResponse } from "next/server";
import { runMigrations } from "@/lib/db/migrate";

// Hit GET /api/migrate?secret=<MIGRATE_SECRET> once after deploying.
// Safe to call multiple times — all statements use IF NOT EXISTS.
export async function GET(req: NextRequest) {
  // Support both spellings — Vercel env was originally set with a typo
  const expected = process.env.MIGRATE_SECRET ?? process.env.migrate_seceret;
  const provided  = new URL(req.url).searchParams.get("secret");

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await runMigrations();
    return NextResponse.json({ success: true, message: "Migrations complete." });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[migrate]", message);
    return NextResponse.json({ error: "Migration failed." }, { status: 500 });
  }
}
