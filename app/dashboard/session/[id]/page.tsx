import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSessionMessages } from "@/lib/db/sessions";
import { getLessonById } from "@/lib/content/lesson-registry";

const PILLAR_LABELS: Record<string, string> = {
  "critical-thinking": "Critical Thinking",
  "resilience-character": "Resilience & Character",
  "creativity-vision": "Creativity & Vision",
  "communication-articulation": "Communication & Articulation",
  "learning-how-to-learn": "Learning How to Learn",
};

function formatDateTime(epoch: number) {
  return new Date(epoch * 1000).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messages = getSessionMessages(id);

  if (messages.length === 0) notFound();

  const lesson = getLessonById(messages[0] ? (() => {
    // We need lesson_id — fetch it directly
    return "";
  })() : "");

  // Re-fetch with lesson_id by importing db directly for the session metadata
  const { default: db } = await import("@/lib/db/index");
  const meta = db
    .prepare("SELECT lesson_id, MIN(created_at) AS started_at FROM messages WHERE session_id = ?")
    .get(id) as { lesson_id: string; started_at: number } | undefined;

  if (!meta) notFound();

  const resolvedLesson = getLessonById(meta.lesson_id);
  const hasEscalation = messages.some(
    (m) => m.role === "assistant" && m.content.startsWith("[ESCALATE]")
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-cream border-b border-parchment sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-body text-navy/60 hover:text-navy transition-colors shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </Link>
          <div className="w-px h-5 bg-parchment" />
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-6 h-5">
              <Image src="/brand/Logo.png" alt="" fill sizes="24px" className="object-contain" />
            </div>
            <span className="font-serif font-semibold text-navy text-base">LearnCuriosity</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Session metadata */}
        <p className="text-xs font-mono-brand uppercase tracking-widest text-brass mb-2">
          {formatDateTime(meta.started_at)}
        </p>
        <h1 className="font-serif text-3xl text-navy mb-3">
          {resolvedLesson?.title ?? meta.lesson_id}
        </h1>

        <div className="flex items-center gap-3 flex-wrap mb-8">
          {resolvedLesson && (
            <>
              <span className="text-xs font-semibold bg-teal/10 text-teal px-3 py-1 rounded-full">
                {PILLAR_LABELS[resolvedLesson.pillar] ?? resolvedLesson.pillar}
              </span>
              <span className="text-xs font-body text-navy/50 capitalize">
                {resolvedLesson.archetype.replace("-", " / ")} · {resolvedLesson.gradeBand}
              </span>
              <span className="text-xs font-body text-navy/50">
                {messages.length} messages
              </span>
            </>
          )}
          {hasEscalation && (
            <span className="text-xs bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-full">
              ⚠ Flagged — a message was redirected
            </span>
          )}
        </div>

        {/* Parent summary */}
        {resolvedLesson && (
          <div className="bg-parchment rounded-2xl p-5 mb-8">
            <p className="text-xs font-mono-brand uppercase tracking-widest text-brass mb-2">
              What this session was building
            </p>
            <p className="font-body text-sm text-navy/80 leading-relaxed">
              {resolvedLesson.parentSummary}
            </p>
          </div>
        )}

        {/* Opening question context */}
        {resolvedLesson && resolvedLesson.reflectionQuestions[0] && (
          <div className="mb-6">
            <p className="text-xs font-mono-brand uppercase tracking-widest text-navy/40 mb-3">
              Transcript
            </p>
            {/* The first reflection question is shown in-app but not logged via the API */}
            <div className="flex gap-3 mb-4 opacity-60">
              <div className="w-7 h-7 rounded-full bg-teal/20 flex items-center justify-center text-xs font-bold text-teal shrink-0 mt-0.5">
                M
              </div>
              <div className="bg-white border border-parchment rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-navy/70 leading-relaxed max-w-md italic">
                {resolvedLesson.reflectionQuestions[0].question}
              </div>
            </div>
          </div>
        )}

        {/* Conversation messages */}
        <div className="flex flex-col gap-4">
          {messages.map((m, i) => {
            const isEscalation = m.role === "assistant" && m.content.startsWith("[ESCALATE]");
            const displayContent = isEscalation
              ? m.content.replace(/^\[ESCALATE\]\s*/, "")
              : m.content;

            return (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center text-xs font-bold text-cream shrink-0 mt-0.5">
                    M
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-md">
                  {isEscalation && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Mentor redirected this topic
                    </p>
                  )}
                  <div
                    className={[
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "assistant"
                        ? "bg-white border border-parchment text-navy rounded-tl-sm"
                        : "bg-navy text-cream rounded-tr-sm",
                      isEscalation ? "border-red-200" : "",
                    ].join(" ")}
                  >
                    {displayContent}
                  </div>
                  <p className={`text-xs text-navy/30 font-body ${m.role === "user" ? "text-right" : ""}`}>
                    {new Date(m.createdAt * 1000).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-10 pt-6 border-t border-parchment">
          <p className="text-xs font-body text-navy/40 text-center">
            This is the complete conversation — every message, nothing omitted.
          </p>
        </div>

      </main>
    </div>
  );
}
