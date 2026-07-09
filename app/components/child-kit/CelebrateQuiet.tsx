"use client";
// celebrate-quiet — the ONLY completion animation allowed. A brief warm glow
// plus the mentor's line. No confetti, no stars, no fanfare sounds.

import { useEffect } from "react";
import "./child-kit.css";

export interface CelebrateQuietProps {
  /** The mentor's spoken line, shown large in Fraunces. */
  line: string;
  mentorEmoji?: string;
  /** Called when the moment finishes (~2.4s). */
  onDone?: () => void;
}

export function CelebrateQuiet({ line, mentorEmoji = "🦉", onDone }: CelebrateQuietProps) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <div className="ck-celebrate-veil" aria-hidden />
      <div
        className="ck-celebrate-line"
        role="status"
        style={{
          position: "fixed", left: 0, right: 0, bottom: "18%", zIndex: 91,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          pointerEvents: "none", padding: "0 24px",
        }}
      >
        <span style={{ fontSize: 40 }} aria-hidden>{mentorEmoji}</span>
        <p
          style={{
            fontFamily: "var(--font-serif, Fraunces, Georgia, serif)",
            fontSize: 26, fontWeight: 600, textAlign: "center",
            color: "var(--color-charcoal)", maxWidth: 420, lineHeight: 1.3,
            textShadow: "0 1px 0 rgba(251,246,236,.9)",
          }}
        >
          {line}
        </p>
      </div>
    </>
  );
}
