"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Lesson, ChoiceType } from "@/lib/content/lesson.types";
import type { MentorCharacter } from "@/lib/mentor/mentor-characters";

interface Props {
  lesson: Lesson;
  mentor: MentorCharacter;
  archetype: string;
  gradeBand: string;
  isFallback: boolean;
  childProfileId: string | null;
}

type Phase = "story" | "consequence" | "chat";
type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

const CHOICE_LABELS: Record<ChoiceType, string> = {
  courageous: "Tell the truth, even though it's risky",
  avoidant: "Stay quiet and keep looking first",
  impulsive: "Say something right away without investigating more",
  creative: "Investigate the clue yourself before saying anything",
};

export default function LessonClient({
  lesson,
  mentor,
  archetype,
  gradeBand,
  isFallback,
  childProfileId,
}: Props) {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [phase, setPhase] = useState<Phase>("story");
  const [choiceType, setChoiceType] = useState<ChoiceType | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const consequence = lesson.consequences.find((c) => c.choiceType === choiceType);
  const firstQuestion = lesson.reflectionQuestions[0]?.question ?? "";

  // Scroll to bottom of chat on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  function pickChoice(ct: ChoiceType) {
    setChoiceType(ct);
    setPhase("consequence");
  }

  function startChat() {
    setChatMessages([
      {
        id: "mentor-open",
        role: "assistant",
        content: firstQuestion,
      },
    ]);
    setPhase("chat");
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const next = [...chatMessages, userMsg];
    setChatMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          archetype,
          gradeBand,
          mentorId: mentor.id,
          sessionId,
          childProfileId,
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: data.content },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Let's try that again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] pb-20">
      {/* Floating exit button — fixed to screen, always visible */}
      <Link
        href="/home"
        style={{
          position: "fixed",
          bottom: 24,
          right: 20,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#1e3a52",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          padding: "12px 20px",
          borderRadius: 999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          textDecoration: "none",
        }}
      >
        🏠 Leave Lesson
      </Link>
      {/* Top bar */}
      <header className="bg-white border-b border-[#f0e8d8] px-4 py-3 flex items-center gap-3">
        {/* Brand logo */}
        <div className="relative w-[36px] h-[27px] shrink-0">
          <Image
            src="/brand/Logo.png"
            alt="Learn Curiosity"
            fill
            sizes="36px"
            className="object-contain"
          />
        </div>
        <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />
        {/* Mentor info */}
        <span className="text-xl select-none">{mentor.emoji}</span>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Your guide
          </p>
          <p className="text-sm font-bold text-[#1e3a52]">{mentor.name}</p>
        </div>
        {isFallback && (
          <span className="ml-auto text-xs bg-[#f0e8d8] text-[#b8860b] font-semibold px-2 py-1 rounded-full">
            Preview lesson
          </span>
        )}
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Story card */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b8860b] mb-1">
            Today&apos;s story
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{lesson.title}</h2>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {lesson.openingNarrative}
            </p>
          </div>

          {/* Phase: story — decision buttons */}
          {phase === "story" && (
            <div>
              <p className="font-semibold text-gray-900 mb-4">{lesson.decisionPrompt}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.consequences.map((c) => (
                  <button
                    key={c.choiceType}
                    onClick={() => pickChoice(c.choiceType)}
                    className="text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[#1e3a52] hover:bg-[#f0e8d8] transition-all cursor-pointer text-sm font-medium text-gray-700"
                  >
                    {CHOICE_LABELS[c.choiceType]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Phase: consequence */}
          {phase === "consequence" && consequence && (
            <div>
              <div className="bg-[#f0e8d8] rounded-2xl border border-[#e8dcc8] p-6 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#b8860b] mb-2">
                  What happened…
                </p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {consequence.narrative}
                </p>
              </div>
              <button
                onClick={startChat}
                className="w-full py-3 px-6 rounded-full bg-[#1e3a52] text-white font-semibold hover:bg-[#162d3f] transition-colors cursor-pointer"
              >
                Reflect with {mentor.name} →
              </button>
            </div>
          )}

          {/* Phase: chat */}
          {phase === "chat" && (
            <div className="mt-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Reflection
              </p>

              {/* Messages */}
              <div className="flex flex-col gap-4 mb-4">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {m.role === "assistant" && (
                      <span className="text-2xl select-none mt-1 shrink-0">{mentor.emoji}</span>
                    )}
                    <div
                      className={[
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-sm",
                        m.role === "assistant"
                          ? "bg-white border border-gray-100 text-gray-700"
                          : "bg-[#1e3a52] text-white",
                      ].join(" ")}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <span className="text-2xl select-none mt-1">{mentor.emoji}</span>
                    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-gray-400 text-sm">
                      Thinking…
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer…"
                  disabled={sending}
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#1e3a52] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="px-5 py-2 rounded-full bg-[#1e3a52] text-white text-sm font-semibold hover:bg-[#162d3f] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Send
                </button>
              </form>

              {/* Finish links — appear after 2 full exchanges */}
              {chatMessages.length >= 4 && (
                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center gap-3">
                  <p className="text-xs text-gray-400 text-center">
                    Great thinking — you earned sparks for this reflection!
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Link
                      href="/home"
                      className="px-6 py-2.5 rounded-full bg-[#1e3a52] text-white text-sm font-semibold hover:bg-[#162d3f] transition-all"
                    >
                      🏠 Back to Home
                    </Link>
                    <Link
                      href="/student"
                      className="px-6 py-2.5 rounded-full border-2 border-[#1e3a52] text-[#1e3a52] text-sm font-semibold hover:bg-[#1e3a52] hover:text-white transition-all"
                    >
                      ⭐ See my sparks
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
