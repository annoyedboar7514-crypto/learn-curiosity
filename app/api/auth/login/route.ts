import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/index";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const parent = db
      .prepare("SELECT id, password_hash FROM parent_accounts WHERE email = ?")
      .get(email.toLowerCase().trim()) as { id: string; password_hash: string } | undefined;

    if (!parent) {
      return NextResponse.json({ error: "No account found with that email." }, { status: 401 });
    }

    // TODO: replace with bcrypt.compare() before launch
    const hash = Buffer.from(password).toString("base64");
    if (hash !== parent.password_hash) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const child = db
      .prepare("SELECT id FROM child_profiles WHERE parent_id = ? ORDER BY created_at ASC LIMIT 1")
      .get(parent.id) as { id: string } | undefined;

    if (!child) {
      return NextResponse.json({ error: "No child profile found. Please contact support." }, { status: 404 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("lc_child_id", child.id, {
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
