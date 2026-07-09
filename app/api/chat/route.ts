import { NextRequest } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { classifyInput, checkMentorOutput } from "@/lib/safety/index";
import { logMessage } from "@/lib/db/index";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

// Plain-text response — both consumers handle it: ChatInterface reads the body
// as a text stream (arrives as one chunk), LessonClient reads the full text.
function textResponse(text: string): Response {
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Free-form mentor chat system prompt (not lesson-locked).
// Keeps the mentor in character, age-appropriate, and safe.
function buildFreeChatPrompt(mentorVoiceNote: string, mentorName: string, gradeBand: string): string {
  const ageContext =
    gradeBand === "K-2"
      ? "The child is in kindergarten through 2nd grade (ages 5–7). Use very simple words and short sentences. Offer two choices when they seem stuck."
      : gradeBand === "3-4"
      ? "The child is in 3rd or 4th grade (ages 8–10). Ask open questions and reflect their answers back to them."
      : "The child is in 5th or 6th grade (ages 10–12). Ask harder questions and invite them to challenge their own thinking.";

  return `${mentorVoiceNote}

You are a wise, curious, and encouraging mentor named ${mentorName} for a child using Learn Curiosity.

${ageContext}

YOUR ROLE
You guide through questions — you never lecture or give direct answers. Help the child think, wonder, and discover. Ask one question at a time. Keep responses short (2–4 sentences maximum when speaking, since your words will be read aloud).

WHAT YOU CAN DISCUSS
- Ideas, stories, curiosity, how things work, feelings, imagination, ethics, science, art, friendship, fairness, bravery — anything a curious kid might wonder about.
- You can explore any topic a reasonable parent would be comfortable with.

WHAT YOU MUST NOT DO
- Discuss violence, adult content, politics, religion, or distressing real-world events.
- Pretend to be the child's friend outside this app or promise ongoing contact.
- Give homework answers or test answers directly.

IF THE CHILD SEEMS DISTRESSED
Respond warmly: "That sounds like something really important — the best person to talk to about that is a grown-up you trust, like a parent or teacher. Can you think of who that might be?" Start your response with [ESCALATE].

VOICE FORMAT RULES (IMPORTANT)
Your responses will be spoken aloud. Write as you would speak:
- No bullet points, no headers, no markdown.
- Short sentences. Natural pauses implied by punctuation.
- End with a question to keep the conversation going.`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    messages,
    mentorId = "luna",
    gradeBand = "3-4",
    sessionId,
    childProfileId,
  }: {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    mentorId?: string;
    gradeBand?: string;
    sessionId: string;
    childProfileId?: string | null;
  } = body;

  const mentor = getMentorCharacter(mentorId);
  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  // ---- INPUT SAFETY: screen the child's message before the model sees it ----
  if (lastUser) {
    const safety = classifyInput(lastUser.content);
    if (!safety.safe) {
      const reply = safety.redirectResponse ?? "Let's get back to our story.";
      const marker = safety.escalate ? "[ESCALATE] " : "[REDIRECT] ";
      await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: "free-chat", role: "user",      content: lastUser.content });
      await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: "free-chat", role: "assistant", content: marker + reply });
      return textResponse(reply);
    }
    await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: "free-chat", role: "user", content: lastUser.content });
  }

  const systemPrompt = buildFreeChatPrompt(mentor.voiceNote, mentor.name, gradeBand);

  // Generate the full reply first so the OUTPUT guard can screen it before the
  // child sees a single word (defense in depth — replies are 2-4 sentences,
  // so the latency cost is small and the guarantee is worth it).
  const result = await generateText({
    model: anthropic("claude-opus-4-8"),
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    maxOutputTokens: 256,
  });

  const raw = result.text.trim();
  const isEscalation = raw.startsWith("[ESCALATE]");
  const clean = isEscalation ? raw.replace("[ESCALATE]", "").trim() : raw;

  // ---- OUTPUT SAFETY: screen the mentor's reply before it is shown ----
  const guarded = checkMentorOutput(clean);
  const outText = guarded.text;
  const storeText = isEscalation
    ? "[ESCALATE] " + outText
    : guarded.blocked
    ? "[REDIRECT] " + outText
    : outText;

  await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: "free-chat", role: "assistant", content: storeText }).catch(() => {});

  return textResponse(outText);
}
