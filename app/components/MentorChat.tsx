// Learn Curiosity — Mentor Chat Component
// Used inside LevelModal during the post-decision conversation phase.
// Also reusable standalone for a full-screen chat session.

"use client";

import React, { useState, useRef, useEffect } from "react";
import { colors, fonts, space, radius, components } from "@/lib/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "mentor" | "child";
  text: string;
  timestamp?: number;
}

export interface MentorChatProps {
  mentorName: string;
  mentorEmoji: string;
  pillarName: string;
  levelTitle: string;
  /** First message Orion sends when chat opens */
  openerMessage: string;
  /** Follow-up questions to surface after child responds */
  followUpQuestions?: string[];
  /** Called when the conversation has enough depth to advance */
  onComplete?: (transcript: ChatMessage[]) => void;
  /** Minimum child messages before onComplete is allowed */
  minChildMessages?: number;
}

// ─── Quick reply chips (surfaced after mentor asks a question) ────────────────

const QUICK_REPLIES: Record<number, string[]> = {
  0: [
    "I was afraid no one would believe me",
    "I was worried about getting in trouble",
    "I thought the truth mattered more",
    "I wasn't sure what I'd do",
  ],
  1: [
    "I think the fear was reasonable",
    "They weren't seeing the full picture",
    "Fear can make you miss things",
  ],
  2: [
    "I'd still tell the truth",
    "I might wait until I was sure",
    "I'd find a trusted person first",
  ],
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

const TypingDots: React.FC = () => (
  <div style={{
    display: "flex", gap: space[1], alignItems: "center",
    padding: `${space[3]} ${space[4]}`,
    background: colors.mentorBubble,
    borderRadius: radius.md,
    alignSelf: "flex-start",
    width: 56,
  }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: radius.full,
        background: colors.teal,
        animation: "lc-typing 0.9s infinite",
        animationDelay: `${i * 0.15}s`,
      }} />
    ))}
    <style>{`
      @keyframes lc-typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-5px); opacity: 1; }
      }
    `}</style>
  </div>
);

// ─── Single chat bubble ───────────────────────────────────────────────────────

const Bubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => (
  <div style={{
    maxWidth: components.chatBubble.maxWidth,
    alignSelf: msg.role === "mentor" ? "flex-start" : "flex-end",
    padding: `${space[3]} ${space[4]}`,
    background: msg.role === "mentor"
      ? components.chatBubble.mentor.background
      : components.chatBubble.child.background,
    color: msg.role === "mentor" ? colors.charcoal : colors.mentorBubble,
    borderRadius: radius.md,
    fontFamily: fonts.body,
    fontSize: components.chatBubble.fontSize,
    fontWeight: 400,
    lineHeight: 1.5,
  }}>
    {msg.text}
  </div>
);

// ─── Quick reply chips ────────────────────────────────────────────────────────

const QuickReplies: React.FC<{
  options: string[];
  onSelect: (text: string) => void;
}> = ({ options, onSelect }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: space[2], marginTop: space[2] }}>
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onSelect(opt)}
        style={{
          padding: `${space[1]} ${space[3]}`,
          background: "transparent",
          border: `0.5px solid ${colors.border}`,
          borderRadius: radius.full,
          fontFamily: fonts.body, fontSize: "13px", fontWeight: 400,
          color: colors.charcoal,
          cursor: "pointer",
          transition: "all .15s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = colors.mentorBubble;
          e.currentTarget.style.borderColor = colors.teal;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = colors.border;
        }}
      >
        {opt}
      </button>
    ))}
  </div>
);

// ─── MentorChat ───────────────────────────────────────────────────────────────

