import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/mentor/system-prompts";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { getLessonForArchetype } from "@/lib/content/lesson-registry";
import { logMessage } from "@/lib/db/index";
import { classifyInput } from "@/lib/safety/index";
import type { Archetype, GradeBand } from "@/lib/content/lesson.types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    messages,
    archetype,
    gradeBand = "3-4",
    mentorId = "luna",
    sessionId,
    childProfileId,
  }: {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    archetype: string;
    gradeBand?: string;
    mentorId?: string;
    sessionId: string;
    childProfileId?: string | null;
  } = body;

  const { lesson } = getLessonForArchetype(
    archetype as Archetype,
    gradeBand as GradeBand
  );
  const mentor = getMentorCharacter(mentorId);

  // ── Safety check on the child's latest message ────────────────────────────
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (lastUser) {
    const safety = classifyInput(lastUser.content);
    if (!safety.safe) {
      const escalationResponse = `[ESCALATE] ${safety.redirectResponse}`;
      await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: lesson.id, role: "user",      content: lastUser.content });
      await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: lesson.id, role: "assistant", content: escalationResponse });
      return Response.json({ role: "assistant", content: safety.redirectResponse });
    }

    await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: lesson.id, role: "user", content: lastUser.content });
  }

  // ── Claude call ──────────────────────────────────────────────────────────
  const systemPrompt = buildSystemPrompt({
    mentorName: mentor.name,
    childName: "you",
    lesson,
    voiceNote: mentor.voiceNote,
  });

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: lesson.id, role: "assistant", content: text });

  return Response.json({ role: "assistant", content: text });
}
