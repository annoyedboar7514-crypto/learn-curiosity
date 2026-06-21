// Learn Curiosity — Level & Era Data
// Add new eras here — dashboard reads this file directly

export type GradeBand = "K-2" | "3-4" | "5-6";
export type Pillar = 1 | 2 | 3 | 4 | 5;
export type LevelStatus = "done" | "active" | "locked";

export interface Choice {
  id: string;
  text: string;
}

export interface Level {
  id: number;
  title: string;
  summary: string;         // 1-2 sentence teaser shown on dashboard card
  storyText: string;       // shown after "video" starts
  cliffhanger: string;     // mentor intro line before decision
  decisionQuestion: string;
  choices: Choice[];
  consequence: string;     // shown after child picks — sets up mentor chat
  mentorName: string;
  mentorEmoji: string;
  mentorOpener: string;    // first message mentor sends
  mentorFollowUps: string[];
  pillar: Pillar;
  minutesEstimate: number;
  xpReward: { pillar: number; bonus?: number };
  bonusPillar?: Pillar;
}

export interface Era {
  id: number;
  title: string;
  subtitle: string;
  levels: number[];        // level IDs in this era
  unlockAfterLevel?: number;
}

// ─── Eras ────────────────────────────────────────────────────────────────────

export const ERAS: Era[] = [
  {
    id: 1,
    title: "Ancient Wonders",
    subtitle: "Alexandria · Athens · The Nile",
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
  {
    id: 2,
    title: "The Age of Explorers",
    subtitle: "The Ocean Road · New Worlds · Uncharted Maps",
    levels: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    unlockAfterLevel: 20,
  },
  {
    id: 3,
    title: "The Industrial Age",
    subtitle: "Steam · Steel · The Factory Floor",
    levels: Array.from({ length: 20 }, (_, i) => 41 + i),
    unlockAfterLevel: 40,
  },
];

// ─── Levels ───────────────────────────────────────────────────────────────────

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "The First Question",
    summary: "A young philosopher asks why the sky is blue — and no one in Athens will give a straight answer.",
    storyText: `Athens, 430 BCE. Twelve-year-old Lyra sits in the agora while the philosophers argue. She raises her hand. "But why does the sky look blue?" she asks. The philosophers stop. They look at each other. One of them laughs. "Because that is its nature," he says. The others nod.\n\nBut Lyra doesn't nod. She wants to know what nature actually means — and why no one will explain it properly.`,
    cliffhanger: "The philosophers are about to dismiss Lyra completely. But she has one more question she could ask — or she could walk away and figure it out herself.",
    decisionQuestion: "What should Lyra do?",
    choices: [
      { id: "A", text: "Push back: ask the philosopher what he means by 'nature.'" },
      { id: "B", text: "Stay quiet — she doesn't want to seem rude to adults." },
      { id: "C", text: "Leave and go try to find the answer herself." },
    ],
    consequence: "Lyra pushed back. The philosopher sputtered — and then, actually, answered. It wasn't a great answer. But it was a real one.",
    mentorName: "Orion",
    mentorEmoji: "🔭",
    mentorOpener: "Lyra kept asking even when people wanted her to stop. What do you think made her do that — and have you ever been in a situation like hers?",
    mentorFollowUps: [
      "That's a real thing — asking questions can feel risky. Why do you think adults sometimes react badly when kids push back?",
      "Here's something to sit with: was the philosopher being mean, or was he just used to no one questioning him? Does it matter which one it was?",
    ],
    pillar: 1,
    minutesEstimate: 18,
    xpReward: { pillar: 12 },
  },
  {
    id: 2,
    title: "The Weight of Bread",
    summary: "There's not enough food for everyone in a siege. A baker's assistant has to decide who gets the last loaf.",
    storyText: `Rhodes, 305 BCE. The city has been under siege for two months. Mira works in the last bakery still producing bread. Today there is only enough flour for one more loaf — and there are four people waiting.\n\nAn old soldier who has been fighting for weeks. A mother with a young child. A merchant who says he can pay double. A city official who says the loaf should go to whoever the city needs most.\n\nMira's hands are covered in flour. The oven is hot. Everyone is staring at her.`,
    cliffhanger: "Mira has to decide. The merchant is waving coins. The official is raising his voice. The mother is just watching — saying nothing.",
    decisionQuestion: "What should Mira do with the last loaf?",
    choices: [
      { id: "A", text: "Give it to the mother and child — they need it most." },
      { id: "B", text: "Give it to the soldier — he's protecting everyone." },
      { id: "C", text: "Divide it four ways — a little for everyone." },
      { id: "D", text: "Ask them all to decide together." },
    ],
    consequence: "Mira divided the loaf. It wasn't enough for anyone to feel full. But no one could say the decision was unfair.",
    mentorName: "Orion",
    mentorEmoji: "🔭",
    mentorOpener: "There was no perfect answer there. Mira had to choose, and every choice left someone with less. Does a decision being fair mean everyone gets the same — or does it mean something else?",
    mentorFollowUps: [
      "What's the difference between fair and equal? Can something be one and not the other?",
      "If you were the merchant, would you feel like Mira's decision was right? What about if you were the soldier?",
    ],
    pillar: 1,
    minutesEstimate: 20,
    xpReward: { pillar: 14 },
    bonusPillar: 4,
  },
  {
    id: 3,
    title: "The River Riddle",
    summary: "An engineer needs to measure the width of the Nile without crossing it. Everyone says it's impossible.",
    storyText: `Nile Delta, 280 BCE. Dayo is a young engineering apprentice. The great canal project needs exact measurements — but the river is swollen and dangerous to cross. His master says it can't be done without crossing.\n\nBut Dayo has been thinking about shadows, angles, and sticks in the ground. He thinks there might be a way. Nobody has shown him this method. He invented it himself, in his head, last night.`,
    cliffhanger: "Dayo could try his idea — or he could wait and follow his master's orders. His master is leaving at dawn.",
    decisionQuestion: "What should Dayo do?",
    choices: [
      { id: "A", text: "Try his method now, before his master leaves." },
      { id: "B", text: "Tell his master about the idea first, and ask permission." },
      { id: "C", text: "Wait — if it's wrong, he'll look foolish." },
    ],
    consequence: "Dayo told his master. The master looked at the idea for a long time. Then he said: 'Do it.'",
    mentorName: "Orion",
    mentorEmoji: "🔭",
    mentorOpener: "Dayo invented something completely on his own — just by thinking. What do you think goes on in someone's mind when they figure something out that nobody taught them?",
    mentorFollowUps: [
      "Have you ever figured something out by yourself that surprised even you? What was happening in your brain?",
      "Dayo was nervous to share the idea. What makes someone hesitate before sharing something they invented?",
    ],
    pillar: 3,
    minutesEstimate: 18,
    xpReward: { pillar: 12 },
  },
  {
    id: 7,
    title: "The Astronomer's Choice",
    summary: "A young stargazer discovers evidence the Earth is round — but the scholars won't like being wrong.",
    storyText: `Alexandria, 240 BCE. Kai is assistant to the great astronomer Eratosthenes. Studying shadows cast by the sun in two distant cities, Kai notices something extraordinary: the numbers don't add up the way everyone assumes. The Earth might not be flat after all.\n\nEratosthenes listens carefully. "If you're right," he says slowly, "we would have to tell the scholars. And the scholars would not be pleased."\n\nKai looks at the calculations again. The evidence is clear. But the scholars have power. And power doesn't like being wrong.`,
    cliffhanger: "The scholars have been invited to hear the findings. Kai can present the full evidence — or soften it to avoid conflict.",
    decisionQuestion: "What should Kai do?",
    choices: [
      { id: "A", text: "Present the full evidence clearly, even if scholars push back." },
      { id: "B", text: "Present it carefully — frame it as a question, not a conclusion." },
      { id: "C", text: "Let Eratosthenes present it — he has more authority." },
    ],
    consequence: "Kai presented clearly. Two scholars argued. One of them, after a long silence, asked to see the calculations again.",
    mentorName: "Orion",
    mentorEmoji: "🔭",
    mentorOpener: "Kai chose to speak up clearly even when it was uncomfortable. Before we talk about what happened — what were you most afraid of when you made that choice for Kai?",
    mentorFollowUps: [
      "Do you think Kai's fear was reasonable, or was there something they weren't seeing clearly about the situation?",
      "What would you do if you discovered something true that people in authority didn't want to hear?",
    ],
    pillar: 1,
    minutesEstimate: 20,
    xpReward: { pillar: 12, bonus: 6 },
    bonusPillar: 2,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLevelById(id: number): Level | undefined {
  return LEVELS.find(l => l.id === id);
}

export function getEraForLevel(levelId: number): Era | undefined {
  return ERAS.find(e => e.levels.includes(levelId));
}

export const PILLAR_META: Record<Pillar, { name: string; color: string; bgColor: string; borderColor: string }> = {
  1: { name: "Critical Thinking", color: "#5B6FA8", bgColor: "#EEF1F8", borderColor: "rgba(91,111,168,0.4)" },
  2: { name: "Resilience",        color: "#4F8B6E", bgColor: "#EBF5F0", borderColor: "rgba(79,139,110,0.4)" },
  3: { name: "Creativity",        color: "#8B5FA3", bgColor: "#F4EEF8", borderColor: "rgba(139,95,163,0.4)" },
  4: { name: "Communication",     color: "#D9714F", bgColor: "#FBF0EC", borderColor: "rgba(217,113,79,0.4)" },
  5: { name: "Learning to Learn", color: "#C98A3E", bgColor: "#FAF3E6", borderColor: "rgba(201,138,62,0.4)" },
};
