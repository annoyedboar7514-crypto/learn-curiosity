'use client'
import { useState } from 'react'
import type { MiniGame } from '@/lib/content/lessonSchema'

export function ArgumentBuilder({ game }: { game: MiniGame }) {
  const [claim, setClaim] = useState<number | null>(null)
  const [reason, setReason] = useState<number | null>(null)

  return (
    <div className="lc-game">
      <div className="lc-game-header">
        <span style={{ fontSize: 22 }}>🗣</span>
        <span className="lc-game-title">{game.title}</span>
      </div>
      <p className="lc-game-instr">{game.instruction}</p>

      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>
        1. Pick a claim
      </p>
      <div className="lc-arg-grid" style={{ marginBottom: 14 }}>
        {(game.claims ?? []).map((c, i) => (
          <button
            key={i}
            className={`lc-arg-item${claim === i ? ' selected' : ''}`}
            onClick={() => { setClaim(i); setReason(null) }}
          >
            {c}
          </button>
        ))}
      </div>

      {claim !== null && (
        <>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>
            2. Pick a reason
          </p>
          <div className="lc-arg-grid">
            {(game.reasons ?? []).map((r, i) => (
              <button
                key={i}
                className={`lc-arg-item${reason === i ? ' selected' : ''}`}
                onClick={() => setReason(i)}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      )}

      {claim !== null && reason !== null && (
        <div className="lc-arg-assembled">
          <div className="lc-arg-asmb-label">Your argument</div>
          <span style={{ fontWeight: 700 }}>{game.claims?.[claim]}</span>
          {' '}because{' '}
          <span style={{ color: '#4A5568' }}>{game.reasons?.[reason]}</span>
        </div>
      )}
    </div>
  )
}
