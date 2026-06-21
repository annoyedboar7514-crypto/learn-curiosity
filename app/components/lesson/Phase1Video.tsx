'use client'
import { useState } from 'react'
import type { Lesson } from '@/lib/content/lessonSchema'

interface Props {
  lesson: Partial<Lesson>
  onComplete: () => void
}

export function Phase1Video({ lesson, onComplete }: Props) {
  const [pauseAnswered, setPauseAnswered] = useState(false)
  const [selectedPause, setSelectedPause] = useState<number | null>(null)
  const hasPausePoint = lesson.pausePoint1Question && lesson.pausePoint1Cards?.length

  return (
    <div className="flex flex-col gap-4">
      {/* Historical context ticker */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(27,110,107,0.06)', border: '1px solid rgba(27,110,107,0.15)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📍</span>
          <span className="font-mono text-xs uppercase tracking-wide" style={{ color: '#1B6E6B' }}>
            {lesson.historicalPeriod}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#233137' }}>
          {lesson.historicalContext}
        </p>
      </div>

      {/* Video placeholder */}
      <div
        className="rounded-2xl flex flex-col items-center justify-center gap-3 py-12"
        style={{ background: '#1a2744', minHeight: '180px' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: 'rgba(232,163,61,0.2)', border: '2px solid rgba(232,163,61,0.4)' }}
        >
          🎬
        </div>
        <p className="text-sm font-medium" style={{ color: 'rgba(251,246,236,0.7)' }}>
          Story video coming soon
        </p>
        <p className="text-xs" style={{ color: 'rgba(251,246,236,0.4)' }}>
          {lesson.title}
        </p>
      </div>

      {/* Pause point question (if available) */}
      {hasPausePoint && !pauseAnswered && (
        <div
          className="rounded-2xl p-5"
          style={{ background: '#FBF6EC', border: '1px solid #E3DCC8' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⏸</span>
            <span className="font-mono text-xs uppercase tracking-wide" style={{ color: '#E8A33D' }}>
              Pause &amp; Think
            </span>
          </div>
          <p className="font-semibold text-sm mb-4" style={{ color: '#233137', fontFamily: "'Fraunces', Georgia, serif" }}>
            {lesson.pausePoint1Question}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {lesson.pausePoint1Cards!.map((card, i) => (
              <button
                key={i}
                onClick={() => setSelectedPause(i)}
                className="p-3 rounded-xl text-left transition-all text-sm"
                style={{
                  background: selectedPause === i ? 'rgba(27,110,107,0.1)' : '#fff',
                  border: selectedPause === i ? '2px solid #1B6E6B' : '2px solid #E3DCC8',
                  color: '#233137',
                }}
              >
                <span className="text-lg block mb-1">{card.emoji}</span>
                {card.label}
              </button>
            ))}
          </div>
          {selectedPause !== null && (
            <button
              onClick={() => setPauseAnswered(true)}
              className="w-full mt-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#1B6E6B', color: '#FBF6EC' }}
            >
              Continue watching →
            </button>
          )}
        </div>
      )}

      {/* Continue button */}
      {(!hasPausePoint || pauseAnswered) && (
        <button
          onClick={onComplete}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all"
          style={{
            background: '#E8A33D',
            color: '#412402',
            boxShadow: '0 4px 0 #C9852A',
          }}
        >
          Make my choice →
        </button>
      )}
    </div>
  )
}
