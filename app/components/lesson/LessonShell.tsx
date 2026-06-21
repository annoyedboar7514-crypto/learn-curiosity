'use client'
import { useState } from 'react'
import type { Lesson, GradeBand } from '@/lib/content/lessonSchema'
import { EraBackground } from './EraBackground'
import { Phase1Video } from './Phase1Video'
import { Phase2Decision } from './Phase2Decision'
import { Phase3Consequence } from './Phase3Consequence'
import { Phase4Mentor } from './Phase4Mentor'
import { ProgressTrail } from './ProgressTrail'
import { PillarBadge } from './PillarBadge'

interface Props {
  lesson: Partial<Lesson>
  gradeBand: GradeBand
  childName: string
  mentorName: string
  onComplete: (sessionData: { messages: { role: string; text: string }[]; questionCount: number }) => void
}

const PHASE_LABELS = ['Watch the Story', 'Make Your Choice', 'See What Happened', 'Talk With Mentor']

export function LessonShell({ lesson, gradeBand, childName, mentorName, onComplete }: Props) {
  const [phase, setPhase] = useState(0)
  const [choiceLabel, setChoiceLabel] = useState('')

  return (
    <div className="min-h-screen" style={{ background: '#FBF6EC' }}>
      {/* HEADER */}
      <div className="relative overflow-hidden" style={{ minHeight: '200px' }}>
        {lesson.era && <EraBackground era={lesson.era} scene={lesson.eraBackground} />}
        <div className="relative z-10 flex flex-col justify-end h-full p-6 pt-12">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 self-start"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: lesson.accentColor }} />
            <span className="font-mono text-xs text-white/90 uppercase tracking-wide">
              Level {lesson.id} of 100
            </span>
          </div>
          <h1
            className="text-3xl font-semibold text-white leading-tight mb-2"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {lesson.title}
          </h1>
          <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.7)' }}>
            📍 {lesson.historicalPeriod}
          </p>
        </div>
      </div>

      {/* PROGRESS */}
      <ProgressTrail phase={phase} labels={PHASE_LABELS} onSelect={p => { if (p < phase) setPhase(p) }} />

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-5 py-6">
        {lesson.pillar && lesson.pillarLabel && (
          <PillarBadge pillar={lesson.pillar} label={lesson.pillarLabel} />
        )}

        {phase === 0 && (
          <Phase1Video
            lesson={lesson}
            onComplete={() => setPhase(1)}
          />
        )}
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
    </div>
  )
}
