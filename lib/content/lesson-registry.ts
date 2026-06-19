import type { Archetype, GradeBand, Lesson } from "./lesson.types";
import detectiveLesson from "./lessons/detective-3-4-the-clue-that-points-the-wrong-way";
import astronautLesson from "./lessons/astronaut-3-4-the-clue-that-points-the-wrong-way";
import explorerLesson from "./lessons/explorer-3-4-the-raft-that-fell-apart";
import artistLesson from "./lessons/artist-3-4-the-blank-canvas";
import doctorHealerLesson from "./lessons/doctor-healer-3-4-the-patient-who-wont-listen";
import inventorBuilderLesson from "./lessons/inventor-builder-3-4-the-bridge-that-fell";

type RegistryKey = `${Archetype}:${GradeBand}`;

const registry: Partial<Record<RegistryKey, Lesson>> = {
  "detective:3-4":        detectiveLesson,
  "astronaut:3-4":        astronautLesson,
  "explorer:3-4":         explorerLesson,
  "artist:3-4":           artistLesson,
  "doctor-healer:3-4":    doctorHealerLesson,
  "inventor-builder:3-4": inventorBuilderLesson,
};

const allLessons: Lesson[] = [
  detectiveLesson,
  astronautLesson,
  explorerLesson,
  artistLesson,
  doctorHealerLesson,
  inventorBuilderLesson,
];

// Returns the lesson for a given archetype and grade band.
// No longer falls back to detective — every archetype now has a 3-4 skin.
export function getLessonForArchetype(
  archetype: Archetype,
  gradeBand: GradeBand = "3-4"
): { lesson: Lesson; isFallback: boolean } {
  const key: RegistryKey = `${archetype}:${gradeBand}`;
  const lesson = registry[key];
  if (lesson) return { lesson, isFallback: false };
  // Fallback only if the grade band doesn't have a skin yet
  return { lesson: detectiveLesson, isFallback: true };
}

export function getLessonById(id: string): Lesson | null {
  return allLessons.find((l) => l.id === id) ?? null;
}
