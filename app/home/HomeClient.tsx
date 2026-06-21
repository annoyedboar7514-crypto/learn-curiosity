"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { LevelModal } from "@/app/components/LevelModal";
import { ERAS, LEVELS, type Pillar } from "@/lib/content/levels";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HomeProfile {
  nickname: string;
  gradeBand: "K-2" | "3-4" | "5-6";
  archetype: string;        // DB key: "explorer" | "astronaut" | ...
  archetypeEmoji: string;
  completedLevels: number[];
  currentLevelId: number;
  xp: Record<Pillar, number>;
  streakDays: number;
}

// ─── Static config ────────────────────────────────────────────────────────────

const CSS_ARCH: Record<string, string> = {
  "explorer":         "explorer",
  "astronaut":        "astronaut",
  "detective":        "detective",
  "inventor-builder": "explorer",
  "artist":           "explorer",
  "doctor-healer":    "explorer",
};

const MENTOR_DATA: Record<string, { name: string; greeting: (n: string) => string; sub: string }> = {
  "explorer":         { name: "Nova",  greeting: n => `Hi ${n}! Ready for today's adventure?`,       sub: "Your next story is waiting. Let's find out what happens." },
  "astronaut":        { name: "Orion", greeting: n => `Hi ${n}! Ready to explore the unknown?`,      sub: "A brand-new signal just came in. Let's go find it." },
  "detective":        { name: "Scout", greeting: n => `Hi ${n}! Ready to crack the next case?`,      sub: "There's a fresh clue on the board." },
  "inventor-builder": { name: "Bolt",  greeting: n => `Hi ${n}! Ready to build something new?`,      sub: "Your workbench is set up and ready to go." },
  "artist":           { name: "Lyra",  greeting: n => `Hi ${n}! Ready to create today?`,             sub: "There's a blank canvas and a story waiting for you." },
  "doctor-healer":    { name: "Sage",  greeting: n => `Hi ${n}! Ready to help someone today?`,       sub: "There's a character who really needs your thinking." },
};

const PILLAR_META: { id: Pillar; name: string; color: string; icon: string; shortDesc: string }[] = [
  { id: 1, name: "Critical Thinking", color: "#5B6FA8", icon: "🔍", shortDesc: "Ask better questions" },
  { id: 2, name: "Resilience",        color: "#4F8B6E", icon: "🌱", shortDesc: "Bounce back & grow" },
  { id: 3, name: "Creativity",        color: "#8B5FA3", icon: "✨", shortDesc: "Imagine & invent" },
  { id: 4, name: "Communication",     color: "#D9714F", icon: "💬", shortDesc: "Say what you mean" },
  { id: 5, name: "How to Learn",      color: "#C98A3E", icon: "🗺️", shortDesc: "Think about thinking" },
];

const TOTAL_LEVELS = 100;

// ─── SVG mini-map (5-node strip) ─────────────────────────────────────────────

