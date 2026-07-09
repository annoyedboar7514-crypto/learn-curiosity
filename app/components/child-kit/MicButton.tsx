"use client";
// MicButton — the hero element of the session player.
// States: idle (soft glow) · listening (gold waveform ring) · thinking
// (mentor is working — button rests) · speaking (gentle pulse while mentor
// audio plays; mic input should be hard-disabled by the caller).

import { useEffect, useRef } from "react";
import { playMicWarm } from "./sounds";
import "./child-kit.css";

export type MicState = "idle" | "listening" | "thinking" | "speaking";

const LABELS: Record<MicState, string> = {
  idle: "Tap to talk",
  listening: "I'm listening…",
  thinking: "Thinking…",
  speaking: "My turn — one moment",
};

export interface MicButtonProps {
  state?: MicState;
  onPress?: () => void;
  /** Hide the helper label under the button. */
  hideLabel?: boolean;
  className?: string;
}

export function MicButton({ state = "idle", onPress, hideLabel, className = "" }: MicButtonProps) {
  const prev = useRef<MicState>(state);

  // Warm tone exactly when the mic starts listening.
  useEffect(() => {
    if (state === "listening" && prev.current !== "listening") playMicWarm();
    prev.current = state;
  }, [state]);

  const disabled = state === "thinking" || state === "speaking";

  return (
    <div className={`ck-mic ck-mic--${state} ${className}`} data-mic-state={state}>
      <button
        type="button"
        className="ck-mic-btn"
        onClick={onPress}
        disabled={disabled}
        aria-label={LABELS[state]}
      >
        {state === "listening" ? (
          <span className="ck-mic-wave" aria-hidden>
            <span className="ck-mic-bar" /><span className="ck-mic-bar" /><span className="ck-mic-bar" />
            <span className="ck-mic-bar" /><span className="ck-mic-bar" />
          </span>
        ) : state === "thinking" ? (
          <span className="ck-dots" aria-hidden>
            <span className="ck-dot" /><span className="ck-dot" /><span className="ck-dot" />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8" />
          </svg>
        )}
      </button>
      {!hideLabel && <span className="ck-mic-label">{LABELS[state]}</span>}
    </div>
  );
}
