import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { GradeBand, LessonPillar, QuestionBank } from "@/lib/content/lessonSchema";
import { logMessage } from "@/lib/db/index";
import { getChildProfileId } from "@/lib/session";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PILLAR_CONTEXT: Record<LessonPillar, string> = {
  critical: "critical thinking, questioning assumptions, and examining evidence",
  resilience: "resilience, moral character, and the consequences of choices",
  creativity: "creative thinking, reframing problems, and finding unexpected solutions",
  communication: "clear communication, building arguments, and articulating ideas",
  learning: "how we learn, metacognition, and understanding our own thinking",
};

function buildMentorSystemPrompt(opts: {
  lessonTitle: string
  pillar: LessonPillar
  gradeBand: GradeBand
  childName: string
  mentorName: string
  choiceLabel: string
  questionBank: QuestionBank | undefined
}): string {
  const { lessonTitle, pillar, gradeBand, childName, mentorName, choiceLabel, questionBank } = opts
  const pillarCtx = PILLAR_CONTEXT[pillar] ?? "deep thinking"

  const ageNote =
    gradeBand === "k2"
      ? `${childName} is in kindergarten through second grade (ages 5-7). Use simple words, short sentences, and warm encouragement. If they seem stuck, offer two simple choices to help them get started.`
      : gradeBand === "grade34"
      ? `${childName} is in third or fourth grade (ages 8-10). You can ask slightly more abstract questions and gently push them to explain their reasoning.`
      : `${childName} is in fifth or sixth grade (ages 10-12). You can engage with nuance, ambiguity, and ask them to steelman positions or examine their assumptions.`

  const bankInstructions = questionBank
    ? `Here are additional questions you can draw from (you do not need to ask all of them — pick based on the conversation):
Core questions: ${questionBank.core.map((q, i) => `${i + 1}. ${q}`).join("\n")}
Deeper questions (use only if the child is highly engaged): ${questionBank.deep.map((q, i) => `${i + 1}. ${q}`).join("\n")}
If the child gives very short answers, use this reframe: "${questionBank.disengagement}"`
    : ""

  return `You are ${mentorName}, a Socratic mentor for ${childName} in a lesson called "${lessonTitle}".

YOUR ROLE
You guide through questions — you never give answers. Help ${childName} reason through ideas and articulate their thinking. When they reach a conclusion, ask them to explain it rather than confirming it.

LESSON FOCUS
This lesson is about ${pillarCtx}. ${childName} chose to "${choiceLabel}" when presented with the dilemma.

AGE GUIDANCE
${ageNote}

WHAT YOU MAY DISCUSS
- The story and the choice ${childName} made
- The consequences they just saw
- How this connects to the pillar theme: ${pillarCtx}

RULES
- Never give the "right" answer
- Never lecture or moralize
- Always ask one question at a time
- Be warm, curious, and encouraging
- Keep responses to 2-3 sentences maximum — you are prompting dialogue, not delivering a speech

${bankInstructions}

IF THE CHILD SAYS SOMETHING WORRYING
Respond with care and start your response with [ESCALATE]: "That sounds like something worth talking to a trusted adult about — a parent or teacher. Is there someone like that you can talk to?"`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      sessionId,
      lessonId,
      lessonTitle,
      pillar,
      gradeBand = "grade34",
      childName = "Explorer",
      mentorName = "Luna",
      choiceLabel = "",
      questionBank,
      history = [],
      questionCount = 0,
    }: {
      sessionId?: string
      lessonId?: number | string
      lessonTitle?: string
      pillar?: LessonPillar
      gradeBand?: GradeBand
      childName?: string
      mentorName?: string
      choiceLabel?: string
      questionBank?: QuestionBank
      history: Array<{ role: "user" | "assistant"; content: string }>
      questionCount?: number
    } = body

    const systemPrompt = buildMentorSystemPrompt({
      lessonTitle: lessonTitle ?? "this lesson",
      pillar: (pillar as LessonPillar) ?? "critical",
      gradeBand: gradeBand as GradeBand,
      childName,
      mentorName,
      choiceLabel,
      questionBank,
    })

    // If the child is disengaging (very short answers 2+ times), nudge
    const lastFew = history.slice(-4).filter(m => m.role === "user")
    const disengaged = lastFew.length >= 2 && lastFew.every(m => m.content.trim().length < 10)
    if (disengaged && questionBank?.disengagement) {
      return NextResponse.json({ response: questionBank.disengagement })
    }

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: systemPrompt,
      messages: history,
    })

    const text =
      response.content[0]?.type === "text"
        ? response.content[0].text.trim()
        : questionBank?.disengagement ?? "Tell me more about that."

    const isEscalation = text.startsWith("[ESCALATE]")
    const cleanText = isEscalation ? text.replace("[ESCALATE]", "").trim() : text

    if (isEscalation) {
      console.warn(`[MENTOR-ESCALATE] lessonId=${lessonId} childName=${childName}`)
    }

    // Log messages to DB so parent dashboard can show transcripts.
    // Fire-and-forget — never block the response on logging.
    if (sessionId && lessonId != null) {
      const sid = String(sessionId)
      const lid = String(lessonId)
      getChildProfileId().then(childProfileId => {
        const lastMsg = history[history.length - 1]
        if (lastMsg?.role === "user") {
          logMessage({ sessionId: sid, childProfileId, lessonId: lid, role: "user", content: lastMsg.content }).catch(() => {})
        }
        // Store raw text so parent report can detect [ESCALATE] prefix
        logMessage({ sessionId: sid, childProfileId, lessonId: lid, role: "assistant", content: text }).catch(() => {})
      }).catch(() => {})
    }

    return NextResponse.json({
      response: cleanText,
      questionCount: questionCount + 1,
      escalation: isEscalation,
    })
  } catch (err) {
    console.error("[api/mentor]", err)
    return NextResponse.json(
      { response: "Tell me more about what you were thinking." },
      { status: 200 }
    )
  }
}
