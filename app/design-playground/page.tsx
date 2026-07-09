"use client";
// Dev review route: the entire Stage 1 child UI kit, every component in every
// state, on one phone-scrollable page. Not linked from any child or parent
// surface; noindex via layout metadata.

import { useState } from "react";
import {
  MentorAvatar,
  MentorPresence,
  MicButton,
  type MicState,
  TranscriptBubble,
  TranscriptColumn,
  ChildButton,
  ChildCard,
  CelebrateQuiet,
  EraAtmosphere,
  soundEnabled,
  setSoundEnabled,
  playPageTurn,
  playPop,
  playMicWarm,
} from "@/app/components/child-kit";

const MENTORS = [
  { id: "luna", name: "Luna", emoji: "🔬" },
  { id: "rex", name: "Rex", emoji: "🧭" },
  { id: "sage", name: "Sage", emoji: "🦉" },
];

const PILLARS = [
  { name: "Critical Thinking", color: "#5B6FA8" },
  { name: "Resilience", color: "#4F8B6E" },
  { name: "Creativity", color: "#8B5FA3" },
  { name: "Articulation", color: "#D9714F" },
  { name: "Learning to Learn", color: "#C98A3E" },
];

const ERAS: { n: 1 | 2 | 3 | 4 | 5; title: string; note?: string }[] = [
  { n: 1, title: "Ancient Wonders" },
  { n: 2, title: "The Age of Explorers" },
  { n: 3, title: "The Industrial Age" },
  { n: 4, title: "Era 4", note: "reserved — flight" },
  { n: 5, title: "Era 5", note: "reserved — space age" },
];

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <h2
        style={{
          fontFamily: "var(--font-serif, Georgia, serif)", fontSize: 22, fontWeight: 600,
          color: "var(--color-charcoal)", marginBottom: 4,
        }}
      >
        {title}
      </h2>
      {note && (
        <p style={{ fontSize: 13, color: "var(--color-charcoal)", opacity: 0.6, marginBottom: 14 }}>{note}</p>
      )}
      <div style={{ marginTop: note ? 0 : 14 }}>{children}</div>
    </section>
  );
}