export const MentorChat: React.FC<MentorChatProps> = ({
  mentorName,
  mentorEmoji,
  pillarName,
  levelTitle,
  openerMessage,
  followUpQuestions = [],
  onComplete,
  minChildMessages = 2,
}) => {
  const [messages,    setMessages]    = useState<ChatMessage[]>([]);
  const [inputValue,  setInputValue]  = useState("");
  const [typing,      setTyping]      = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [childCount,  setChildCount]  = useState(0);
  const [followUpIdx, setFollowUpIdx] = useState(0);
  const [canFinish,   setCanFinish]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Seed with opener on mount
  useEffect(() => {
    const opener: ChatMessage = { role: "mentor", text: openerMessage, timestamp: Date.now() };
    setMessages([opener]);
    setQuickReplies(QUICK_REPLIES[0] ?? []);
  }, [openerMessage]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const childMsg: ChatMessage = { role: "child", text: text.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, childMsg]);
    setInputValue("");
    setQuickReplies([]);
    setTyping(true);

    const newCount = childCount + 1;
    setChildCount(newCount);

    // Simulate mentor "thinking" time
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      setTyping(false);

      let nextMentorText: string;
      let nextQuickReplies: string[] = [];

      if (followUpIdx < followUpQuestions.length) {
        nextMentorText = followUpQuestions[followUpIdx];
        nextQuickReplies = QUICK_REPLIES[followUpIdx + 1] ?? [];
        setFollowUpIdx(prev => prev + 1);
      } else {
        // Wrap up
        nextMentorText = `You've been thinking hard about this. I'll remember what you said. Let's see how the story ends.`;
        setTimeout(() => setCanFinish(true), 800);
      }

      setMessages(prev => [...prev, { role: "mentor", text: nextMentorText, timestamp: Date.now() }]);
      setQuickReplies(nextQuickReplies);

      if (newCount >= minChildMessages && followUpIdx >= followUpQuestions.length - 1) {
        setTimeout(() => setCanFinish(true), 1000);
      }
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 360 }}>

      {/* Mentor header */}
      <div style={{
        display: "flex", alignItems: "center", gap: space[3],
        padding: `${space[4]} ${space[5]}`,
        borderBottom: `0.5px solid ${colors.border}`,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: radius.full,
          background: colors.teal, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "22px", flexShrink: 0,
          border: `2px solid ${colors.gold}`,
        }}>
          {mentorEmoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.display, fontSize: "15px", fontWeight: 600, color: colors.charcoal }}>
            {mentorName}
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: "13px", color: colors.charcoal, opacity: 0.6 }}>
            Your Mentor
          </div>
        </div>
        <div style={{
          fontFamily: fonts.mono, fontSize: "10px", fontWeight: 500,
          color: colors.teal, textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          {pillarName}
        </div>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, overflowY: "auto",
        display: "flex", flexDirection: "column", gap: space[3],
        padding: `${space[4]} ${space[5]}`,
      }}>
        {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
        {typing && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {quickReplies.length > 0 && !typing && (
        <div style={{ padding: `0 ${space[5]} ${space[3]}` }}>
          <QuickReplies options={quickReplies} onSelect={sendMessage} />
        </div>
      )}

      {/* Input row */}
      <div style={{
        padding: `${space[3]} ${space[5]} ${space[4]}`,
        borderTop: `0.5px solid ${colors.border}`,
        display: "flex", gap: space[2],
      }}>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={typing ? `${mentorName} is thinking…` : "Type your answer…"}
          disabled={typing}
          style={{
            flex: 1,
            padding: `${space[3]} ${space[4]}`,
            background: colors.cream,
            border: `1.5px solid ${colors.border}`,
            borderRadius: radius.sm,
            fontFamily: fonts.body, fontSize: "15px", fontWeight: 400,
            color: colors.charcoal,
            outline: "none",
            transition: "border-color .15s",
          }}
          onFocus={e => { e.currentTarget.style.borderColor = colors.teal; }}
          onBlur={e  => { e.currentTarget.style.borderColor = colors.border; }}
        />
        <button
          onClick={() => sendMessage(inputValue)}
          disabled={typing || !inputValue.trim()}
          style={{
            padding: `${space[3]} ${space[4]}`,
            background: typing || !inputValue.trim() ? colors.border : colors.teal,
            color: colors.cream,
            border: "none",
            borderRadius: radius.sm,
            fontFamily: fonts.body, fontSize: "14px", fontWeight: 500,
            cursor: typing || !inputValue.trim() ? "not-allowed" : "pointer",
            transition: "background .15s",
          }}
          onMouseEnter={e => { if (!typing && inputValue.trim()) e.currentTarget.style.background = colors.tealDark; }}
          onMouseLeave={e => { if (!typing && inputValue.trim()) e.currentTarget.style.background = colors.teal; }}
        >
          Send
        </button>
      </div>

      {/* Finish button */}
      {canFinish && onComplete && (
        <div style={{ padding: `0 ${space[5]} ${space[5]}` }}>
          <button
            onClick={() => onComplete(messages)}
            style={{
              width: "100%", height: "44px",
              background: colors.gold, color: colors.ctaText,
              border: "none", borderRadius: radius.sm,
              fontFamily: fonts.body, fontSize: "14px", fontWeight: 500,
              cursor: "pointer", transition: "background .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = colors.goldDark; }}
            onMouseLeave={e => { e.currentTarget.style.background = colors.gold; }}
          >
            See what happened → Complete Level
          </button>
        </div>
      )}
    </div>
  );
};

export default MentorChat;
