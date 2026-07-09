'use client'
import { useState } from 'react'
import type { MiniGame } from '@/lib/content/lessonSchema'
import { GameShell, Feedback, GameButton, gc } from './GameShell'

// "Make it stronger" — the child sees a rough draft / first attempt, then
// chooses the single change that improves it the most. Every pick is valid;
// the best one gets a brighter nudge.
export function ImproveSolution({ game, onDone }: { game: MiniGame; onDone?: () => void }) {
  const [pick, setPick] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const improvements = game.improvements ?? []
  const best = game.bestImprovement
  const isBest = pick !== null && best !== undefined && pick === best

  return (
    <GameShell emoji="🛠️" title={game.title} instruction={game.instruction}>
      {/* The rough draft */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(game.items ?? []).map((item, i) => (
          <div key={i} style={{ background: gc.cream, border: `1px dashed ${gc.border}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: gc.navy }}>
            {item}
          </div>
        ))}
      </div>

      {improvements.length > 0 ? (
        <>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: gc.teal, margin: '14px 0 8px' }}>
            Pick the one change that helps most
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {improvements.map((imp, i) => (
              <button
                key={i}
                type="button"
                disabled={locked}
                onClick={() => setPick(i)}
                style={{
                  textAlign: 'left',
                  background: pick === i ? gc.teal : '#fff',
                  color: pick === i ? gc.cream : gc.navy,
                  border: `1.5px solid ${pick === i ? gc.teal : gc.border}`,
                  borderRadius: 12,
                  padding: '11px 14px',
                  fontSize: 13.5,
                  lineHeight: 1.4,
                  cursor: locked ? 'default' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {imp}
              </button>
            ))}
          </div>
        </>
      ) : (
        <Feedback tone="note">What would you add or change to make this sharper? Hold that thought — your mentor will ask you next.</Feedback>
      )}

      {pick !== null && locked && (
        <Feedback tone={isBest ? 'good' : 'think'}>
          {isBest
            ? 'Yes! That’s the change that turns “looking” into really noticing — the sharpest upgrade here.'
            : 'Good addition — that does make it better. One of the others sharpens it even more. Either way, you’re thinking like a real improver.'}
        </Feedback>
      )}

      {improvements.length > 0 && !locked && (
        <GameButton onClick={() => { if (pick !== null) { setLocked(true); onDone?.() } }} disabled={pick === null}>
          {pick === null ? 'Pick one to continue' : 'Lock in my change'}
        </GameButton>
      )}
    </GameShell>
  )
}
