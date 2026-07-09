// Warm rounded transcript bubbles: mentor left in cream-on-teal-tint,
// child right in gold-tint. 18px Inter body per the child type scale.

import type { ReactNode } from "react";
import "./child-kit.css";

export interface TranscriptBubbleProps {
  role: "mentor" | "child";
  /** Speaker name shown as a small eyebrow (e.g. the mentor's name / nickname). */
  who?: string;
  children: ReactNode;
  /** Animate in with gentle-entrance (new messages). */
  entering?: boolean;
  className?: string;
}

export function TranscriptBubble({ role, who, children, entering, className = "" }: TranscriptBubbleProps) {
  return (
    <div
      className={[
        "ck-bubble",
        role === "mentor" ? "ck-bubble--mentor" : "ck-bubble--child",
        entering ? "ck-enter" : "",
        className,
      ].join(" ")}
    >
      {who && <span className="ck-bubble-who">{who}</span>}
      {children}
    </div>
  );
}

/** Flex column that right/left-aligns bubbles automatically. */
export function TranscriptColumn({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {children}
    </div>
  );
}
