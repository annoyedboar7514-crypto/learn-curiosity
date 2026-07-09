"use client";
// Chunky child-facing button: min 56px tap target, 18px Inter, card-lift press.

import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./child-kit.css";

export interface ChildButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet";
  children: ReactNode;
}

export function ChildButton({ variant = "primary", children, className = "", ...rest }: ChildButtonProps) {
  return (
    <button
      type="button"
      className={`ck-btn ck-btn--${variant} ${variant !== "primary" ? "ck-lift" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
