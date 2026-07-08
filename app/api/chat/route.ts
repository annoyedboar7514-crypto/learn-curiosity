import { NextRequest } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { classifyInput } from "@/lib/safety/index";
import { logMessage } from "@/lib/db/index";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

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

  // Safety check
  if (lastUser) {
    const safety = classifyInput(lastUser.content);
    if (!safety.safe) {
      const escalation = `[ESCALATE] ${safety.redirectResponse}`;
      await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: "free-chat", role: "user",      content: lastUser.content });
      await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: "free-chat", role: "assistant", content: escalation });
      // Return as a stream so the client handles it the same way
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(c) {
          const msg = (safety.redirectResponse ?? "Let's get back to our story.").replace(/"/g, '\\"');
          c.enqueue(encoder.encode(`0:"${msg}"\n`));
          c.close();
        },
      });
      return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Vercel-AI-Data-Stream": "v1" } });
    }
    await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: "free-chat", role: "user", content: lastUser.content });
  }

  const systemPrompt = buildFreeChatPrompt(mentor.voiceNote, mentor.name, gradeBand);

  const result = streamText({
    model: anthropic("claude-fable-5"),
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    maxOutputTokens: 256,
    onFinish: async ({ text }) => {
      await logMessage({ sessionId, childProfileId: childProfileId ?? null, lessonId: "free-chat", role: "assistant", content: text });
    },
  });

  return result.toTextStreamResponse();
}
