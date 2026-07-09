import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getChildProfileId } from "@/lib/session";
import { saveCrossroadsRun, getCrossroadsRuns, type WhyQuote } from "@/lib/db/crossroads-runs";
import { getCrossroadsStory } from "@/lib/content/crossroads";
import { ensureMigrations } from "@/lib/db/migrate";

ensureMigrations();

// GET /api/crossroads/run?storyId=... — prior runs (for cross-run memory + true-path reveal state)
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const storyId = new URL(req.url).searchParams.get("storyId") ?? "";
  if (!getCrossroadsStory(storyId)) return NextResponse.json({ error: "Unknown story" }, { status: 404 });
  const runs = await getCrossroadsRuns(userId, storyId);
  return NextResponse.json({ runs });
}

// POST /api/crossroads/run — save a completed run
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body: {
    storyId?: string;
    runNumber?: number;
    path?: string[];
    whys?: WhyQuote[];
    endingId?: string;
    rewindCount?: number;
    durationMs?: number;
    startedAt?: number;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.storyId || !getCrossroadsStory(body.storyId)) {
    return NextResponse.json({ error: "Unknown story" }, { status: 404 });
  }

  const childProfileId = await getChildProfileId();
  try {
    await saveCrossroadsRun({
      clerkUserId: userId,
      childProfileId,
      storyId: body.storyId,
      runNumber: Math.max(1, Number(body.runNumber) || 1),
      path: Array.isArray(body.path) ? body.path.map(String) : [],
      whys: Array.isArray(body.whys) ? body.whys : [],
      endingId: body.endingId ?? null,
      rewindCount: Math.max(0, Number(body.rewindCount) || 0),
      durationMs: Math.max(0, Number(body.durationMs) || 0),
      startedAt: body.startedAt,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[crossroads/run]", err);
    return NextResponse.json({ error: "Failed to save run." }, { status: 500 });
  }
}
