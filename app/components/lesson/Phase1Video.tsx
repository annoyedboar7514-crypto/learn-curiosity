'use client'
import { useState } from 'react'
import type { Lesson } from '@/lib/content/lessonSchema'

interface Props {
  lesson: Partial<Lesson>
  archetype: string
  onComplete: () => void
}

// Deterministic positions — no Math.random (SSR safe)
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left:  `${(i * 14 + 7)  % 98}%`,
  bottom:`${(i * 9  + 3)  % 28}%`,
  size:  `${(i % 3) * 3   + 4}px`,
  delay: `${(i * 0.35)    % 5}s`,
  dur:   `${(i % 4) * 1.5 + 4}s`,
}))

export function Phase1Video({ lesson, onComplete }: Props) {
  const [watched, setWatched] = useState(false)
  const [selectedPause, setSelectedPause] = useState<number | null>(null)
  const [pauseAnswered, setPauseAnswered] = useState(false)

  const hasPause = !!(lesson.pausePoint1Question && lesson.pausePoint1Cards?.length)
  const readyToProceed = !hasPause || pauseAnswered

  return (
    <>
      {/* ── Cinematic video hero ── */}
      <div className="lc-video-hero">
        <div className="lc-particles" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="lc-particle"
              style={{ left: p.left, bottom: p.bottom, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.dur }}
            />
          ))}
        </div>

        <div className="lc-play-zone">
          {!watched ? (
            <>
              <p className="lc-play-label">Watch the Story</p>
              <div className="lc-play-ring-wrap">
                <div className="lc-play-ring1" aria-hidden="true" />
                <div className="lc-play-ring2" aria-hidden="true" />
                <button
                  className="lc-play-btn"
                  onClick={() => setWatched(true)}
                  aria-label="Play story"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 4 }}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="lc-watching-badge">
              <div className="lc-watching-dot" aria-hidden="true" />
              Story is playing · scroll down
            </div>
          )}
        </div>

        <div className="lc-hero-overlay">
          <div className="lc-era-pill">
            <span className="lc-era-dot" aria-hidden="true" />
            Era {lesson.era} · {lesson.historicalPeriod}
          </div>
          <h1 className="lc-hero-title">{lesson.title}</h1>
          <p className="lc-hero-period">📍 {lesson.historicalPeriod}</p>
        </div>
      </div>

      {/* ── Below the hero — revealed after play ── */}
      {watched && (
        <>
          {/* Historical context */}
          <div className="lc-history-card">
            <div className="lc-history-label">
              <span>🌍</span>
              Historical Context
            </div>
            <p className="lc-history-text">
              {lesson.historicalContext ?? 'Setting the scene...'}
            </p>
          </div>

          {/* Optional pause-point question */}
          {hasPause && !pauseAnswered && (
            <div className="lc-pause-card">
              <div className="lc-pause-label">
                <span>⏸</span>
                Pause &amp; Think
              </div>
              <p className="lc-pause-q">{lesson.pausePoint1Question}</p>
              <div className="lc-pause-grid">
                {lesson.pausePoint1Cards!.map((card, i) => (
                  <button
                    key={i}
                    className={`lc-pause-opt${selectedPause === i ? ' sel' : ''}`}
                    onClick={() => setSelectedPause(i)}
                  >
                    <span className="lc-pause-opt-em">{card.emoji}</span>
                    <span className="lc-pause-opt-lbl">{card.label}</span>
                  </button>
                ))}
              </div>
              {selectedPause !== null && (
                <button className="lc-btn lc-btn-theme" onClick={() => setPauseAnswered(true)}>
                  Continue →
                </button>
              )}
            </div>
          )}

          {/* CTA */}
          {readyToProceed && (
            <div className="lc-video-cta">
              <button className="lc-btn lc-btn-gold" onClick={onComplete}>
                I&apos;m ready to make my choice
                <span className="lc-btn-arrow">→</span>
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
