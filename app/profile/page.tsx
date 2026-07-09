export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getChildProfile } from "@/lib/session";
import { getProgress } from "@/lib/db/progress";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { BottomNav } from "@/app/components/BottomNav";

const ARCHETYPE_META: Record<string, { label: string; icon: string }> = {
  "explorer":         { label: "The Explorer",        icon: "🗺️" },
  "astronaut":        { label: "The Astronaut",        icon: "🚀" },
  "detective":        { label: "The Detective",        icon: "🔍" },
  "inventor-builder": { label: "The Inventor/Builder", icon: "🔧" },
  "artist":           { label: "The Artist",           icon: "🎨" },
  "doctor-healer":    { label: "The Doctor/Healer",    icon: "🩺" },
};

const GRADE_LABELS: Record<string, string> = {
  "K-2": "Kindergarten – Grade 2",
  "3-4": "Grades 3–4",
  "5-6": "Grades 5–6",
};

export default async function ProfilePage() {
  const profile = await getChildProfile();
  if (!profile) redirect("/login");

  const progress = await getProgress(profile.id);
  const mentor = getMentorCharacter(profile.mentorId ?? "luna");
  const archetype = profile.archetype ? ARCHETYPE_META[profile.archetype] : null;

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <header className="bg-cream border-b border-parchment sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-5 h-16 flex items-center gap-4">
          <Link href="/home" className="text-navy/50 hover:text-navy transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-5">
              <Image src="/brand/Logo.png" alt="" fill sizes="28px" className="object-contain" />
            </div>
            <span className="font-serif font-semibold text-navy">Profile</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-7">

        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center text-4xl font-bold text-white font-serif mb-3 select-none">
            {profile.nickname.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-serif text-2xl font-semibold text-navy">{profile.nickname}</h1>
          <p className="text-sm font-body text-navy/50 mt-1">{GRADE_LABELS[profile.gradeBand] ?? profile.gradeBand}</p>
          {progress.uniqueLessons.length > 0 && (
            <div className="flex items-center gap-2 mt-3 bg-parchment rounded-full px-4 py-1.5">
              <span className="text-base select-none">📖</span>
              <span className="font-serif text-sm font-semibold text-navy">
                {progress.uniqueLessons.length} {progress.uniqueLessons.length === 1 ? "story" : "stories"} explored
              </span>
            </div>
          )}
        </div>

        {/* Settings cards */}
        <div className="flex flex-col gap-3 mb-6">

          {/* Archetype */}
          <div className="bg-white rounded-2xl border border-parchment overflow-hidden">
            <div className="px-5 py-3 border-b border-parchment">
              <p className="text-xs font-mono-brand uppercase tracking-widest text-brass">Your Archetype</p>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl select-none">{archetype?.icon ?? "❓"}</span>
                <span className="font-serif text-navy font-semibold">{archetype?.label ?? "Not set yet"}</span>
              </div>
              <Link href="/quiz" className="text-sm font-semibold text-teal hover:underline">
                Change →
              </Link>
            </div>
          </div>

          {/* Mentor */}
          <div className="bg-white rounded-2xl border border-parchment overflow-hidden">
            <div className="px-5 py-3 border-b border-parchment">
              <p className="text-xs font-mono-brand uppercase tracking-widest text-brass">Your Mentor</p>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl select-none">{mentor.emoji}</span>
                <div>
                  <p className="font-serif text-navy font-semibold">{mentor.name}</p>
                  <p className="text-xs font-body text-navy/50">{mentor.title}</p>
                </div>
              </div>
              <Link href="/mentor" className="text-sm font-semibold text-teal hover:underline">
                Change →
              </Link>
            </div>
          </div>

          {/* Grade band */}
          <div className="bg-white rounded-2xl border border-parchment overflow-hidden">
            <div className="px-5 py-3 border-b border-parchment">
              <p className="text-xs font-mono-brand uppercase tracking-widest text-brass">Grade Level</p>
            </div>
            <div className="px-5 py-4 flex items-center gap-3">
              <span className="text-2xl select-none">📚</span>
              <span className="font-serif text-navy font-semibold">{GRADE_LABELS[profile.gradeBand] ?? profile.gradeBand}</span>
            </div>
          </div>

        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="flex items-center justify-between bg-white rounded-2xl border border-parchment px-5 py-4 hover:border-teal/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl select-none">📋</span>
              <span className="font-serif text-navy font-semibold">Parent Dashboard</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy/30">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-between bg-white rounded-2xl border border-parchment px-5 py-4 hover:border-teal/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl select-none">🌐</span>
              <span className="font-serif text-navy font-semibold">Back to Homepage</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy/30">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
