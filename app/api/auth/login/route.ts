import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db/index";
import bcrypt from "bcryptjs";

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // bcrypt hashes start with $2 — legacy base64 hashes do not
  if (hash.startsWith("$2")) return bcrypt.compare(password, hash);
  return Buffer.from(password).toString("base64") === hash;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const [parent] = await sql`
      SELECT id, password_hash FROM parent_accounts WHERE email = ${email.toLowerCase().trim()}
    `;

    if (!parent) {
      return NextResponse.json({ error: "No account found with that email." }, { status: 401 });
    }

    const valid = await verifyPassword(password, String(parent.password_hash));
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    // Silently upgrade legacy base64 hash to bcrypt on first login
    if (!String(parent.password_hash).startsWith("$2")) {
      const newHash = await bcrypt.hash(password, 10);
      await sql`UPDATE parent_accounts SET password_hash = ${newHash} WHERE id = ${String(parent.id)}`;
    }

    const [child] = await sql`
      SELECT id FROM child_profiles WHERE parent_id = ${String(parent.id)} ORDER BY created_at ASC LIMIT 1
    `;

    if (!child) {
      return NextResponse.json({ error: "No child profile found." }, { status: 404 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("lc_child_id", String(child.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
