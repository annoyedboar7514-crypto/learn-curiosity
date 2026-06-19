import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/index";
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

    // TODO: replace with bcrypt/argon2 before launch
    const passwordHash = Buffer.from(parent.password).toString("base64");

    db.prepare(
      "INSERT INTO parent_accounts (id, email, password_hash) VALUES (?, ?, ?)"
    ).run(parentId, parent.email.toLowerCase().trim(), passwordHash);

    db.prepare(
      "INSERT INTO coppa_consent (id, parent_id, agreed_to_terms, agreed_to_coppa, agreed_to_age) VALUES (?, ?, ?, ?, ?)"
    ).run(consentId, parentId, 1, 1, 1);

    db.prepare(
      "INSERT INTO child_profiles (id, parent_id, nickname, grade_band) VALUES (?, ?, ?, ?)"
    ).run(childId, parentId, child.nickname.trim(), child.gradeBand);

    const res = NextResponse.json({ success: true, childProfileId: childId });
    res.cookies.set("lc_child_id", childId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    console.error("[signup]", message);
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
  }
}
