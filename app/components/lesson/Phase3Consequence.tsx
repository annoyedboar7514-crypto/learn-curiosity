'use client'
import { useState } from 'react'
import type { Lesson } from '@/lib/content/lessonSchema'
import { MiniGame } from './games/MiniGame'

interface Props {
  lesson: Partial<Lesson>
  choice: string
  onComplete: () => void
}

export function Phase3Consequence({ lesson, choice, onComplete }: Props) {
  const hasGame = !!lesson.miniGame && lesson.miniGame.type !== 'none'
  const [gameDone, setGameDone] = useState(false)
  // The mini-game is a true "pause": when a lesson has one, the mentor
  // conversation unlocks only after the child has played it.
  const ready = !hasGame || gameDone

  return (
    <div className="lc-phase-in">
      {/* Choice recall */}
      <div className="lc-choice-recall">
        <span style={{ fontSize: 20 }}>💭</span>
        <div>
          <p className="lc-cr-label">You chose</p>
          <p className="lc-cr-value">{choice}</p>
        </div>
      </div>

      {/* Story consequence */}
      <div className="lc-story-card">
        <div className="lc-story-header">
          <div className="lc-story-icon">📖</div>
          <span className="lc-story-tag">What happened</span>
        </div>
        <div className="lc-story-body">
          <p className="lc-story-text">
            {lesson.consequenceText ?? 'The story continued...'}
          </p>
          {lesson.consequenceHistoricalTie && (
            <div className="lc-hist-note">
              <div className="lc-hist-lbl">🏛 Historical note</div>
              <p className="lc-hist-text">{lesson.consequenceHistoricalTie}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mini game — a fun, thinking "pause" before the mentor conversation */}
      {hasGame && (
        <MiniGame game={lesson.miniGame!} onDone={() => setGameDone(true)} />
      )}

      <button
        className="lc-btn lc-btn-theme"
        onClick={onComplete}
        disabled={!ready}
        style={!ready ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
      >
        {ready ? 'Talk with my mentor' : 'Play the quick game first ↑'}
        <span className="lc-btn-arrow">→</span>
      </button>
    </div>
  )
}
