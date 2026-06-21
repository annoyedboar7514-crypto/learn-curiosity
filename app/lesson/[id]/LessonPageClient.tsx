'use client'
import { useRouter } from 'next/navigation'
import { LessonShell } from '@/app/components/lesson/LessonShell'
import type { Lesson, GradeBand } from '@/lib/content/lessonSchema'

interface Props {
  lesson: Partial<Lesson>
  gradeBand: GradeBand
  childName: string
  mentorName: string
  archetype: string
}

export function LessonPageClient({ lesson, gradeBand, childName, mentorName, archetype }: Props) {
  const router = useRouter()

  const handleComplete = (sessionData: { messages: { role: string; text: string }[]; questionCount: number }) => {
    console.log('[lesson-complete]', lesson.id, sessionData.questionCount, 'exchanges')
    router.push('/home')
  }

  return (
    <LessonShell
      lesson={lesson}
      gradeBand={gradeBand}
      childName={childName}
      mentorName={mentorName}
      archetype={archetype}
      onComplete={handleComplete}
    />
  )
}
