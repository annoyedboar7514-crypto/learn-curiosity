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
    <div className="lc-phase-in">
      {/* Choice recall */}
      <div className="lc-choice-recall">
        <span style={{ fontSize: 20 }}>💭</span>
        <div>
          <p className="lc-cr-label">You chose</p>
          <p className="lc-cr-value">{choice}</p>
        </div>
      </div>

      {/* Story consequence */}
      <div className="lc-story-card">
        <div className="lc-story-header">
          <div className="lc-story-icon">📖</div>
          <span className="lc-story-tag">What happened</span>
        </div>
        <div className="lc-story-body">
          <p className="lc-story-text">
            {lesson.consequenceText ?? 'The story continued...'}
          </p>
          {lesson.consequenceHistoricalTie && (
            <div className="lc-hist-note">
              <div className="lc-hist-lbl">🏛 Historical note</div>
              <p className="lc-hist-text">{lesson.consequenceHistoricalTie}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mini game */}
      {lesson.miniGame && lesson.miniGame.type !== 'none' && (
        <>
          {lesson.miniGame.type === 'sort' && <SortGame game={lesson.miniGame} />}
          {lesson.miniGame.type === 'argument-builder' && <ArgumentBuilder game={lesson.miniGame} />}
          {lesson.miniGame.type === 'improve-solution' && (
            <div className="lc-game">
              <div className="lc-game-header">
                <span style={{ fontSize: 22 }}>🔬</span>
                <span className="lc-game-title">{lesson.miniGame.title}</span>
              </div>
              <p className="lc-game-instr">{lesson.miniGame.instruction}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(lesson.miniGame.items ?? []).map((item, i) => (
                  <div
                    key={i}
                    style={{ background: 'white', border: '1px solid #E3DCC8', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#233137' }}
                  >
                    {i + 1}. {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <button className="lc-btn lc-btn-theme" onClick={onComplete}>
        Talk with my mentor
        <span className="lc-btn-arrow">→</span>
      </button>
    </div>
  )
}
