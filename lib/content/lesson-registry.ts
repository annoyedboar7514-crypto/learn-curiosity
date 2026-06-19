import type { Archetype, GradeBand, Lesson } from "./lesson.types";
import detectiveLesson from "./lessons/detective-3-4-the-clue-that-points-the-wrong-way";
import astronautLesson from "./lessons/astronaut-3-4-the-clue-that-points-the-wrong-way";

type RegistryKey = `${Archetype}:${GradeBand}`;

const registry: Partial<Record<RegistryKey, Lesson>> = {
  "detective:3-4": detectiveLesson,
  "astronaut:3-4": astronautLesson,
};

// Returns the lesson for a given archetype and grade band.
// Falls back to the detective lesson when no skin exists yet for that combination.
export function getLessonForArchetype(
  archetype: Archetype,
  gradeBand: GradeBand = "3-4"
): { lesson: Lesson; isFallback: boolean } {
  const key: RegistryKey = `${archetype}:${gradeBand}`;
  const lesson = registry[key];
  if (lesson) return { lesson, isFallback: false };
  return { lesson: detectiveLesson, isFallback: true };
}
