'use client'
import { useState } from 'react'
import type { MiniGame } from '@/lib/content/lessonSchema'

export function SortGame({ game }: { game: MiniGame }) {
  const [items, setItems] = useState((game.items ?? []).map((text, i) => ({ id: i, text })))
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleDrop = (i: number) => {
    if (dragIndex === null || dragIndex === i) return
    const next = [...items]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(i, 0, moved)
    setItems(next)
    setDragIndex(null)
  }

  return (
    <div className="lc-game">
      <div className="lc-game-header">
        <span style={{ fontSize: 22 }}>🎮</span>
        <span className="lc-game-title">{game.title}</span>
      </div>
      <p className="lc-game-instr">{game.instruction}</p>
      <div>
        {items.map((item, i) => (
          <div
            key={item.id}
            className="lc-sort-item"
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(i)}
          >
            <span className="lc-sort-drag">⠿</span>
            <span className="lc-sort-text">{item.text}</span>
            <span className="lc-sort-num">{i + 1}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>Drag to reorder</p>
    </div>
  )
}
