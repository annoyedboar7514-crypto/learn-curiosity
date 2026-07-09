// Safety layer — all child-facing text and input passes through here.
// See CLAUDE.md: "All text shown to children must pass through lib/safety/"

export { classifyInput, checkMentorOutput } from "./content-filter";
export type {
  SafetyCategory,
  SafetyResult,
  Severity,
  OutputResult,
} from "./content-filter";
