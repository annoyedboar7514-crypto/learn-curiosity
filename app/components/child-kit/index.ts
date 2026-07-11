// Child UI kit — Stage 1 of the App Rework. Every component here belongs to
// the CHILD world: warm, alive, playful, cinematic. Parent surfaces must not
// import from this module.

export { MentorAvatar, MentorPresence, type MentorState, type MentorAvatarProps } from "./MentorAvatar";
export { MicButton, type MicState, type MicButtonProps } from "./MicButton";
export { TranscriptBubble, TranscriptColumn, type TranscriptBubbleProps } from "./TranscriptBubble";
export { ChildButton, type ChildButtonProps } from "./ChildButton";
export { ChildCard, type ChildCardProps } from "./ChildCard";
export { CelebrateQuiet, type CelebrateQuietProps } from "./CelebrateQuiet";
export { EraAtmosphere, type EraAtmosphereProps } from "./EraAtmosphere";
export { soundEnabled, setSoundEnabled, playPageTurn, playPop, playMicWarm } from "./sounds";
export { mentorAudio } from "./audio";
export { useVoiceInput } from "./useVoiceInput";