function MiniMap({ currentId, completedIds }: { currentId: number; completedIds: number[] }) {
  const nodes = [currentId - 2, currentId - 1, currentId, currentId + 1, currentId + 2].filter(n => n >= 1 && n <= TOTAL_LEVELS);
  const W = 480;
  const pts = nodes.map((_, i) => ({ x: 60 + i * ((W - 120) / Math.max(nodes.length - 1, 1)), y: i % 2 === 0 ? 64 : 32 }));

  return (
    <svg viewBox={`0 0 ${W} 96`} style={{ width: "100%", height: 96 }}>
      {pts.slice(0, -1).map((p, i) => (
        <line key={i} x1={p.x} y1={p.y} x2={pts[i + 1].x} y2={pts[i + 1].y}
          stroke="#B99A5A" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 6" />
      ))}
      {nodes.map((lvl, i) => {
        const done = completedIds.includes(lvl);
        const curr = lvl === currentId;
        const locked = !done && !curr;
        return (
          <g key={lvl}>
            {curr && <circle cx={pts[i].x} cy={pts[i].y} r={28} fill="rgba(27,110,107,.18)" className="map-pulse" />}
            <circle cx={pts[i].x} cy={pts[i].y} r={22}
              fill={done ? "#1B6E6B" : curr ? "#E8A33D" : "#fff"}
              stroke={locked ? "#E3DCC8" : curr ? "#C9852A" : "#1B6E6B"}
              strokeWidth="3" />
            <text x={pts[i].x} y={pts[i].y + 5} textAnchor="middle"
              fill={done ? "#fff" : curr ? "#412402" : "#9CA3AF"} fontSize={13} fontWeight={600}>
              {done ? "✓" : locked ? "🔒" : lvl}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG big map (all visible levels) ────────────────────────────────────────

function BigMap({ currentId, completedIds }: { currentId: number; completedIds: number[] }) {
  const era = ERAS.find(e => e.levels.includes(currentId)) ?? ERAS[0];
  const visible = era.levels.slice(0, 12);
  const COLS = 4;
  const W = 680;
  const H = Math.ceil(visible.length / COLS) * 100 + 40;

  const pos = (i: number) => ({
    x: ((i % COLS) * (W / COLS)) + W / COLS / 2 + (Math.floor(i / COLS) % 2 === 1 ? W / COLS / 2 : 0),
    y: Math.floor(i / COLS) * 100 + 60,
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {visible.slice(0, -1).map((lvl, i) => {
        const p = pos(i);
        const q = pos(i + 1);
        return (
          <line key={lvl} x1={p.x} y1={p.y} x2={q.x} y2={q.y}
            stroke="#E3DCC8" strokeWidth="3" strokeLinecap="round" />
        );
      })}
      {visible.map((lvl, i) => {
        const done = completedIds.includes(lvl);
        const curr = lvl === currentId;
        const locked = !done && !curr;
        const p = pos(i);
        const lv = LEVELS.find(l => l.id === lvl);
        return (
          <g key={lvl}>
            {curr && <circle cx={p.x} cy={p.y} r={32} fill="rgba(232,163,61,.20)" className="map-pulse" />}
            <circle cx={p.x} cy={p.y} r={26}
              fill={done ? "#1B6E6B" : curr ? "#E8A33D" : "#fff"}
              stroke={locked ? "#E3DCC8" : curr ? "#C9852A" : "#1B6E6B"}
              strokeWidth="3" />
            <text x={p.x} y={p.y + 5} textAnchor="middle"
              fill={done ? "#fff" : curr ? "#412402" : "#9CA3AF"} fontSize={12} fontWeight={600}>
              {done ? "✓" : locked ? "🔒" : String(lvl)}
            </text>
            {lv && (
              <text x={p.x} y={p.y + 46} textAnchor="middle"
                fill="#4A5568" fontSize={10} fontWeight={500}>
                {lv.title.length > 18 ? lv.title.slice(0, 17) + "…" : lv.title}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Progress ring ────────────────────────────────────────────────────────────

function Ring({ done, total }: { done: number; total: number }) {
  const pct = Math.min(done / total, 1);
  const R = 80;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - pct);
  return (
    <div className="ring">
      <svg width={190} height={190} viewBox="0 0 190 190">
        <circle cx={95} cy={95} r={R} fill="none" stroke="#E3DCC8" strokeWidth={14} />
        <circle cx={95} cy={95} r={R} fill="none" stroke="var(--accent)" strokeWidth={14}
          strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="ctr">
        <div className="big">{done}</div>
        <div className="of">of {total}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HomeClient({ profile }: { profile: HomeProfile }) {
  const [tab, setTab] = useState<"home" | "progress">("home");
  const [lessonOpen, setLessonOpen] = useState(false);

  const cssArch = CSS_ARCH[profile.archetype] ?? "explorer";
  const mentor = MENTOR_DATA[profile.archetype] ?? MENTOR_DATA["explorer"];
  const currentLevel = LEVELS.find(l => l.id === profile.currentLevelId) ?? LEVELS[0];
  const currentEra = ERAS.find(e => e.levels.includes(profile.currentLevelId)) ?? ERAS[0];
  const pillarOfLesson = PILLAR_META.find(p => p.id === currentLevel.pillar)!;
  const done = profile.completedLevels.length;

  // Wire archetype colour to body so CSS vars cascade correctly
  useEffect(() => {
    document.body.setAttribute("data-archetype", cssArch);
    return () => { document.body.removeAttribute("data-archetype"); };
  }, [cssArch]);

  return (
    <div className="lc-home">

      {/* Decorative blobs */}
      <div className="bg-deco">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>

      <div className="shell">

        {/* ── Top bar ── */}
        <div className="topbar">
          <div className="brand">
            <Image src="/brand/Logo.png" alt="" width={44} height={44} className="mark" />
            <span className="wordmark">LearnCuriosity</span>
          </div>

          <div className="topbar-right">
            <div className="child-chip">
              <div className="avatar">{profile.archetypeEmoji}</div>
              <span className="name">{profile.nickname}</span>
            </div>

            {/* Parent dashboard link */}
            <Link href="/dashboard" className="btn-ghost">Parent</Link>

            {/* Sign out */}
            <SignOutButton redirectUrl="/">
              <button className="btn-ghost">Sign Out</button>
            </SignOutButton>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tabs" role="tablist">
          {(["home", "progress"] as const).map(t => (
            <button key={t} role="tab" className="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}>
              {t === "home" ? "🏠 Home" : "📊 Progress"}
            </button>
          ))}
        </div>

        {/* ════════════ HOME PANEL ════════════ */}
        <div className={`panel${tab === "home" ? " active" : ""}`} role="tabpanel">
          <div className="home">

            {/* Hero — mentor speech bubble */}
            <div className="hero">
              <div className="hero-inner">
                <div className="speech">
                  <div className="who">{mentor.name} · your mentor</div>
                  <h1>{mentor.greeting(profile.nickname)}</h1>
                  <p>{mentor.sub}</p>
                </div>
              </div>
            </div>

            {/* Big START button */}
            <button className="start" onClick={() => setLessonOpen(true)}>
              <span className="spark">✦</span>
              <span className="spark2">⭐</span>
              <div className="start-play">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="start-text">
                <div className="start-label">Level {profile.currentLevelId} · {currentEra.title}</div>
                <div className="start-title">{currentLevel.title}</div>
                <div className="start-meta">
                  <span className="pill" style={{ "--pillar": pillarOfLesson.color } as React.CSSProperties}>
                    <span className="dot" />
                    {pillarOfLesson.name}
                  </span>
                  <span style={{ fontSize: 14, opacity: 0.8 }}>
                    ⏱ {currentLevel.minutesEstimate} min
                  </span>
                </div>
              </div>
              <span className="start-go">Start →</span>
            </button>

            {/* Mini level trail */}
            <div className="trail-card">
              <div className="hd">
                <h3>Your Trail</h3>
                <span className="lvl">Level {profile.currentLevelId} / {TOTAL_LEVELS}</span>
              </div>
              <div className="minimap">
                <MiniMap currentId={profile.currentLevelId} completedIds={profile.completedLevels} />
              </div>
              <button className="lc-link" onClick={() => setTab("progress")}>
                See full map →
              </button>
            </div>

            {/* Pillar skill cards */}
            <div className="pillars-row">
              {PILLAR_META.map(p => {
                const xpVal = profile.xp[p.id] ?? 0;
                return (
                  <div key={p.id} className="pcard"
                    style={{ "--pillar": p.color } as React.CSSProperties}>
                    <div className="picon">
                      <span style={{ fontSize: 26 }}>{p.icon}</span>
                    </div>
                    <div className="pname">{p.name}</div>
                    <div className="pcount">{xpVal} XP · {p.shortDesc}</div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* ════════════ PROGRESS PANEL ════════════ */}
        <div className={`panel${tab === "progress" ? " active" : ""}`} role="tabpanel">
          <div className="prog">

            {/* Top row: ring + stats */}
            <div className="prog-top">

              <div className="lc-card ring-card">
                <div className="eyebrow">Overall Progress</div>
                <Ring done={done} total={TOTAL_LEVELS} />
                <span className="era-tag">{currentEra.title}</span>
                <p style={{ fontSize: 13, opacity: 0.7, marginTop: 10 }}>
                  {currentEra.subtitle}
                </p>
              </div>

              <div className="lc-card">
                <h3>Your Stats</h3>
                <div className="stat-grid">
                  <div className="stat">
                    <div className="n">{profile.streakDays}</div>
                    <div className="l">Day streak 🔥</div>
                  </div>
                  <div className="stat">
                    <div className="n">{done}</div>
                    <div className="l">Levels done ✓</div>
                  </div>
                  <div className="stat">
                    <div className="n">{Object.values(profile.xp).reduce((a, b) => a + b, 0)}</div>
                    <div className="l">Total XP ⭐</div>
                  </div>
                  <div className="stat">
                    <div className="n">{Math.max(0, profile.currentLevelId - 1)}</div>
                    <div className="l">Current level 🎯</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Era level map */}
            <div className="lc-card">
              <h3>{currentEra.title} — Level Map</h3>
              <p className="eyebrow" style={{ marginBottom: 16 }}>{currentEra.subtitle}</p>
              <div className="map-wrap">
                <BigMap currentId={profile.currentLevelId} completedIds={profile.completedLevels} />
              </div>
            </div>

            {/* Pillar progress bars */}
            <div className="lc-card">
              <h3>Skill Growth</h3>
              <div className="pillars-grid">
                {PILLAR_META.map(p => {
                  const xpVal = profile.xp[p.id] ?? 0;
                  const maxXp = 500;
                  const pct = Math.min((xpVal / maxXp) * 100, 100);
                  return (
                    <div key={p.id} className="prow">
                      <div className="top">
                        <span className="pn">{p.icon} {p.name}</span>
                        <span className="pc">{xpVal} / {maxXp} XP</span>
                      </div>
                      <div className="pbar">
                        <span style={{
                          width: `${pct}%`,
                          ["--pillar" as string]: p.color,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent completed levels */}
            {profile.completedLevels.length > 0 && (
              <div className="lc-card">
                <h3>Completed Levels</h3>
                <div className="recent">
                  {profile.completedLevels.slice(-5).reverse().map(id => {
                    const lv = LEVELS.find(l => l.id === id);
                    if (!lv) return null;
                    const pm = PILLAR_META.find(p => p.id === lv.pillar)!;
                    return (
                      <div key={id} className="ritem">
                        <div className="lv">{id}</div>
                        <div className="info">
                          <div className="t">{lv.title}</div>
                          <div className="s">{pm.icon} {pm.name} · {lv.minutesEstimate} min</div>
                        </div>
                        <div className="chk">
                          <span>✓</span> Done
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {profile.completedLevels.length === 0 && (
              <div className="lc-card" style={{ textAlign: "center", padding: "40px 24px" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
                <p style={{ fontSize: 15, opacity: 0.7 }}>
                  Complete your first lesson to see progress here!
                </p>
                <button className="start" style={{ maxWidth: 360, margin: "20px auto 0" }}
                  onClick={() => { setTab("home"); setTimeout(() => setLessonOpen(true), 100); }}>
                  <div className="start-play" style={{ width: 52, height: 52 }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22, marginLeft: 3 }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="start-text">
                    <div className="start-label">Start now</div>
                    <div className="start-title" style={{ fontSize: 22 }}>Level 1 — {LEVELS[0].title}</div>
                  </div>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Lesson modal — opens when Start button is tapped */}
      {lessonOpen && currentLevel && (
        <LevelModal
          level={currentLevel}
          onClose={() => setLessonOpen(false)}
          onLevelComplete={() => setLessonOpen(false)}
        />
      )}

    </div>
  );
}
