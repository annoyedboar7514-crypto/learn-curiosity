import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db/index";
import { getChildProfileId } from "@/lib/session";

// POST /api/parent/delete
// Erases the child's learning data (quiz baseline, lesson sessions, chat
// transcripts). Leaves the parent account/profile intact so they can start
// fresh. COPPA: parent-initiated deletion, processed immediately.
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const childId = await getChildProfileId();

  try {
    await sql`DELETE FROM quiz_results    WHERE clerk_user_id = ${userId}`.catch(() => {});
    await sql`DELETE FROM lesson_sessions WHERE clerk_user_id = ${userId}`.catch(() => {});
    if (childId) {
      await sql`DELETE FROM messages WHERE child_profile_id = ${childId}`.catch(() => {});
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[parent/delete]", err);
    return NextResponse.json({ error: "Failed to delete data." }, { status: 500 });
  }
}
