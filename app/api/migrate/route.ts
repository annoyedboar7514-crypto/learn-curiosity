import { NextResponse } from "next/server";
import { runMigrations } from "@/lib/db/migrate";

// Hit GET /api/migrate once after deploying to create all tables.
// Safe to call multiple times — all statements use IF NOT EXISTS.
export async function GET() {
  try {
    await runMigrations();
    return NextResponse.json({ success: true, message: "Migrations complete." });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[migrate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
