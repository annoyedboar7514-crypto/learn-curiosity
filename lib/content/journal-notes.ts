// Mentor "handwritten" notes for the Curiosity Journal — the short warm line
// written beneath the child's own quote. Human-authored; keyed by pillar with
// a couple of variants each, picked deterministically per lesson so a page's
// note never changes between visits. No praise-for-being-right — the notes
// honor the *thinking*, per the five-pillar pedagogy.

const NOTES: Record<string, string[]> = {
  critical: [
    "You didn't just answer — you gave a reason. That's what thinking out loud looks like.",
    "You spotted the part of the problem everyone else walks past.",
  ],
  resilience: [
    "You chose something hard and stood by it. I noticed.",
    "This answer took courage to say. Keep saying things like it.",
  ],
  creativity: [
    "Nobody told you to imagine it that way. You just did.",
    "You made a door where the story only showed a wall.",
  ],
  communication: [
    "You said exactly what you meant. That's rarer than you think.",
    "I understood you perfectly — that's your doing, not mine.",
  ],
  learning: [
    "You noticed your own thinking changing. That's the biggest trick there is.",
    "You connected two things nobody said were connected.",
  ],
};

const FALLBACK = [
  "I keep thinking about this answer of yours.",
  "This one belongs in the journal. That's why it's here.",
];

export function getJournalNote(pillar: string | undefined, lessonKey: string | number): string {
  const pool = (pillar && NOTES[pillar]) || FALLBACK;
  const n = typeof lessonKey === "number" ? lessonKey : lessonKey.length + lessonKey.charCodeAt(0);
  return pool[n % pool.length];
}
