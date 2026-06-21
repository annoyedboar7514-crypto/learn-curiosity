'use client'
import { useState } from 'react'
import type { Lesson, GradeBand } from '@/lib/content/lessonSchema'

const PILLAR_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  critical:      { bg: '#EEF0F8', color: '#5B6FA8', label: '🔍 Critical Thinking' },
  resilience:    { bg: '#EDF3EF', color: '#4F8B6E', label: '🛡 Resilience' },
  creativity:    { bg: '#F3EEF8', color: '#8B5FA3', label: '✨ Creativity' },
  communication: { bg: '#FDF0EB', color: '#D9714F', label: '💬 Communication' },
  learning:      { bg: '#FDF5E8', color: '#C98A3E', label: '🧠 Learning How to Learn' },
}

interface Props {
  lesson: Partial<Lesson>
  gradeBand: GradeBand
  onComplete: (choice: number, label: string) => void
}

export function Phase2Decision({ lesson, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const cards = lesson.decisionCards ?? []
  const gridClass = cards.length <= 2 ? 'c2' : cards.length === 3 ? 'c3' : 'c4'
  const pillar = lesson.pillar ? PILLAR_STYLES[lesson.pillar] : null

  return (
    <div className="lc-phase-in">
      {pillar && (
        <div className="lc-pillar-tag" style={{ background: pillar.bg, color: pillar.color }}>
          {pillar.label}
        </div>
      )}

      <p className="lc-question">
        {lesson.decisionQuestion ?? 'What would you do?'}
      </p>

      <div className={`lc-cards ${gridClass}${selected !== null ? ' has-pick' : ''}`}>
        {cards.map((card, i) => (
          <button
            key={i}
            className={`lc-card${selected === i ? ' selected' : ''}`}
            onClick={() => setSelected(i)}
          >
            <span className="lc-card-em">{card.emoji}</span>
            <span className="lc-card-lbl">{card.label}</span>
          </button>
        ))}
      </div>

      <button
        className="lc-btn lc-btn-gold"
        disabled={selected === null}
        onClick={() => {
          if (selected === null) return
          onComplete(selected, cards[selected]?.label ?? '')
        }}
      >
        {selected === null ? 'Pick one to continue' : 'See what happens'}
        {selected !== null && <span className="lc-btn-arrow">→</span>}
      </button>
    </div>
  )
}
