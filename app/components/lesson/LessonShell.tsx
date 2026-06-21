'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lesson, GradeBand } from '@/lib/content/lessonSchema'
import { Phase1Video } from './Phase1Video'
import { Phase2Decision } from './Phase2Decision'
import { Phase3Consequence } from './Phase3Consequence'
import { Phase4Mentor } from './Phase4Mentor'

interface Props {
  lesson: Partial<Lesson>
  gradeBand: GradeBand
  childName: string
  mentorName: string
  archetype: string
  onComplete: (sessionData: { messages: { role: string; text: string }[]; questionCount: number }) => void
}

const STEPS = [
  { icon: '🎬', label: 'Watch' },
  { icon: '🤔', label: 'Choose' },
  { icon: '📖', label: 'Outcome' },
  { icon: '💬', label: 'Reflect' },
]

export function LessonShell({ lesson, gradeBand, childName, mentorName, archetype, onComplete }: Props) {
  const [phase, setPhase] = useState(0)
  const [choiceLabel, setChoiceLabel] = useState('')
  const router = useRouter()

  return (
    <div className="lc-lesson" data-archetype={archetype}>
      {/* Sticky nav */}
      <nav className="lc-nav">
        <button className="lc-back-btn" onClick={() => router.push('/home')}>
          ← Back
        </button>
        <span className="lc-level-chip">
          Level {lesson.id ?? '?'} · Era {lesson.era}
        </span>
      </nav>

      {/* Phase 0: full cinematic video section */}
      {phase === 0 && (
        <Phase1Video
          lesson={lesson}
          archetype={archetype}
          onComplete={() => setPhase(1)}
        />
      )}

      {/* Phases 1+: compact archetype header */}
      {phase > 0 && (
        <div className="lc-compact-header">
          <div className="lc-compact-era-pill">
            <span className="lc-compact-era-dot" />
            Era {lesson.era}
          </div>
          <h2 className="lc-compact-title">{lesson.title}</h2>
        </div>
      )}

      {/* Progress trail — always shown */}
      <div className="lc-progress-trail">
        {STEPS.map((step, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <button
              className={`lc-step ${i === phase ? 'active' : i < phase ? 'done' : 'future'}`}
              onClick={() => { if (i < phase) setPhase(i) }}
            >
              <div className="lc-step-dot">
                {i < phase ? '✓' : step.icon}
              </div>
              <span className="lc-step-label">{step.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`lc-step-line${i < phase ? ' filled' : ''}`} />
            )}
          </span>
        ))}
      </div>

      {/* Phase content (phases 1+) */}
      {phase > 0 && (
        <div className="lc-content lc-phase-in">
          {phase === 1 && (
            <Phase2Decision
              lesson={lesson}
              gradeBand={gradeBand}
              onComplete={(_, label) => { setChoiceLabel(label); setPhase(2) }}
            />
          )}
          {phase === 2 && (
            <Phase3Consequence
              lesson={lesson}
              choice={choiceLabel}
              onComplete={() => setPhase(3)}
            />
          )}
          {phase === 3 && (
            <Phase4Mentor
              lesson={lesson}
              gradeBand={gradeBand}
              childName={childName}
              mentorName={mentorName}
              choiceLabel={choiceLabel}
              onComplete={onComplete}
            />
          )}
        </div>
      )}
    </div>
  )
}
