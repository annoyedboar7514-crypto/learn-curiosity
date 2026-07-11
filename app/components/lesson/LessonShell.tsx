'use client'
// Session player shell. The lesson is four beats — story → decision →
// consequence → conversation — and the child FEELS the structure without
// labels: each beat shifts the atmosphere (600ms background tint) and the
// dots quietly mark where we are. Panels cross-fade in.

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Lesson, GradeBand } from '@/lib/content/lessonSchema'
import { Phase1Video } from './Phase1Video'
import { Phase2Decision } from './Phase2Decision'
import { Phase3Consequence } from './Phase3Consequence'
import { Phase4Mentor } from './Phase4Mentor'
import { mentorAudio } from '@/app/components/child-kit'
import '@/app/components/child-kit/child-kit.css'

export interface SessionComplete {
  messages: { role: string; text: string }[]
  questionCount: number
  sessionId: string
  lessonId: string
  level: number | null
  pillar: string | undefined
  startedAt: number   // Unix seconds
  durationMs: number
  decisionAnswer: string
}

interface Props {
  lesson: Partial<Lesson>
  gradeBand: GradeBand
  childName: string
  mentorId: string
  mentorName: string
  archetype: string
  onComplete: (data: SessionComplete) => void
}

const BEATS = ['story', 'decision', 'consequence', 'conversation'] as const

export function LessonShell({ lesson, gradeBand, childName, mentorId, mentorName, archetype, onComplete }: Props) {
  const [phase, setPhase] = useState(0)
  const [choiceLabel, setChoiceLabel] = useState('')

  // stable session identity — Date.now() here is intentional (a one-time id,
  // not render output), so the purity rule doesn't apply in spirit
  // eslint-disable-next-line react-hooks/purity, react-hooks/refs
  const sessionId = useRef(`lc-${lesson.id ?? 0}-${Date.now()}`).current
  // eslint-disable-next-line react-hooks/purity
  const startedAt = useRef(Math.floor(Date.now() / 1000)).current

  const router = useRouter()

  const handleComplete = (data: { messages: { role: string; text: string }[]; questionCount: number }) => {
    onComplete({
      ...data,
      sessionId,
      lessonId: String(lesson.id ?? ''),
      level: lesson.id ?? null,
      pillar: lesson.pillar,
      startedAt,
      durationMs: (Math.floor(Date.now() / 1000) - startedAt) * 1000,
      decisionAnswer: choiceLabel,
    })
  }

  return (
    <div className={`lc-lesson ck-beat ck-beat--${BEATS[phase]}`} data-archetype={archetype} style={{ minHeight: '100dvh' }}>
      {/* Quiet nav — just the way back */}
      <nav className="lc-nav">
        <button className="lc-back-btn" onClick={() => { mentorAudio.stop(); router.push('/home') }}>
          ← Map
        </button>
        <span className="lc-level-chip">{lesson.title}</span>
      </nav>

      {/* Beat dots — structure felt, not labeled */}
      <div className="ck-beat-dots" aria-hidden>
        {BEATS.map((b, i) => (
          <span key={b} className={`ck-beat-dot ${i < phase ? 'ck-beat-dot--past' : i === phase ? 'ck-beat-dot--now' : ''}`} />
        ))}
      </div>

      {/* Phase 0: full cinematic story panel */}
      {phase === 0 && (
        <div className="ck-panel-enter">
          <Phase1Video
            lesson={lesson}
            archetype={archetype}
            onComplete={() => setPhase(1)}
          />
        </div>
      )}

      {/* Phase content (beats 1+) — keyed so each beat cross-fades in */}
      {phase > 0 && (
        <div key={phase} className="lc-content ck-panel-enter">
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
              mentorId={mentorId}
              mentorName={mentorName}
              choiceLabel={choiceLabel}
              sessionId={sessionId}
              onComplete={handleComplete}
            />
          )}
        </div>
      )}
    </div>
  )
}
