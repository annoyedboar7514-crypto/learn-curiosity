"use client";
// Child Home = the Story Map (Stage 2.1). No dashboard, no menu — the child
// lands on the era landscape: a horizontally scrollable illustrated path.
// Completed landmarks are full-color and replay the mentor's one-line memory;
// the current landmark breathes with the gold glow; future ones are dusk
// silhouettes; Crossroads waypoints glow and stay tappable forever.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ERAS } from "@/lib/content/levels";
import { getLevelById } from "@/lib/content/levels/all100Levels";
import { CROSSROADS_STORIES } from "@/lib/content/crossroads";
import type { GradeBand as CrGradeBand } from "@/lib/content/lessonSchema";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";
import {
  EraAtmosphere,
  MentorAvatar,
  ChildButton,
  mentorAudio,
  playPop,
} from "@/app/components/child-kit";

const CR_GRADE: Record<string, CrGradeBand> = { "K-2": "k2", "3-4": "grade34", "5-6": "grade56" };

export interface StoryMapProfile {
  nickname: string;
  gradeBand: "K-2" | "3-4" | "5-6";
  archetype: string;
  mentorId: string;
  completedLevels: number[];
  currentLevelId: number;
  quizPending?: boolean;
}

// The mentor greets the child by nickname on arrival. Four variants so the
// audio caches (Cache API) and mornings don't re-bill TTS.
const GREETINGS = [
  (n: string) => `Hi ${n}! I found a new story for us.`,
  (n: string) => `Welcome back, ${n}. The path is waiting.`,
  (n: string) => `There you are, ${n}! Ready to see what happens next?`,
  (n: string) => `Hello ${n}. I've been wondering about something — come see.`,
];

type MapNode =
  | { kind: "level"; id: number; title: string; state: "done" | "current" | "future" }
  | { kind: "crossroads"; id: string; title: string; open: boolean; afterLevel: number };

type SheetContent =
  | { kind: "memory"; levelId: number; title: string; line: string }
  | { kind: "crossroads-teaser"; title: string; afterLevel: number };

const NODE_GAP = 122;
const CANVAS_H = 340;

