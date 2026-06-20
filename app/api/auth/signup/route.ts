import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db/index";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { parent, consent, child } = await req.json();

    if (!parent?.email || !parent?.password || !child?.nickname || !child?.gradeBand) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!consent?.agreedToTerms || !consent?.agreedToCoppa || !consent?.agreedToAge) {
      return NextResponse.json({ error: "All consent fields are required" }, { status: 400 });
    }

    const email = parent.email.toLowerCase().trim();

    // Check for duplicate email before inserting to give a clean error
    const [existing] = await sql`SELECT id FROM parent_accounts WHERE email = ${email}`;
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const parentId  = randomUUID();
    const childId   = randomUUID();
    const consentId = randomUUID();
    const passwordHash = await bcrypt.hash(parent.password, 10);

    // Run all three inserts atomically
    await sql.transaction([
      sql`INSERT INTO parent_accounts (id, email, password_hash) VALUES (${parentId}, ${email}, ${passwordHash})`,
      sql`INSERT INTO coppa_consent (id, parent_id, agreed_to_terms, agreed_to_coppa, agreed_to_age) VALUES (${consentId}, ${parentId}, 1, 1, 1)`,
      sql`INSERT INTO child_profiles (id, parent_id, nickname, grade_band) VALUES (${childId}, ${parentId}, ${child.nickname.trim()}, ${child.gradeBand})`,
    ]);

    const res = NextResponse.json({ success: true, childProfileId: childId });
    res.cookies.set("lc_child_id", childId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
  }
}
