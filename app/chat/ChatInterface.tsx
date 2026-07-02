"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { MentorCharacter } from "@/lib/mentor/mentor-characters";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  childName: string;
  gradeBand: string;
  defaultMentorId: string;
  mentors: MentorCharacter[];
  childProfileId: string | null;
}

const SENTENCE_RE = /[^.!?]*[.!?]+(\s|$)/g;

let _msgId = 0;
function msgId() { return String(++_msgId); }

export default function ChatInterface({ childName, gradeBand, defaultMentorId, mentors, childProfileId }: Props) {
  const sessionId    = useRef(`chat-${Date.now()}`);
  const [mentorId, setMentorId] = useState(defaultMentorId);
  const mentor = mentors.find((m) => m.id === mentorId) ?? mentors[0];

  const [messages, setMessages]     = useState<ChatMessage[]>([]);
  const [input, setInput]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ttsError, setTtsError]     = useState(false);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognRef   = useRef<any>(null);
  const ttsQueue    = useRef<string[]>([]);
  const ttsRunning  = useRef(false);
  const ttsBuffer   = useRef("");
  const abortRef    = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── TTS pipeline ─────────────────────────────────────────────────────────────

  async function playAudio(url: string) {
    return new Promise<void>((resolve) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
      audio.play().catch(() => resolve());
    });
  }

  async function drainTts() {
    if (ttsRunning.current) return;
    ttsRunning.current = true;
    setIsSpeaking(true);
    while (ttsQueue.current.length > 0) {
      const text = ttsQueue.current.shift()!;
      if (!text.trim()) continue;
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mentorId }),
        });
        if (!res.ok) { setTtsError(true); break; }
        const blob = await res.blob();
        await playAudio(URL.createObjectURL(blob));
      } catch {
        setTtsError(true);
        break;
      }
    }
    ttsRunning.current = false;
    setIsSpeaking(false);
  }

  function enqueueTts(text: string) {
    if (!ttsEnabled || ttsError || !text.trim()) return;
    ttsQueue.current.push(text.trim());
    drainTts();
  }

  function stopAudio() {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.src = "";
    ttsQueue.current = [];
    ttsBuffer.current = "";
    ttsRunning.current = false;
    setIsSpeaking(false);
  }

  // Feed streaming text through sentence detector → TTS queue
  function feedTts(chunk: string) {
    if (!ttsEnabled || ttsError) return;
    ttsBuffer.current += chunk;
    const matches = ttsBuffer.current.match(SENTENCE_RE);
    if (!matches) return;
    const last = matches[matches.length - 1];
    const idx  = ttsBuffer.current.lastIndexOf(last) + last.length;
    const ready = ttsBuffer.current.slice(0, idx).trim();
    ttsBuffer.current = ttsBuffer.current.slice(idx);
    if (ready) enqueueTts(ready);
  }

  // ── Send a message ────────────────────────────────────────────────────────────

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    stopAudio();
    ttsBuffer.current = "";

    const userMsg: ChatMessage = { id: msgId(), role: "user", content: text.trim() };
    const asstId = msgId();
    const asstMsg: ChatMessage = { id: asstId, role: "assistant", content: "" };

    setMessages(prev => [...prev, userMsg, asstMsg]);
    setInput("");
    setIsLoading(true);

    const history = [...messages, userMsg];

    try {
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
          mentorId,
          gradeBand,
          sessionId: sessionId.current,
          childProfileId,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream error");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        feedTts(chunk);
        setMessages(prev =>
          prev.map(m => m.id === asstId ? { ...m, content: full } : m)
        );
      }

      // Flush remaining buffer to TTS
      if (ttsBuffer.current.trim()) {
        enqueueTts(ttsBuffer.current.trim());
        ttsBuffer.current = "";
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setMessages(prev =>
          prev.map(m => m.id === asstId ? { ...m, content: "Hmm, something went wrong. Try again?" } : m)
        );
      }
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, mentorId, gradeBand, childProfileId, isLoading, ttsEnabled, ttsError]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  // ── Voice input ───────────────────────────────────────────────────────────────

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) { alert("Voice input isn't supported in this browser. Try Chrome."); return; }
    stopAudio();
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = false;
    recognRef.current = r;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      send(t);
    };
    r.onend  = () => setIsListening(false);
    r.onerror = () => setIsListening(false);
    r.start();
    setIsListening(true);
  }, [send]);

  function stopListening() {
    recognRef.current?.stop();
    setIsListening(false);
  }

  // ── Switch mentor ─────────────────────────────────────────────────────────────

  function switchMentor(id: string) {
    abortRef.current?.abort();
    stopAudio();
    setMentorId(id);
    setMessages([]);
    ttsBuffer.current = "";
    sessionId.current = `chat-${Date.now()}`;
    setIsLoading(false);
  }

  const hasMessages = messages.length > 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f2027 100%)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#fff",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}>
        <Link href="/home" style={{ textDecoration: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, letterSpacing: 1 }}>
          ← home
        </Link>

        <div style={{ display: "flex", gap: 8 }}>
          {mentors.map((m) => (
            <button key={m.id} onClick={() => switchMentor(m.id)} title={`Switch to ${m.name}`} style={{
              background: mentorId === m.id ? `${m.color}28` : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${mentorId === m.id ? m.color : "rgba(255,255,255,0.1)"}`,
              borderRadius: 20, padding: "6px 14px",
              color: mentorId === m.id ? m.color : "rgba(255,255,255,0.4)",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}>
              {m.emoji} {m.name}
            </button>
          ))}
        </div>

        <button onClick={() => { setTtsEnabled(v => !v); stopAudio(); }} title={ttsEnabled ? "Mute" : "Unmute"} style={{
          background: "none", border: "none",
          color: ttsEnabled && !ttsError ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
          fontSize: 20, cursor: "pointer",
        }}>
          {ttsEnabled && !ttsError ? "🔊" : "🔇"}
        </button>
      </div>

      {/* ── Avatar ── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: hasMessages ? 16 : 44, paddingBottom: hasMessages ? 8 : 28,
        flexShrink: 0, transition: "padding 0.4s",
      }}>
        <div style={{
          width: hasMessages ? 68 : 96, height: hasMessages ? 68 : 96,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${mentor.color}28, transparent)`,
          border: `2.5px solid ${isSpeaking ? mentor.color : `${mentor.color}55`}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: hasMessages ? 34 : 50,
          boxShadow: isSpeaking ? `0 0 24px ${mentor.color}70` : "none",
          transition: "all 0.3s",
          animation: isSpeaking ? "avatarPulse 1.2s ease-in-out infinite" : "none",
        }}>
          {mentor.emoji}
        </div>

        <div style={{
          color: mentor.color, fontWeight: 700,
          fontSize: hasMessages ? 14 : 19, marginTop: 10, transition: "font-size 0.3s",
        }}>
          {mentor.name}
        </div>

        {!hasMessages && (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 3 }}>
            {mentor.title}
          </div>
        )}

        {isSpeaking && (
          <div style={{ display: "flex", gap: 4, marginTop: 8, alignItems: "flex-end", height: 20 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: 3, borderRadius: 2, background: mentor.color,
                animation: `wave 1s ease-in-out ${i * 0.14}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "0 16px 8px",
        maxWidth: 680, width: "100%", margin: "0 auto",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {!hasMessages && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.28)", fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>
            Hi {childName}! Hold the mic button to talk,<br />or type a message below.
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%",
              padding: "11px 15px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user" ? "rgba(255,255,255,0.1)" : `${mentor.color}18`,
              border: m.role === "user" ? "1px solid rgba(255,255,255,0.09)" : `1px solid ${mentor.color}38`,
              color: m.role === "user" ? "rgba(255,255,255,0.82)" : "#eef2ff",
              fontSize: 15, lineHeight: 1.65, whiteSpace: "pre-wrap",
              minHeight: m.role === "assistant" && m.content === "" ? 40 : undefined,
            }}>
              {m.content === "" && m.role === "assistant" ? (
                <span style={{ display: "flex", gap: 5, alignItems: "center", paddingTop: 4 }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{
                      display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                      background: mentor.color, opacity: 0.6,
                      animation: `bounce 1s ease-in-out ${i * 0.18}s infinite`,
                    }} />
                  ))}
                </span>
              ) : m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        padding: "12px 16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(0,0,0,0.28)",
        flexShrink: 0,
      }}>
        <form onSubmit={handleSubmit} style={{
          maxWidth: 680, margin: "0 auto",
          display: "flex", gap: 10, alignItems: "center",
        }}>
          {/* Mic */}
          <button
            type="button"
            onPointerDown={startListening}
            onPointerUp={stopListening}
            onPointerLeave={stopListening}
            style={{
              width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
              background: isListening ? mentor.color : "rgba(255,255,255,0.07)",
              border: `2px solid ${isListening ? mentor.color : "rgba(255,255,255,0.14)"}`,
              color: isListening ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: 20, cursor: "pointer", transition: "all 0.2s",
              boxShadow: isListening ? `0 0 18px ${mentor.color}80` : "none",
            }}
            title="Hold to speak"
          >
            {isListening ? "🎙️" : "🎤"}
          </button>

          {/* Text */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening…" : `Ask ${mentor.name} anything…`}
            disabled={isLoading || isListening}
            style={{
              flex: 1, padding: "12px 18px", borderRadius: 24,
              background: "rgba(255,255,255,0.06)",
              border: "1.5px solid rgba(255,255,255,0.11)",
              color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit",
            }}
          />

          {/* Send */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              width: 48, height: 48, borderRadius: "50%", flexShrink: 0, border: "none",
              background: input.trim() && !isLoading ? mentor.color : "rgba(255,255,255,0.07)",
              color: "#fff", fontSize: 20, cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            ↑
          </button>
        </form>

        {ttsError && (
          <div style={{ textAlign: "center", color: "rgba(255,100,100,0.65)", fontSize: 12, marginTop: 8 }}>
            Voice unavailable — add ELEVENLABS_API_KEY to enable it.
          </div>
        )}
      </div>

      <style>{`
        @keyframes avatarPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.05);opacity:.88} }
        @keyframes wave { 0%,100%{height:5px} 50%{height:18px} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        input::placeholder { color:rgba(255,255,255,.28); }
        input:focus { border-color:rgba(255,255,255,.3) !important; }
      `}</style>
    </div>
  );
}
