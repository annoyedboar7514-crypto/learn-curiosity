'use client'
// The Fairness Line — the child places how the story's outcome FELT on a
// line from fair to unfair. Touch: tap anywhere on the line. Voice: say it
// ("kind of unfair"). No correct position; the placement is the conversation.

import { useRef, useState } from 'react'
import { MicButton, mentorAudio, useVoiceInput, ChildButton, playPop } from '@/app/components/child-kit'
import {
  fairnessQuestion, fairnessReaction, fairnessSummary, FAIRNESS_VOICE_MAP,
  type GameMomentResult,
} from '@/lib/content/game-moments'

const serif = { fontFamily: 'var(--font-serif, Fraunces, Georgia, serif)' } as const

export function FairnessLine({ choiceLabel, mentorId, onDone }: {
  choiceLabel: string
  mentorId: string
  onDone: (result: GameMomentResult) => void
}) {
  const [pos, setPos] = useState<number | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  function place(p: number) {
    const clamped = Math.min(1, Math.max(0, p))
    playPop()
    setPos(clamped)
    mentorAudio.stop()
    void mentorAudio.speak(fairnessReaction(clamped), mentorId)
  }

  function placeFromTouch(e: React.PointerEvent) {
    const rect = barRef.current?.getBoundingClientRect()
    if (!rect) return
    place((e.clientX - rect.left) / rect.width)
  }

  const voice = useVoiceInput((said) => {
    const hit = FAIRNESS_VOICE_MAP.find(v => v.match.test(said))
    if (hit) place(hit.pos)
  })

  return (
    <div>
      <p style={{ ...serif, fontSize: 19, lineHeight: 1.4, textAlign: 'center', margin: '0 0 6px' }}>
        {fairnessQuestion(choiceLabel)}
      </p>

      <div
        ref={barRef}
        className="ck-fairline"
        onPointerDown={placeFromTouch}
        role="slider"
        aria-label="Fairness line: left is fair, right is unfair"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pos === null ? undefined : Math.round(pos * 100)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') place((pos ?? 0.5) - 0.1)
          if (e.key === 'ArrowRight') place((pos ?? 0.5) + 0.1)
        }}
        style={{ cursor: 'pointer', touchAction: 'none' }}
      >
        {pos !== null && (
          <span className="ck-fairline-mark" style={{ left: `${pos * 100}%` }} aria-hidden>⚖️</span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, opacity: 0.65, padding: '0 6px' }}>
        <span>fair</span><span>not fair</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 14 }}>
        {voice.supported && pos === null && (
          <>
            <MicButton
              state={voice.listening ? 'listening' : 'idle'}
              onPress={() => (voice.listening ? voice.stop() : voice.start())}
              hideLabel
            />
            <span style={{ fontSize: 13, opacity: 0.6 }}>tap the line, or say it</span>
          </>
        )}
        {pos !== null && (
          <ChildButton onClick={() => onDone({ game: 'fairness-line', summary: fairnessSummary(pos) })}>
            That&apos;s where it goes →
          </ChildButton>
        )}
      </div>
    </div>
  )
}
