import Link from "next/link";
import Image from "next/image";
import { getProgress } from "@/lib/db/progress";
import { getChildProfileId } from "@/lib/session";

const ALL_PILLARS: { id: string; label: string; icon: string; color: string }[] = [
  { id: "critical-thinking",       label: "Critical Thinking",          icon: "🧠", color: "bg-indigo-100 border-indigo-300 text-indigo-700" },
  { id: "resilience-character",    label: "Resilience & Character",     icon: "🌱", color: "bg-green-100 border-green-300 text-green-700" },
  { id: "creativity-vision",       label: "Creativity & Vision",        icon: "💡", color: "bg-pink-100 border-pink-300 text-pink-700" },
  { id: "communication-articulation", label: "Communication & Articulation", icon: "💬", color: "bg-amber-100 border-amber-300 text-amber-700" },
  { id: "learning-how-to-learn",   label: "Learning How to Learn",      icon: "🔄", color: "bg-teal/10 border-teal/30 text-teal" },
];

export default async function StudentPage() {
  const childProfileId = await getChildProfileId();
  const progress = getProgress(childProfileId);
  const { rank } = progress;

  const sparksToNext = rank.nextSparksRequired !== null
    ? rank.nextSparksRequired - progress.sparks
    : null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-cream border-b border-parchment sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-6">
              <Image src="/brand/Logo.png" alt="" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-serif font-semibold text-navy text-lg">LearnCuriosity</span>
          </Link>
          <Link
            href="/quiz"
            className="px-4 py-2 rounded-full bg-teal text-cream text-sm font-semibold font-body hover:bg-teal/90 transition-colors"
          >
            New lesson →
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">

        {/* ── Rank card ─────────────────────────────────────────────────── */}
        <div className="bg-navy rounded-3xl p-8 mb-8 relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative">
            <p className="text-xs font-mono-brand uppercase tracking-widest text-cream/50 mb-3">
              Your rank
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl select-none">{rank.icon}</span>
              <div>
                <p className="font-serif text-3xl text-cream font-semibold leading-none mb-1">
                  {rank.title}
                </p>
                <p className="text-sm font-body text-cream/60">
                  Level {rank.level}
                  {rank.level < 6 ? ` of 6` : " · Max level reached!"}
                </p>
              </div>
            </div>

            {/* Sparks + progress bar */}
            <div className="mb-3 flex items-end gap-3">
              <div>
                <span className="font-serif text-4xl font-semibold text-gold">
                  {progress.sparks}
                </span>
                <span className="text-sm font-body text-cream/60 ml-2">sparks</span>
              </div>
              {sparksToNext !== null && (
                <p className="text-xs font-body text-cream/40 mb-1.5">
                  {sparksToNext} to Level {rank.level + 1}
                </p>
              )}
            </div>

            {rank.nextSparksRequired !== null && (
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-700"
                  style={{ width: `${rank.progressPct}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Lessons", value: progress.totalSessions, icon: "📖" },
            { label: "Replies", value: progress.totalUserMessages, icon: "💬" },
            { label: "Pillars", value: `${progress.uniquePillars.length} of 5`, icon: "🗺️" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-parchment p-4 text-center"
            >
              <p className="text-2xl mb-1 select-none">{s.icon}</p>
              <p className="font-serif text-2xl font-semibold text-navy leading-none mb-1">
                {s.value}
              </p>
              <p className="text-xs font-body text-navy/40 uppercase tracking-widest">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Pillar badges ──────────────────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="font-serif text-xl text-navy mb-4">Your map of ideas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_PILLARS.map((p) => {
              const explored = progress.uniquePillars.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={[
                    "flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition-all",
                    explored
                      ? p.color
                      : "bg-white border-parchment text-navy/30",
                  ].join(" ")}
                >
                  <span className={`text-2xl select-none ${explored ? "" : "grayscale opacity-40"}`}>
                    {p.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold font-body leading-snug ${explored ? "" : "text-navy/30"}`}>
                      {p.label}
                    </p>
                    <p className="text-xs font-body mt-0.5">
                      {explored ? "Explored ✓" : "Not yet explored"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── How sparks work ────────────────────────────────────────────── */}
        <div className="bg-parchment rounded-2xl p-5 mb-8">
          <p className="text-xs font-mono-brand uppercase tracking-widest text-brass mb-3">
            How you earn sparks
          </p>
          <div className="flex flex-col gap-2">
            {[
              { amount: "+10", label: "Complete a lesson" },
              { amount: "+2",  label: "Each reply you write in reflection" },
              { amount: "+5",  label: "First time exploring a new pillar" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="font-mono-brand text-sm font-bold text-gold w-8 shrink-0">
                  {row.amount}
                </span>
                <span className="text-sm font-body text-navy/70">{row.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        {progress.totalSessions === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-parchment rounded-2xl">
            <p className="text-4xl mb-3 select-none">🌱</p>
            <p className="font-serif text-xl text-navy mb-2">Your journey starts here</p>
            <p className="text-sm font-body text-navy/50 mb-6 max-w-xs mx-auto">
              Complete your first lesson to earn sparks and discover your rank.
            </p>
            <Link
              href="/quiz"
              className="inline-block px-8 py-3 rounded-full bg-teal text-cream font-semibold font-body hover:bg-teal/90 transition-colors"
            >
              Start your first lesson →
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <Link
              href="/quiz"
              className="inline-block px-8 py-3 rounded-full bg-teal text-cream font-semibold font-body hover:bg-teal/90 transition-colors"
            >
              Explore another lesson →
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
