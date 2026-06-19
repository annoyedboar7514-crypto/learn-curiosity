import Link from "next/link";
import Image from "next/image";
import { getSessions, getStats } from "@/lib/db/sessions";
import { getLessonById } from "@/lib/content/lesson-registry";
import { getChildProfileId } from "@/lib/session";

const PILLAR_LABELS: Record<string, string> = {
  "critical-thinking": "Critical Thinking",
  "resilience-character": "Resilience & Character",
  "creativity-vision": "Creativity & Vision",
  "communication-articulation": "Communication & Articulation",
  "learning-how-to-learn": "Learning How to Learn",
};

const PILLAR_COLORS: Record<string, string> = {
  "critical-thinking": "bg-indigo-100 text-indigo-800",
  "resilience-character": "bg-green-100 text-green-800",
  "creativity-vision": "bg-pink-100 text-pink-800",
  "communication-articulation": "bg-amber-100 text-amber-800",
  "learning-how-to-learn": "bg-teal/10 text-teal",
};

function formatDate(epoch: number) {
  return new Date(epoch * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(epoch: number) {
  return new Date(epoch * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const childProfileId = await getChildProfileId();
  const [sessions, stats] = await Promise.all([
    getSessions(childProfileId),
    getStats(childProfileId),
  ]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Dashboard header — always solid */}
      <header className="bg-cream border-b border-parchment sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-6">
              <Image src="/brand/Logo.png" alt="" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-serif font-semibold text-navy text-lg">LearnCuriosity</span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-xs font-mono-brand uppercase tracking-widest text-brass">
              Parent Dashboard
            </span>
            <Link href="/quiz" className="text-sm font-body text-navy/60 hover:text-navy transition-colors">
              ← Back to app
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Sessions", value: stats.sessions },
            { label: "Messages logged", value: stats.messages },
            {
              label: "Pillars touched",
              value: new Set(
                sessions.map((s) => getLessonById(s.lessonId)?.pillar).filter(Boolean)
              ).size,
            },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-parchment p-5">
              <p className="text-3xl font-serif font-semibold text-navy mb-1">{s.value}</p>
              <p className="text-xs font-body text-navy/50 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Session list */}
        <h2 className="font-serif text-2xl text-navy mb-6">Session history</h2>

        {sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((session) => {
              const lesson = getLessonById(session.lessonId);
              return (
                <Link
                  key={session.sessionId}
                  href={`/dashboard/session/${session.sessionId}`}
                  className="group bg-white rounded-2xl border border-parchment p-5 hover:border-teal/40 hover:shadow-sm transition-all flex items-start justify-between gap-4"
                >
                  {/* Left: date + lesson info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <p className="text-xs font-mono-brand text-brass uppercase tracking-widest">
                        {formatDate(session.startedAt)} · {formatTime(session.startedAt)}
                      </p>
                      {session.hasEscalation && (
                        <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                          ⚠ flagged
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-lg text-navy leading-snug mb-2 truncate">
                      {lesson?.title ?? session.lessonId}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {lesson && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PILLAR_COLORS[lesson.pillar] ?? "bg-gray-100 text-gray-700"}`}>
                          {PILLAR_LABELS[lesson.pillar] ?? lesson.pillar}
                        </span>
                      )}
                      {lesson && (
                        <span className="text-xs font-body text-navy/50 capitalize">
                          {lesson.archetype.replace("-", " / ")} · {lesson.gradeBand}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: message count + chevron */}
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <p className="text-2xl font-serif font-semibold text-navy">{session.messageCount}</p>
                    <p className="text-xs text-navy/40 font-body">messages</p>
                    <svg
                      className="mt-2 text-navy/30 group-hover:text-teal transition-colors"
                      width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 border-2 border-dashed border-parchment rounded-2xl">
      <div className="text-5xl mb-4 select-none">📋</div>
      <h3 className="font-serif text-xl text-navy mb-2">No sessions yet</h3>
      <p className="font-body text-sm text-navy/50 mb-6 max-w-xs mx-auto">
        Sessions appear here after your child completes the reflection phase of a lesson.
      </p>
      <Link
        href="/quiz"
        className="inline-block px-6 py-3 rounded-full bg-teal text-cream font-semibold font-body text-sm hover:bg-teal/90 transition-colors"
      >
        Start a session
      </Link>
    </div>
  );
}
