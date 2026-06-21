'use client'
import { useState } from 'react'
import type { Lesson, GradeBand } from '@/lib/content/lessonSchema'

interface Props {
  lesson: Partial<Lesson>
  gradeBand: GradeBand
  onComplete: (choice: number, label: string) => void
}

export function Phase2Decision({ lesson, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const cards = lesson.decisionCards ?? []
  const gridCols = cards.length <= 2 ? 'grid-cols-1' : cards.length === 3 ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl p-5"
        style={{ background: '#FBF6EC', border: '1px solid #E3DCC8' }}
      >
        <p
          className="font-semibold text-lg leading-snug"
          style={{ color: '#233137', fontFamily: "'Fraunces', Georgia, serif" }}
        >
          {lesson.decisionQuestion ?? 'What would you do?'}
        </p>
      </div>

      <div className={`grid ${gridCols} gap-3`}>
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="p-4 rounded-2xl flex flex-col items-center gap-2 text-center transition-all"
            style={{
              background: selected === i ? 'rgba(27,110,107,0.08)' : '#fff',
              border: selected === i ? '3px solid #1B6E6B' : '2px solid #E3DCC8',
              boxShadow: selected === i ? '0 0 0 4px rgba(27,110,107,0.12)' : '0 2px 8px rgba(35,49,55,0.06)',
              transform: selected === i ? 'translateY(-2px)' : 'none',
            }}
          >
            <span className="text-3xl">{card.emoji}</span>
            <span className="text-sm font-medium" style={{ color: '#233137' }}>{card.label}</span>
          </button>
        ))}
      </div>

      <button
        disabled={selected === null}
        onClick={() => {
          if (selected === null) return
          onComplete(selected, cards[selected]?.label ?? '')
        }}
        className="w-full py-4 rounded-2xl font-semibold text-base transition-all"
        style={{
          background: selected !== null ? '#E8A33D' : '#E3DCC8',
          color: selected !== null ? '#412402' : '#9CA3AF',
          boxShadow: selected !== null ? '0 4px 0 #C9852A' : 'none',
          cursor: selected !== null ? 'pointer' : 'not-allowed',
        }}
      >
        {selected === null ? 'Pick one to continue' : 'See what happens →'}
      </button>
    </div>
  )
}
