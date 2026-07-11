'use client'
import { useRouter } from 'next/navigation'
import { LessonShell, type SessionComplete } from '@/app/components/lesson/LessonShell'
import type { Lesson, GradeBand } from '@/lib/content/lessonSchema'

interface Props {
  lesson: Partial<Lesson>
  gradeBand: GradeBand
  childName: string
  mentorId: string
  mentorName: string
  archetype: string
}

export function LessonPageClient({ lesson, gradeBand, childName, mentorId, mentorName, archetype }: Props) {
  const router = useRouter()

  const handleComplete = (data: SessionComplete) => {
    // Fire-and-forget — never block navigation on the DB write
    fetch('/api/lessons/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId:      data.sessionId,
        lessonId:       data.lessonId,
        level:          data.level,
        pillar:         data.pillar,
        decisionAnswer: data.decisionAnswer,
        durationMs:     data.durationMs,
        startedAt:      data.startedAt,
        userTurns:      data.messages.filter(m => m.role === 'user').length || data.questionCount,
      }),
    }).catch(() => {/* non-fatal */})

    router.push('/home')
  }

  return (
    <LessonShell
      lesson={lesson}
      gradeBand={gradeBand}
      childName={childName}
      mentorId={mentorId}
      mentorName={mentorName}
      archetype={archetype}
      onComplete={handleComplete}
    />
  )
}
