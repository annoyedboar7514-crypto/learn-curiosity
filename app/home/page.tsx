export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getChildProfile } from "@/lib/session";
import { getProgress } from "@/lib/db/progress";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { BottomNav } from "@/app/components/BottomNav";

const ARCHETYPES = [
  { id: "explorer",        label: "Explorer",        icon: "🗺️",  desc: "Exploration & adventure",       color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400" },
  { id: "astronaut",       label: "Astronaut",        icon: "🚀",  desc: "Space & discovery",             color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400" },
  { id: "detective",       label: "Detective",        icon: "🔍",  desc: "Mysteries & reasoning",         color: "bg-amber-50 border-amber-200 hover:border-amber-400" },
  { id: "inventor-builder",label: "Inventor",         icon: "🔧",  desc: "Engineering & building",        color: "bg-orange-50 border-orange-200 hover:border-orange-400" },
  { id: "artist",          label: "Artist",           icon: "🎨",  desc: "Creativity & storytelling",     color: "bg-pink-50 border-pink-200 hover:border-pink-400" },
  { id: "doctor-healer",   label: "Healer",           icon: "🩺",  desc: "Caretaking & biology",          color: "bg-red-50 border-red-200 hover:border-red-400" },
];

const SIDE_QUESTS = [
  {
    icon: "🌳",
    title: "Forest Mystery",
    desc: "A tree falls in the night. Who — or what — is responsible?",
    archetype: "detective",
    badge: "Nature",
    color: "border-emerald-200 bg-emerald-50",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: "🌊",
    title: "Ocean Journey",
    desc: "Your raft is drifting. Can you navigate home using only the stars?",
    archetype: "explorer",
    badge: "Adventure",
    color: "border-blue-200 bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: "🦋",
    title: "The Healing Garden",
    desc: "A butterfly is hurt. What do you do — and who do you ask for help?",
    archetype: "doctor-healer",
    badge: "Empathy",
    color: "border-pink-200 bg-pink-50",
    badgeColor: "bg-pink-100 text-pink-700",
  },
  {
    icon: "🔭",
    title: "Stargazer",
    desc: "You spot something in the sky no one can explain. What do you do next?",
    archetype: "astronaut",
    badge: "Discovery",
    color: "border-indigo-200 bg-indigo-50",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
];

export default async function HomePage() {
  const profile = await getChildProfile();
  if (!profile) redirect("/login");

  const progress = await getProgress(profile.id);
  const mentor = getMentorCharacter(profile.mentorId ?? "luna");
  const lessonHref = profile.archetype
    ? `/lesson?archetype=${profile.archetype}`
    : "/quiz";

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <header className="bg-cream border-b border-parchment sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-6">
              <Image src="/brand/Logo.png" alt="" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-serif font-semibold text-navy text-lg">LearnCuriosity</span>
          </div>
          <Link href="/profile" className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm hover:bg-navy/80 transition-colors select-none">
            {profile.nickname.charAt(0).toUpperCase()}
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-6 space-y-7">

        {/* Greeting */}
        <div>
          <p className="text-xs font-mono-brand uppercase tracking-widest text-brass mb-0.5">Welcome back</p>
          <h1 className="font-serif text-3xl font-semibold text-navy">{profile.nickname}!</h1>
        </div>

        {/* Rank bar */}
        <Link href="/student" className="flex items-center gap-4 bg-navy rounded-2xl px-5 py-4 hover:opacity-90 transition-opacity">
          <span className="text-3xl select-none">{progress.rank.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-white font-semibold text-sm">{progress.rank.title} · Level {progress.rank.level}</p>
            <div className="mt-1.5 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${progress.rank.progressPct}%` }} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-serif text-gold font-bold text-xl leading-none">{progress.sparks}</p>
            <p className="text-[10px] text-white/50 mt-0.5">sparks</p>
          </div>
        </Link>

        {/* Start lesson CTA */}
        <Link
          href={lessonHref}
          className="flex items-center justify-between bg-teal text-white rounded-2xl px-6 py-5 hover:opacity-90 active:scale-95 transition-all"
        >
          <div>
            <p className="font-serif text-xl font-semibold leading-tight">Start Today&apos;s Lesson</p>
            <p className="text-sm text-white/70 mt-0.5">with {mentor.name} {mentor.emoji}</p>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Analytics */}
        <div>
          <p className="text-xs font-mono-brand uppercase tracking-widest text-brass mb-3">Your progress</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Sessions",      value: progress.totalSessions,       icon: "📖" },
              { label: "Sparks",        value: progress.sparks,              icon: "⭐" },
              { label: "Pillars",       value: `${progress.uniquePillars.length}/5`, icon: "🗺️" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-parchment p-4 text-center">
                <p className="text-xl mb-1 select-none">{s.icon}</p>
                <p className="font-serif text-2xl font-semibold text-navy leading-none">{s.value}</p>
                <p className="text-[10px] font-body text-navy/40 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono-brand uppercase tracking-widest text-brass">Courses</p>
            <p className="text-xs text-navy/40 font-body">6 worlds to explore</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ARCHETYPES.map((a) => {
              const isYours = profile.archetype === a.id;
              return (
                <Link
                  key={a.id}
                  href={`/lesson?archetype=${a.id}`}
                  className={`${a.color} border-2 rounded-2xl p-4 flex items-start gap-3 transition-all active:scale-95 relative`}
                >
                  {isYours && (
                    <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wide bg-teal text-white px-1.5 py-0.5 rounded-full">
                      Yours
                    </span>
                  )}
                  <span className="text-2xl select-none mt-0.5">{a.icon}</span>
                  <div className="min-w-0">
                    <p className="font-serif text-sm font-semibold text-navy leading-tight">{a.label}</p>
                    <p className="text-[11px] text-navy/50 font-body mt-0.5 leading-snug">{a.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Side quests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono-brand uppercase tracking-widest text-brass">Side Quests</p>
            <p className="text-xs text-navy/40 font-body">Nature adventures</p>
          </div>
          <div className="flex flex-col gap-3">
            {SIDE_QUESTS.map((q) => (
              <Link
                key={q.title}
                href={`/lesson?archetype=${q.archetype}`}
                className={`${q.color} border-2 rounded-2xl p-4 flex items-start gap-4 hover:opacity-90 active:scale-[0.99] transition-all`}
              >
                <span className="text-3xl select-none mt-0.5">{q.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-serif text-base font-semibold text-navy">{q.title}</p>
                    <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${q.badgeColor}`}>
                      {q.badge}
                    </span>
                  </div>
                  <p className="text-xs text-navy/60 font-body leading-snug">{q.desc}</p>
                </div>
                <svg className="shrink-0 mt-1 text-navy/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Parent dashboard link */}
        <Link
          href="/dashboard"
          className="flex items-center justify-between bg-white border border-parchment rounded-2xl px-5 py-4 hover:border-teal/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl select-none">📋</span>
            <div>
              <p className="font-serif text-navy font-semibold text-sm">Parent Dashboard</p>
              <p className="text-xs text-navy/40 font-body">Session history & reports</p>
            </div>
          </div>
          <svg className="text-navy/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

      </main>

      <BottomNav />
    </div>
  );
}
