'use client'
import { useState } from 'react'
import type { MiniGame } from '@/lib/content/lessonSchema'

export function SortGame({ game }: { game: MiniGame }) {
  const [items, setItems] = useState((game.items ?? []).map((item, i) => ({ id: i, text: item })))
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleDragStart = (i: number) => setDragIndex(i)
  const handleDrop = (i: number) => {
    if (dragIndex === null || dragIndex === i) return
    const newItems = [...items]
    const [moved] = newItems.splice(dragIndex, 1)
    newItems.splice(i, 0, moved)
    setItems(newItems)
    setDragIndex(null)
  }

  return (
    <div
      className="rounded-2xl p-5 mb-5"
      style={{ background: 'linear-gradient(135deg, rgba(232,163,61,0.08), rgba(27,110,107,0.08))', border: '2px dashed #E8A33D' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🎮</span>
        <span className="font-mono text-xs uppercase tracking-wide text-gray-600">{game.title}</span>
      </div>
      <p className="text-sm mb-4" style={{ color: '#4A5568' }}>{game.instruction}</p>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className="bg-white rounded-xl p-3 flex items-center gap-3 cursor-grab transition-all"
            style={{ border: '2px solid #E3DCC8' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#E8A33D')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#E3DCC8')}
          >
            <span className="text-lg" style={{ color: '#D8D0C0' }}>⠿</span>
            <span className="text-sm font-medium flex-1" style={{ color: '#233137' }}>{item.text}</span>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{ background: '#FBF6EC', border: '1px solid #E3DCC8' }}
            >
              {i + 1}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs mt-3" style={{ color: '#9CA3AF' }}>Drag to reorder</p>
    </div>
  )
}
