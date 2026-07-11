'use client'
// GameMoment framework — Engagement Games, Stage 2.5.
// A mentor-hosted beat inside the session player: the game surface slides up
// over the lower half of the panel (the mentor stays visible and reactive
// behind it), the mentor speaks a host line, the child plays by voice or
// touch, and the result is handed back for injection into mentor context.
// No win states anywhere — no scores, no right answers.

import { useEffect, useRef, type ReactNode } from 'react'
import { mentorAudio } from '@/app/components/child-kit'
import type { GameMomentResult } from '@/lib/content/game-moments'

export type { GameMomentResult }

export function GameMoment({ hostLine, mentorId, children }: {
  hostLine: string
  mentorId: string
  children: ReactNode
}) {
  // The mentor hosts: the invitation is spoken as the sheet slides up.
  const spoke = useRef(false)
  useEffect(() => {
    if (spoke.current) return
    spoke.current = true
    void mentorAudio.speak(hostLine, mentorId)
  }, [hostLine, mentorId])

  return (
    <div className="ck-game-sheet" role="dialog" aria-label="A game from your mentor">
      <div className="ck-game-grip" aria-hidden />
      <p style={{ fontSize: 15.5, lineHeight: 1.5, textAlign: 'center', margin: '0 0 14px', opacity: 0.85 }}>
        {hostLine}
      </p>
      {children}
    </div>
  )
}
