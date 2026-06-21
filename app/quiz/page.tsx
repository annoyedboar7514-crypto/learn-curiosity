export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
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

  const profile = userId ? await getChildProfile() : null;
  const initialGrade: Grade = GRADE_MAP[profile?.gradeBand ?? ""] ?? "grade34";

  return (
    <QuizClient
      initialGrade={initialGrade}
      nickname={profile?.nickname ?? "Explorer"}
    />
  );
}
