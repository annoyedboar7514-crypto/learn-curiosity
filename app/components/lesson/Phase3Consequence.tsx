'use client'
import type { Lesson } from '@/lib/content/lessonSchema'
import { SortGame } from './games/SortGame'
import { ArgumentBuilder } from './games/ArgumentBuilder'

interface Props {
  lesson: Partial<Lesson>
  choice: string
  onComplete: () => void
}

export function Phase3Consequence({ lesson, choice, onComplete }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Choice callback */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(232,163,61,0.08)', border: '1px solid rgba(232,163,61,0.3)' }}
      >
        <span className="text-xl flex-shrink-0">💭</span>
        <div>
          <p className="text-xs font-mono uppercase tracking-wide mb-1" style={{ color: '#C98A3E' }}>
            You chose
          </p>
          <p className="text-sm font-semibold" style={{ color: '#233137' }}>{choice}</p>
        </div>
      </div>

      {/* Consequence */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#fff', border: '1px solid #E3DCC8', boxShadow: '0 2px 12px rgba(35,49,55,0.06)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📖</span>
          <span className="font-mono text-xs uppercase tracking-wide" style={{ color: '#1B6E6B' }}>What happened</span>
        </div>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#233137' }}>
          {lesson.consequenceText ?? 'The story continued...'}
        </p>
        {lesson.consequenceHistoricalTie && (
          <div
            className="rounded-xl p-3 text-xs leading-relaxed"
            style={{ background: '#FBF6EC', color: '#4A5568' }}
          >
            <span className="font-semibold">Historical note: </span>
            {lesson.consequenceHistoricalTie}
          </div>
        )}
      </div>

      {/* Mini game */}
      {lesson.miniGame && lesson.miniGame.type !== 'none' && (
        <>
          {lesson.miniGame.type === 'sort' && <SortGame game={lesson.miniGame} />}
          {lesson.miniGame.type === 'argument-builder' && <ArgumentBuilder game={lesson.miniGame} />}
          {lesson.miniGame.type === 'improve-solution' && (
            <div
              className="rounded-2xl p-5 mb-2"
              style={{ background: 'linear-gradient(135deg, rgba(232,163,61,0.08), rgba(27,110,107,0.08))', border: '2px dashed #E8A33D' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔬</span>
                <span className="font-mono text-xs uppercase tracking-wide text-gray-600">{lesson.miniGame.title}</span>
              </div>
              <p className="text-sm mb-4" style={{ color: '#4A5568' }}>{lesson.miniGame.instruction}</p>
              <div className="flex flex-col gap-2">
                {(lesson.miniGame.items ?? []).map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 text-sm" style={{ border: '1px solid #E3DCC8', color: '#233137' }}>
                    {i + 1}. {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={onComplete}
        className="w-full py-4 rounded-2xl font-semibold text-base transition-all"
        style={{ background: '#1B6E6B', color: '#FBF6EC', boxShadow: '0 4px 0 #14524F' }}
      >
        Talk with mentor →
      </button>
    </div>
  )
}
