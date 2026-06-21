import type { LessonPillar } from '@/lib/content/lessonSchema'

const PILLAR_CONFIG: Record<LessonPillar, { emoji: string; color: string; bg: string }> = {
  critical:      { emoji: '🧠', color: '#5B6FA8', bg: '#EEF0F8' },
  resilience:    { emoji: '🌱', color: '#4F8B6E', bg: '#EEF5F1' },
  creativity:    { emoji: '✨', color: '#8B5FA3', bg: '#F4EEF8' },
  communication: { emoji: '💬', color: '#D9714F', bg: '#FBF0EC' },
  learning:      { emoji: '📚', color: '#C98A3E', bg: '#FBF4EC' },
}

interface Props {
  pillar: LessonPillar
  label: string
}

export function PillarBadge({ pillar, label }: Props) {
  const cfg = PILLAR_CONFIG[pillar]
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span>{cfg.emoji}</span>
      <span>{label}</span>
    </div>
  )
}
