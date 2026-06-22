export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getChildProfile } from "@/lib/session";
import QuizClient from "./QuizClient";
import type { Grade } from "./QuizClient";

const GRADE_MAP: Record<string, Grade> = {
  "K-2":  "k2",
  "3-4":  "grade34",
  "5-6":  "grade56",
};

export default async function QuizPage() {
  let userId: string | null = null;
  try { ({ userId } = await auth()); } catch { /* Clerk not active */ }

  // Unauthenticated users shouldn't land here — send them to sign up
  if (!userId) redirect("/signup");

  const profile = await getChildProfile();
  const initialGrade: Grade = GRADE_MAP[profile?.gradeBand ?? ""] ?? "grade34";

  return (
    <>
      {/* Logo link — always visible over the quiz background */}
      <div style={{
        position: "fixed", top: 14, left: 16, zIndex: 100,
        display: "flex", alignItems: "center",
      }}>
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
        >
          <div style={{ position: "relative", width: 26, height: 20 }}>
            <Image src="/brand/Logo.png" alt="Learn Curiosity" fill sizes="26px" style={{ objectFit: "contain" }} />
          </div>
          <span style={{
            fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: 15,
            color: "rgba(251,246,236,0.85)", textShadow: "0 1px 6px rgba(0,0,0,0.55)",
          }}>
            LearnCuriosity
          </span>
        </Link>
      </div>

      <QuizClient
        initialGrade={initialGrade}
        nickname={profile?.nickname ?? "Explorer"}
      />
    </>
  );
}