export default function DesignPlaygroundPage() {
  const [micState, setMicState] = useState<MicState>("idle");
  const [entranceKey, setEntranceKey] = useState(0);
  const [panel, setPanel] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [presence, setPresence] = useState(false);
  const [sound, setSound] = useState(() => soundEnabled());

  return (
    <main
      style={{
        maxWidth: 560, margin: "0 auto", padding: "28px 20px 140px",
        background: "var(--color-cream)", minHeight: "100vh",
      }}
    >
      <header style={{ marginBottom: 36 }}>
        <p style={{ fontFamily: "var(--font-mono-brand, monospace)", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--color-teal)" }}>
          Stage 1 · Design Playground
        </p>
        <h1 style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: 30, fontWeight: 600, color: "var(--color-charcoal)", margin: "6px 0" }}>
          The Child UI Kit
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-charcoal)", opacity: 0.65, lineHeight: 1.5 }}>
          Same tokens, child temperature. Rule: any child screen uses cream + charcoal + one accent.
          Motion respects reduced-motion. No spinners, no confetti, no reward sounds.
        </p>
      </header>

      {/* ── Motion primitives ── */}
      <Section title="Motion primitives" note="gentle-entrance · breathing · panel cross-fade · card-lift · celebrate-quiet">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ChildCard key={entranceKey} entering>
            <strong>gentle-entrance</strong>
            <p style={{ fontSize: 15, opacity: 0.7, margin: "4px 0 10px" }}>Settles in with a soft spring — never over 1.02 scale.</p>
            <ChildButton variant="secondary" onClick={() => setEntranceKey((k) => k + 1)}>Replay</ChildButton>
          </ChildCard>

          <ChildCard>
            <strong>breathing</strong>
            <p style={{ fontSize: 15, opacity: 0.7, margin: "4px 0 12px" }}>4s cycle — idle mentor + current landmark glow.</p>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div className="ck-breathing" style={{ width: 56, height: 56, borderRadius: 999, background: "var(--color-teal)", display: "grid", placeItems: "center", color: "#fff", fontSize: 24 }}>🦉</div>
              <div className="ck-glow" style={{ width: 56, height: 56, borderRadius: 999, background: "var(--color-gold)", display: "grid", placeItems: "center", fontSize: 24 }}>⛰️</div>
            </div>
          </ChildCard>

          <ChildCard>
            <strong>story-panel-cross-fade</strong>
            <p style={{ fontSize: 15, opacity: 0.7, margin: "4px 0 12px" }}>Panels change like slow cinema — 800ms.</p>
            <div style={{ position: "relative", height: 96, borderRadius: 18, overflow: "hidden" }}>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="ck-crossfade"
                  style={{
                    position: "absolute", inset: 0, display: "grid", placeItems: "center",
                    fontFamily: "var(--font-serif, serif)", fontSize: 19, color: "#fff",
                    background: i === 0 ? "linear-gradient(120deg,#1B6E6B,#14524F)" : "linear-gradient(120deg,#8A6B3F,#6b5230)",
                    opacity: panel === i ? 1 : 0,
                  }}
                >
                  {i === 0 ? "The harbor at dawn…" : "…and the storm that followed."}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <ChildButton variant="secondary" onClick={() => { setPanel((p) => 1 - p); playPageTurn(); }}>
                Next panel
              </ChildButton>
            </div>
          </ChildCard>

          <ChildCard onPress={() => playPop()}>
            <strong>card-lift</strong>
            <p style={{ fontSize: 15, opacity: 0.7, margin: "4px 0 0" }}>Press and hold me — 4px lift with shadow, satisfying release (plus the gentle pop).</p>
          </ChildCard>

          <ChildCard>
            <strong>celebrate-quiet</strong>
            <p style={{ fontSize: 15, opacity: 0.7, margin: "4px 0 10px" }}>The only completion animation: a warm glow + the mentor&rsquo;s line.</p>
            <ChildButton onClick={() => setCelebrating(true)}>Finish a story</ChildButton>
          </ChildCard>
        </div>
      </Section>

      {/* ── Mentor avatar ── */}
      <Section title="Mentor avatar" note="Idle breathes · thinking replaces every spinner · speaking glows · errors speak plainly">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <ChildCard>
            <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 14 }}>idle · one avatar per mentor</p>
            <div style={{ display: "flex", gap: 22, justifyContent: "center" }}>
              {MENTORS.map((m) => (
                <div key={m.id} style={{ textAlign: "center" }}>
                  <MentorAvatar emoji={m.emoji} name={m.name} state="idle" size="md" />
                  <p style={{ fontSize: 13, marginTop: 6, opacity: 0.7 }}>{m.name}</p>
                </div>
              ))}
            </div>
          </ChildCard>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <ChildCard>
              <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 12 }}>thinking (= loading)</p>
              <MentorAvatar emoji="🔬" name="Luna" state="thinking" size="md" />
            </ChildCard>
            <ChildCard>
              <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 12 }}>speaking (TTS glow)</p>
              <MentorAvatar emoji="🔬" name="Luna" state="speaking" size="md" />
            </ChildCard>
          </div>
          <ChildCard>
            <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 12 }}>error — spoken plainly, tap to recover</p>
            <MentorAvatar emoji="🧭" name="Rex" state="error" size="md" onRetry={() => {}} />
          </ChildCard>
          <ChildCard>
            <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 10 }}>persistent presence (bottom corner of every child screen)</p>
            <ChildButton variant="secondary" onClick={() => setPresence((p) => !p)}>
              {presence ? "Hide" : "Show"} corner presence
            </ChildButton>
          </ChildCard>
        </div>
      </Section>

      {/* ── Mic button ── */}
      <Section title="Mic button — the hero" note="idle → listening → thinking → speaking. Warm tone plays when listening starts.">
        <ChildCard>
          <div style={{ display: "grid", placeItems: "center", padding: "10px 0 18px" }}>
            <MicButton
              state={micState}
              onPress={() => setMicState(micState === "idle" ? "listening" : "idle")}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {(["idle", "listening", "thinking", "speaking"] as MicState[]).map((s) => (
              <button
                key={s}
                onClick={() => setMicState(s)}
                style={{
                  padding: "8px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
                  border: `2px solid ${micState === s ? "var(--color-teal)" : "var(--color-cream-border)"}`,
                  background: micState === s ? "var(--color-bubble)" : "#fff",
                  color: "var(--color-charcoal)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </ChildCard>
      </Section>

      {/* ── Transcript bubbles ── */}
      <Section title="Transcript bubbles" note="Mentor left in cream-on-teal-tint · child right in gold-tint · 18px body">
        <ChildCard>
          <TranscriptColumn>
            <TranscriptBubble role="mentor" who="Luna">
              If the whole crew is scared of the strait, what would make a good captain keep going anyway?
            </TranscriptBubble>
            <TranscriptBubble role="child" who="Mia">
              Because he promised the king! And maybe the scary part is short.
            </TranscriptBubble>
            <TranscriptBubble role="mentor" who="Luna" entering>
              Ooh — &ldquo;maybe the scary part is short.&rdquo; How could he find that out without risking every ship?
            </TranscriptBubble>
          </TranscriptColumn>
        </ChildCard>
      </Section>

      {/* ── Buttons ── */}
      <Section title="Buttons" note="Min 56px tap targets, 18px labels">
        <ChildCard>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <ChildButton onClick={() => playPop()}>Primary — Start the story</ChildButton>
            <ChildButton variant="secondary">Secondary — Tell me more</ChildButton>
            <ChildButton variant="quiet">Quiet — not right now</ChildButton>
            <ChildButton disabled>Disabled — play the game first</ChildButton>
          </div>
        </ChildCard>
      </Section>

      {/* ── Cards + pillar accents ── */}
      <Section title="Cards & the one-accent rule" note="Each screen gets ONE accent — the active pillar's or era's. All five shown here for review only.">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PILLARS.map((p) => (
            <ChildCard key={p.name} accent={p.color} onPress={() => playPop()}>
              <span style={{ fontFamily: "var(--font-mono-brand, monospace)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.color }}>
                {p.name}
              </span>
              <p style={{ fontSize: 17, marginTop: 4 }}>A tappable story card with the pillar accent stripe.</p>
            </ChildCard>
          ))}
        </div>
      </Section>

      {/* ── Era atmospheres ── */}
      <Section title="Era atmospheres" note="Tinted sky + era motif at 8% opacity. Atmosphere, not decoration.">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ERAS.map((e) => (
            <EraAtmosphere key={e.n} era={e.n} className="ck-card" >
              <div style={{ minHeight: 96, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <span style={{ fontFamily: "var(--font-serif, serif)", fontSize: 20, fontWeight: 600, color: "var(--color-charcoal)" }}>
                  Era {e.n} — {e.title}
                </span>
                {e.note && <span style={{ fontSize: 12, opacity: 0.55 }}>{e.note}</span>}
              </div>
            </EraAtmosphere>
          ))}
        </div>
      </Section>

      {/* ── Sound ── */}
      <Section title="Sound" note="Three of five slots used, all <400ms, none for rewards. Default ON child / OFF parent.">
        <ChildCard>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16 }}>
              <input
                type="checkbox"
                checked={sound}
                onChange={(e) => { setSound(e.target.checked); setSoundEnabled(e.target.checked); }}
                style={{ width: 22, height: 22 }}
              />
              Child sounds {sound ? "on" : "off"} (parent-toggleable)
            </label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <ChildButton variant="secondary" onClick={playPageTurn}>Page-turn</ChildButton>
              <ChildButton variant="secondary" onClick={playPop}>Gentle pop</ChildButton>
              <ChildButton variant="secondary" onClick={playMicWarm}>Mic warm tone</ChildButton>
            </div>
          </div>
        </ChildCard>
      </Section>

      {celebrating && (
        <CelebrateQuiet
          line="You asked the question the philosophers were afraid of."
          mentorEmoji="🔬"
          onDone={() => setCelebrating(false)}
        />
      )}
      {presence && <MentorPresence emoji="🦉" name="Sage" state="idle" />}
    </main>
  );
}
