// Learn Curiosity — Student Dashboard
// Main child-facing screen: level trail, quests, mini-game, pillar progress, tips.
// Route: app/dashboard/page.tsx

"use client";

import React, { useState, useCallback } from "react";
import { colors, fonts, space, radius, shadow, components } from "@/lib/theme";
import { LevelModal } from "@/app/components/LevelModal";
import { ERAS, LEVELS, PILLAR_META, getLevelById, type Pillar } from "@/lib/content/levels";

// ─── Child session state (replace with real DB/API) ──────────────────────────

interface ChildProfile {
  nickname: string;
  gradeBand: "K-2" | "3-4" | "5-6";
  archetype: string;
  archetypeEmoji: string;
  completedLevels: number[];   // level IDs
  currentLevelId: number;
  xp: Record<Pillar, number>;
  streakDays: number;
}

const DEMO_PROFILE: ChildProfile = {
  nickname: "Max",
  gradeBand: "3-4",
  archetype: "Astronaut",
  archetypeEmoji: "🚀",
  completedLevels: [1, 2, 3, 4, 5, 6],
  currentLevelId: 7,
  xp: { 1: 72, 2: 55, 3: 40, 4: 30, 5: 60 },
  streakDays: 5,
};

// ─── Mini-games data ──────────────────────────────────────────────────────────

interface MiniGameQuestion {
  question: string;
  context?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const MINI_GAMES: MiniGameQuestion[] = [
  {
    question: "Which of these is a REASON, not just a restatement of the claim?",
    context: "Claim: \"We should eat breakfast every day.\"",
    options: [
      "Breakfast is good for you.",
      "Eating breakfast gives your brain the fuel it needs for the first few hours of school.",
      "Everyone knows breakfast is the most important meal.",
      "Breakfast is important.",
    ],
    correctIndex: 1,
    explanation: "A reason has to actually prove the claim — not just repeat it or assume the reader already agrees.",
  },
  {
    question: "Which response actually challenges the argument?",
    context: "Claim: \"Kai should have stayed quiet to avoid trouble.\"",
    options: [
      "That's a reasonable thing to say.",
      "But sometimes trouble is the only way the truth gets told.",
      "I agree, trouble is bad.",
      "Kai was scared.",
    ],
    correctIndex: 1,
    explanation: "Challenging an argument means offering a reason the claim could be wrong — not just agreeing or describing the situation.",
  },
  {
    question: "Someone says: 'You're wrong because you're only a kid.' What kind of reasoning is this?",
    context: undefined,
    options: [
      "Good reasoning — age matters in arguments.",
      "An attack on the person, not the idea.",
      "A strong counterargument.",
      "Evidence-based reasoning.",
    ],
    correctIndex: 1,
    explanation: "Attacking the person instead of their idea is called an ad hominem — it doesn't actually address whether the argument is right or wrong.",
  },
];

const TIPS = [
  "\"When you're stuck, ask yourself: what do I know for sure, and what am I just guessing?\"",
  "\"A good question is worth more than a quick answer. Sit with it.\"",
  "\"Try explaining your idea to someone who has never heard it before. That's how you find the gaps.\"",
  "\"Being wrong is how you find out what's actually true. It's not a mistake — it's the process.\"",
  "\"Before you decide, ask: what would happen if I'm wrong about this?\"",
  "\"Curiosity is a skill you can practice. Notice one thing today you don't understand, and follow it.\"",
];

// ─── Reusable micro-components ────────────────────────────────────────────────

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    fontFamily: fonts.mono, fontSize: "10px", fontWeight: 500,
    lineHeight: 1.2, letterSpacing: "0.05em", textTransform: "uppercase",
    color: colors.teal, margin: `0 0 ${space[2]} 0`,
  }}>
    {children}
  </p>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }> = ({
  children, style, onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      background: components.card.background,
      border: components.card.border,
      borderRadius: components.card.borderRadius,
      padding: components.card.padding,
      boxShadow: components.card.shadowDefault,
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow .15s",
      ...style,
    }}
    onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.boxShadow = components.card.shadowHover; }}
    onMouseLeave={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.boxShadow = components.card.shadowDefault; }}
  >
    {children}
  </div>
);

// ─── XP progress bar ──────────────────────────────────────────────────────────