export default function StoryMapClient({ profile }: { profile: StoryMapProfile }) {
  const router = useRouter();
  const mentor = getMentorCharacter(profile.mentorId);
  const band = CR_GRADE[profile.gradeBand] ?? "grade34";
  const doneSet = useMemo(() => new Set(profile.completedLevels), [profile.completedLevels]);

  const era = ERAS.find((e) => e.levels.includes(profile.currentLevelId)) ?? ERAS[0];

  // Build the era path: levels in order, crossroads waypoints slotted after
  // their landmark level (age-band gated — outside the band it never renders).
  const nodes = useMemo<MapNode[]>(() => {
    const out: MapNode[] = [];
    for (const id of era.levels) {
      const lv = getLevelById(id);
      out.push({
        kind: "level",
        id,
        title: lv?.title ?? `Story ${id}`,
        state: doneSet.has(id) ? "done" : id === profile.currentLevelId ? "current" : "future",
      });
      for (const s of CROSSROADS_STORIES) {
        if (s.landmarkAfterLevel === id && s.ageBands.includes(band)) {
          out.push({
            kind: "crossroads",
            id: s.id,
            title: s.title,
            open: doneSet.has(s.landmarkAfterLevel),
            afterLevel: s.landmarkAfterLevel,
          });
        }
      }
    }
    return out;
  }, [era, doneSet, profile.currentLevelId, band]);

  // Gently undulating path positions
  const pos = useMemo(
    () =>
      nodes.map((_, i) => ({
        x: 100 + i * NODE_GAP,
        y: CANVAS_H / 2 + Math.sin(i * 0.85) * 62,
      })),
    [nodes]
  );
  const canvasW = 200 + (nodes.length - 1) * NODE_GAP;
  const currentIdx = nodes.findIndex((n) => n.kind === "level" && n.state === "current");

  const [sheet, setSheet] = useState<SheetContent | null>(null);
  const [greetLine, setGreetLine] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => mentorAudio.subscribe(setSpeaking), []);

  // Land with the current landmark centered
  useEffect(() => {
    const el = scrollRef.current;
    const target = currentRef.current;
    if (el && target) {
      el.scrollLeft = target.offsetLeft - el.clientWidth / 2;
    }
  }, []);

  // TTS greeting on arrival — once per day, cached audio variants. Browsers
  // block autoplay before a gesture, so if play fails silently the line still
  // shows in the mentor's bubble and plays on the first tap.
  useEffect(() => {
    const variant = new Date().getDate() % GREETINGS.length;
    const line = GREETINGS[variant](profile.nickname);
    // Date-dependent, so it can't be computed in render; one-time mount sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreetLine(line);
    const dayKey = `lc.greeted.${new Date().toDateString()}`;
    if (sessionStorage.getItem(dayKey)) return;
    sessionStorage.setItem(dayKey, "1");
    const cacheKey = `greet-v1-${variant}-${profile.nickname}`;
    const play = () => mentorAudio.speak(line, profile.mentorId, { cacheKey });
    void play();
    const once = () => {
      if (!mentorAudio.isSpeaking) void play();
      document.removeEventListener("pointerdown", once);
    };
    document.addEventListener("pointerdown", once, { once: true });
    return () => document.removeEventListener("pointerdown", once);
  }, [profile.nickname, profile.mentorId]);

  function tapLevel(node: Extract<MapNode, { kind: "level" }>) {
    if (node.state === "current") {
      router.push(`/lesson/${node.id}`);
      return;
    }
    if (node.state === "done") {
      playPop();
      const lv = getLevelById(node.id);
      const line = lv
        ? `Remember "${lv.title}"? ${lv.historicalPeriod ?? ""} You made that call yourself.`
        : `We walked that part of the path together.`;
      setSheet({ kind: "memory", levelId: node.id, title: node.title, line });
      void mentorAudio.speak(line, profile.mentorId, { cacheKey: `memory-v1-${node.id}` });
    }
  }

  function tapCrossroads(node: Extract<MapNode, { kind: "crossroads" }>) {
    if (node.open) {
      router.push(`/crossroads/${node.id}`);
    } else {
      playPop();
      setSheet({ kind: "crossroads-teaser", title: node.title, afterLevel: node.afterLevel });
    }
  }

  return (
    <EraAtmosphere era={(era.id > 5 ? 5 : era.id) as 1 | 2 | 3 | 4 | 5} className="ck-map-root">
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Quiet header — the map is the interface, not a menu */}
        <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px" }}>
          <Image src="/brand/Logo.png" alt="Learn Curiosity" width={36} height={36} />
          <div style={{ fontFamily: "var(--font-serif, Fraunces, serif)", fontWeight: 600, fontSize: 17, color: "var(--color-charcoal)" }}>
            {era.title}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            {/* Journal — a small charming notebook on the map, not a nav item */}
            <Link
              href="/journal"
              aria-label="Open your Curiosity Journal"
              className="ck-lift"
              style={{
                display: "grid", placeItems: "center", width: 52, height: 52,
                background: "#fff", border: "2px solid var(--color-cream-border)",
                borderRadius: 16, fontSize: 24, textDecoration: "none",
                boxShadow: "0 2px 8px rgba(35,49,55,.08)",
              }}
            >
              📓
            </Link>
            <Link
              href="/dashboard"
              style={{ fontSize: 13, color: "var(--color-charcoal)", opacity: 0.55, textDecoration: "none", padding: "8px 6px" }}
            >
              Parent
            </Link>
          </div>
        </header>

        {/* Quiz pending — the mentor asks, warmly */}
        {profile.quizPending && (
          <div className="ck-card ck-enter" style={{ margin: "4px 16px 0", display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 30 }} aria-hidden>{mentor.emoji}</span>
            <div style={{ flex: 1, fontSize: 15.5, lineHeight: 1.45 }}>
              First, a little quiz — so I can pick the stories you&apos;ll love most.
            </div>
            <ChildButton variant="primary" onClick={() => router.push("/quiz")}>Let&apos;s go</ChildButton>
          </div>
        )}

        {/* ── The Story Map ── */}
        <div ref={scrollRef} className="ck-map-scroll" style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div className="ck-map-canvas" style={{ width: canvasW, minWidth: canvasW }}>
            {/* the winding path */}
            <svg className="ck-map-path" width={canvasW} height={CANVAS_H} viewBox={`0 0 ${canvasW} ${CANVAS_H}`}>
              {pos.slice(0, -1).map((p, i) => {
                const q = pos[i + 1];
                const mx = (p.x + q.x) / 2;
                const traveled = i < currentIdx;
                return (
                  <path
                    key={i}
                    d={`M ${p.x} ${p.y} Q ${mx} ${p.y} ${mx} ${(p.y + q.y) / 2} T ${q.x} ${q.y}`}
                    fill="none"
                    stroke={traveled ? "var(--color-teal)" : "rgba(35,49,55,0.22)"}
                    strokeWidth={traveled ? 5 : 4}
                    strokeLinecap="round"
                    strokeDasharray={traveled ? undefined : "2 12"}
                  />
                );
              })}
            </svg>

            {/* landmarks */}
            {nodes.map((node, i) => {
              const p = pos[i];
              if (node.kind === "crossroads") {
                return (
                  <button
                    key={`cr-${node.id}`}
                    className={`ck-landmark ck-waypoint ${node.open ? "ck-waypoint--open" : "ck-waypoint--future"}`}
                    style={{ left: p.x, top: p.y }}
                    onClick={() => tapCrossroads(node)}
                    aria-label={node.open ? `Crossroads: ${node.title} — always open` : "A crossroads in history is ahead"}
                  >
                    <span className="ck-landmark-node"><span aria-hidden>⚖️</span></span>
                    <span className="ck-landmark-eyebrow">Crossroads</span>
                    <span className="ck-landmark-label">{node.open ? node.title : "A crossroads ahead…"}</span>
                  </button>
                );
              }
              const isCurrent = node.state === "current";
              return (
                <button
                  key={node.id}
                  ref={isCurrent ? currentRef : undefined}
                  className={`ck-landmark ck-landmark--${node.state}`}
                  style={{ left: p.x, top: p.y }}
                  onClick={() => tapLevel(node)}
                  disabled={node.state === "future"}
                  aria-label={
                    node.state === "done" ? `${node.title} — tap to remember`
                    : isCurrent ? `Today's story: ${node.title} — tap to begin`
                    : "A story still ahead"
                  }
                >
                  <span className={`ck-landmark-node ${isCurrent ? "ck-glow ck-breathing" : ""}`}>
                    <span aria-hidden>{node.state === "done" ? "✓" : isCurrent ? "★" : ""}</span>
                  </span>
                  {isCurrent && <span className="ck-landmark-eyebrow">Today&apos;s story</span>}
                  <span className="ck-landmark-label">
                    {node.state === "future" ? "···" : node.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mentor presence — greeting by nickname, glowing while speaking */}
        <div className="ck-presence">
          <MentorAvatar
            emoji={mentor.emoji}
            name={mentor.name}
            state={speaking ? "speaking" : "idle"}
            size="sm"
          />
          {greetLine && !sheet && (
            <div className="ck-avatar-line ck-enter" style={{ maxWidth: 220 }}>{greetLine}</div>
          )}
        </div>

        {/* Landmark memory / teaser sheet */}
        {sheet && (
          <div className="ck-map-sheet ck-enter">
            <div className="ck-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sheet.kind === "memory" ? (
                <>
                  <div style={{ fontFamily: "var(--font-serif, Fraunces, serif)", fontWeight: 600, fontSize: 20 }}>
                    {sheet.title}
                  </div>
                  <p style={{ fontSize: 16, lineHeight: 1.5, margin: 0 }}>{sheet.line}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <ChildButton variant="secondary" onClick={() => router.push(`/lesson/${sheet.levelId}`)}>
                      Visit again
                    </ChildButton>
                    <ChildButton variant="quiet" onClick={() => { mentorAudio.stop(); setSheet(null); }}>
                      Close
                    </ChildButton>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: "var(--font-serif, Fraunces, serif)", fontWeight: 600, fontSize: 20 }}>
                    A crossroads in history is ahead
                  </div>
                  <p style={{ fontSize: 16, lineHeight: 1.5, margin: 0 }}>
                    Keep walking the path — finish story {sheet.afterLevel} and “{sheet.title}” opens. Once it opens, it stays open forever.
                  </p>
                  <ChildButton variant="quiet" onClick={() => setSheet(null)}>Close</ChildButton>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </EraAtmosphere>
  );
}
