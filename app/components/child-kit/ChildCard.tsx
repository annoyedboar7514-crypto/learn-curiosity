"use client";
// Rounded-3xl child card. Optionally tappable (card-lift) and accented with
// the active pillar's or era's color — the ONE accent allowed per screen.

import type { ReactNode } from "react";
import "./child-kit.css";

export interface ChildCardProps {
  children: ReactNode;
  /** Hex/token of the single active accent (pillar or era). */
  accent?: string;
  onPress?: () => void;
  entering?: boolean;
  className?: string;
}

export function ChildCard({ children, accent, onPress, entering, className = "" }: ChildCardProps) {
  const classes = [
    "ck-card",
    accent ? "ck-card--accent" : "",
    onPress ? "ck-card-tap ck-lift" : "",
    entering ? "ck-enter" : "",
    className,
  ].join(" ");
  const style = accent ? ({ "--ck-accent": accent } as React.CSSProperties) : undefined;

  if (onPress) {
    return (
      <button type="button" className={classes} style={style} onClick={onPress}>
        {children}
      </button>
    );
  }
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
