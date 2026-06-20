import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getChildProfile } from "@/lib/session";
import { getProgress } from "@/lib/db/progress";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import { BottomNav } from "@/app/components/BottomNav";

const ARCHETYPE_META: Record<string, { label: string; icon: string; color: string }> = {
  explorer:  { label: "The Explorer",        icon: "🗺️",  color: "bg-emerald-50 border-emerald-200" },
  astronaut: { label: "The Astronaut",        icon: "🚀",  color: "bg-indigo-50 border-indigo-200" },
  detective: { label: "The Detective",        icon: "🔍",  color: "bg-amber-50 border-amber-200" },
  inventor:  { label: "The Inventor/Builder", icon: "🔧",  color: "bg-orange-50 border-orange-200" },
  artist:    { label: "The Artist",           icon: "🎨",  color: "bg-pink-50 border-pink-200" },
  doctor:    { label: "The Doctor/Healer",    icon: "🩺",  color: "bg-red-50 border-red-200" },
};

const TILES = [
  {
    href: "/quiz",
    icon: "✨",
    label: "Start a Lesson",
    description: "Begin today's adventure",
    bg: "bg-teal",
    text: "text-white",
    descColor: "text-white/70",
  },
  {
    href: "/student",
    icon: "⭐",
    label: "My Sparks",
    description: "See your rank and progress",
    bg: "bg-navy",
    text: "text-white",
    descColor: "text-white/70",
  },
  {
    href: "/mentor",
    icon: "🦉",
    label: "My Mentor",
    description: "Change your guide",
    bg: "bg-parchment",
    text: "text-navy",
    descColor: "text-navy/50",
  },
  {
    href: "/dashboard",
    icon: "📋",
    label: "Parent View",
    description: "Session history & reports",
    bg: "bg-parchment",
    text: "text-navy",
    descColor: "text-navy/50",
  },
];

export default async function HomePage() {
  const profile = await getChildProfile();
  if (!profile) redirect("/login");

  const progress = await getProgress(profile.id);
  const mentor = getMentorCharacter(profile.mentorId ?? "luna");
  const archetype = profile.archetype ? ARCHETYPE_META[profile.archetype] : null;

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <header className="bg-cream border-b border-parchment sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-6">
              <Image src="/brand/Logo.png" alt="" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-serif font-semibold text-navy text-lg">LearnCuriosity</span>
          </div>
          <Link href="/profile" className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-sm hover:bg-navy/20 transition-colors">
            {profile.nickname.charAt(0).toUpperCase()}
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-7">

        {/* Greeting */}
        <div className="mb-7">
          <p className="text-xs font-mono-brand uppercase tracking-widest text-brass mb-1">Welcome back</p>
          <h1 className="font-serif text-3xl font-semibold text-navy leading-tight">
            {profile.nickname}!
          </h1>
        </div>

        {/* Sparks summary bar */}
        <Link href="/student" className="flex items-center gap-4 bg-navy rounded-2xl px-5 py-4 mb-6 hover:opacity-90 transition-opacity">
          <span className="text-3xl select-none">{progress.rank.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-white font-semibold text-sm leading-tight">{progress.rank.title}</p>
            <div className="mt-1.5 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full" style={{ width: `${progress.rank.progressPct}%` }} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-serif text-gold font-bold text-xl leading-none">{progress.sparks}</p>
            <p className="text-[10px] text-white/50 mt-0.5">sparks</p>
          </div>
        </Link>

        {/* Nav tiles */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className={`${tile.bg} ${tile.text} rounded-2xl p-5 flex flex-col gap-2 hover:opacity-90 active:scale-95 transition-all border border-transparent`}
            >
              <span className="text-3xl select-none">{tile.icon}</span>
              <div>
                <p className="font-serif font-semibold text-base leading-tight">{tile.label}</p>
                <p className={`text-xs font-body mt-0.5 ${tile.descColor}`}>{tile.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Archetype + Mentor row */}
        <div className="grid grid-cols-2 gap-3">
          {archetype && (
            <Link href="/quiz" className={`${archetype.color} border rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity`}>
              <span className="text-2xl select-none">{archetype.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-brand uppercase tracking-widest text-navy/40 mb-0.5">Archetype</p>
                <p className="font-serif text-sm font-semibold text-navy leading-snug truncate">{archetype.label}</p>
              </div>
            </Link>
          )}
          <Link href="/mentor" className="bg-gold/10 border border-gold/20 rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity">
            <span className="text-2xl select-none">{mentor.emoji}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-mono-brand uppercase tracking-widest text-navy/40 mb-0.5">Mentor</p>
              <p className="font-serif text-sm font-semibold text-navy leading-snug truncate">{mentor.name}</p>
            </div>
          </Link>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
