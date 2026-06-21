// =====================================================================
// Learn Curiosity — Grading & Report system
// Pure functions shared by the quiz, lessons, and the parent dashboard.
// No DB or framework imports here — keep it portable and testable.
// =====================================================================

/** Short pillar keys used everywhere in scoring/storage. */
export type PillarKey = "ct" | "res" | "cre" | "com" | "learn";

export interface PillarMeta {
  key: PillarKey;
  name: string;
  color: string; // hex, from theme pillar colors
}

export const PILLARS: PillarMeta[] = [
  { key: "ct", name: "Critical Thinking", color: "#5B6FA8" },
  { key: "res", name: "Resilience & Character", color: "#4F8B6E" },
  { key: "cre", name: "Creativity & Vision", color: "#8B5FA3" },
  { key: "com", name: "Communication", color: "#D9714F" },
  { key: "learn", name: "Learning How to Learn", color: "#C98A3E" },
];

export type PillarScores = Record<PillarKey, number>;

export function emptyPillars(): PillarScores {
  return { ct: 0, res: 0, cre: 0, com: 0, learn: 0 };
}

/**
 * Normalize any pillar string the codebase uses into a short key.
 * Handles short keys ("ct"), the lesson.types long form
 * ("critical-thinking"), and the lessonSchema short form ("critical").
 */
export function normalizePillar(p: string | null | undefined): PillarKey | null {
  if (!p) return null;
  const s = p.toLowerCase();
  if (s === "ct" || s.startsWith("critical")) return "ct";
  if (s === "res" || s.startsWith("resilience")) return "res";
  if (s === "cre" || s.startsWith("creativity")) return "cre";
  if (s === "com" || s.startsWith("communication")) return "com";
  if (s === "learn" || s.startsWith("learning")) return "learn";
  return null;
}

// ---------------------------------------------------------------------
// Quiz grading
// ---------------------------------------------------------------------

/** One graded quiz answer (what the quiz sends to the server). */
export interface QuizAnswer {
  q?: string;                              // question text (for the transcript)
  choice?: string;                         // chosen card label (for the transcript)
  arch?: string | null;                    // archetype token, if archetype question
  pillar?: PillarKey | PillarKey[] | null; // pillar(s) this answer scores
  score?: number;                          // 1-3 silent pillar score
  text?: string;                           // optional free-text response
}

export interface QuizGrade {
  archetype: string;
  pillars: PillarScores;
}

/**
 * Authoritative server-side grading. Sums each answer's pillar score and
 * tallies archetype tokens. Mirrors the client scorer so the stored
 * baseline can't be tampered with from the browser.
 */
export function gradeQuiz(answers: QuizAnswer[]): QuizGrade {
  const tally: Record<string, number> = {};
  const pillars = emptyPillars();

  for (const a of answers) {
    if (a.arch) tally[a.arch] = (tally[a.arch] ?? 0) + 1;
    if (a.pillar && a.score) {
      const keys = Array.isArray(a.pillar) ? a.pillar : [a.pillar];
      for (const k of keys) {
        const nk = normalizePillar(k);
        if (nk) pillars[nk] += a.score;
      }
    }
  }

  let archetype = "explorer";
  let best = -1;
  for (const k of Object.keys(tally)) {
    if (tally[k] > best) {
      best = tally[k];
      archetype = k;
    }
  }
  return { archetype, pillars };
}

// ---------------------------------------------------------------------
// Lesson grading — how much a finished lesson moves its pillar
// ---------------------------------------------------------------------

/**
 * Points a completed lesson adds to its primary pillar. Engagement-based:
 * a child who actually talked with the mentor earns more than a flythrough.
 * userTurns = number of child messages in the session.
 */
export function lessonPillarGain(userTurns: number): number {
  if (userTurns >= 4) return 3;
  if (userTurns >= 2) return 2;
  return 1;
}

// ---------------------------------------------------------------------
// Report building — baseline + growth, with parent-facing labels
// ---------------------------------------------------------------------

export type PillarLabel =
  | "Not yet measured"
  | "Just Getting Started"
  | "Building Nicely"
  | "Thinking Deeply"
  | "Ready to Lead";

export function pillarLabel(v: number): { label: PillarLabel; fill: number } {
  if (v >= 9) return { label: "Ready to Lead", fill: 1 };
  if (v >= 7) return { label: "Thinking Deeply", fill: 0.82 };
  if (v >= 4) return { label: "Building Nicely", fill: 0.55 };
  if (v >= 1) return { label: "Just Getting Started", fill: 0.28 };
  return { label: "Not yet measured", fill: 0.06 };
}

export interface PillarReportRow {
  key: PillarKey;
  name: string;
  color: string;
  baseline: number;   // from the quiz
  current: number;    // baseline + lesson gains
  gain: number;       // current - baseline
  label: PillarLabel;
  fillPct: number;    // 0-100, current
  basePct: number;    // 0-100, baseline marker
}

/**
 * Combine the quiz baseline with per-pillar lesson gains into the
 * parent-facing report. This is the longitudinal "proof of learning."
 */
export function buildPillarReport(
  baseline: PillarScores,
  gains: PillarScores
): PillarReportRow[] {
  return PILLARS.map((p) => {
    const base = baseline[p.key] || 0;
    const cur = base + (gains[p.key] || 0);
    const scale = Math.max(12, cur + 1); // keep bars readable as scores grow
    return {
      key: p.key,
      name: p.name,
      color: p.color,
      baseline: base,
      current: cur,
      gain: cur - base,
      label: pillarLabel(cur).label,
      fillPct: Math.min(100, Math.round((cur / scale) * 100)),
      basePct: Math.min(100, Math.round((base / scale) * 100)),
    };
  });
}

// ---------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------

export function fmtDuration(ms: number): string {
  const m = Math.round(ms / 60000);
  if (m < 1) return "<1 min";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function fmtRelative(ts: number): string {
  const days = Math.round((Date.now() - ts) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(ts).toLocaleDateString();
}
