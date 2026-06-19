export type Pillar =
  | "critical-thinking"
  | "resilience-character"
  | "creativity-vision"
  | "communication-persuasion"
  | "learning-how-to-learn";

export type GradeBand = "K-2" | "3-4" | "5-6";

export type Archetype =
  | "explorer"
  | "astronaut"
  | "detective"
  | "inventor-builder"
  | "artist"
  | "doctor-healer";

// How the child's open-ended response at the decision point is classified
// so the right consequence branch is shown. Claude classifies at runtime.
export type ChoiceType = "courageous" | "avoidant" | "impulsive" | "creative";

// One branch of the story, shown after the child's response is classified.
// Consequences are realistic and shown — never preachy or explicitly labelled
// "right" or "wrong."
export interface Consequence {
  choiceType: ChoiceType;
  narrative: string;
}

// One Socratic question for the reflection phase.
// The question asks — it never states the lesson's conclusion.
export interface ReflectionQuestion {
  question: string;
  // Used when a child gives a very short or stuck answer — opens a side door
  // without giving the answer away.
  scaffoldedFollowUp: string;
}

export interface Lesson {
  id: string;
  title: string;

  // Curriculum placement
  pillar: Pillar;
  secondaryPillars: Pillar[];
  gradeBand: GradeBand;
  archetype: Archetype;

  // The archetype-independent moral or reasoning challenge at the heart of
  // this lesson. Shared across all archetype skins of the same core lesson.
  moralCore: string;

  // Story content — all prose is calibrated for the lesson's gradeBand
  openingNarrative: string;    // Story up to the moment of choice
  decisionPrompt: string;      // The question put to the child at the decision point

  // One entry per ChoiceType. Not every lesson needs all four — include
  // the types that are realistically likely for the specific dilemma.
  consequences: Consequence[];

  // 3–5 questions for the Socratic reflection phase.
  reflectionQuestions: ReflectionQuestion[];

  // Generated for the parent dashboard after each session.
  // Describes what reasoning capacity this lesson targets, not what "answer"
  // the child should have reached.
  parentSummary: string;
}
