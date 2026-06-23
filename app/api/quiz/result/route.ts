import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getChildProfileId } from "@/lib/session";
import { saveQuizResult } from "@/lib/db/quiz-results";
import { gradeQuiz, type QuizAnswer } from "@/lib/grading";
import { ensureMigrations } from "@/lib/db/migrate";

ensureMigrations();

// POST /api/quiz/result
// Body: { gradeBand: string, answers: QuizAnswer[], durationMs?: number }
// Re-grades the answers server-side (authoritative), then stores the baseline.
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: { gradeBand?: string; answers?: QuizAnswer[]; durationMs?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const answers = Array.isArray(body.answers) ? body.answers : [];
  if (answers.length === 0) {
    return NextResponse.json({ error: "No answers provided" }, { status: 400 });
  }

  // Authoritative grading happens on the server — never trust client scores.
  const { archetype, pillars } = gradeQuiz(answers);
  const gradeBand = body.gradeBand ?? "3-4";
  const childProfileId = await getChildProfileId();

  try {
    await saveQuizResult({
      clerkUserId: userId,
      childProfileId,
      archetype,
      gradeBand,
      pillars,
      answers,
      durationMs: Math.max(0, Number(body.durationMs) || 0),
    });
    return NextResponse.json({ success: true, archetype, pillars });
  } catch (err) {
    console.error("[quiz/result]", err);
    return NextResponse.json({ error: "Failed to save quiz result." }, { status: 500 });
  }
}
