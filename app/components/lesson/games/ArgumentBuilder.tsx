'use client'
import { useState } from 'react'
import type { MiniGame } from '@/lib/content/lessonSchema'
import { GameShell, Feedback, GameButton, gc } from './GameShell'

// "Build the strongest case" — pick a claim, then choose the reason that
// actually PROVES it (not just one that sounds related). Gentle feedback
// nudges toward reasons that prove rather than merely explain.
export function ArgumentBuilder({ game, onDone }: { game: MiniGame; onDone?: () => void }) {
  const [claim, setClaim] = useState<number | null>(null)
  const [reason, setReason] = useState<number | null>(null)
  const [used, setUsed] = useState(false)

  const strong = game.strongReasons ?? []
  const isStrong = reason !== null && strong.includes(reason)
  const knowsStrength = strong.length > 0

  const mono: React.CSSProperties = {
    fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '.1em',
    textTransform: 'uppercase', color: gc.teal, marginBottom: 8,
  }

  return (
    <GameShell emoji="🗣️" title={game.title} instruction={game.instruction}>
      <p style={mono}>1 · Pick what you think</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(game.claims ?? []).map((c, i) => (
          <button key={i} type="button" onClick={() => { setClaim(i); setReason(null); setUsed(false) }} style={chip(claim === i)}>
            {c}
          </button>
        ))}
      </div>

      {claim !== null && (
        <>
          <p style={{ ...mono, marginTop: 14 }}>2 · Now pick the reason that proves it</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(game.reasons ?? []).map((r, i) => (
              <button key={i} type="button" onClick={() => { setReason(i); setUsed(false) }} style={chip(reason === i)}>
                {r}
              </button>
            ))}
          </div>
        </>
      )}

      {reason !== null && !used && knowsStrength && (
        <Feedback tone={isStrong ? 'good' : 'think'}>
          {isStrong
            ? 'Strong choice — that reason actually proves your claim, not just explains it.'
            : 'That one sounds good, but does it really prove your claim — or just sound nice? Try the reason that shows why it has to be true.'}
        </Feedback>
      )}

      {reason !== null && used && (
        <div style={{ marginTop: 14, background: gc.cream, border: `1px solid ${gc.border}`, borderRadius: 12, padding: '12px 14px', fontSize: 14, color: gc.navy, lineHeight: 1.5 }}>
          <div style={mono}>Your argument</div>
          <b>{game.claims?.[claim!]}</b> <span style={{ opacity: 0.6 }}>— because</span> {game.reasons?.[reason]}
        </div>
      )}

      {reason !== null && !used && (
        <GameButton onClick={() => { setUsed(true); onDone?.() }}>Use this argument</GameButton>
      )}
    </GameShell>
  )
}

function chip(selected: boolean): React.CSSProperties {
  return {
    textAlign: 'left',
    background: selected ? gc.teal : '#fff',
    color: selected ? gc.cream : gc.navy,
    border: `1.5px solid ${selected ? gc.teal : gc.border}`,
    borderRadius: 12,
    padding: '11px 14px',
    fontSize: 13.5,
    lineHeight: 1.4,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  }
}
