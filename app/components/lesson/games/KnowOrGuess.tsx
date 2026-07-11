'use client'
// Know It or Guess It — metacognition made playable. One statement at a time;
// the child sorts it into "I know it" or "I'm guessing" by tapping a bucket
// or saying the word. No scoring: noticing the difference IS the game.

import { useState } from 'react'
import { MicButton, mentorAudio, useVoiceInput, playPop } from '@/app/components/child-kit'
import {
  knowGuessItems, knowGuessReaction, knowGuessSummary,
  type GameMomentResult,
} from '@/lib/content/game-moments'

const serif = { fontFamily: 'var(--font-serif, Fraunces, Georgia, serif)' } as const

type Sorted = { statement: string; bucket: 'know' | 'guess' }

export function KnowOrGuess({ choiceLabel, mentorId, onDone }: {
  choiceLabel: string
  mentorId: string
  onDone: (result: GameMomentResult) => void
}) {
  const [items] = useState(() => knowGuessItems(choiceLabel))
  const [sorted, setSorted] = useState<Sorted[]>([])
  const current = items[sorted.length]

  function sortInto(bucket: 'know' | 'guess') {
    if (!current) return
    playPop()
    mentorAudio.stop()
    void mentorAudio.speak(knowGuessReaction(bucket), mentorId)
    const next = [...sorted, { statement: current.statement, bucket }]
    setSorted(next)
    if (next.length === items.length) {
      onDone({ game: 'know-or-guess', summary: knowGuessSummary(next) })
    }
  }

  const voice = useVoiceInput((said) => {
    if (/guess/i.test(said)) sortInto('guess')
    else if (/know/i.test(said)) sortInto('know')
  })

  if (!current) return null

  return (
    <div>
      <p style={{ ...serif, fontSize: 21, lineHeight: 1.35, textAlign: 'center', margin: '4px 0 16px' }}>
        {current.statement}
      </p>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          className="ck-bucket ck-lift"
          onClick={() => sortInto('know')}
          style={{ cursor: 'pointer', textAlign: 'center' }}
        >
          <div style={{ fontSize: 26 }} aria-hidden>🌞</div>
          <div style={{ ...serif, fontWeight: 600, fontSize: 17 }}>I know it</div>
          <div style={{ fontSize: 12.5, opacity: 0.6 }}>I saw it or said it</div>
        </button>
        <button
          type="button"
          className="ck-bucket ck-lift"
          onClick={() => sortInto('guess')}
          style={{ cursor: 'pointer', textAlign: 'center' }}
        >
          <div style={{ fontSize: 26 }} aria-hidden>🌙</div>
          <div style={{ ...serif, fontWeight: 600, fontSize: 17 }}>I&apos;m guessing</div>
          <div style={{ fontSize: 12.5, opacity: 0.6 }}>I can&apos;t be sure</div>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 14 }}>
        {voice.supported && (
          <>
            <MicButton
              state={voice.listening ? 'listening' : 'idle'}
              onPress={() => (voice.listening ? voice.stop() : voice.start())}
              hideLabel
            />
            <span style={{ fontSize: 13, opacity: 0.6 }}>tap a side, or say “know” / “guess”</span>
          </>
        )}
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }} aria-hidden>
          {items.map((_, i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: 999, background: i < sorted.length ? 'var(--color-teal)' : 'var(--color-cream-border)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
