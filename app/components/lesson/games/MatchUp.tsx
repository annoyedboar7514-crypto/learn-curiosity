'use client'
import { useState } from 'react'
import type { MiniGame } from '@/lib/content/lessonSchema'
import { GameShell, Feedback, gc } from './GameShell'

// "Connect the pairs" — tap a card on the left, then its match on the right.
// Correct pairs lock in; a mismatch gives a soft nudge. Finishing all pairs
// shows an encouraging close. A satisfying, low-text pause that still thinks.
export function MatchUp({ game, onDone }: { game: MiniGame; onDone?: () => void }) {
  const pairs = game.pairs ?? []
  const lefts = pairs.map((p, i) => ({ i, text: p.left }))
  // shuffle the right column once
  const [rights] = useState(() => {
    const arr = pairs.map((p, i) => ({ i, text: p.right }))
    for (let k = arr.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1))
      ;[arr[k], arr[j]] = [arr[j], arr[k]]
    }
    return arr
  })

  const [pickedLeft, setPickedLeft] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [wrong, setWrong] = useState<number | null>(null)

  const done = matched.size === pairs.length && pairs.length > 0

  function tapRight(rightIdx: number) {
    if (pickedLeft === null || matched.has(rightIdx)) return
    if (pickedLeft === rightIdx) {
      const next = new Set(matched)
      next.add(rightIdx)
      setMatched(next)
      setPickedLeft(null)
      setWrong(null)
      if (next.size === pairs.length) onDone?.()
    } else {
      setWrong(rightIdx)
      setTimeout(() => setWrong((w) => (w === rightIdx ? null : w)), 600)
    }
  }

  return (
    <GameShell emoji="🔗" title={game.title} instruction={game.instruction}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lefts.map((l) => {
            const isMatched = matched.has(l.i)
            const isPicked = pickedLeft === l.i
            return (
              <button
                key={l.i}
                type="button"
                disabled={isMatched}
                onClick={() => setPickedLeft(isPicked ? null : l.i)}
                style={cell(isMatched ? 'matched' : isPicked ? 'picked' : 'idle')}
              >
                {l.text}
              </button>
            )
          })}
        </div>
        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rights.map((r) => {
            const isMatched = matched.has(r.i)
            const isWrong = wrong === r.i
            return (
              <button
                key={r.i}
                type="button"
                disabled={isMatched}
                onClick={() => tapRight(r.i)}
                style={cell(isMatched ? 'matched' : isWrong ? 'wrong' : 'idle')}
              >
                {r.text}
              </button>
            )
          })}
        </div>
      </div>

      {!done ? (
        <p style={{ fontSize: 11, color: gc.muted, marginTop: 10, textAlign: 'center' }}>
          {pickedLeft === null ? 'Tap one on the left, then its match on the right' : 'Now tap its match on the right →'}
          {'   '}({matched.size}/{pairs.length})
        </p>
      ) : (
        <Feedback tone="good">
          {game.reflection ?? 'You connected them all! Seeing how one thing leads to another is exactly the kind of thinking this builds.'}
        </Feedback>
      )}
    </GameShell>
  )
}

function cell(state: 'idle' | 'picked' | 'matched' | 'wrong'): React.CSSProperties {
  const base: React.CSSProperties = {
    textAlign: 'left', borderRadius: 12, padding: '11px 13px', fontSize: 13,
    lineHeight: 1.35, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
    transition: 'transform .1s, background .15s',
  }
  if (state === 'matched') return { ...base, background: gc.bubble, color: gc.navy, border: `1.5px solid ${gc.good}`, cursor: 'default', opacity: 0.85 }
  if (state === 'picked') return { ...base, background: gc.teal, color: gc.cream, border: `1.5px solid ${gc.teal}` }
  if (state === 'wrong') return { ...base, background: '#FBEDE7', color: gc.navy, border: `1.5px solid ${gc.think}` }
  return { ...base, background: '#fff', color: gc.navy, border: `1.5px solid ${gc.border}` }
}
