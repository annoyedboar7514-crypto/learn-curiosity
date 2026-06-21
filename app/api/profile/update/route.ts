import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db/index";

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { field, value } = await req.json() as { field: string; value: string };

  if (!value?.trim()) {
    return NextResponse.json({ error: "Value cannot be empty" }, { status: 400 });
  }

  const VALID_ARCHETYPES = ["explorer","astronaut","detective","inventor-builder","artist","doctor-healer"];
  const VALID_MENTORS    = ["luna","rex","sage"];

  if (field === "archetype" && !VALID_ARCHETYPES.includes(value)) {
    return NextResponse.json({ error: "Invalid archetype" }, { status: 400 });
  }
  if (field === "mentor_id" && !VALID_MENTORS.includes(value)) {
    return NextResponse.json({ error: "Invalid mentor" }, { status: 400 });
  }

  if (field === "archetype") {
    await sql`UPDATE child_profiles SET archetype = ${value} WHERE clerk_user_id = ${userId}`;
  } else if (field === "mentor_id") {
    await sql`UPDATE child_profiles SET mentor_id = ${value} WHERE clerk_user_id = ${userId}`;
  } else {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