const XPBar: React.FC<{ value: number; max?: number }> = ({ value, max = 100 }) => (
  <div style={{
    background: colors.cream, borderRadius: radius.full, height: 6, overflow: "hidden",
  }}>
    <div style={{
      height: "100%", background: colors.gold,
      borderRadius: radius.full,
      width: `${Math.min(100, (value / max) * 100)}%`,
      transition: "width 1s cubic-bezier(.4,0,.2,1)",
    }} />
  </div>
);

// ─── Level node on the trail ──────────────────────────────────────────────────

type NodeStatus = "done" | "active" | "locked";

const LevelNode: React.FC<{
  levelId: number;
  status: NodeStatus;
  pillar: Pillar;
  onClick: () => void;
}> = ({ levelId, status, pillar, onClick }) => {
  const pillarColor = PILLAR_META[pillar].color;
  return (
    <button
      onClick={status !== "locked" ? onClick : undefined}
      title={status === "locked" ? "Complete earlier levels to unlock" : `Level ${levelId}`}
      style={{
        width: 46, height: 46, borderRadius: radius.full,
        border: `2px solid ${
          status === "done"   ? colors.teal :
          status === "active" ? colors.gold :
          colors.border
        }`,
        background:
          status === "done"   ? colors.teal :
          status === "active" ? colors.gold :
          colors.cream,
        color:
          status === "done"   ? colors.cream :
          status === "active" ? colors.ctaText :
          colors.charcoal,
        fontFamily: fonts.body, fontSize: "13px", fontWeight: 500,
        cursor: status === "locked" ? "not-allowed" : "pointer",
        opacity: status === "locked" ? 0.42 : 1,
        transition: "transform .15s, box-shadow .15s",
        flexShrink: 0,
        position: "relative",
        boxShadow: status === "active" ? `0 0 0 4px rgba(232,163,61,0.22)` : "none",
      }}
      onMouseEnter={e => {
        if (status !== "locked") {
          e.currentTarget.style.transform = "scale(1.12)";
          e.currentTarget.style.boxShadow = shadow.md;
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = status === "active" ? "0 0 0 4px rgba(232,163,61,0.22)" : "none";
      }}
    >
      {status === "done" ? "✓" : levelId}
      {/* Pillar dot */}
      <div style={{
        position: "absolute", top: -3, right: -3,
        width: 11, height: 11, borderRadius: radius.full,
        background: pillarColor,
        border: `2px solid ${components.card.background}`,
      }} />
    </button>
  );
};

// ─── Trail connector ──────────────────────────────────────────────────────────

const TrailLine: React.FC<{ filled: boolean }> = ({ filled }) => (
  <div style={{
    flex: 1, height: 3, maxWidth: 64,
    borderTop: filled
      ? `2px solid ${colors.trailFilled}`
      : `2px dotted ${colors.trailMuted}`,
    transition: "border .3s",
  }} />
);

// ─── Quest item ───────────────────────────────────────────────────────────────

interface Quest {
  id: string;
  text: string;
  xp: number;
  done: boolean;
}

const QuestItem: React.FC<{
  quest: Quest;
  onToggle: (id: string) => void;
}> = ({ quest, onToggle }) => (
  <div
    onClick={() => onToggle(quest.id)}
    style={{
      display: "flex", alignItems: "center", gap: space[3],
      padding: `${space[2]} 0`,
      borderBottom: `0.5px solid ${colors.border}`,
      cursor: "pointer",
    }}
  >
    <div style={{
      width: 20, height: 20, borderRadius: radius.sm, flexShrink: 0,
      border: `1.5px solid ${quest.done ? colors.teal : colors.border}`,
      background: quest.done ? colors.teal : colors.cream,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .15s",
    }}>
      {quest.done && <span style={{ color: colors.cream, fontSize: "12px", lineHeight: 1 }}>✓</span>}
    </div>
    <span style={{
      flex: 1,
      fontFamily: fonts.body, fontSize: "13px", fontWeight: 400, lineHeight: 1.4,
      color: colors.charcoal,
      opacity: quest.done ? 0.4 : 1,
      textDecoration: quest.done ? "line-through" : "none",
    }}>
      {quest.text}
    </span>
    <span style={{
      fontFamily: fonts.mono, fontSize: "10px", fontWeight: 500,
      color: quest.done ? colors.teal : colors.trailMuted,
      textTransform: "uppercase", letterSpacing: "0.05em",
    }}>
      +{quest.xp}
    </span>
  </div>
);

// ─── Mini-game widget ─────────────────────────────────────────────────────────

const MiniGameWidget: React.FC<{ game: MiniGameQuestion }> = ({ game }) => {
  const [answered, setAnswered] = useState<number | null>(null);

  return (
    <div>
      {game.context && (
        <div style={{
          fontFamily: fonts.body, fontSize: "13px", lineHeight: 1.4,
          color: colors.charcoal, opacity: 0.7,
          background: colors.cream, padding: `${space[2]} ${space[3]}`,
          borderRadius: radius.sm, marginBottom: space[3],
          fontStyle: "italic",
          border: `0.5px solid ${colors.border}`,
        }}>
          {game.context}
        </div>
      )}
      <div style={{
        fontFamily: fonts.body, fontSize: "14px", fontWeight: 500,
        color: colors.charcoal, lineHeight: 1.4, marginBottom: space[3],
      }}>
        {game.question}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: space[2] }}>
        {game.options.map((opt, i) => {
          const isCorrect = i === game.correctIndex;
          const isSelected = answered === i;
          const showResult = answered !== null;
          let bg: string = colors.cream;
          let border: string = `0.5px solid ${colors.border}`;
          let textColor: string = colors.charcoal;
          if (showResult) {
            if (isCorrect)       { bg = "#EBF5F0"; border = `1px solid ${colors.pillarResilience}`; textColor = colors.pillarResilience; }
            else if (isSelected) { bg = "#FBF0EC"; border = `1px solid ${colors.pillarArticulation}`; textColor = colors.pillarArticulation; }
          }
          return (
            <button
              key={i}
              onClick={() => { if (answered === null) setAnswered(i); }}
              disabled={answered !== null}
              style={{
                width: "100%", padding: `${space[2]} ${space[3]}`,
                textAlign: "left", background: bg, border,
                borderRadius: radius.sm, cursor: answered === null ? "pointer" : "default",
                fontFamily: fonts.body, fontSize: "13px", fontWeight: isSelected || (showResult && isCorrect) ? 500 : 400,
                color: textColor, lineHeight: 1.4, transition: "all .15s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered !== null && (
        <div style={{
          marginTop: space[3],
          padding: `${space[3]} ${space[4]}`,
          background: answered === game.correctIndex ? "#EBF5F0" : "#FBF0EC",
          border: `1px solid ${answered === game.correctIndex ? colors.pillarResilience : colors.pillarArticulation}`,
          borderRadius: radius.sm,
          fontFamily: fonts.body, fontSize: "13px", fontWeight: 400, lineHeight: 1.5,
          color: colors.charcoal,
        }}>
          {answered === game.correctIndex ? "✓ " : "Not quite — "}
          {game.explanation}
        </div>
      )}
    </div>
  );
};

// ─── StudentDashboard ─────────────────────────────────────────────────────────

interface StudentDashboardProps {
  profile?: ChildProfile;
  onLogout?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile: externalProfile,
  onLogout,
}) => {
  const [profile, setProfile]           = useState<ChildProfile>(externalProfile ?? DEMO_PROFILE);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [tipIndex, setTipIndex]          = useState(0);
  const [mgIndex]                        = useState(() => Math.floor(Math.random() * MINI_GAMES.length));
  const [quests, setQuests]              = useState<Quest[]>([
    { id: "q1", text: "Complete 1 lesson",            xp: 15, done: profile.completedLevels.length > 0 },
    { id: "q2", text: "Answer a mentor question",     xp: 10, done: false },
    { id: "q3", text: "Try the daily mini-game",      xp: 10, done: false },
    { id: "q4", text: "Explore a curious question",   xp: 5,  done: false },
  ]);

  const toggleQuest = (id: string) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, done: !q.done } : q));
  };

  const handleLevelComplete = useCallback((levelId: number, xp: number) => {
    setProfile(prev => {
      const newCompleted = prev.completedLevels.includes(levelId)
        ? prev.completedLevels
        : [...prev.completedLevels, levelId];

      const nextLevel = LEVELS.find(l => !newCompleted.includes(l.id));

      return {
        ...prev,
        completedLevels: newCompleted,
        currentLevelId: nextLevel?.id ?? prev.currentLevelId,
      };
    });
    // Mark quest 1 done
    setQuests(prev => prev.map(q => q.id === "q1" ? { ...q, done: true } : q));
  }, []);

  const activeLevel    = activeLevelId ? getLevelById(activeLevelId) : null;
  const currentLevel   = getLevelById(profile.currentLevelId);
  const era1           = ERAS[0];
  const totalXP        = Object.values(profile.xp).reduce((a, b) => a + b, 0);
  const questsDone     = quests.filter(q => q.done).length;

  const getNodeStatus = (levelId: number): "done" | "active" | "locked" => {
    if (profile.completedLevels.includes(levelId)) return "done";
    if (levelId === profile.currentLevelId)        return "active";
    return "locked";
  };

  // Chunk levels into rows of 5 for the trail display
  const levelRows: number[][] = [];
  for (let i = 0; i < era1.levels.slice(0, 15).length; i += 5) {
    levelRows.push(era1.levels.slice(i, i + 5));
  }

  // Get a pillar for a level node (fallback to 1)
  const getLevelPillar = (levelId: number): Pillar => {
    const lvl = LEVELS.find(l => l.id === levelId);
    return lvl?.pillar ?? 1;
  };

  return (
    <>
      <div style={{ minHeight: "100vh", background: colors.cream, fontFamily: fonts.body }}>

        {/* ── TOP NAV ── */}
        <nav style={{
          background: colors.teal,
          padding: `${space[3]} ${space[6]}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 100,
          boxShadow: shadow.md,
        }}>
          <div style={{
            fontFamily: fonts.display, fontSize: "22px", fontWeight: 600,
            color: colors.cream, letterSpacing: "-0.3px",
          }}>
            LearnCuriosity
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: space[4] }}>
            <span style={{
              fontFamily: fonts.body, fontSize: "14px",
              color: "rgba(251,246,236,0.8)",
            }}>
              Welcome, <strong style={{ color: colors.cream }}>{profile.nickname}</strong>
            </span>

            {/* Streak pill */}
            <div style={{
              background: "rgba(232,163,61,0.2)",
              border: `1px solid rgba(232,163,61,0.4)`,
              borderRadius: radius.full,
              padding: `${space[1]} ${space[3]}`,
              fontFamily: fonts.body, fontSize: "13px", fontWeight: 500,
              color: colors.gold,
            }}>
              🔥 {profile.streakDays} day streak
            </div>

            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: radius.full,
              background: colors.gold,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
              border: "2px solid rgba(251,246,236,0.35)",
              cursor: "pointer",
            }}>
              {profile.archetypeEmoji}
            </div>
          </div>
        </nav>

        {/* ── MAIN GRID ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 210px",
          gap: space[5],
          padding: `${space[5]} ${space[6]} ${space[8]}`,
          maxWidth: 1200, margin: "0 auto",
          alignItems: "start",
        }}>

          {/* ═══ LEFT SIDEBAR ═══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: space[4] }}>

            {/* Profile card */}
            <Card style={{ textAlign: "center", padding: `${space[5]} ${space[4]}` }}>
              <div style={{
                width: 68, height: 68, borderRadius: radius.full,
                background: colors.teal,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "28px", margin: `0 auto ${space[3]}`,
                border: `3px solid ${colors.gold}`,
              }}>
                {profile.archetypeEmoji}
              </div>
              <div style={{ fontFamily: fonts.display, fontSize: "18px", fontWeight: 600, color: colors.charcoal, marginBottom: space[1] }}>
                {profile.nickname}
              </div>
              <div style={{
                fontFamily: fonts.mono, fontSize: "10px", fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.05em",
                color: colors.teal, marginBottom: space[3],
              }}>
                {profile.archetype} · Grade {profile.gradeBand}
              </div>
              <XPBar value={totalXP % 1000} max={1000} />
              <p style={{
                fontFamily: fonts.body, fontSize: "12px", color: colors.charcoal,
                opacity: 0.55, marginTop: space[1],
              }}>
                {totalXP} XP total · Level {Math.floor(totalXP / 100) + 1}
              </p>
            </Card>

            {/* Daily Quests */}
            <Card>
              <Eyebrow>Daily Quests</Eyebrow>
              <div style={{ marginBottom: space[3] }}>
                <div style={{
                  fontFamily: fonts.body, fontSize: "12px", color: colors.charcoal, opacity: 0.55,
                  marginBottom: space[2],
                }}>
                  {questsDone} of {quests.length} complete
                </div>
                <XPBar value={questsDone} max={quests.length} />
              </div>
              {quests.map(q => (
                <QuestItem key={q.id} quest={q} onToggle={toggleQuest} />
              ))}
            </Card>

            {/* Mentor Tip */}
            <Card>
              <Eyebrow>Mentor Tip</Eyebrow>
              <div style={{
                background: colors.mentorBubble,
                borderLeft: `3px solid ${colors.teal}`,
                borderRadius: `0 ${radius.sm} ${radius.sm} 0`,
                padding: `${space[3]} ${space[4]}`,
                fontFamily: fonts.body, fontSize: "14px", fontWeight: 400,
                lineHeight: 1.5, color: colors.charcoal,
                fontStyle: "italic",
                marginBottom: space[3],
              }}>
                {TIPS[tipIndex]}
              </div>
              <button
                onClick={() => setTipIndex(i => (i + 1) % TIPS.length)}
                style={{
                  width: "100%", padding: `${space[2]} 0`,
                  background: "none",
                  border: `0.5px solid ${colors.border}`,
                  borderRadius: radius.sm,
                  fontFamily: fonts.body, fontSize: "12px", fontWeight: 400,
                  color: colors.charcoal, opacity: 0.6, cursor: "pointer",
                }}
              >
                Next tip →
              </button>
            </Card>

          </div>

          {/* ═══ MAIN ═══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: space[4] }}>

            {/* Current level hero card */}
            {currentLevel && (
              <Card
                onClick={() => setActiveLevelId(currentLevel.id)}
                style={{ border: `1.5px solid ${colors.gold}`, padding: space[5] }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: space[4] }}>
                  <div style={{ flex: 1 }}>
                    <Eyebrow>Up Next · Level {currentLevel.id}</Eyebrow>
                    <h2 style={{
                      fontFamily: fonts.display, fontSize: "22px", fontWeight: 600,
                      color: colors.charcoal, margin: `0 0 ${space[2]} 0`, lineHeight: 1.25,
                    }}>
                      {currentLevel.title}
                    </h2>
                    <p style={{
                      fontFamily: fonts.body, fontSize: "15px", fontWeight: 400,
                      lineHeight: 1.5, color: colors.charcoal, opacity: 0.65,
                      margin: `0 0 ${space[3]} 0`,
                    }}>
                      {currentLevel.summary}
                    </p>
                    <div style={{ display: "flex", gap: space[2], flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{
                        padding: `${space[1]} ${space[3]}`, borderRadius: radius.full,
                        fontFamily: fonts.body, fontSize: "12px", fontWeight: 500,
                        background: PILLAR_META[currentLevel.pillar].bgColor,
                        color:      PILLAR_META[currentLevel.pillar].color,
                        border:     `1px solid ${PILLAR_META[currentLevel.pillar].borderColor}`,
                      }}>
                        {PILLAR_META[currentLevel.pillar].name}
                      </span>
                      <span style={{
                        fontFamily: fonts.body, fontSize: "12px",
                        color: colors.charcoal, opacity: 0.5,
                      }}>
                        ~{currentLevel.minutesEstimate} min
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setActiveLevelId(currentLevel.id); }}
                    style={{
                      flexShrink: 0,
                      height: "44px", padding: "10px 20px",
                      background: colors.gold, color: colors.ctaText,
                      border: "none", borderRadius: radius.sm,
                      fontFamily: fonts.body, fontSize: "14px", fontWeight: 500,
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = colors.goldDark; }}
                    onMouseLeave={e => { e.currentTarget.style.background = colors.gold; }}
                  >
                    Play Level →
                  </button>
                </div>
              </Card>
            )}

            {/* Level Trail */}
            <Card style={{ padding: `${space[5]} ${space[5]} ${space[4]}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: space[4] }}>
                <div>
                  <Eyebrow>Era 1 · Levels 1–20</Eyebrow>
                  <h3 style={{
                    fontFamily: fonts.display, fontSize: "20px", fontWeight: 600,
                    color: colors.charcoal, margin: 0, lineHeight: 1.2,
                  }}>
                    {era1.title}
                  </h3>
                </div>
                <span style={{
                  fontFamily: fonts.mono, fontSize: "10px", fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  color: colors.gold,
                  background: "rgba(232,163,61,0.12)",
                  border: `1px solid rgba(232,163,61,0.35)`,
                  borderRadius: radius.full,
                  padding: `${space[1]} ${space[3]}`,
                }}>
                  {profile.completedLevels.length} / 20 Done
                </span>
              </div>

              {/* Trail rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: space[7] }}>
                {levelRows.map((row, rowIdx) => (
                  <div key={rowIdx} style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 0,
                  }}>
                    {row.map((levelId, i) => {
                      const status = getNodeStatus(levelId);
                      const pillar = getLevelPillar(levelId);
                      const prevDone = i > 0 && getNodeStatus(row[i - 1]) === "done";
                      return (
                        <React.Fragment key={levelId}>
                          {i > 0 && <TrailLine filled={prevDone && status !== "locked"} />}
                          <LevelNode
                            levelId={levelId}
                            status={status}
                            pillar={pillar}
                            onClick={() => setActiveLevelId(levelId)}
                          />
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: space[5], paddingTop: space[4],
                borderTop: `0.5px solid ${colors.border}`,
                fontFamily: fonts.mono, fontSize: "10px", fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.05em",
                color: colors.charcoal, opacity: 0.4, textAlign: "center",
              }}>
                Levels 16–20 unlock after Era 1 milestone
              </div>
            </Card>

          </div>

          {/* ═══ RIGHT SIDEBAR ═══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: space[4] }}>

            {/* Streak */}
            <div style={{
              background: "rgba(232,163,61,0.10)",
              border: `1px solid rgba(232,163,61,0.35)`,
              borderRadius: radius.md,
              padding: `${space[4]} ${space[5]}`,
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: fonts.display, fontSize: "36px", fontWeight: 600,
                color: colors.goldDark, lineHeight: 1,
              }}>
                🔥 {profile.streakDays}
              </div>
              <div style={{
                fontFamily: fonts.body, fontSize: "13px",
                color: colors.charcoal, opacity: 0.65, marginTop: space[1],
              }}>
                Day streak
              </div>
            </div>

            {/* Mini-game */}
            <div style={{
              background: colors.teal,
              borderRadius: radius.md,
              padding: space[5],
              boxShadow: shadow.sm,
            }}>
              <div style={{
                fontFamily: fonts.mono, fontSize: "10px", fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.05em",
                color: "rgba(232,163,61,0.9)", marginBottom: space[2],
              }}>
                Daily Mini-Game
              </div>
              <div style={{
                fontFamily: fonts.display, fontSize: "16px", fontWeight: 600,
                color: colors.cream, marginBottom: space[2],
              }}>
                The Argument Builder
              </div>
              <div style={{
                fontFamily: fonts.body, fontSize: "13px",
                color: "rgba(251,246,236,0.75)", lineHeight: 1.4, marginBottom: space[4],
              }}>
                Can you match the claim to the right reason?
              </div>
              <div style={{
                background: colors.cardBg,
                borderRadius: radius.md,
                padding: space[4],
              }}>
                <MiniGameWidget game={MINI_GAMES[mgIndex]} />
              </div>
            </div>

            {/* Pillar progress */}
            <Card>
              <Eyebrow>Your Pillars</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: space[3] }}>
                {([1, 2, 3, 4, 5] as Pillar[]).map(p => {
                  const meta = PILLAR_META[p];
                  const val  = profile.xp[p];
                  return (
                    <div key={p} style={{ display: "flex", alignItems: "center", gap: space[2] }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: radius.full,
                        background: meta.color, flexShrink: 0,
                      }} />
                      <span style={{
                        flex: 1,
                        fontFamily: fonts.body, fontSize: "12px", fontWeight: 400,
                        color: colors.charcoal,
                      }}>
                        {meta.name}
                      </span>
                      <div style={{ width: 56 }}>
                        <div style={{ background: colors.cream, borderRadius: radius.full, height: 5, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", background: meta.color,
                            borderRadius: radius.full, width: `${val}%`,
                            transition: "width 1s cubic-bezier(.4,0,.2,1)",
                          }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Parent report nudge */}
            <Card style={{ background: colors.cream, padding: `${space[3]} ${space[4]}` }}>
              <Eyebrow>Parent Report</Eyebrow>
              <p style={{
                fontFamily: fonts.body, fontSize: "13px", fontWeight: 400,
                lineHeight: 1.5, color: colors.charcoal, opacity: 0.65,
                margin: 0,
              }}>
                Session summary sent after Level 6. Your parent can review it in their dashboard.
              </p>
            </Card>

          </div>

        </div>
      </div>

      {/* ── LEVEL MODAL ── */}
      {activeLevel && (
        <LevelModal
          level={activeLevel}
          onClose={() => setActiveLevelId(null)}
          onLevelComplete={(id, xp) => {
            handleLevelComplete(id, xp);
            setActiveLevelId(null);
          }}
        />
      )}
    </>
  );
};

export default StudentDashboard;
