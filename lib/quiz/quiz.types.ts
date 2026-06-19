import type { Archetype } from "@/lib/content/lesson.types";

export interface QuizOption {
  label: string;
  emoji: string;
  archetype: Archetype;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export interface ArchetypeResult {
  archetype: Archetype;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}
