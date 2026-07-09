import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Child UI Kit — Design Playground",
  robots: { index: false, follow: false },
};

export default function DesignPlaygroundLayout({ children }: { children: ReactNode }) {
  return children;
}
