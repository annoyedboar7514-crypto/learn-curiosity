import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db/index";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { parent, consent, child } = await req.json();

    if (!parent?.email || !parent?.password || !child?.nickname || !child?.gradeBand) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!consent?.agreedToTerms || !consent?.agreedToCoppa || !consent?.agreedToAge) {
      return NextResponse.json({ error: "All consent fields are required" }, { status: 400 });
    }

    const parentId  = randomUUID();
    const childId   = randomUUID();
    const consentId = randomUUID();

    // TODO: replace with bcrypt before launch
    const passwordHash = Buffer.from(parent.password).toString("base64");

    await sql`
      INSERT INTO parent_accounts (id, email, password_hash)
      VALUES (${parentId}, ${parent.email.toLowerCase().trim()}, ${passwordHash})
    `;
    await sql`
      INSERT INTO coppa_consent (id, parent_id, agreed_to_terms, agreed_to_coppa, agreed_to_age)
      VALUES (${consentId}, ${parentId}, 1, 1, 1)
    `;
    await sql`
      INSERT INTO child_profiles (id, parent_id, nickname, grade_band)
      VALUES (${childId}, ${parentId}, ${child.nickname.trim()}, ${child.gradeBand})
    `;

    const res = NextResponse.json({ success: true, childProfileId: childId });
    res.cookies.set("lc_child_id", childId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("unique") || message.includes("duplicate")) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    console.error("[signup]", message);
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
  }
}
