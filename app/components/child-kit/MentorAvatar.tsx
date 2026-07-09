"use client";
// The mentor IS the UI. This avatar is persistently present on every child
// screen: breathing when idle, glowing while speaking, "thinking" instead of
// spinners, and speaking plainly instead of error toasts.

import { useEffect, useState } from "react";
import "./child-kit.css";

export type MentorState = "idle" | "thinking" | "speaking" | "error";

const THINKING_LINES = [
  "Hmm, let me think…",
  "Oh, that's a good one…",
  "Give me just a second…",
  "I'm turning that over in my mind…",
];

const DEFAULT_ERROR_LINE = "My voice got stuck for a second. Tap here and we'll keep going.";

export interface MentorAvatarProps {
  emoji?: string;
  name?: string;
  state?: MentorState;
  size?: "sm" | "md" | "lg";
  /** Overrides the default rotating thinking line / plain error line. */
  line?: string;
  /** Error state only: tapping the recovery line calls this. */
  onRetry?: () => void;
  className?: string;
}

export function MentorAvatar({
  emoji = "🦉",
  name,
  state = "idle",
  size = "md",
  line,
  onRetry,
  className = "",
}: MentorAvatarProps) {
  const [thinkIdx, setThinkIdx] = useState(0);

  useEffect(() => {
    if (state !== "thinking" || line) return;
    const t = setInterval(() => setThinkIdx((i) => (i + 1) % THINKING_LINES.length), 2400);
    return () => clearInterval(t);
  }, [state, line]);

  const face = (
    <div
      className={[
        "ck-avatar",
        `ck-avatar--${size}`,
        state === "idle" ? "ck-breathing" : "",
        state === "speaking" ? "ck-avatar--speaking" : "",
        state === "error" ? "ck-avatar--error" : "",
      ].join(" ")}
      role="img"
      aria-label={name ? `${name}, your mentor` : "Your mentor"}
    >
      <span>{emoji}</span>
    </div>
  );

  return (
    <div className={`ck-avatar-wrap ${className}`} data-mentor-state={state}>
      {face}

      {state === "thinking" && (
        <div className="ck-avatar-line ck-enter" aria-live="polite">
          <span style={{ display: "block", marginBottom: 4 }}>{line ?? THINKING_LINES[thinkIdx]}</span>
          <span className="ck-dots" aria-hidden>
            <span className="ck-dot" /><span className="ck-dot" /><span className="ck-dot" />
          </span>
        </div>
      )}

      {state === "error" && (
        <button
          type="button"
          onClick={onRetry}
          className="ck-avatar-line ck-enter ck-lift"
          style={{ cursor: onRetry ? "pointer" : "default", borderColor: "rgba(232,163,61,.55)" }}
        >
          {line ?? DEFAULT_ERROR_LINE}
        </button>
      )}
    </div>
  );
}

/** Fixed bottom-corner wrapper — the persistent presence on child screens. */
export function MentorPresence(props: MentorAvatarProps) {
  return (
    <div className="ck-presence">
      <MentorAvatar size="sm" {...props} />
    </div>
  );
}
