export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { getParentReport } from "@/lib/db/parent-report";
import type { ParentReport } from "@/lib/db/parent-report";
import ParentDashboardClient from "./ParentDashboardClient";

export default async function DashboardPage() {
  let userId: string | null = null;
  try { ({ userId } = await auth()); } catch { /* Clerk middleware not active */ }
  if (!userId) redirect("/login");

  let report: ParentReport | null = null;
  try {
    report = await getParentReport();
  } catch (err) {
    console.error("[dashboard] getParentReport failed:", err);
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-cream border-b border-[#E3DCC8] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-6">
            <Image src="/brand/Logo.png" alt="" fill sizes="32px" className="object-contain" />
          </div>
          <span className="font-serif font-semibold text-navy text-lg leading-none">LearnCuriosity</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/home" className="text-sm font-medium text-teal hover:text-teal/80 px-3 py-2 flex items-center gap-1.5">
            ← Child Home
          </Link>
          <Link href="/profile" className="text-sm text-navy/60 hover:text-navy px-3 py-2">Profile</Link>
          <SignOutButton redirectUrl="/">
            <button className="text-sm text-navy/60 hover:text-navy border border-[#E3DCC8] px-4 py-2 rounded-lg transition-colors cursor-pointer bg-transparent">
              Log Out
            </button>
          </SignOutButton>
        </div>
      </header>

      {report ? (
        <ParentDashboardClient report={report} />
      ) : (
        <main className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="w-14 h-14 bg-teal rounded-full flex items-center justify-center mx-auto mb-6 text-xl text-cream font-serif">
            ✦
          </div>
          <p className="font-mono text-xs tracking-widest uppercase text-teal mb-3">Parent Dashboard</p>
          <h1 className="font-serif text-3xl font-semibold text-navy mb-4">Getting things ready…</h1>
          <p className="text-navy/60 max-w-sm mx-auto mb-8 leading-relaxed text-sm">
            Your dashboard is loading. If this persists, the database may need a one-time migration.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="bg-white border border-[#E3DCC8] rounded-xl p-6">
              <div className="text-2xl mb-3">🧭</div>
              <h3 className="font-semibold text-navy text-sm mb-1">Take the Quiz</h3>
              <p className="text-xs text-navy/50 mb-4 leading-relaxed">Find your child&apos;s mentor archetype in 5 questions.</p>
              <Link href="/quiz" className="inline-block bg-teal text-cream text-xs font-semibold px-4 py-2 rounded-lg hover:bg-teal/90 transition-colors">Start Quiz →</Link>
            </div>
            <div className="bg-white border border-[#E3DCC8] rounded-xl p-6">
              <div className="text-2xl mb-3">📖</div>
              <h3 className="font-semibold text-navy text-sm mb-1">First Lesson</h3>
              <p className="text-xs text-navy/50 mb-4 leading-relaxed">Jump straight into your child&apos;s first story-based lesson.</p>
              <Link href="/home" className="inline-block bg-teal text-cream text-xs font-semibold px-4 py-2 rounded-lg hover:bg-teal/90 transition-colors">Begin →</Link>
            </div>
            <div className="bg-white border border-[#E3DCC8] rounded-xl p-6">
              <div className="text-2xl mb-3">👤</div>
              <h3 className="font-semibold text-navy text-sm mb-1">Child Profile</h3>
              <p className="text-xs text-navy/50 mb-4 leading-relaxed">View and update your child&apos;s learning profile.</p>
              <Link href="/profile" className="inline-block border border-navy text-navy text-xs font-semibold px-4 py-2 rounded-lg hover:bg-navy hover:text-cream transition-colors">View Profile →</Link>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
