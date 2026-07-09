import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getChildProfileId } from "@/lib/session";
import { recordLessonSession, type RedirectFlag } from "@/lib/db/lesson-sessions";
import { getLessonById } from "@/lib/content/lesson-registry";
import { getLevelById } from "@/lib/content/levels/all100Levels";
import { normalizePillar, lessonPillarGain } from "@/lib/grading";

// POST /api/lessons/complete
// Body: {
//   sessionId, lessonId, level?, pillar?, decisionAnswer?, durationMs?,
//   startedAt?, userTurns?, flags?
// }
// Records the per-session metadata for a finished lesson. The transcript
// itself is already in `messages`. Call this when a lesson's loop completes.
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: {
    sessionId?: string;
    lessonId?: string;
    level?: number;
    pillar?: string;
    decisionAnswer?: string;
    durationMs?: number;
    startedAt?: number;
    userTurns?: number;
    flags?: RedirectFlag[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.sessionId || !body.lessonId) {
    return NextResponse.json({ error: "sessionId and lessonId are required" }, { status: 400 });
  }

  // Resolve the pillar: registry (string ids) → numbered levels → client payload
  const registryLesson = getLessonById(body.lessonId);
  const numericLevel = body.level != null ? getLevelById(Number(body.level)) : undefined;
  const pillar =
    (registryLesson && normalizePillar(registryLesson.pillar)) ??
    (numericLevel && normalizePillar(numericLevel.pillar ?? null)) ??
    normalizePillar(body.pillar ?? null);
  const gain = lessonPillarGain(Number(body.userTurns) || 0);
  const childProfileId = await getChildProfileId();

  try {
    await recordLessonSession({
      sessionId: body.sessionId,
      clerkUserId: userId,
      childProfileId,
      lessonId: body.lessonId,
      level: body.level ?? null,
      pillar,
      pillarGain: gain,
      decisionAnswer: body.decisionAnswer ?? null,
      durationMs: Math.max(0, Number(body.durationMs) || 0),
      startedAt: body.startedAt ?? Math.floor(Date.now() / 1000),
      endedAt: Math.floor(Date.now() / 1000),
      flags: Array.isArray(body.flags) ? body.flags : [],
    });
    return NextResponse.json({ success: true, pillar, pillarGain: gain });
  } catch (err) {
    console.error("[lessons/complete]", err);
    return NextResponse.json({ error: "Failed to record lesson session." }, { status: 500 });
  }
}
