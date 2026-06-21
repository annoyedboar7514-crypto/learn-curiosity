// Learn Curiosity — Level Modal
// The full lesson experience: Video → Decision → Mentor Chat → Complete
// Opened from StudentDashboard when the child taps a level node.

"use client";

import React, { useState, useEffect } from "react";
import { colors, fonts, space, radius, shadow } from "@/lib/theme";
import { MentorChat, type ChatMessage } from "@/app/components/MentorChat";
import { type Level, PILLAR_META } from "@/lib/content/levels";

// ─── Phase types ──────────────────────────────────────────────────────────────

type Phase = "video" | "decision" | "mentor" | "complete";

// ─── Props ────────────────────────────────────────────────────────────────────

interface LevelModalProps {
  level: Level;
  onClose: () => void;
  onLevelComplete: (levelId: number, xp: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    fontFamily: fonts.mono, fontSize: "11px", fontWeight: 500,
    lineHeight: 1.2, letterSpacing: "0.05em", textTransform: "uppercase",
    color: colors.teal, margin: `0 0 ${space[2]} 0`,
  }}>
    {children}
  </p>
);

// ─── Phase: Video / Story ─────────────────────────────────────────────────────
// In prod, swap the placeholder for an actual <video> element.

const VideoPhase: React.FC<{
  level: Level;
  onStoryRead: () => void;
}> = ({ level, onStoryRead }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      {/* Video placeholder */}
      <div
        onClick={() => setPlaying(true)}
        style={{
          background: "#0a1a1e",
          aspectRatio: "16/9",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: space[3],
          cursor: playing ? "default" : "pointer",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Starfield */}
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(i * 37 + 11) % 100}%`,
            top:  `${(i * 53 + 7)  % 100}%`,
            width: 2, height: 2,
            background: "#fff",
            borderRadius: radius.full,
            opacity: 0.3 + (i % 5) * 0.14,
          }} />
        ))}

        {!playing ? (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: radius.full,
              background: "rgba(232,163,61,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px", zIndex: 1,
              boxShadow: "0 0 32px rgba(232,163,61,0.4)",
            }}>
              ▶
            </div>
            <div style={{
              fontFamily: fonts.display, fontSize: "16px", fontWeight: 600,
              color: colors.cream, zIndex: 1, textAlign: "center", padding: `0 ${space[7]}`,
            }}>
              {level.title}
            </div>
            <div style={{
              fontFamily: fonts.body, fontSize: "13px",
              color: "rgba(251,246,236,0.55)", zIndex: 1,
            }}>
              Tap to begin · ~{level.minutesEstimate} min
            </div>
          </>
        ) : (
          <div style={{
            fontFamily: fonts.body, fontSize: "14px",
            color: "rgba(251,246,236,0.6)", zIndex: 1,
          }}>
            📺  Video playing… (wire up real &lt;video&gt; here)
          </div>
        )}
      </div>

      {/* Story text */}
      <div style={{ padding: `${space[5]} ${space[6]}`, background: colors.cream }}>
        <Eyebrow>The Story</Eyebrow>
        <div style={{
          fontFamily: fonts.body, fontSize: "16px", fontWeight: 400,
          lineHeight: 1.7, color: colors.charcoal, whiteSpace: "pre-line",
        }}>
          {level.storyText}
        </div>
      </div>

      {/* Cliffhanger bar */}
      <div style={{
        background: colors.charcoal,
        padding: `${space[3]} ${space[6]}`,
        display: "flex", alignItems: "center", gap: space[3],
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: radius.full,
          background: colors.gold,
          boxShadow: `0 0 6px ${colors.gold}`,
          animation: "lc-pulse 1s infinite",
        }} />
        <style>{`@keyframes lc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.8)} }`}</style>
        <span style={{
          fontFamily: fonts.mono, fontSize: "11px", fontWeight: 500,
          color: colors.gold, textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          Cliffhanger
        </span>
        <span style={{
          fontFamily: fonts.body, fontSize: "14px",
          color: "rgba(251,246,236,0.75)", lineHeight: 1.4,
        }}>
          {level.cliffhanger}
        </span>
      </div>

      {/* CTA */}
      <div style={{ padding: `${space[5]} ${space[6]}`, background: colors.cream }}>
        <button
          onClick={onStoryRead}
          style={{
            width: "100%", height: "44px",
            background: colors.teal, color: colors.cream,
            border: "none", borderRadius: radius.sm,
            fontFamily: fonts.body, fontSize: "14px", fontWeight: 500,
            cursor: "pointer",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = colors.tealDark; }}
          onMouseLeave={e => { e.currentTarget.style.background = colors.teal; }}
        >
          Make the decision →
        </button>
      </div>
    </div>
  );
};

// ─── Phase: Decision ──────────────────────────────────────────────────────────

const DecisionPhase: React.FC<{
  level: Level;
  onChoose: (choiceId: string) => void;
}> = ({ level, onChoose }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ padding: `${space[5]} ${space[6]}` }}>
      {/* Mentor intro */}
      <div style={{
        display: "flex", alignItems: "center", gap: space[3],
        padding: `${space[3]} ${space[4]}`,
        background: colors.mentorBubble,
        borderRadius: radius.md,
        marginBottom: space[5],
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: radius.full,
          background: colors.teal, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: "20px", flexShrink: 0,
          border: `2px solid ${colors.gold}`,
        }}>
          {level.mentorEmoji}
        </div>
        <div>
          <div style={{ fontFamily: fonts.display, fontSize: "14px", fontWeight: 600, color: colors.teal }}>
            {level.mentorName} appears
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: "13px", color: colors.charcoal, opacity: 0.65 }}>
            Your Mentor · {PILLAR_META[level.pillar].name}
          </div>
        </div>
      </div>

      <Eyebrow>Your choice</Eyebrow>
      <h3 style={{
        fontFamily: fonts.display, fontSize: "20px", fontWeight: 600,
        color: colors.charcoal, lineHeight: 1.35,
        margin: `0 0 ${space[5]} 0`,
      }}>
        {level.decisionQuestion}
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: space[2] }}>
        {level.choices.map(choice => {
          const isSelected = selected === choice.id;
          return (
            <button
              key={choice.id}
              onClick={() => setSelected(choice.id)}
              style={{
                width: "100%", padding: `${space[3]} ${space[4]}`,
                textAlign: "left",
                background: isSelected ? colors.mentorBubble : colors.cream,
                border: `${isSelected ? "1.5" : "0.5"}px solid ${isSelected ? colors.teal : colors.border}`,
                borderRadius: radius.md,
                fontFamily: fonts.body, fontSize: "15px", fontWeight: isSelected ? 500 : 400,
                color: isSelected ? colors.teal : colors.charcoal,
                cursor: "pointer", lineHeight: 1.4,
                transition: "all .15s",
                display: "flex", gap: space[3], alignItems: "flex-start",
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: radius.full, flexShrink: 0,
                border: `1.5px solid ${isSelected ? colors.teal : colors.border}`,
                background: isSelected ? colors.teal : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: 1,
                transition: "all .15s",
              }}>
                {isSelected && <div style={{ width: 8, height: 8, borderRadius: radius.full, background: colors.cream }} />}
              </div>
              <span>{choice.text}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => { if (selected) onChoose(selected); }}
        disabled={!selected}
        style={{
          marginTop: space[5],
          width: "100%", height: "44px",
          background: selected ? colors.gold : colors.border,
          color: selected ? colors.ctaText : colors.charcoal,
          border: "none", borderRadius: radius.sm,
          fontFamily: fonts.body, fontSize: "14px", fontWeight: 500,
          cursor: selected ? "pointer" : "not-allowed",
          transition: "background .15s",
        }}
        onMouseEnter={e => { if (selected) e.currentTarget.style.background = colors.goldDark; }}
        onMouseLeave={e => { if (selected) e.currentTarget.style.background = colors.gold; }}
      >
        {selected ? "See what happens →" : "Choose an option first"}
      </button>
    </div>
  );
};

// ─── Phase: Complete ──────────────────────────────────────────────────────────

const CompletePhase: React.FC<{
  level: Level;
  onClose: () => void;
}> = ({ level, onClose }) => {
  const pillar = PILLAR_META[level.pillar];
  const bonusPillar = level.bonusPillar ? PILLAR_META[level.bonusPillar] : null;

  return (
    <div style={{ padding: `${space[7]} ${space[6]}`, textAlign: "center" }}>
      <div style={{
        width: 72, height: 72, borderRadius: radius.full,
        background: colors.mentorBubble,
        border: `2px solid ${colors.teal}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: `0 auto ${space[5]}`,
        fontSize: "28px",
      }}>
        ⭐
      </div>

      <h2 style={{
        fontFamily: fonts.display, fontSize: "28px", fontWeight: 600,
        color: colors.charcoal, margin: `0 0 ${space[3]} 0`,
      }}>
        Level {level.id} Complete!
      </h2>

      <p style={{
        fontFamily: fonts.body, fontSize: "16px", fontWeight: 400,
        lineHeight: 1.5, color: colors.charcoal, opacity: 0.7,
        margin: `0 0 ${space[5]} 0`,
      }}>
        You finished <strong style={{ opacity: 1 }}>{level.title}</strong>. Your thinking will be remembered.
      </p>

      {/* XP badges */}
      <div style={{ display: "flex", gap: space[2], justifyContent: "center", flexWrap: "wrap", marginBottom: space[5] }}>
        <span style={{
          padding: `${space[1]} ${space[3]}`, borderRadius: radius.full,
          fontFamily: fonts.body, fontSize: "12px", fontWeight: 500,
          background: pillar.bgColor, color: pillar.color,
          border: `1px solid ${pillar.borderColor}`,
        }}>
          {pillar.name} +{level.xpReward.pillar} XP
        </span>
        {bonusPillar && level.xpReward.bonus && (
          <span style={{
            padding: `${space[1]} ${space[3]}`, borderRadius: radius.full,
            fontFamily: fonts.body, fontSize: "12px", fontWeight: 500,
            background: bonusPillar.bgColor, color: bonusPillar.color,
            border: `1px solid ${bonusPillar.borderColor}`,
          }}>
            {bonusPillar.name} +{level.xpReward.bonus} XP
          </span>
        )}
      </div>

      {/* Mentor session note (parent-facing copy) */}
      <div style={{
        background: colors.mentorBubble,
        borderRadius: radius.md,
        padding: `${space[4]} ${space[5]}`,
        marginBottom: space[5],
        textAlign: "left",
      }}>
        <div style={{
          fontFamily: fonts.mono, fontSize: "10px", fontWeight: 500,
          textTransform: "uppercase", letterSpacing: "0.05em",
          color: colors.teal, marginBottom: space[2],
        }}>
          {level.mentorName}'s note to your parent
        </div>
        <div style={{
          fontFamily: fonts.body, fontSize: "14px", fontWeight: 400,
          lineHeight: 1.5, color: colors.charcoal,
        }}>
          "Strong reasoning shown today — connected the character's fear to social consequence rather
          than factual uncertainty. That's a Pillar {level.pillar} insight. Session complete."
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          width: "100%", height: "44px",
          background: colors.teal, color: colors.cream,
          border: "none", borderRadius: radius.sm,
          fontFamily: fonts.body, fontSize: "14px", fontWeight: 500,
          cursor: "pointer",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = colors.tealDark; }}
        onMouseLeave={e => { e.currentTarget.style.background = colors.teal; }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

// ─── Phase progress bar ───────────────────────────────────────────────────────

const PHASE_LABELS: Record<Phase, string> = {
  video:    "Story",
  decision: "Your Choice",
  mentor:   "Mentor Chat",
  complete: "Complete",
};
const PHASE_ORDER: Phase[] = ["video", "decision", "mentor", "complete"];

const PhaseBar: React.FC<{ current: Phase }> = ({ current }) => {
  const idx = PHASE_ORDER.indexOf(current);
  return (
    <div style={{ display: "flex", gap: 0 }}>
      {PHASE_ORDER.map((p, i) => {
        const done   = i < idx;
        const active = i === idx;
        return (
          <div key={p} style={{
            flex: 1, height: 3,
            background: done ? colors.teal : active ? colors.gold : colors.border,
            transition: "background .3s",
          }} />
        );
      })}
    </div>
  );
};

// ─── LevelModal ───────────────────────────────────────────────────────────────

export const LevelModal: React.FC<LevelModalProps> = ({ level, onClose, onLevelComplete }) => {
  const [phase, setPhase] = useState<Phase>("video");

  const totalXP = level.xpReward.pillar + (level.xpReward.bonus ?? 0);

  const handleChatComplete = (_transcript: ChatMessage[]) => {
    setPhase("complete");
    onLevelComplete(level.id, totalXP);
  };

  // Trap focus / close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(35,49,55,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: space[4],
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: colors.cardBg,
        borderRadius: radius.lg,
        width: "100%", maxWidth: 620,
        maxHeight: "90vh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: shadow.lg,
      }}>
        {/* Header */}
        <div style={{
          background: colors.teal,
          padding: `${space[4]} ${space[5]}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: fonts.mono, fontSize: "10px", fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.05em",
              color: "rgba(232,163,61,0.9)", marginBottom: space[1],
            }}>
              Level {level.id} · {PHASE_LABELS[phase]}
            </div>
            <div style={{
              fontFamily: fonts.display, fontSize: "18px", fontWeight: 600,
              color: colors.cream, lineHeight: 1.2,
            }}>
              {level.title}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none",
              color: colors.cream, fontSize: "20px",
              cursor: "pointer", opacity: 0.7, padding: `${space[1]} ${space[2]}`,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Phase progress bar */}
        <div style={{ flexShrink: 0 }}>
          <PhaseBar current={phase} />
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {phase === "video" && (
            <VideoPhase level={level} onStoryRead={() => setPhase("decision")} />
          )}
          {phase === "decision" && (
            <DecisionPhase level={level} onChoose={() => setPhase("mentor")} />
          )}
          {phase === "mentor" && (
            <MentorChat
              mentorName={level.mentorName}
              mentorEmoji={level.mentorEmoji}
              pillarName={PILLAR_META[level.pillar].name}
              levelTitle={level.title}
              openerMessage={level.mentorOpener}
              followUpQuestions={level.mentorFollowUps}
              onComplete={handleChatComplete}
              minChildMessages={2}
            />
          )}
          {phase === "complete" && (
            <CompletePhase level={level} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelModal;
