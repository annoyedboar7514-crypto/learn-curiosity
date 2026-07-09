export type GradeBand = 'k2' | 'grade34' | 'grade56'
export type LessonPillar = 'critical' | 'resilience' | 'creativity' | 'communication' | 'learning'
export type Era = 1 | 2 | 3 | 4 | 5
export type GameType = 'sort' | 'argument-builder' | 'improve-solution' | 'match' | 'none'
export type ArchetypeSkin = 'explorer' | 'astronaut' | 'detective' | 'inventor' | 'artist' | 'healer'

export interface ChoiceCard {
  emoji: string
  label: string
  pillarScore: number
  archetypeHint?: string
}

export interface QuestionBank {
  entry: string
  core: string[]
  deep: string[]
  disengagement: string
}

export interface MiniGame {
  type: GameType
  title: string
  instruction: string
  items?: string[]                 // sort: items to order · improve-solution: the rough notes
  claims?: string[]                // argument-builder
  reasons?: string[]               // argument-builder
  strongReasons?: number[]         // argument-builder: indices of reasons that actually PROVE the claim
  improvements?: string[]          // improve-solution: candidate upgrades to choose from
  bestImprovement?: number         // improve-solution: index of the strongest upgrade
  pairs?: { left: string; right: string }[]  // match: cause → effect pairs
  reflection?: string              // encouraging closing line shown after the child plays
}

export interface ArchetypeSkinData {
  archetype: ArchetypeSkin
  characterName: string
  settingDescription: string
  backgroundScene: string
}

export interface Lesson {
  id: number
  era: Era
  title: string
  historicalPeriod: string
  pillar: LessonPillar
  pillarLabel: string
  historicalContext: string
  historicalAccuracyNote: string

  videoScriptId: string
  pausePoint1Question: string
  pausePoint1Cards: ChoiceCard[]

  decisionQuestion: string
  decisionCards: ChoiceCard[]

  consequenceText: string
  consequenceHistoricalTie: string

  miniGame?: MiniGame

  questionBanks: {
    k2: QuestionBank
    grade34: QuestionBank
    grade56: QuestionBank
  }
  mentorClosing: string

  archetypeSkins: Record<ArchetypeSkin, ArchetypeSkinData>

  eraBackground: 'space' | 'safari' | 'ocean' | 'treehouse' | 'egypt' | 'mountain' | 'workshop' | 'galileo-path'
  accentColor: string
}
