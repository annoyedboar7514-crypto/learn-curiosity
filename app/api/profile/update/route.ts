import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/index";

const ALLOWED_FIELDS = ["archetype", "mentor_id"] as const;
type AllowedField = (typeof ALLOWED_FIELDS)[number];

export async function PATCH(req: NextRequest) {
  const childId = req.cookies.get("lc_child_id")?.value;
  if (!childId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { field, value } = await req.json() as { field: string; value: string };

  if (!ALLOWED_FIELDS.includes(field as AllowedField)) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }
  if (typeof value !== "string" || !value.trim()) {
    return NextResponse.json({ error: "Invalid value" }, { status: 400 });
  }

  db.prepare(`UPDATE child_profiles SET ${field} = ? WHERE id = ?`).run(value.trim(), childId);

  return NextResponse.json({ success: true });
}
