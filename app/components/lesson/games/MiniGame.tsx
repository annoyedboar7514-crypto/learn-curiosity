'use client'
import type { MiniGame as MiniGameData } from '@/lib/content/lessonSchema'
import { SortGame } from './SortGame'
import { ArgumentBuilder } from './ArgumentBuilder'
import { ImproveSolution } from './ImproveSolution'
import { MatchUp } from './MatchUp'

// Renders the right mini-game for a lesson's `miniGame` block.
// onDone fires when the child finishes playing (optional — for advancing/logging).
export function MiniGame({ game, onDone }: { game: MiniGameData; onDone?: () => void }) {
  switch (game.type) {
    case 'sort':
      return <SortGame game={game} onDone={onDone} />
    case 'argument-builder':
      return <ArgumentBuilder game={game} onDone={onDone} />
    case 'improve-solution':
      return <ImproveSolution game={game} onDone={onDone} />
    case 'match':
      return <MatchUp game={game} onDone={onDone} />
    default:
      return null
  }
}
