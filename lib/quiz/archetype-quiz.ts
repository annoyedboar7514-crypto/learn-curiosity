import type { Archetype } from "@/lib/content/lesson.types";
import type { QuizQuestion, ArchetypeResult } from "./quiz.types";

export const questions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What sounds most fun on a free afternoon?",
    options: [
      { label: "Go on a hike and discover something new", emoji: "🏕️", archetype: "explorer" },
      { label: "Build something with your hands", emoji: "🔧", archetype: "inventor-builder" },
      { label: "Draw, paint, or write a story", emoji: "🎨", archetype: "artist" },
      { label: "Help take care of a hurt animal", emoji: "🐾", archetype: "doctor-healer" },
      { label: "Solve a mystery or tricky puzzle", emoji: "🔍", archetype: "detective" },
      { label: "Watch a space video or do an experiment", emoji: "🚀", archetype: "astronaut" },
    ],
  },
  {
    id: "q2",
    prompt: "If you could have one superpower, you'd pick…",
    options: [
      { label: "Talk to animals", emoji: "🐘", archetype: "explorer" },
      { label: "Fly through space", emoji: "🛸", archetype: "astronaut" },
      { label: "See clues nobody else notices", emoji: "👁️", archetype: "detective" },
      { label: "Build anything you imagine instantly", emoji: "⚙️", archetype: "inventor-builder" },
      { label: "Make your drawings come to life", emoji: "✨", archetype: "artist" },
      { label: "Heal any sickness in seconds", emoji: "💊", archetype: "doctor-healer" },
    ],
  },
  {
    id: "q3",
    prompt: "Your favorite kind of story is about…",
    options: [
      { label: "Adventures in wild, unexplored places", emoji: "🌿", archetype: "explorer" },
      { label: "Space travel and amazing discoveries", emoji: "🌌", archetype: "astronaut" },
      { label: "A detective cracking a mysterious case", emoji: "🕵️", archetype: "detective" },
      { label: "A kid who invents something incredible", emoji: "💡", archetype: "inventor-builder" },
      { label: "A character who creates something beautiful", emoji: "🖌️", archetype: "artist" },
      { label: "Someone who helps others and saves the day", emoji: "🏥", archetype: "doctor-healer" },
    ],
  },
  {
    id: "q4",
    prompt: "When you grow up, you'd love to…",
    options: [
      { label: "Explore jungles, oceans, or mountains", emoji: "🗺️", archetype: "explorer" },
      { label: "Travel to space or discover new planets", emoji: "🪐", archetype: "astronaut" },
      { label: "Solve crimes or uncover hidden truths", emoji: "🔎", archetype: "detective" },
      { label: "Invent something the world has never seen", emoji: "🛠️", archetype: "inventor-builder" },
      { label: "Make art, music, or stories people love", emoji: "🎭", archetype: "artist" },
      { label: "Help sick people or animals get better", emoji: "🩺", archetype: "doctor-healer" },
    ],
  },
  {
    id: "q5",
    prompt: "Your friends say you're always the one who…",
    options: [
      { label: "Wants to go outside and find new things", emoji: "🌄", archetype: "explorer" },
      { label: "Knows cool facts about science and space", emoji: "🔭", archetype: "astronaut" },
      { label: "Figures out what's really going on", emoji: "🧐", archetype: "detective" },
      { label: "Has an idea for how to fix something", emoji: "🔩", archetype: "inventor-builder" },
      { label: "Makes things look or sound amazing", emoji: "🎵", archetype: "artist" },
      { label: "Makes everyone feel cared for", emoji: "💛", archetype: "doctor-healer" },
    ],
  },
];

export const archetypeResults: Record<Archetype, ArchetypeResult> = {
  explorer: {
    archetype: "explorer",
    name: "The Explorer",
    emoji: "🏕️",
    tagline: "Curious about the world and everything in it",
    description:
      "You love discovering new places, meeting new creatures, and going on adventures. " +
      "You ask 'what's out there?' — and then you go find out. The world is your classroom.",
    bgColor: "bg-green-50",
    textColor: "text-green-900",
    accentColor: "bg-green-600",
  },
  astronaut: {
    archetype: "astronaut",
    name: "The Astronaut",
    emoji: "🚀",
    tagline: "A scientist at heart, reaching for the stars",
    description:
      "You love big questions — how the universe works, what's beyond the stars, " +
      "and what science can help us discover next. The unknown is your favorite place to start.",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-900",
    accentColor: "bg-indigo-600",
  },
  detective: {
    archetype: "detective",
    name: "The Detective",
    emoji: "🔍",
    tagline: "A sharp mind who always finds the truth",
    description:
      "You notice things others miss. You ask questions, spot patterns, and won't stop " +
      "until you understand what's really going on. You know a clue is just the beginning.",
    bgColor: "bg-amber-50",
    textColor: "text-amber-900",
    accentColor: "bg-amber-600",
  },
  "inventor-builder": {
    archetype: "inventor-builder",
    name: "The Inventor",
    emoji: "⚙️",
    tagline: "A builder who turns ideas into real things",
    description:
      "When you see a problem, you immediately start thinking about how to fix it. " +
      "You love figuring out how things work — and making new things that didn't exist before.",
    bgColor: "bg-orange-50",
    textColor: "text-orange-900",
    accentColor: "bg-orange-600",
  },
  artist: {
    archetype: "artist",
    name: "The Artist",
    emoji: "🎨",
    tagline: "An imaginative creator who sees the world differently",
    description:
      "You see beauty and meaning in things others walk right past. Whether it's a story, " +
      "a drawing, a song, or just an idea — you bring something new into the world.",
    bgColor: "bg-pink-50",
    textColor: "text-pink-900",
    accentColor: "bg-pink-600",
  },
  "doctor-healer": {
    archetype: "doctor-healer",
    name: "The Healer",
    emoji: "💛",
    tagline: "A caring heart who makes things better",
    description:
      "You notice when someone is hurting, and you want to help. Whether it's people, " +
      "animals, or the planet — you're driven by one question: how can I make this better?",
    bgColor: "bg-teal-50",
    textColor: "text-teal-900",
    accentColor: "bg-teal-600",
  },
};

// Returns the archetype with the highest score. Ties go to the first in list order.
export function scoreQuiz(scores: Partial<Record<Archetype, number>>): Archetype {
  const order: Archetype[] = [
    "explorer",
    "astronaut",
    "detective",
    "inventor-builder",
    "artist",
    "doctor-healer",
  ];
  return order.reduce(
    (best, arch) => ((scores[arch] ?? 0) > (scores[best] ?? 0) ? arch : best),
    order[0]
  );
}
