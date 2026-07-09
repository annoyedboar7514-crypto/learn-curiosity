'use client'
import { useState } from 'react'
import type { MiniGame } from '@/lib/content/lessonSchema'
import { GameShell, Feedback, GameButton, gc } from './GameShell'

// "Put it in order" — the child ranks the options. There's no single right
// answer (per the blueprint): locking in shows a warm, reflective response.
export function SortGame({ game, onDone }: { game: MiniGame; onDone?: () => void }) {
  const [items, setItems] = useState(() => (game.items ?? []).map((text, i) => ({ id: i, text })))
  const [locked, setLocked] = useState(false)

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (locked || j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    setItems(next)
  }

  return (
    <GameShell emoji="🪜" title={game.title} instruction={game.instruction}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: locked ? gc.bubble : '#fff',
              border: `1px solid ${locked ? gc.good + '66' : gc.border}`,
              borderRadius: 12,
              padding: '10px 12px',
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                background: gc.gold,
                color: '#412402',
                display: 'grid',
                placeItems: 'center',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Fraunces, Georgia, serif',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span style={{ flex: 1, fontSize: 13.5, color: gc.navy, lineHeight: 1.45 }}>{item.text}</span>
            {!locked && (
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button type="button" aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0} style={arrowBtn(i === 0)}>
                  ▲
                </button>
                <button type="button" aria-label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1} style={arrowBtn(i === items.length - 1)}>
                  ▼
                </button>
              </span>
            )}
          </div>
        ))}
      </div>

      {!locked ? (
        <GameButton onClick={() => { setLocked(true); onDone?.() }}>Lock in my order</GameButton>
      ) : (
        <Feedback tone="good">
          {game.reflection ?? 'Nice thinking. There’s no single right order here — what matters is that you can say why you put them this way. Your mentor will ask about it next.'}
        </Feedback>
      )}
    </GameShell>
  )
}

function arrowBtn(disabled: boolean): React.CSSProperties {
  return {
    border: `1px solid ${gc.border}`,
    background: '#fff',
    borderRadius: 6,
    width: 26,
    height: 18,
    fontSize: 9,
    lineHeight: 1,
    color: disabled ? '#c9c2b0' : gc.teal,
    cursor: disabled ? 'default' : 'pointer',
    padding: 0,
  }
}
